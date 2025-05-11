import express from "express"
import path from "path"
import { fileURLToPath } from "url"
import bodyParser from "body-parser"
import dotenv from "dotenv"
import fs from "fs"

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
  fs.readFile(filePath, (err, content) => {
    if (err) return callback(err)
    return callback(null, content.toString())
  })
})

// Create routes folder and files if they don't exist
const routesDir = path.join(__dirname, "routes")
const controllersDir = path.join(__dirname, "controllers")
const modelsDir = path.join(__dirname, "models")
const viewsDir = path.join(__dirname, "views")
const publicDir = path.join(__dirname, "public")
const cssDir = path.join(publicDir, "css")
const jsDir = path.join(publicDir, "js")
const imagesDir = path.join(publicDir, "images")

// Create directories if they don't exist
;[routesDir, controllersDir, modelsDir, viewsDir, publicDir, cssDir, jsDir, imagesDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
    console.log(`Created directory: ${dir}`)
  }
})

// Create route file if it doesn't exist
const routeFilePath = path.join(routesDir, "contactRoutes.js")
if (!fs.existsSync(routeFilePath)) {
  const routeContent = `import express from "express";
import { getContactPage, submitContactForm } from "../controllers/contactController.js";

const router = express.Router();

// Route to display the contact form
router.get("/", getContactPage);

// Route to handle form submission
router.post("/send", submitContactForm);

export default router;`

  fs.writeFileSync(routeFilePath, routeContent)
  console.log(`Created file: ${routeFilePath}`)
}

// Create controller file if it doesn't exist
const controllerFilePath = path.join(controllersDir, "contactController.js")
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
}`

  fs.writeFileSync(controllerFilePath, controllerContent)
  console.log(`Created file: ${controllerFilePath}`)
}

// Create model file if it doesn't exist
const modelFilePath = path.join(modelsDir, "emailModel.js")
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
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #f9f9f9;">
          <h2 style="color: #3a86ff; text-align: center; border-bottom: 2px solid #3a86ff; padding-bottom: 10px;">New Contact Form Submission</h2>
          <p style="margin: 15px 0;"><strong style="color: #555;">Name:</strong> \${data.name}</p>
          <p style="margin: 15px 0;"><strong style="color: #555;">Email:</strong> \${data.email}</p>
          <h3 style="color: #3a86ff; margin-top: 25px;">Message:</h3>
          <div style="background-color: white; padding: 15px; border-radius: 5px; border-left: 4px solid #3a86ff;">
            <p style="margin: 0; line-height: 1.6;">\${data.message.replace(/\\n/g, "<br>")}</p>
          </div>
          <p style="margin-top: 30px; font-size: 12px; color: #888; text-align: center;">This message was sent from your website contact form.</p>
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
}`

  fs.writeFileSync(modelFilePath, modelContent)
  console.log(`Created file: ${modelFilePath}`)
}

