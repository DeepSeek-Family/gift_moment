import { ICreateAccount, IResetPassword } from '../types/emailTemplate';

const PRIMARY = "#F6339A";
const WHITE = "#ffffff";
const LOGO = "https://res.cloudinary.com/dnsktebcu/image/upload/v1772594172/Mask_group_oz2zkg.png";

const giftWrapper = (title: string, subtitle: string, body: string) => `
<body style="margin:0; padding:0; background:#fce7f3; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
    <tr>
      <td align="center">

        <table width="100%" cellpadding="0" cellspacing="0"
          style="max-width:600px; background:${WHITE}; border-radius:16px; overflow:hidden;
          box-shadow:0 15px 40px rgba(246,51,154,0.12);">

          <!-- Compact Header -->
          <tr>
            <td align="center" style="background:${PRIMARY}; padding:24px 20px;">

              <!-- Logo -->
              <img src="${LOGO}" 
                   alt="Gift Moment Logo"
                   style="display:block; margin:0 auto 12px; max-width:90px;" />

              <!-- Title -->
              <h1 style="margin:0; font-size:20px; color:white; font-weight:600;">
                ${title}
              </h1>

              <p style="margin:6px 0 0; font-size:13px; color:white; opacity:0.9;">
                ${subtitle}
              </p>

            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 35px; text-align:center;">

              ${body}

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#fff0f6; padding:18px; text-align:center; font-size:12px; color:#9f9f9f;">
              © 2026 Gift Moment · Crafted with care
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
</body>
`;

const otpBlock = (otp: string) => `
  <p style="font-size:15px; color:#555; line-height:1.6; margin-bottom:24px;">
    Use the code below to continue:
  </p>

  <div style="
    display:inline-block;
    padding:16px 34px;
    font-size:26px;
    font-weight:700;
    letter-spacing:6px;
    background:${PRIMARY};
    color:white;
    border-radius:10px;
    box-shadow:0 10px 25px rgba(246,51,154,0.30);
  ">
    ${otp}
  </div>

  <p style="margin-top:22px; font-size:13px; color:#777;">
    This code is valid for 3 minutes.
  </p>
`;

const createAccount = (values: ICreateAccount) => {
  return {
    to: values.email,
    subject: "🎁 Welcome to Gift Moment",
    html: giftWrapper(
      "Verify Your Account",
      "Your gift experience starts here",
      `
        <p style="font-size:15px; color:#444; margin-bottom:28px;">
          Hi ${values.name},<br/><br/>
          Thank you for joining Gift Moment. Please verify your account using the secure code below.
        </p>

        ${otpBlock(values.otp)}

        <p style="margin-top:28px; font-size:12px; color:#999;">
          If you did not create this account, you can safely ignore this email.
        </p>
      `
    )
  };
};

const resetPassword = (values: IResetPassword) => {
  return {
    to: values.email,
    subject: "🎀 Reset Your Password",
    html: giftWrapper(
      "Password Reset",
      "Secure your Gift Moment account",
      `
        <p style="font-size:15px; color:#444; margin-bottom:28px;">
          We received a request to reset your password.  
          Enter the code below to continue securely.
        </p>

        ${otpBlock(values.otp)}

        <p style="margin-top:28px; font-size:12px; color:#999;">
          If you didn’t request a reset, no action is needed.
        </p>
      `
    )
  };
};



const giftEmailTemplate = (
  senderName: string,
  message?: string,
  viewGiftUrl?: string
) => {
  return `
  <div style="
    background:#f5f5f7;
    padding:40px 20px;
    font-family: 'Segoe UI', Arial, sans-serif;
  ">

    <div style="
      max-width:600px;
      margin:auto;
      background:#ffffff;
      border-radius:14px;
      padding:40px 30px;
      box-shadow:0 10px 25px rgba(0,0,0,0.05);
      text-align:center;
    ">

      <h1 style="
        color:#e339cc;
        margin-bottom:10px;
        font-size:28px;
      ">
        🎁 You've Received a Gift!
      </h1>

      <p style="
        font-size:16px;
        color:#555;
        margin-bottom:20px;
      ">
        <strong style="color:#e339cc;">${senderName}</strong> sent you a special gift.
      </p>

      ${message
      ? `
        <div style="
          background:#fafafa;
          border-left:4px solid #e339cc;
          padding:18px;
          border-radius:6px;
          margin:25px 0;
          text-align:left;
        ">
          <p style="
            margin:0;
            color:#444;
            font-style:italic;
          ">
            "${message}"
          </p>
        </div>
      `
      : ""
    }

            <a 
        href="${viewGiftUrl}" 
        target="_blank"
        rel="noopener noreferrer"
        style="
          display:inline-block;
          margin-top:20px;
          padding:14px 32px;
          background:#e339cc;
          color:#ffffff;
          text-decoration:none;
          border-radius:8px;
          font-weight:600;
          font-size:15px;
          box-shadow:0 4px 12px rgba(227,57,204,0.3);
        "
      >
        View Your Gift
      </a>

      <p style="
        margin-top:35px;
        font-size:12px;
        color:#999;
      ">
        If you were not expecting this gift, you can safely ignore this email.
      </p>

    </div>

  </div>
  `;
};

export const emailTemplate = {
  createAccount,
  resetPassword,
  giftEmailTemplate
};