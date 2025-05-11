document.addEventListener("DOMContentLoaded", () => {
  // Initialize AOS animation library
  AOS.init({
    duration: 1000,
    once: true,
    mirror: false,
  })

  // Initialize particles.js
  particlesJS("particles-js", {
    particles: {
      number: {
        value: 80,
        density: {
          enable: true,
          value_area: 800,
        },
      },
      color: {
        value: "#3a86ff",
      },
      shape: {
        type: "circle",
        stroke: {
          width: 0,
          color: "#000000",
        },
        polygon: {
          nb_sides: 5,
        },
      },
      opacity: {
        value: 0.5,
        random: false,
        anim: {
          enable: false,
          speed: 1,
          opacity_min: 0.1,
          sync: false,
        },
      },
      size: {
        value: 3,
        random: true,
        anim: {
          enable: false,
          speed: 40,
          size_min: 0.1,
          sync: false,
        },
      },
      line_linked: {
        enable: true,
        distance: 150,
        color: "#3a86ff",
        opacity: 0.4,
        width: 1,
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
          rotateY: 1200,
        },
      },
    },
    interactivity: {
      detect_on: "canvas",
      events: {
        onhover: {
          enable: true,
          mode: "grab",
        },
        onclick: {
          enable: true,
          mode: "push",
        },
        resize: true,
      },
      modes: {
        grab: {
          distance: 140,
          line_linked: {
            opacity: 1,
          },
        },
        bubble: {
          distance: 400,
          size: 40,
          duration: 2,
          opacity: 8,
          speed: 3,
        },
        repulse: {
          distance: 200,
          duration: 0.4,
        },
        push: {
          particles_nb: 4,
        },
        remove: {
          particles_nb: 2,
        },
      },
    },
    retina_detect: true,
  })

  // Form handling
  const contactForm = document.getElementById("contactForm")
  const submitBtn = document.getElementById("submitBtn")
  const formAlert = document.getElementById("formAlert")
  const btnText = submitBtn.querySelector(".btn-text")

  // Function to show alert
  function showAlert(message, type) {
    formAlert.textContent = message
    formAlert.className = `form-alert ${type}`

    // Add show class after a small delay for animation
    setTimeout(() => {
      formAlert.classList.add("show")
    }, 10)

    // Auto hide after 5 seconds
    setTimeout(() => {
      formAlert.classList.remove("show")

      // Remove class after fade out animation completes
      setTimeout(() => {
        formAlert.className = "form-alert"
      }, 300)
    }, 5000)
  }

  // Add input animation effects
  const inputs = document.querySelectorAll(".input-container input, .input-container textarea")

  inputs.forEach((input) => {
    // Add focus animation
    input.addEventListener("focus", () => {
      input.parentElement.style.transform = "translateY(-3px)"
    })

    // Remove focus animation
    input.addEventListener("blur", () => {
      input.parentElement.style.transform = "translateY(0)"
    })
  })

  // Handle form submission with animation
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault()

    // Disable button and show loading state
    submitBtn.disabled = true
    submitBtn.classList.add("loading")

    try {
      // Get form data
      const formData = new FormData(contactForm)
      const formDataObj = Object.fromEntries(formData.entries())

      // Send data to server
      const response = await fetch("/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formDataObj),
      })

      const result = await response.json()

      if (result.success) {
        // Show success message with animation
        showAlert(result.message || "Your message has been sent successfully! We'll get back to you soon.", "success")

        // Reset form with animation
        inputs.forEach((input) => {
          input.style.transition = "all 0.3s ease"
          input.style.opacity = "0"

          setTimeout(() => {
            input.value = ""
            input.style.opacity = "1"
          }, 300)
        })

        // Add success animation to button
        submitBtn.classList.remove("loading")
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Sent Successfully'

        setTimeout(() => {
          submitBtn.innerHTML = '<span class="btn-text">Send Message</span><i class="fas fa-paper-plane"></i>'
          submitBtn.disabled = false
        }, 2000)
      } else {
        // Show error message
        showAlert(result.message || "Failed to send email. Please try again.", "error")

        // Restore button state
        submitBtn.classList.remove("loading")
        submitBtn.innerHTML = '<span class="btn-text">Send Message</span><i class="fas fa-paper-plane"></i>'
        submitBtn.disabled = false
      }
    } catch (error) {
      console.error("Error:", error)
      showAlert("An unexpected error occurred. Please try again later.", "error")

      // Restore button state
      submitBtn.classList.remove("loading")
      submitBtn.innerHTML = '<span class="btn-text">Send Message</span><i class="fas fa-paper-plane"></i>'
      submitBtn.disabled = false
    }
  })

  // Add floating animation to elements
  const floatingElements = document.querySelectorAll(".info-item")
  floatingElements.forEach((element, index) => {
    element.style.animation = `float 3s ease-in-out ${index * 0.2}s infinite`
  })

  // Add pulse animation to logo
  const logo = document.querySelector(".logo")
  logo.style.animation = "pulse 2s ease-in-out infinite"
})
