const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

const sendEmail = async ({ email, subject, message, html }) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `"Glam Beauty" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: subject,
    text: message,
    html: html || message,
  };

  const info = await transporter.sendMail(mailOptions);
  return info;
};

const sendOTPEmail = async (email, otp) => {
  const subject = `${otp} is your Glam Beauty verification code`;
  const text = `Welcome to Glam Beauty! Your one-time verification code is: ${otp}. This code is valid for 5 minutes. If you did not request this code, please ignore this email.`;
  
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Glam Beauty Verification Code</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f9fafb; color: #1f2937;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 540px; margin: 40px auto; background-color: #ffffff; border-radius: 16px; border: 1px solid #f3f4f6; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); overflow: hidden;">
        <!-- Header -->
        <tr>
          <td style="padding: 36px 40px 24px; text-align: center; background: linear-gradient(135deg, #111827 0%, #374151 100%);">
            <h1 style="margin: 0; font-size: 26px; font-weight: 800; letter-spacing: 2px; color: #f9fafb; text-transform: uppercase;">
              GLAM BEAUTY
            </h1>
            <p style="margin: 6px 0 0; font-size: 11px; letter-spacing: 3px; color: #fb7185; text-transform: uppercase;">
              Luxury Cosmetics & Skincare
            </p>
          </td>
        </tr>

        <!-- Body Content -->
        <tr>
          <td style="padding: 36px 40px;">
            <h2 style="margin: 0 0 12px; font-size: 20px; font-weight: 700; color: #111827;">
              Verification Code
            </h2>
            <p style="margin: 0 0 24px; font-size: 14px; line-height: 1.6; color: #4b5563;">
              Please use the verification code below to sign in to your Glam Beauty account.
            </p>

            <!-- OTP Box -->
            <div style="background: #fff1f2; border: 1.5px dashed #f43f5e; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0;">
              <span style="display: block; font-size: 34px; font-weight: 800; letter-spacing: 8px; color: #e11d48; font-family: monospace;">
                ${otp}
              </span>
              <span style="display: block; margin-top: 8px; font-size: 12px; color: #9f1239; font-weight: 500;">
                ⏱️ Expires in 5 minutes
              </span>
            </div>

            <p style="margin: 24px 0 0; font-size: 13px; line-height: 1.5; color: #6b7280;">
              If you didn't request this verification code, you can safely ignore this email. Someone may have typed your email address by mistake.
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding: 24px 40px; background-color: #f9fafb; border-top: 1px solid #f3f4f6; text-align: center;">
            <p style="margin: 0; font-size: 11px; color: #9ca3af;">
              © ${new Date().getFullYear()} Glam Beauty. All rights reserved.
            </p>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  return sendEmail({ email, subject, message: text, html });
};

module.exports = { sendEmail, sendOTPEmail };