// Create view file if it doesn't exist
const viewFilePath = path.join(viewsDir, "index.html")
if (!fs.existsSync(viewFilePath)) {
  const viewContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Contact Us | Professional Communication</title>
  <!-- Font Awesome -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <!-- AOS Animation Library -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.css">
  <!-- Custom CSS -->
  <link rel="stylesheet" href="/css/styles.css">
</head>
<body>
  <div class="particles-container" id="particles-js"></div>
  
  <div class="page-wrapper">
    <header class="header">
      <div class="logo" data-aos="fade-down">
        <i class="fas fa-paper-plane"></i>
        <span>Connect</span>
      </div>
      <nav class="nav" data-aos="fade-down" data-aos-delay="100">
        <ul>
          <li><a href="#" class="active">Home</a></li>
          <li><a href="#">About</a></li>
          <li><a href="#">Services</a></li>
          <li><a href="#">Portfolio</a></li>
          <li><a href="#">Contact</a></li>
        </ul>
      </nav>
    </header>

    <main class="main-content">
      <div class="contact-container">
        <div class="contact-info" data-aos="fade-right" data-aos-duration="800">
          <h2>Get in Touch</h2>
          <p>We'd love to hear from you. Fill out the form and our team will get back to you as soon as possible.</p>
          
          <div class="info-item">
            <i class="fas fa-map-marker-alt"></i>
            <div>
              <h3>Our Location</h3>
              <p>123 Business Avenue, Suite 100, New York, NY 10001</p>
            </div>
          </div>
          
          <div class="info-item">
            <i class="fas fa-phone-alt"></i>
            <div>
              <h3>Call Us</h3>
              <p>+1 (555) 123-4567</p>
            </div>
          </div>
          
          <div class="info-item">
            <i class="fas fa-envelope"></i>
            <div>
              <h3>Email Us</h3>
              <p>info@yourcompany.com</p>
            </div>
          </div>
          
          <div class="social-links">
            <a href="#" class="social-link"><i class="fab fa-facebook-f"></i></a>
            <a href="#" class="social-link"><i class="fab fa-twitter"></i></a>
            <a href="#" class="social-link"><i class="fab fa-linkedin-in"></i></a>
            <a href="#" class="social-link"><i class="fab fa-instagram"></i></a>
          </div>
        </div>
        
        <div class="contact-form-container" data-aos="fade-left" data-aos-duration="800">
          <div class="form-header">
            <h2>Send a Message</h2>
            <p>Fill out the form below to send us a message</p>
          </div>
          
          <form id="contactForm" class="contact-form">
            <div class="form-group">
              <div class="input-container">
                <i class="fas fa-user"></i>
                <input type="text" id="name" name="name" placeholder="Your Name" required>
              </div>
            </div>
            
            <div class="form-group">
              <div class="input-container">
                <i class="fas fa-envelope"></i>
                <input type="email" id="email" name="email" placeholder="Your Email" required>
              </div>
            </div>
            
            <div class="form-group">
              <div class="input-container textarea-container">
                <i class="fas fa-comment-alt"></i>
                <textarea id="message" name="message" placeholder="Your Message" rows="5" required></textarea>
              </div>
            </div>
            
            <button type="submit" id="submitBtn" class="submit-btn">
              <span class="btn-text">Send Message</span>
              <i class="fas fa-paper-plane"></i>
            </button>
          </form>
          
          <div id="formAlert" class="form-alert"></div>
        </div>
      </div>
    </main>
    
    <footer class="footer">
      <p>&copy; 2023 Your Company. All rights reserved.</p>
    </footer>
  </div>

  <!-- Particles.js -->
  <script src="https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js"></script>
  <!-- AOS Animation Library -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.js"></script>
  <!-- Custom JS -->
  <script src="/js/main.js"></script>
</body>
</html>`

  fs.writeFileSync(viewFilePath, viewContent)
  console.log(`Created file: ${viewFilePath}`)
}

// Create CSS file if it doesn't exist
const cssFilePath = path.join(cssDir, "styles.css")
if (!fs.existsSync(cssFilePath)) {
  const cssContent = `/* Base Styles */
:root {
  --primary-color: #3a86ff;
  --primary-dark: #2667cc;
  --secondary-color: #ff006e;
  --text-color: #333;
  --text-light: #666;
  --bg-color: #f8f9fa;
  --white: #ffffff;
  --success: #4caf50;
  --error: #f44336;
  --border-radius: 12px;
  --box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  --transition: all 0.3s ease;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Poppins', sans-serif;
  color: var(--text-color);
  background-color: var(--bg-color);
  line-height: 1.6;
  overflow-x: hidden;
}

/* Particles Background */
.particles-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}

/* Page Layout */
.page-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Header Styles */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 5%;
  background-color: rgba(255, 255, 255, 0.95);
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 100;
}

.logo {
  display: flex;
  align-items: center;
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--primary-color);
}

.logo i {
  margin-right: 0.5rem;
  font-size: 1.5rem;
}

.nav ul {
  display: flex;
  list-style: none;
}

.nav ul li {
  margin-left: 2rem;
}

.nav ul li a {
  text-decoration: none;
  color: var(--text-color);
  font-weight: 500;
  transition: var(--transition);
  position: relative;
}

.nav ul li a:hover,
.nav ul li a.active {
  color: var(--primary-color);
}

.nav ul li a::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 0;
  height: 2px;
  background-color: var(--primary-color);
  transition: var(--transition);
}

.nav ul li a:hover::after,
.nav ul li a.active::after {
  width: 100%;
}

/* Main Content */
.main-content {
  flex: 1;
  padding: 3rem 5%;
}

/* Contact Container */
.contact-container {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  background-color: var(--white);
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: var(--box-shadow);
}

/* Contact Info */
.contact-info {
  flex: 1;
  min-width: 300px;
  background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
  color: var(--white);
  padding: 3rem 2rem;
  position: relative;
  overflow: hidden;
}

.contact-info::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%);
  z-index: 0;
}

.contact-info h2 {
  font-size: 2.2rem;
  margin-bottom: 1.5rem;
  position: relative;
  z-index: 1;
}

.contact-info > p {
  margin-bottom: 2.5rem;
  opacity: 0.9;
  position: relative;
  z-index: 1;
}

.info-item {
  display: flex;
  margin-bottom: 1.5rem;
  position: relative;
  z-index: 1;
}

.info-item i {
  font-size: 1.5rem;
  margin-right: 1rem;
  margin-top: 0.3rem;
}

.info-item h3 {
  font-size: 1.1rem;
  margin-bottom: 0.3rem;
}

.info-item p {
  opacity: 0.9;
  font-size: 0.95rem;
}

