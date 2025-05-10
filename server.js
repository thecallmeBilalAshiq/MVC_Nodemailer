import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import fs from "fs";

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// Set view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "html");
app.engine("html", (filePath, options, callback) => {
  fs.readFile(filePath, (err, content) => {
    if (err) return callback(err);
    return callback(null, content.toString());
  });
});

// Create routes folder and files if they don't exist
const routesDir = path.join(__dirname, "routes");
const controllersDir = path.join(__dirname, "controllers");
const modelsDir = path.join(__dirname, "models");
const viewsDir = path.join(__dirname, "views");
const publicDir = path.join(__dirname, "public");
const cssDir = path.join(publicDir, "css");
const jsDir = path.join(publicDir, "js");

// Create directories if they don't exist
[routesDir, controllersDir, modelsDir, viewsDir, publicDir, cssDir, jsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
});

// Create route file if it doesn't exist
const routeFilePath = path.join(routesDir, "contactRoutes.js");
if (!fs.existsSync(routeFilePath)) {
  const routeContent = `import express from "express";
import { getContactPage, submitContactForm } from "../controllers/contactController.js";

const router = express.Router();

// Route to display the contact form
router.get("/", getContactPage);

// Route to handle form submission
router.post("/send", submitContactForm);

export default router;`;

  fs.writeFileSync(routeFilePath, routeContent);
  console.log(`Created file: ${routeFilePath}`);
}

// Create controller file if it doesn't exist
const controllerFilePath = path.join(controllersDir, "contactController.js");
if (!fs.existsSync(controllerFilePath)) {
  const controllerContent = `import path from "path";
import { fileURLToPath } from "url";
import { sendEmail } from "../models/emailModel.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Controller function to render the contact page
export function getContactPage(req, res) {
  res.sendFile(path.join(__dirname, "../views/index.html"));
}

// Controller function to handle form submission
export async function submitContactForm(req, res) {
  try {
    const { name, email, message } = req.body;

    // Validate input
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Send email using the model
    const result = await sendEmail({ name, email, message });

    if (result.success) {
      res.status(200).json({
        success: true,
        message: "Email sent successfully!",
      });
    } else {
      throw new Error(result.error || "Failed to send email");
    }
  } catch (error) {
    console.error("Error in submitContactForm:", error);
    res.status(500).json({
      success: false,
      message: error.message || "An error occurred while sending the email",
    });
  }
}`;

  fs.writeFileSync(controllerFilePath, controllerContent);
  console.log(`Created file: ${controllerFilePath}`);
}

// Create model file if it doesn't exist
const modelFilePath = path.join(modelsDir, "emailModel.js");
if (!fs.existsSync(modelFilePath)) {
  const modelContent = `import nodemailer from "nodemailer";

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
    });

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_FROM || "noreply@example.com",
      to: process.env.EMAIL_TO || "contact@example.com",
      replyTo: data.email,
      subject: \`Contact Form: Message from \${data.name}\`,
      text: \`
        Name: \${data.name}
        Email: \${data.email}
        
        Message:
        \${data.message}
      \`,
      html: \`
        <div>
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> \${data.name}</p>
          <p><strong>Email:</strong> \${data.email}</p>
          <h3>Message:</h3>
          <p>\${data.message.replace(/\\n/g, "<br>")}</p>
        </div>
      \`,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return { success: true };
  } catch (error) {
    console.error("Error sending email:", error);
    return {
      success: false,
      error: error.message || "Failed to send email",
    };
  }
}`;

  fs.writeFileSync(modelFilePath, modelContent);
  console.log(`Created file: ${modelFilePath}`);
}

