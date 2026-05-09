const nodemailer = require('nodemailer');

let transporter;
const getTransporter = async () => {
  if (transporter) return transporter;

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

  if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT) || 587,
      secure: Number(SMTP_PORT) === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS }
    });
    return transporter;
  }

  // Development fallback: create an Ethereal test account (previewable) and log OTPs
  if (process.env.NODE_ENV !== 'production') {
    try {
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: { user: testAccount.user, pass: testAccount.pass }
      });
      console.log('⚠️  Using Ethereal test SMTP account for OTPs (dev only)');
      return transporter;
    } catch (e) {
      console.error('Failed to create ethereal test account:', e);
    }
  }

  // In production, require SMTP to be configured
  throw new Error('SMTP configuration missing. Set SMTP_HOST, SMTP_USER and SMTP_PASS in environment.');
};

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const sendOTPEmail = async (email, otp) => {
  // Always log OTP to console for debugging (safe in dev only)
  console.log(`\n=============================`);
  console.log(`OTP for ${email}: ${otp}`);
  console.log(`=============================\n`);

  try {
    const tx = await getTransporter();
    const info = await tx.sendMail({
      from: process.env.SMTP_FROM || '"TravelApp" <noreply@travelapp.com>',
      to: email,
      subject: 'Your OTP for TravelApp Signup',
      html: `<h2>Your OTP is: <strong>${otp}</strong></h2><p>Valid for 10 minutes.</p>`
    });

    if (process.env.NODE_ENV !== 'production' && info && info.messageId) {
      // Preview URL for Ethereal
      const preview = nodemailer.getTestMessageUrl(info);
      if (preview) console.log('OTP email preview:', preview);
    }

    return otp;
  } catch (err) {
    console.error('Failed to send OTP email:', err);
    // Rethrow so caller can decide how to handle in production
    throw err;
  }
};

module.exports = { generateOTP, sendOTPEmail };
