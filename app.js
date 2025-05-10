import express from "express"
import path from "path"
import { fileURLToPath } from "url"
import bodyParser from "body-parser"
import dotenv from "dotenv"
import contactRoutes from "./routes/contactRoutes.js"

// Load environment variables
dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Initialize Express app
const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, "public")))

// Set view engine
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "html")
app.engine("html", (filePath, options, callback) => {
  // Simple HTML file rendering
  import("fs").then((fs) => {
    fs.readFile(filePath, (err, content) => {
      if (err) return callback(err)
      return callback(null, content.toString())
    })
  })
})

// Routes
app.use("/", contactRoutes)

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})

// For demonstration purposes, log if email credentials are missing
if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
  console.warn("Warning: Email configuration is incomplete. Check your environment variables.")
}

export default app