// Create view file if it doesn't exist
const viewFilePath = path.join(viewsDir, "index.html");
if (!fs.existsSync(viewFilePath)) {
  const viewContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Contact Us</title>
  <!-- Bootstrap CSS -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
  <!-- Custom CSS -->
  <link rel="stylesheet" href="/css/styles.css">
</head>
<body>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-md-8 col-lg-6">
        <div class="card shadow">
          <div class="card-body">
            <h1 class="text-center mb-4">Contact Us</h1>
            
            <form id="contactForm">
              <div class="mb-3">
                <label for="name" class="form-label">Name</label>
                <input type="text" class="form-control" id="name" name="name" required>
              </div>
              
              <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input type="email" class="form-control" id="email" name="email" required>
              </div>
              
              <div class="mb-3">
                <label for="message" class="form-label">Message</label>
                <textarea class="form-control" id="message" name="message" rows="5" required></textarea>
              </div>
              
              <div class="d-grid">
                <button type="submit" class="btn btn-primary" id="submitBtn">Send Message</button>
              </div>
            </form>
            
            <!-- Alert for feedback -->
            <div class="alert mt-3 d-none" id="formAlert" role="alert"></div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Bootstrap JS Bundle with Popper -->
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
  <!-- Custom JS -->
  <script src="/js/main.js"></script>
</body>
</html>`;

  fs.writeFileSync(viewFilePath, viewContent);
  console.log(`Created file: ${viewFilePath}`);
}

// Create CSS file if it doesn't exist
const cssFilePath = path.join(cssDir, "styles.css");
if (!fs.existsSync(cssFilePath)) {
  const cssContent = `body {
  background-color: #f8f9fa;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

.card {
  border-radius: 10px;
  border: none;
}

.card-body {
  padding: 2rem;
}

h1 {
  color: #333;
  font-weight: 600;
}

.form-label {
  font-weight: 500;
}

.form-control:focus {
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
  border-color: #86b7fe;
}

.btn-primary {
  background-color: #0d6efd;
  border-color: #0d6efd;
  padding: 0.5rem 1rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background-color: #0b5ed7;
  border-color: #0a58ca;
}

.alert-success {
  background-color: #d1e7dd;
  border-color: #badbcc;
  color: #0f5132;
}

.alert-danger {
  background-color: #f8d7da;
  border-color: #f5c2c7;
  color: #842029;
}

.spinner-border {
  width: 1rem;
  height: 1rem;
  margin-right: 0.5rem;
}`;

  fs.writeFileSync(cssFilePath, cssContent);
  console.log(`Created file: ${cssFilePath}`);
}

// Create JS file if it doesn't exist
const jsFilePath = path.join(jsDir, "main.js");
if (!fs.existsSync(jsFilePath)) {
  const jsContent = `document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.getElementById("contactForm");
  const submitBtn = document.getElementById("submitBtn");
  const formAlert = document.getElementById("formAlert");

  // Function to show alert
  function showAlert(message, type) {
    formAlert.textContent = message;
    formAlert.className = \`alert mt-3 alert-\${type}\`;
    formAlert.classList.remove("d-none");

    // Auto hide after 5 seconds
    setTimeout(() => {
      formAlert.classList.add("d-none");
    }, 5000);
  }

  // Handle form submission
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Disable button and show loading state
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML =
      '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Sending...';
    submitBtn.disabled = true;

    try {
      // Get form data
      const formData = new FormData(contactForm);
      const formDataObj = Object.fromEntries(formData.entries());

      // Send data to server
      const response = await fetch("/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formDataObj),
      });

      const result = await response.json();

      if (result.success) {
        // Show success message
        showAlert(result.message || "Email sent successfully!", "success");
        // Reset form
        contactForm.reset();
      } else {
        // Show error message
        showAlert(result.message || "Failed to send email. Please try again.", "danger");
      }
    } catch (error) {
      console.error("Error:", error);
      showAlert("An unexpected error occurred. Please try again later.", "danger");
    } finally {
      // Restore button state
      submitBtn.innerHTML = originalBtnText;
      submitBtn.disabled = false;
    }
  });
});`;

  fs.writeFileSync(jsFilePath, jsContent);
  console.log(`Created file: ${jsFilePath}`);
}

// Create .env file if it doesn't exist
const envFilePath = path.join(__dirname, ".env");
if (!fs.existsSync(envFilePath)) {
  const envContent = `PORT=3000
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your-email@example.com
EMAIL_PASSWORD=your-password
EMAIL_FROM=your-email@example.com
EMAIL_TO=recipient@example.com
EMAIL_SECURE=false`;

  fs.writeFileSync(envFilePath, envContent);
  console.log(`Created file: ${envFilePath}`);
}

// Import routes
import contactRoutes from "./routes/contactRoutes.js";

// Use routes
app.use("/", contactRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// For demonstration purposes, log if email credentials are missing
if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
  console.warn("Warning: Email configuration is incomplete. Check your environment variables.");
}

export default app;