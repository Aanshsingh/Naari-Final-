// utils/sendEmail.js
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendEmail({ to, subject, html, replyTo }) {
  await transporter.sendMail({
    from: `"Naari Contact Form" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
    replyTo, 
  });
}