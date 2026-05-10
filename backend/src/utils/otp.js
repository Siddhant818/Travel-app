const nodemailer = require('nodemailer');
const dns = require('dns');
const sgMail = require('@sendgrid/mail');

// Force IPv4 to avoid connection issues on hosts with broken IPv6 routing.
dns.setDefaultResultOrder('ipv4first');

let transporter;
const getTransporter = async () => {
  if (transporter) return transporter;

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

  if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
    const buildOptions = (port, secure) => ({
      host: SMTP_HOST,
      port,
      secure,
      family: 4,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000
    });

    const primaryPort = Number(SMTP_PORT) || 587;
    const primarySecure = primaryPort === 465;
    transporter = nodemailer.createTransport(buildOptions(primaryPort, primarySecure));

    try {
      await transporter.verify();
      console.log('SMTP primary verify succeeded', { host: SMTP_HOST, port: primaryPort, secure: primarySecure });
      return transporter;
    } catch (err) {
      console.warn('SMTP primary verify failed:', err && err.code);

      if (primaryPort !== 465) {
        const fallbackPort = 465;
        const fallbackSecure = true;
        console.log('Attempting SMTP fallback to port 465 (SSL)');
        transporter = nodemailer.createTransport(buildOptions(fallbackPort, fallbackSecure));

        try {
          await transporter.verify();
          console.log('SMTP fallback verify succeeded', { host: SMTP_HOST, port: fallbackPort, secure: fallbackSecure });
          return transporter;
        } catch (err2) {
          console.error('SMTP fallback verify failed:', err2 && err2.code);
          throw err2 || err;
        }
      }

      throw err;
    }
  }

  // Development fallback: create an Ethereal test account (previewable) and log OTPs.
  if (process.env.NODE_ENV !== 'production') {
    try {
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        family: 4,
        auth: { user: testAccount.user, pass: testAccount.pass }
      });
      console.log('⚠️  Using Ethereal test SMTP account for OTPs (dev only)');
      return transporter;
    } catch (e) {
      console.error('Failed to create ethereal test account:', e);
    }
  }

  throw new Error('SMTP configuration missing. Set SMTP_HOST, SMTP_USER and SMTP_PASS in environment.');
};

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const sendOTPEmail = async (email, otp) => {
  // Always log OTP to console for debugging (safe in dev only)
  console.log(`\n=============================`);
  console.log(`OTP for ${email}: ${otp}`);
  console.log(`=============================\n`);

  const sendgridKey = process.env.SENDGRID_API_KEY;
  if (sendgridKey) {
    sgMail.setApiKey(sendgridKey);
    try {
      await sgMail.send({
        to: email,
        from: process.env.SMTP_FROM || 'noreply@travelapp.com',
        subject: 'Your OTP for TravelApp Signup',
        html: `<h2>Your OTP is: <strong>${otp}</strong></h2><p>Valid for 10 minutes.</p>`
      });
      console.log('SendGrid email sent successfully to', email);
      return otp;
    } catch (err) {
      console.error('SendGrid send failed:', err && err.response ? err.response.body : err);
      throw err;
    }
  }

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
