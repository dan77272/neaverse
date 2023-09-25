import { withIronSession } from "next-iron-session";

export default function withSession(handler) {
  return withIronSession(handler, {
    password: 'a-secure-password-of-your-choice',
    cookieName: 'session-name',
    cookieOptions: {
      secure: process.env.NODE_ENV === 'production',
    },
  });
}