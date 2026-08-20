// utils/sendVerificationEmail.js
import crypto from "crypto";
import { sendEmail } from "./sendEmail.js";

export function generateVerificationToken() {
  const token = crypto.randomBytes(32).toString("hex");
  const expiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  return { token, expiry };
}

export async function sendVerificationEmail(user, token) {
  const verifyUrl = `${process.env.CLIENT_URL}/verify-email/${token}`;

  await sendEmail({
    to: user.email,
    subject: "Verify your email — Naari",
    html: `
      <h2>Welcome to Naari, ${user.name}</h2>
      <p>Please verify your email address to complete your account setup.</p>
      <p><a href="${verifyUrl}" style="background:#D4A34E;color:#000;padding:10px 24px;text-decoration:none;border-radius:4px;display:inline-block;margin-top:12px;">Verify Email</a></p>
      <p style="color:#888;font-size:12px;margin-top:24px;">This link expires in 24 hours. If you didn't create this account, you can ignore this email.</p>
    `,
  });
}

