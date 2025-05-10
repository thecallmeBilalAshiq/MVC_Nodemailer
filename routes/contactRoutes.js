import express from "express"
import { getContactPage, submitContactForm } from "../controllers/contactController.js"

const router = express.Router()

// Route to display the contact form
router.get("/", getContactPage)

// Route to handle form submission
router.post("/send", submitContactForm)

export default router
