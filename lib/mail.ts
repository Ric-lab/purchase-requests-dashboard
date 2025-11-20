import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const domain = process.env.NEXT_PUBLIC_APP_URL;

export const sendPasswordResetEmail = async (
    email: string,
    token: string
) => {
    const resetLink = `${domain}/auth/new-password?token=${token}`;

    await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "Reset your password",
        html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #f5f5f7;">
        <div style="background-color: white; padding: 40px; border-radius: 18px; box-shadow: 0 4px 24px rgba(0,0,0,0.04); text-align: center;">
          <h1 style="color: #1d1d1f; font-size: 24px; font-weight: 600; margin-bottom: 16px; letter-spacing: -0.02em;">Reset Password</h1>
          <p style="color: #86868b; font-size: 17px; line-height: 1.5; margin-bottom: 32px;">
            We received a request to reset your password. Click the button below to create a new one.
          </p>
          <a href="${resetLink}" style="display: inline-block; background-color: #0071e3; color: white; padding: 14px 32px; border-radius: 999px; text-decoration: none; font-weight: 500; font-size: 17px; transition: background-color 0.2s;">
            Reset Password
          </a>
          <p style="color: #86868b; font-size: 13px; margin-top: 40px;">
            If you didn't request this, you can safely ignore this email.
          </p>
        </div>
      </div>
    `
    });
};
