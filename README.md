<div align="center">
  <h1>📧 MVC Nodemailer Contact Form</h1>
  <p>A beautiful, professional contact form built with Express.js and Node.js</p>
  
  ![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
  ![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
  ![Bootstrap](https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white)
  ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
  ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
  ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
</div>

<p align="center">
  <img src="https://via.placeholder.com/800x400?text=Contact+Form+Screenshot" alt="Contact Form Screenshot" width="80%">
</p>

## ✨ Features

- 🏗️ **MVC Architecture** - Clean separation of concerns
- 📱 **Responsive Design** - Looks great on all devices
- ✅ **Form Validation** - Client and server-side validation
- 📨 **Email Notifications** - Instant email delivery
- 🛡️ **Error Handling** - Comprehensive error management
- 🎨 **Modern UI** - Beautiful Bootstrap styling

## 📚 Table of Contents

- [Technologies Used](#%EF%B8%8F-technologies-used)
- [Project Architecture](#-project-architecture)
- [Installation Guide](#-installation-guide)
- [Configuration Steps](#%EF%B8%8F-configuration-steps)
- [Running the Application](#-running-the-application)
- [Code Explanation](#-code-explanation)
- [Troubleshooting](#-troubleshooting)
- [Customization Guide](#-customization-guide)
- [License](#-license)

## 🛠️ Technologies Used

<table>
  <tr>
    <td align="center" width="96">
      <img src="https://skillicons.dev/icons?i=nodejs" width="48" height="48" alt="Node.js" />
      <br>Node.js
    </td>
    <td align="center" width="96">
      <img src="https://skillicons.dev/icons?i=express" width="48" height="48" alt="Express" />
      <br>Express
    </td>
    <td align="center" width="96">
      <img src="https://skillicons.dev/icons?i=html" width="48" height="48" alt="HTML" />
      <br>HTML
    </td>
    <td align="center" width="96">
      <img src="https://skillicons.dev/icons?i=css" width="48" height="48" alt="CSS" />
      <br>CSS
    </td>
    <td align="center" width="96">
      <img src="https://skillicons.dev/icons?i=js" width="48" height="48" alt="JavaScript" />
      <br>JavaScript
    </td>
    <td align="center" width="96">
      <img src="https://skillicons.dev/icons?i=bootstrap" width="48" height="48" alt="Bootstrap" />
      <br>Bootstrap
    </td>
  </tr>
</table>

- **Node.js**: JavaScript runtime for server-side execution
- **Express.js**: Web framework for handling HTTP requests and routing
- **Nodemailer**: Library for sending emails from Node.js applications
- **HTML**: Structure for the contact form and web pages
- **CSS**: Styling to create a beautiful user interface
- **JavaScript**: Client-side validation and form submission
- **Bootstrap**: Responsive design framework for modern UI components

## 🏗 Project Architecture

This project follows the MVC (Model-View-Controller) architecture pattern:

<p align="center">
  <img src="https://via.placeholder.com/800x400?text=MVC+Architecture+Diagram" alt="MVC Architecture" width="80%">
</p>

### 📂 Project Structure

```
mvc-nodemailer/
├── 📁 controllers/         # Handles user input and business logic
│   └── contactController.js
├── 📁 models/              # Manages data and business rules
│   └── emailModel.js
├── 📁 public/              # Static assets
│   ├── 📁 css/
│   │   └── styles.css
│   └── 📁 js/
│       └── main.js
├── 📁 routes/              # Defines application routes
│   └── contactRoutes.js
├── 📁 views/               # User interface templates
│   └── index.html
├── .env                    # Environment variables
├── .env.example            # Example environment variables
├── .gitignore              # Git ignore file
├── package.json            # Project dependencies
├── README.md               # Project documentation
└── server.js               # Application entry point
```

### 🔄 Data Flow

1. User submits the contact form (View)
2. Request is routed to the appropriate controller (Routes)
3. Controller processes the form data (Controller)
4. Email data is prepared and sent (Model)
5. Response is sent back to the user (Controller → View)

## 📥 Installation Guide

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/mvc-nodemailer.git
cd mvc-nodemailer
