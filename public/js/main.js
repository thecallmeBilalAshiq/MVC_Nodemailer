document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.getElementById("contactForm")
  const submitBtn = document.getElementById("submitBtn")
  const formAlert = document.getElementById("formAlert")

  // Function to show alert
  function showAlert(message, type) {
    formAlert.textContent = message
    formAlert.className = `alert mt-3 alert-${type}`
    formAlert.classList.remove("d-none")

    // Auto hide after 5 seconds
    setTimeout(() => {
      formAlert.classList.add("d-none")
    }, 5000)
  }

  // Handle form submission
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault()

    // Disable button and show loading state
    const originalBtnText = submitBtn.innerHTML
    submitBtn.innerHTML =
      '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Sending...'
    submitBtn.disabled = true

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
        // Show success message
        showAlert(result.message || "Email sent successfully!", "success")
        // Reset form
        contactForm.reset()
      } else {
        // Show error message
        showAlert(result.message || "Failed to send email. Please try again.", "danger")
      }
    } catch (error) {
      console.error("Error:", error)
      showAlert("An unexpected error occurred. Please try again later.", "danger")
    } finally {
      // Restore button state
      submitBtn.innerHTML = originalBtnText
      submitBtn.disabled = false
    }
  })
})
