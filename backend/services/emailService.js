const nodemailer = require('nodemailer');

/**
 * Creates a configured Nodemailer transporter.
 * Uses Gmail SMTP. Requires EMAIL_USER and EMAIL_PASS in .env
 */
const createTransporter = () => {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS // Use Gmail App Password, NOT your real password
        }
    });
};

/**
 * Sends a password reset email with a branded HTML template.
 * @param {string} toEmail  – recipient's email address
 * @param {string} resetUrl – the full reset link (/reset-password?token=...)
 * @param {string} userName – recipient's display name
 */
const sendPasswordResetEmail = async (toEmail, resetUrl, userName) => {
    const transporter = createTransporter();

    const htmlBody = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>Reset Your Cookify Password</title>
    </head>
    <body style="margin:0;padding:0;background:#f4f4f4;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:40px 0;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,0.08);">
              
              <!-- Header -->
              <tr>
                <td style="background:linear-gradient(135deg,#16a34a 0%,#15803d 100%);padding:40px 48px;text-align:center;">
                  <table cellpadding="0" cellspacing="0" style="display:inline-block;">
                    <tr>
                      <td style="background:rgba(255,255,255,0.2);border-radius:16px;padding:12px 14px;display:inline-block;">
                        <span style="font-size:28px;">🍃</span>
                      </td>
                    </tr>
                  </table>
                  <p style="color:rgba(255,255,255,0.8);font-size:11px;font-weight:800;letter-spacing:0.3em;text-transform:uppercase;margin:16px 0 0;">Cookify</p>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding:48px 48px 32px;">
                  <h1 style="margin:0 0 8px;font-size:32px;font-weight:900;color:#111827;letter-spacing:-0.5px;">Password Reset</h1>
                  <p style="margin:0 0 32px;font-size:15px;color:#6b7280;font-weight:500;line-height:1.6;">
                    Hey <strong style="color:#111827;">${userName}</strong>, we received a request to reset the password for your Cookify account.
                    Click the button below to create a new password. This link expires in <strong>1 hour</strong>.
                  </p>

                  <!-- CTA Button -->
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center" style="padding:8px 0 32px;">
                        <a href="${resetUrl}" target="_blank"
                           style="display:inline-block;background:linear-gradient(135deg,#16a34a,#15803d);color:#ffffff;font-size:14px;font-weight:800;letter-spacing:0.1em;text-transform:uppercase;text-decoration:none;padding:18px 48px;border-radius:16px;box-shadow:0 8px 24px rgba(22,163,74,0.4);">
                          Reset My Password
                        </a>
                      </td>
                    </tr>
                  </table>

                  <!-- Fallback link -->
                  <p style="font-size:13px;color:#9ca3af;line-height:1.6;word-break:break-all;">
                    If the button above doesn't work, paste this link into your browser:<br/>
                    <a href="${resetUrl}" style="color:#16a34a;font-weight:700;">${resetUrl}</a>
                  </p>
                </td>
              </tr>

              <!-- Divider -->
              <tr>
                <td style="padding:0 48px;"><div style="height:1px;background:#f3f4f6;"></div></td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="padding:24px 48px 40px;text-align:center;">
                  <p style="margin:0;font-size:12px;color:#d1d5db;">
                    If you didn't request this, you can safely ignore this email. Your password won't change.<br/>
                    <span style="font-size:11px;font-weight:800;letter-spacing:0.2em;text-transform:uppercase;color:#e5e7eb;">© 2026 Cookify Inc • Fresh Culinary Labs</span>
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
    `;

    const mailOptions = {
        from: `"Cookify 🍃" <${process.env.EMAIL_USER}>`,
        to: toEmail,
        subject: 'Reset Your Cookify Password',
        html: htmlBody,
        text: `Reset your password using this link (expires in 1 hour): ${resetUrl}`
    };

    await transporter.sendMail(mailOptions);
};

module.exports = { sendPasswordResetEmail };
