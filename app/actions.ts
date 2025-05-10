"use server"

import nodemailer from "nodemailer"
import type { EmailData } from "@/models/email"

// Controller function to handle email sending
export async function sendEmail(data: EmailData) {
  try {
    // Validate input
    if (!data.name || !data.email || !data.message) {
      return { success: false, error: "All fields are required" }
    }

    // Create a transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: process.env.EMAIL_SECURE === "true",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    })

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_FROM || "noreply@example.com",
      to: process.env.EMAIL_TO || "contact@example.com",
      replyTo: data.email,
      subject: `Contact Form: Message from ${data.name}`,
      text: `
        Name: ${data.name}
        Email: ${data.email}
        
        Message:
        ${data.message}
      `,
      html: `
        <div>
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <h3>Message:</h3>
          <p>${data.message.replace(/\n/g, "<br>")}</p>
        </div>
      `,
    }

    // Send email
    await transporter.sendMail(mailOptions)

    return { success: true }
  } catch (error) {
    console.error("Error sending email:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send email",
    }
  }
}
