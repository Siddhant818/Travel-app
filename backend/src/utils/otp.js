const nodemailer = require('nodemailer');

// For dev: logs OTP to console. Replace with real SMTP for production.
const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
    user: 'demo@ethereal.email',
    pass: 'demo'
  }
});

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const sendOTPEmail = async (email, otp) => {
  // In dev mode, just log the OTP
  console.log(`\n=============================`);
  console.log(`OTP for ${email}: ${otp}`);
  console.log(`=============================\n`);

  try {
    await transporter.sendMail({
      from: '"TravelApp" <noreply@travelapp.com>',
      to: email,
      subject: 'Your OTP for TravelApp Signup',
      html: `<h2>Your OTP is: <strong>${otp}</strong></h2><p>Valid for 10 minutes.</p>`
    });
  } catch (e) {
    // Silent fail - OTP is logged to console in dev
  }

  return otp;
};

module.exports = { generateOTP, sendOTPEmail };
