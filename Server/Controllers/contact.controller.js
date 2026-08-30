// Server/controllers/contact.controller.js

import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendEmail } from "../utils/sendEmail.js";

const submitContactForm = asyncHandler(async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    throw new ApiError(400, "Name, email, and message are required");
  }

  // --------------------------------
  // 1. SEND MESSAGE TO ADMIN
  // --------------------------------

  const adminEmail = process.env.ADMIN_EMAIL;

  if (!adminEmail) {
    throw new ApiError(500, "ADMIN_EMAIL is not configured");
  }

  await sendEmail({
    to: adminEmail,
    subject: subject
      ? `[Naari Contact] ${subject}`
      : `[Naari Contact] New message from ${name}`,

    replyTo: email,

    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>New Contact Us Message</h2>

        <p>
          <strong>Name:</strong> ${name}
        </p>

        <p>
          <strong>Email:</strong> ${email}
        </p>

        ${
          subject
            ? `<p><strong>Subject:</strong> ${subject}</p>`
            : ""
        }

        <p><strong>Message:</strong></p>

        <p>
          ${message.replace(/\n/g, "<br>")}
        </p>

        <hr />

        <p style="color:#777;font-size:12px;">
          This message was submitted through the Naari website.
        </p>
      </div>
    `,
  });

  // --------------------------------
  // 2. SEND CONFIRMATION TO CUSTOMER
  // --------------------------------

  await sendEmail({
    to: email,

    subject: "We've received your message — Naari",

    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Thank you for contacting Naari</h2>

        <p>Hi ${name},</p>

        <p>
          Thank you for reaching out to Naari.
          We've successfully received your message.
        </p>

        <p>
          Our team will get back to you within
          1–2 business days.
        </p>

        <hr />

        <p style="color:#777;font-size:12px;">
          This is an automated confirmation email.
        </p>
      </div>
    `,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {},
        "Message sent successfully"
      )
    );
});

export { submitContactForm };