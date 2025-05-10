import path from "path"
import { fileURLToPath } from "url"
import { sendEmail } from "../models/emailModel.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Controller function to render the contact page
export function getContactPage(req, res) {
  res.sendFile(path.join(__dirname, "../views/index.html"))
}

// Controller function to handle form submission
export async function submitContactForm(req, res) {
  try {
    const { name, email, message } = req.body

    // Validate input
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      })
    }

    // Send email using the model
    const result = await sendEmail({ name, email, message })

    if (result.success) {
      res.status(200).json({
        success: true,
        message: "Email sent successfully!",
      })
    } else {
      throw new Error(result.error || "Failed to send email")
    }
  } catch (error) {
    console.error("Error in submitContactForm:", error)
    res.status(500).json({
      success: false,
      message: error.message || "An error occurred while sending the email",
    })
  }
}
