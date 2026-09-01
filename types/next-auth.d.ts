import type { DefaultSession } from "next-auth";

/**
 * Augmentasi tipe next-auth agar session.user.id tersedia
 * sebagai string di semua Server Components dan Server Actions.
 *
 * Tanpa ini, TypeScript akan error karena `session.user.id`
 * tidak ada di DefaultSession dari next-auth.
 */
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}
