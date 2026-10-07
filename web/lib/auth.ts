import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import * as schema from "./schema";

// Email/password is always on. Google (Gmail readonly) activates when its
// OAuth credentials exist in server env — see web/.env.example.
const googleConfigured =
  Boolean(process.env.GOOGLE_CLIENT_ID) && Boolean(process.env.GOOGLE_CLIENT_SECRET);

export const auth = betterAuth({
  // Explicitly trusted browser origins (local dev + production).
  trustedOrigins: ["http://localhost:3000", "https://wihgo.netlify.app"],
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification
    }
  }),
  emailAndPassword: { enabled: true },
  ...(googleConfigured
    ? {
        socialProviders: {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            scope: ["openid", "email", "profile", "https://www.googleapis.com/auth/gmail.readonly"],
            accessType: "offline",
            prompt: "consent"
          }
        }
      }
    : {})
});