.social-links {
  display: flex;
  gap: 1rem;
  margin-top: 2.5rem;
  position: relative;
  z-index: 1;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.2);
  color: var(--white);
  text-decoration: none;
  transition: var(--transition);
}

.social-link:hover {
  background-color: var(--white);
  color: var(--primary-color);
  transform: translateY(-3px);
}

/* Contact Form */
.contact-form-container {
  flex: 1.5;
  min-width: 300px;
  padding: 3rem 2rem;
}

.form-header {
  margin-bottom: 2rem;
  text-align: center;
}

.form-header h2 {
  font-size: 2rem;
  color: var(--primary-color);
  margin-bottom: 0.5rem;
}

.form-header p {
  color: var(--text-light);
}

.contact-form {
  max-width: 500px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 1.5rem;
}

.input-container {
  position: relative;
  display: flex;
  align-items: center;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  transition: var(--transition);
}

.input-container:focus-within {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(58, 134, 255, 0.2);
}

.input-container i {
  width: 50px;
  display: flex;
  justify-content: center;
  color: var(--text-light);
}

.input-container input,
.input-container textarea {
  flex: 1;
  padding: 1rem;
  border: none;
  outline: none;
  font-family: 'Poppins', sans-serif;
  font-size: 1rem;
}

.textarea-container {
  align-items: flex-start;
}

.textarea-container i {
  padding-top: 1rem;
}

.submit-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 1rem;
  background-color: var(--primary-color);
  color: var(--white);
  border: none;
  border-radius: 8px;
  font-family: 'Poppins', sans-serif;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
  position: relative;
  overflow: hidden;
}

.submit-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: 0.5s;
}

