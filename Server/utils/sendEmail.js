// utils/sendEmail.js
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({ to, subject, html, replyTo }) {
  await resend.emails.send({
    from: "Naari <onboarding@resend.dev>", // or your verified domain once you have one
    to,
    subject,
    html,
    reply_to: replyTo,
  });
}