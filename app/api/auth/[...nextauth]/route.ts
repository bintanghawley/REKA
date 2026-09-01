import { handlers } from "@/auth";

/**
 * Route handler untuk Auth.js v5.
 * Menangani semua request ke /api/auth/* (login, logout, session, dll).
 */
export const { GET, POST } = handlers;
