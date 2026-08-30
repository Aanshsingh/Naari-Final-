// Server/utils/sendEmail.js

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({ to, subject, html, replyTo }) {
  try {
    if (!process.env.RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    if (!to) {
      throw new Error("Recipient email is required");
    }

    if (!subject) {
      throw new Error("Email subject is required");
    }

    if (!html) {
      throw new Error("Email HTML content is required");
    }

    const emailData = {
      from: "Naari <contact@naariethnicbyprerna.com>",
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
    };

    // Only add replyTo when it actually exists
    if (replyTo) {
      emailData.replyTo = replyTo;
    }

    const { data, error } = await resend.emails.send(emailData);

    if (error) {
      console.error("RESEND ERROR:", error);
      throw new Error(error.message || "Failed to send email");
    }

    console.log("EMAIL SENT SUCCESSFULLY:", data);

    return data;
  } catch (error) {
    console.error("SEND EMAIL ERROR:", error);
    throw error;
  }
}