import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import { sendEmail } from "./email";

// Google social login (Gmail + Calendar scopes) activates automatically
// once GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET are set in .env.local.
// Email+password stays available as the baseline credential flow.
const googleConfigured =
  Boolean(process.env.GOOGLE_CLIENT_ID) && Boolean(process.env.GOOGLE_CLIENT_SECRET);

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg" }),
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: "Reset your WihGo AI password",
        html: `<p>Hi ${user.name || "there"},</p><p>Reset your password here:</p><p><a href="${url}">${url}</a></p><p>This link expires soon. If you did not ask, ignore this email.</p>`,
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
