// controllers/contact.controller.js
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

import { sendEmail } from "../utils/sendEmail.js";

const submitContactForm = asyncHandler(async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    throw new ApiError(400, "Name, email, and message are required");
  }

  await sendEmail({
    to: process.env.ADMIN_EMAIL,
    subject: subject ? `[Naari Contact] ${subject}` : `[Naari Contact] New message from ${name}`,
    replyTo: email,
    html: `
      <h2>New message from Naari's contact form</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      ${subject ? `<p><strong>Subject:</strong> ${subject}</p>` : ""}
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, "<br>")}</p>
    `,
  });

  // optional confirmation email back to the customer
  await sendEmail({
    to: email,
    subject: "We've received your message — Naari",
    html: `
      <p>Hi ${name},</p>
      <p>Thanks for reaching out to Naari. We've received your message and will get back to you within 1-2 business days.</p>
      <p style="color:#888;font-size:12px;margin-top:24px;">This is an automated confirmation — no need to reply to this email.</p>
    `,
  });

  return res.status(200).json(new ApiResponse(200, {}, "Message sent successfully"));
});

export { submitContactForm };