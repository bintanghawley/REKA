import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import { db } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { loginSchema } from "@/lib/validations/auth";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parseResult = loginSchema.safeParse(credentials);
        if (!parseResult.success) {
          return null;
        }

        const { email, password } = parseResult.data;

        try {
          const user = await db.user.findUnique({
            where: { email },
            select: { id: true, email: true, password_hash: true },
          });

          if (!user) return null;

          const passwordMatch = await bcrypt.compare(
            password,
            user.password_hash
          );

          if (!passwordMatch) return null;

          return {
            id: user.id,
            email: user.email,
          };
        } catch {
          return null;
        }
      },
    }),
  ],
});
