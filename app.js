/* app.js — POLISH LAB */
(() => {
  if (window.__polishLabInitialized) return;
  window.__polishLabInitialized = true;
  /* =========================
     Helpers
  ========================= */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  /* =========================
     Footer year
  ========================= */
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* =========================
     Mobile Navigation
  ========================= */
  const navToggle = $("#navToggle");
  const navMenu = $("#navMenu");

  const openNav = () => {
    navMenu?.classList.add("is-open");
    navToggle?.setAttribute("aria-expanded", "true");
  };

  const closeNav = () => {
    navMenu?.classList.remove("is-open");
    navToggle?.setAttribute("aria-expanded", "false");
  };

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      navMenu.classList.contains("is-open") ? closeNav() : openNav();
    });

    $$(".nav__menu a").forEach((a) => a.addEventListener("click", closeNav));

    document.addEventListener("click", (e) => {
      if (!navMenu.contains(e.target) && !navToggle.contains(e.target))
        closeNav();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeNav();
    });
  }

  /* =========================
     Sticky Book Button
  ========================= */
  const stickyBook = $("#stickyBook");
  const bookingSection = $("#booking");

  if (stickyBook && bookingSection && "IntersectionObserver" in window) {
    new IntersectionObserver(
      ([entry]) => {
        stickyBook.style.opacity = entry.isIntersecting ? "0" : "1";
        stickyBook.style.pointerEvents = entry.isIntersecting ? "none" : "auto";
      },
      { threshold: 0.25 }
    ).observe(bookingSection);
  }

  /* =========================
     Next Available Text
  ========================= */
  const nextAvailable = document.querySelector("#nextAvailable");

  if (nextAvailable) {
    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay(); // 0 Sun – 6 Sat

    if (day !== 0 && hour < 17) {
      nextAvailable.textContent = "Today";
    } else if (day !== 6) {
      nextAvailable.textContent = "Tomorrow";
    } else {
      nextAvailable.textContent = "Next week";
    }
  }

  /* =========================
     Reviews Slider
  ========================= */
  const track = $("#reviewTrack");
  const prev = $("#prevReview");
  const next = $("#nextReview");

  if (track && prev && next) {
    const slideWidth = () => track.getBoundingClientRect().width;
    prev.addEventListener("click", () =>
      track.scrollBy({ left: -slideWidth(), behavior: "smooth" })
    );
    next.addEventListener("click", () =>
      track.scrollBy({ left: slideWidth(), behavior: "smooth" })
    );
  }

  /* =========================
     Gallery Lightbox
  ========================= */
  const modal = $("#lightbox");
  const modalContent = $("#lightboxContent");

  $$(".gallery__item").forEach((item) => {
    item.addEventListener("click", () => {
      if (!modal || !modalContent) return;
      modalContent.innerHTML = `
        <p class="modal__title">${item.innerText.trim()}</p>
        <p class="modal__text">Replace this placeholder with real before/after images.</p>
      `;
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    });
  });

  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target?.dataset?.close) {
        modal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        modal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
      }
    });
  }

  /* =========================
     Contact Form Validation
  ========================= */
  const form = $("#contactForm");
  const formNote = $("#formNote");

  const setError = (name, msg) => {
    const el = $(`[data-error-for="${name}"]`);
    if (el) el.textContent = msg || "";
  };

  const validPhone = (v) => (v || "").replace(/\D/g, "").length >= 10;

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = $("#name")?.value.trim() || "";
      const phone = $("#phone")?.value.trim() || "";
      const msg = $("#message")?.value.trim() || "";

      setError("name", "");
      setError("phone", "");
      setError("message", "");
      if (formNote) formNote.textContent = "";

      let ok = true;

      if (name.length < 2) {
        setError("name", "Enter your name");
        ok = false;
      }
      if (!validPhone(phone)) {
        setError("phone", "Enter a valid phone number");
        ok = false;
      }
      if (msg.length < 10) {
        setError("message", "Message too short");
        ok = false;
      }

      if (!ok) return;

      // OPTIONAL fields (safe even if inputs don't exist)
      const vehicle = $("#vehicle")?.value.trim() || "";
      const location = $("#location")?.value.trim() || "";
      const service = $("#service")?.value.trim() || "";

      // Build email
      const toEmail = "polishlabllc@gmail.com"; // <-- change to your preferred email
      const subject = encodeURIComponent("POLISH LAB — New Inquiry");
      const body = encodeURIComponent(
        `Name: ${name}\n` +
          `Phone: ${phone}\n` +
          (vehicle ? `Vehicle: ${vehicle}\n` : "") +
          (location ? `Location: ${location}\n` : "") +
          (service ? `Service: ${service}\n` : "") +
          `\nMessage:\n${msg}\n`
      );

      // Show a note first (so user sees feedback even if mail client blocks pop)
      if (formNote) formNote.textContent = "Opening your email app…";

      // Open email client
      window.location.href = `mailto:${toEmail}?subject=${subject}&body=${body}`;

      // Reset form after triggering mailto
      form.reset();
    });
  }

  /* =========================================================
     SQUARE WIDGET: HARD STOP PAGE SCROLL (WORKS RELIABLY)
     We freeze the BODY position while user interacts with the widget.
     This prevents ANY page scroll when Square changes categories.
  ========================================================= */
  const squareWrap = $(".squareWidgetWrap");

  let isScrollLocked = false;
  let lockedScrollY = 0;
  let unlockTimer = null;

  const lockScroll = () => {
    if (isScrollLocked) return;

    lockedScrollY = window.scrollY || window.pageYOffset || 0;
    isScrollLocked = true;

    // Freeze body in place
    document.body.style.position = "fixed";
    document.body.style.top = `-${lockedScrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";

    // Optional: prevents iOS rubber-band overscroll weirdness
    document.body.style.overscrollBehavior = "none";
  };

  const unlockScroll = () => {
    if (!isScrollLocked) return;

    // Unfreeze body
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.left = "";
    document.body.style.right = "";
    document.body.style.width = "";
    document.body.style.overscrollBehavior = "";

    // Restore scroll position
    window.scrollTo(0, lockedScrollY);

    isScrollLocked = false;
  };

  const armUnlock = () => {
    // Every interaction re-arms unlock for a short time AFTER the last click.
    // Square often does delayed reflows; this covers them.
    if (unlockTimer) clearTimeout(unlockTimer);
    unlockTimer = setTimeout(() => {
      unlockScroll();
      unlockTimer = null;
    }, 1400);
  };

  if (squareWrap) {
    // Lock immediately when interacting with the widget area
    // (works even though the Square widget is an iframe)
    squareWrap.addEventListener(
      "pointerdown",
      () => {
        lockScroll();
        armUnlock();
      },
      true
    );

    squareWrap.addEventListener(
      "click",
      () => {
        lockScroll();
        armUnlock();
      },
      true
    );

    // If the user moves pointer out, we can unlock a bit sooner
    squareWrap.addEventListener(
      "pointerleave",
      () => {
        armUnlock();
      },
      true
    );

    // Safety: unlock if user hits ESC
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") unlockScroll();
    });

    // Safety: unlock if tab becomes hidden (switch tabs)
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) unlockScroll();
    });
  }
})();