.submit-btn:hover {
  background-color: var(--primary-dark);
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.submit-btn:hover::before {
  left: 100%;
}

.submit-btn i {
  margin-left: 0.5rem;
}

.submit-btn.loading .btn-text {
  visibility: hidden;
  opacity: 0;
}

.submit-btn.loading::after {
  content: "";
  position: absolute;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: var(--white);
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Form Alert */
.form-alert {
  margin-top: 1.5rem;
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
  font-weight: 500;
  opacity: 0;
  transform: translateY(-10px);
  transition: var(--transition);
}

.form-alert.show {
  opacity: 1;
  transform: translateY(0);
}

.form-alert.success {
  background-color: rgba(76, 175, 80, 0.1);
  color: var(--success);
  border: 1px solid rgba(76, 175, 80, 0.3);
}

.form-alert.error {
  background-color: rgba(244, 67, 54, 0.1);
  color: var(--error);
  border: 1px solid rgba(244, 67, 54, 0.3);
}

/* Footer */
.footer {
  text-align: center;
  padding: 1.5rem;
  background-color: var(--white);
  box-shadow: 0 -2px 15px rgba(0, 0, 0, 0.05);
}

/* Animations */
@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .header {
    flex-direction: column;
    padding: 1rem;
  }
  
  .logo {
    margin-bottom: 1rem;
  }
  
  .nav ul {
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .nav ul li {
    margin: 0.5rem;
  }
  
  .contact-container {
    flex-direction: column;
  }
  
  .contact-info,
  .contact-form-container {
    padding: 2rem 1.5rem;
  }
}

@media (max-width: 480px) {
  .main-content {
    padding: 2rem 1rem;
  }
  
  .form-header h2 {
    font-size: 1.8rem;
  }
  
  .input-container {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .input-container i {
    width: 100%;
    padding: 0.5rem;
    background-color: rgba(0, 0, 0, 0.02);
  }
}`

  fs.writeFileSync(cssFilePath, cssContent)
  console.log(`Created file: ${cssFilePath}`)
}

// Create JS file if it doesn't exist
const jsFilePath = path.join(jsDir, "main.js")
if (!fs.existsSync(jsFilePath)) {
  const jsContent = `document.addEventListener("DOMContentLoaded", () => {
  // Initialize AOS animation library
  AOS.init({
    duration: 1000,
    once: true,
    mirror: false
  });

  // Initialize particles.js
  particlesJS("particles-js", {
    particles: {
      number: {
        value: 80,
        density: {
          enable: true,
          value_area: 800
        }
      },
      color: {
        value: "#3a86ff"
      },
      shape: {
        type: "circle",
        stroke: {
          width: 0,
          color: "#000000"
        },
        polygon: {
          nb_sides: 5
        }
      },
      opacity: {
        value: 0.5,
        random: false,
        anim: {
          enable: false,
          speed: 1,
          opacity_min: 0.1,
          sync: false
        }
      },
      size: {
        value: 3,
        random: true,
        anim: {
          enable: false,
          speed: 40,
          size_min: 0.1,
          sync: false
        }
      },
      line_linked: {
        enable: true,
        distance: 150,
        color: "#3a86ff",
        opacity: 0.4,
        width: 1
      },
      move: {
        enable: true,
        speed: 2,
        direction: "none",
        random: false,
        straight: false,
        out_mode: "out",
        bounce: false,
        attract: {
          enable: false,
          rotateX: 600,
          rotateY: 1200
        }
      }
    },
    interactivity: {
      detect_on: "canvas",
      events: {
        onhover: {
          enable: true,
          mode: "grab"
        },
        onclick: {
          enable: true,
          mode: "push"
        },
        resize: true
      },
      modes: {
        grab: {
          distance: 140,
          line_linked: {
            opacity: 1
          }
        },
        bubble: {
          distance: 400,
          size: 40,
          duration: 2,
          opacity: 8,
          speed: 3
        },
        repulse: {
          distance: 200,
          duration: 0.4
        },
        push: {
          particles_nb: 4
        },
        remove: {
          particles_nb: 2
        }
      }
    },
    retina_detect: true
  });

  // Form handling
  const contactForm = document.getElementById("contactForm");
  const submitBtn = document.getElementById("submitBtn");
  const formAlert = document.getElementById("formAlert");
  const btnText = submitBtn.querySelector(".btn-text");

  // Function to show alert
  function showAlert(message, type) {
    formAlert.textContent = message;
    formAlert.className = \`form-alert \${type}\`;
    
    // Add show class after a small delay for animation
    setTimeout(() => {
      formAlert.classList.add("show");
    }, 10);

    // Auto hide after 5 seconds
    setTimeout(() => {
      formAlert.classList.remove("show");
      
      // Remove class after fade out animation completes
      setTimeout(() => {
        formAlert.className = "form-alert";
      }, 300);
    }, 5000);
  }

  // Add input animation effects
  const inputs = document.querySelectorAll(".input-container input, .input-container textarea");
  
  inputs.forEach(input => {
    // Add focus animation
    input.addEventListener("focus", () => {
      input.parentElement.style.transform = "translateY(-3px)";
    });
    
    // Remove focus animation
    input.addEventListener("blur", () => {
      input.parentElement.style.transform = "translateY(0)";
    });
  });

  // Handle form submission with animation
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Disable button and show loading state
    submitBtn.disabled = true;
    submitBtn.classList.add("loading");

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
        // Show success message with animation
        showAlert(result.message || "Your message has been sent successfully! We'll get back to you soon.", "success");
        
        // Reset form with animation
        inputs.forEach(input => {
          input.style.transition = "all 0.3s ease";
          input.style.opacity = "0";
          
          setTimeout(() => {
            input.value = "";
            input.style.opacity = "1";
          }, 300);
        });
        
        // Add success animation to button
        submitBtn.classList.remove("loading");
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Sent Successfully';
        
        setTimeout(() => {
          submitBtn.innerHTML = '<span class="btn-text">Send Message</span><i class="fas fa-paper-plane"></i>';
          submitBtn.disabled = false;
        }, 2000);
      } else {
        // Show error message
        showAlert(result.message || "Failed to send email. Please try again.", "error");
        
        // Restore button state
        submitBtn.classList.remove("loading");
        submitBtn.innerHTML = '<span class="btn-text">Send Message</span><i class="fas fa-paper-plane"></i>';
        submitBtn.disabled = false;
      }
    } catch (error) {
      console.error("Error:", error);
      showAlert("An unexpected error occurred. Please try again later.", "error");
      
      // Restore button state
      submitBtn.classList.remove("loading");
      submitBtn.innerHTML = '<span class="btn-text">Send Message</span><i class="fas fa-paper-plane"></i>';
      submitBtn.disabled = false;
    }
  });

  // Add floating animation to elements
  const floatingElements = document.querySelectorAll(".info-item");
  floatingElements.forEach((element, index) => {
    element.style.animation = \`float 3s ease-in-out \${index * 0.2}s infinite\`;
  });

  // Add pulse animation to logo
  const logo = document.querySelector(".logo");
  logo.style.animation = "pulse 2s ease-in-out infinite";
});`

  fs.writeFileSync(jsFilePath, jsContent)
  console.log(`Created file: ${jsFilePath}`)
}

// Create .env file if it doesn't exist
const envFilePath = path.join(__dirname, ".env")
if (!fs.existsSync(envFilePath)) {
  const envContent = `PORT=3000
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=your-email@gmail.com
EMAIL_TO=recipient@gmail.com
EMAIL_SECURE=false`

  fs.writeFileSync(envFilePath, envContent)
  console.log(`Created file: ${envFilePath}`)
}

// Import routes
import contactRoutes from "./routes/contactRoutes.js"

// Use routes
app.use("/", contactRoutes)

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
  console.log(`✨ Professional contact form with animations is ready!`)
})

// For demonstration purposes, log if email credentials are missing
if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
  console.warn("Warning: Email configuration is incomplete. Check your environment variables.")
}

export default app
