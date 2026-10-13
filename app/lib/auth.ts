import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import { sendEmail } from "./email";

// Google social login (Gmail + Calendar scopes) activates automatically
// once GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET are set in .env.local.
// Email+password stays available as the baseline credential flow.
const googleConfigured =
  Boolean(process.env.GOOGLE_CLIENT_ID) && Boolean(process.env.GOOGLE_CLIENT_SECRET);

const VERIFY_FROM = "WIHGO AI <onboarding@resend.dev>";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  trustedOrigins: [
    "http://localhost:3000",
    "https://wihgo.netlify.app",
  ],
  database: drizzleAdapter(db, { provider: "pg" }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    autoSignIn: true,
    sendResetPassword: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: "Reset your WihGo AI password",
        html: `<p>Hi ${user.name || "there"},</p><p>Reset your password here:</p><p><a href="${url}">${url}</a></p><p>This link expires soon. If you did not ask, ignore this email.</p>`,
        userId: user.id,
      });
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        from: VERIFY_FROM,
        subject: "Verify your WihGo AI account",
        html: `<div style="font-family:sans-serif;max-width:480px;margin:0 auto;background:#05070E;color:#E2E8F0;padding:32px;border-radius:16px;">
          <h1 style="color:#FFFFFF;margin:0 0 4px;">WIHGO <span style="color:#2DD4BF;">AI</span></h1>
          <p style="color:#2DD4BF;font-size:11px;letter-spacing:3px;margin:0 0 16px;">CONNECT HUB</p>
          <p>Hi ${user.name || "there"},</p>
          <p>Confirm your email to activate your account:</p>
          <p><a href="${url}" style="display:inline-block;background:#0D9488;color:#000000;font-weight:bold;padding:12px 24px;border-radius:12px;text-decoration:none;">Verify Email</a></p>
          <p style="font-size:12px;color:#94A3B8;">Or paste this link: ${url}</p>
          <p style="font-size:12px;color:#94A3B8;">If you did not sign up, ignore this email.</p>
        </div>`,
        userId: user.id,
      });
    },
  },
  ...(googleConfigured
    ? {
        socialProviders: {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            scope: ["openid", "email", "profile", "https://www.googleapis.com/auth/gmail.readonly", "https://www.googleapis.com/auth/calendar.readonly"]
          }
        }
      }
    : {})
});
