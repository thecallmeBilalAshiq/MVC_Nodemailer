import nodemailer from "nodemailer"

// Model function to send email
export async function sendEmail(data) {
  try {
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
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #f9f9f9;">
          <h2 style="color: #3a86ff; text-align: center; border-bottom: 2px solid #3a86ff; padding-bottom: 10px;">New Contact Form Submission</h2>
          <p style="margin: 15px 0;"><strong style="color: #555;">Name:</strong> ${data.name}</p>
          <p style="margin: 15px 0;"><strong style="color: #555;">Email:</strong> ${data.email}</p>
          <h3 style="color: #3a86ff; margin-top: 25px;">Message:</h3>
          <div style="background-color: white; padding: 15px; border-radius: 5px; border-left: 4px solid #3a86ff;">
            <p style="margin: 0; line-height: 1.6;">${data.message.replace(/\n/g, "<br>")}</p>
          </div>
          <p style="margin-top: 30px; font-size: 12px; color: #888; text-align: center;">This message was sent from your website contact form.</p>
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
      error: error.message || "Failed to send email",
    }
  }
}
