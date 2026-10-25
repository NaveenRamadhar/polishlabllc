document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("buildInquiryForm");
  const submitButton = document.getElementById("buildSubmitButton");
  const status = document.getElementById("buildFormStatus");
  const serviceSelect = document.getElementById("service");
  const sourcePage = document.getElementById("sourcePage");
  const emailInput = document.getElementById("email");

  if (!form) return;

  /* ============================================= */
  /* SOURCE TRACKING */
  /* ============================================= */

  if (sourcePage) {
    sourcePage.value = document.referrer || window.location.href;
  }

  /* ============================================= */
  /* SERVICE PRESELECTION */
  /* ============================================= */

  const params = new URLSearchParams(window.location.search);
  const requestedService = params.get("service");

  if (requestedService && serviceSelect) {
    const matchingOption = Array.from(serviceSelect.options).find(function (
      option
    ) {
      return option.value === requestedService;
    });

    if (matchingOption) {
      serviceSelect.value = requestedService;
    }
  }

  /* ============================================= */
  /* EMAIL REQUIRED WHEN EMAIL IS SELECTED */
  /* ============================================= */

  const contactOptions = document.querySelectorAll(
    'input[name="preferred_contact"]'
  );

  function updateEmailRequirement() {
    const selectedContact = document.querySelector(
      'input[name="preferred_contact"]:checked'
    );

    if (!selectedContact || !emailInput) return;

    if (selectedContact.value === "Email") {
      emailInput.required = true;
    } else {
      emailInput.required = false;
    }
  }

  contactOptions.forEach(function (option) {
    option.addEventListener("change", updateEmailRequirement);
  });

  updateEmailRequirement();

  /* ============================================= */
  /* FORM SUBMISSION */
  /* ============================================= */

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    /* ========================================= */
    /* BROWSER VALIDATION */
    /* ========================================= */

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    /* ========================================= */
    /* LOADING STATE */
    /* ========================================= */

    submitButton.disabled = true;
    submitButton.textContent = "Submitting...";

    status.className = "build-form-status";
    status.innerHTML = "";

    /* ========================================= */
    /* CREATE FORM DATA */
    /* ========================================= */

    const formData = new FormData(form);

    /* ========================================= */
    /* SUBMIT TO WEB3FORMS */
    /* ========================================= */

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      /* ======================================= */
      /* SUCCESS */
      /* ======================================= */

      if (result.success) {
        status.className = "build-form-status build-form-success";

        status.innerHTML = `
              <strong>Inquiry Received.</strong>
  
              <span>
               Your build starts here. We’ll review your project details and be in touch shortly to discuss your vision, options, and next steps.
              </span>
            `;

        /* Reset customer fields */

        form.reset();

        /* Restore default contact preference */

        const textOption = document.querySelector(
          'input[name="preferred_contact"][value="Text"]'
        );

        if (textOption) {
          textOption.checked = true;
        }

        /* Restore service from URL */

        if (requestedService && serviceSelect) {
          const matchingOption = Array.from(serviceSelect.options).find(
            function (option) {
              return option.value === requestedService;
            }
          );

          if (matchingOption) {
            serviceSelect.value = requestedService;
          }
        }

        /* Restore source tracking */

        if (sourcePage) {
          sourcePage.value = document.referrer || window.location.href;
        }

        updateEmailRequirement();

        /* Scroll confirmation into view */

        status.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      } else {
        throw new Error(result.message || "Submission failed");
      }
    } catch (error) {
      /* ======================================= */
      /* ERROR */
      /* ======================================= */

      console.error("POLISH LAB Build Inquiry Error:", error);

      status.className = "build-form-status build-form-error";

      status.innerHTML = `
            <strong>Something Went Wrong.</strong>
  
            <span>
              Your inquiry could not be submitted.
              Please call or text POLISH LAB at
              407-912-5365.
            </span>
          `;
    } finally {
      /* ======================================= */
      /* RESET BUTTON */
      /* ======================================= */

      submitButton.disabled = false;

      submitButton.textContent = "Submit Build Inquiry";
    }
  });
});
