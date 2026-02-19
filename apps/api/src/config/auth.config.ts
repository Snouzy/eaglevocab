import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@eagle-vocab/database";
import { env } from "../env";

export const auth = betterAuth({
  trustedOrigins: [env.WEB_URL, env.APP_URL],
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  session: {
    cookieCache: { enabled: true, maxAge: 60 * 60 * 24 * 30 },
  },
  emailAndPassword: { enabled: true },
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
});
