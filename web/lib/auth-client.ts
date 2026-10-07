"use client";

import { createAuthClient } from "better-auth/client";

// No hardcoded baseURL: the client talks to whatever origin served the
// page (localhost:3000 in dev, wihgo.netlify.app in production).
export const authClient = createAuthClient();
