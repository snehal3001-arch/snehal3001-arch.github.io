/* =========================================================
   Digital Universe of Snehal — Phase 1 interactions
   - animated starfield + floating particles (canvas)
   - responsive navigation
   - smooth in-page scrolling
   - toast feedback for interactions
   ========================================================= */

(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ---------------- Starfield ---------------- */
  const canvas = document.getElementById("starfield");
  const ctx = canvas && canvas.getContext("2d");

  if (ctx) {
    let stars = [];
    let particles = [];
    let viewWidth = 0;
    let viewHeight = 0;
    let frameId = null;

    function buildField() {
      const area = viewWidth * viewHeight;
      const starCount = Math.min(230, Math.max(70, Math.round(area / 8500)));
      const particleCount = Math.min(26, Math.max(9, Math.round(area / 62000)));

      stars = Array.from({ length: starCount }, function () {
        return {
          x: Math.random() * viewWidth,
          y: Math.random() * viewHeight,
          radius: Math.random() * 1.15 + 0.25,
          alpha: Math.random() * 0.55 + 0.2,
          speed: Math.random() * 0.0018 + 0.0005,
          phase: Math.random() * Math.PI * 2
        };
      });

      particles = Array.from({ length: particleCount }, function () {
        return {
          x: Math.random() * viewWidth,
          y: Math.random() * viewHeight,
          radius: Math.random() * 1.6 + 0.7,
          alpha: Math.random() * 0.35 + 0.12,
          rise: Math.random() * 0.22 + 0.06,
          sway: Math.random() * 0.14 + 0.04,
          phase: Math.random() * Math.PI * 2
        };
      });
    }

    function draw(time) {
      ctx.clearRect(0, 0, viewWidth, viewHeight);

      stars.forEach(function (star) {
        const twinkle = reduceMotion.matches ? 1 : 0.68 + 0.32 * Math.sin(time * star.speed + star.phase);
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(231, 226, 255, " + (star.alpha * twinkle).toFixed(3) + ")";
        ctx.fill();
      });

      particles.forEach(function (particle) {
        if (!reduceMotion.matches) {
          particle.y -= particle.rise;
          particle.x += Math.sin(time * 0.0004 + particle.phase) * particle.sway;
          if (particle.y < -8) {
            particle.y = viewHeight + 8;
            particle.x = Math.random() * viewWidth;
          }
          if (particle.x < -8) particle.x = viewWidth + 8;
          if (particle.x > viewWidth + 8) particle.x = -8;
        }

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(167, 139, 250, " + particle.alpha.toFixed(3) + ")";
        ctx.shadowBlur = 10;
        ctx.shadowColor = "rgba(167, 139, 250, 0.55)";
        ctx.fill();
      });

      ctx.shadowBlur = 0;
    }

    function loop(time) {
      draw(time);
      frameId = window.requestAnimationFrame(loop);
    }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      viewWidth = window.innerWidth;
      viewHeight = window.innerHeight;
      canvas.width = Math.round(viewWidth * dpr);
      canvas.height = Math.round(viewHeight * dpr);
      canvas.style.width = viewWidth + "px";
      canvas.style.height = viewHeight + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildField();
      draw(0);
    }

    function syncAnimation() {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
        frameId = null;
      }
      if (!reduceMotion.matches && !document.hidden) {
        frameId = window.requestAnimationFrame(loop);
      }
    }

    let resizeTimer;
    window.addEventListener("resize", function () {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(resize, 120);
    });
    document.addEventListener("visibilitychange", syncAnimation);
    if (typeof reduceMotion.addEventListener === "function") {
      reduceMotion.addEventListener("change", syncAnimation);
    }

    resize();
    syncAnimation();
  }

  /* ---------------- Navigation ---------------- */
  const header = document.getElementById("site-header");
  const nav = document.getElementById("primary-nav");
  const toggle = document.getElementById("nav-toggle");

  function updateHeader() {
    if (header) {
      header.classList.toggle("is-scrolled", window.scrollY > 24);
    }
  }

  function closeMenu() {
    if (!nav || !toggle) return;
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open navigation menu");
  }

  if (header) {
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      const isOpen = !nav.classList.contains("is-open");
      nav.classList.toggle("is-open", isOpen);
      toggle.setAttribute("aria-expanded", String(isOpen));
      toggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
    });

    document.addEventListener("click", function (event) {
      if (!event.target.closest(".nav")) closeMenu();
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && nav.classList.contains("is-open")) {
        closeMenu();
        toggle.focus();
      }
    });
  }

  /* ---------------- Smooth scrolling ---------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (event) {
      const targetId = link.getAttribute("href").slice(1);
      const target = document.getElementById(targetId);
      if (!target) return;

      event.preventDefault();
      closeMenu();
      target.scrollIntoView({
        behavior: reduceMotion.matches ? "auto" : "smooth",
        block: "start"
      });
    });
  });

  /* ---------------- Toast feedback ---------------- */
  const toast = document.getElementById("toast");
  let toastTimer = null;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      toast.classList.remove("is-visible");
    }, 3400);
  }

  /* ---------------- Explore interaction ---------------- */
  const exploreButton = document.getElementById("explore-btn");
  const hero = document.getElementById("home");

  if (exploreButton && hero) {
    exploreButton.addEventListener("click", function () {
      hero.classList.add("is-exploring");
      showToast("Orbit unlocked: Curiosity, Code and Creativity.");
    });
  }

  /* =======================================================
     PHASE 2 — Personal identity sections
     ======================================================= */

  /* ---------------- Scroll reveal ---------------- */
  const revealItems = Array.from(document.querySelectorAll(".reveal"));

  if (revealItems.length && "IntersectionObserver" in window && !reduceMotion.matches) {
    document.documentElement.classList.add("has-reveal");

    const revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });

    revealItems.forEach(function (item, index) {
      item.style.transitionDelay = (index % 4) * 70 + "ms";
      revealObserver.observe(item);
    });
  } else {
    revealItems.forEach(function (item) {
      item.classList.add("is-visible");
    });
  }

  /* ---------------- Education timeline ---------------- */
  const educationToggle = document.getElementById("education-toggle");
  const educationDetails = document.getElementById("education-details");

  if (educationToggle && educationDetails) {
    educationToggle.addEventListener("click", function () {
      const expanded = educationToggle.getAttribute("aria-expanded") === "true";
      educationToggle.setAttribute("aria-expanded", String(!expanded));
      const actionLabel = educationToggle.querySelector(".timeline__action");
      if (actionLabel) actionLabel.textContent = expanded ? "Show details" : "Hide details";
      educationDetails.hidden = expanded;
    });
  }

  /* ---------------- Interactive skills ---------------- */
  const filters = Array.from(document.querySelectorAll(".filter[data-filter]"));
  const skills = Array.from(document.querySelectorAll(".skill[data-status]"));
  const detailTitle = document.getElementById("skill-detail-title");
  const detailText = document.getElementById("skill-detail-text");
  const detailStatus = document.getElementById("skill-detail-status");

  const statusLabels = {
    used: "Used in practice",
    learning: "Currently learning",
    exploring: "Exploring as an interest"
  };

  function applySkillFilter(value) {
    filters.forEach(function (filter) {
      const active = filter.dataset.filter === value;
      filter.classList.toggle("is-active", active);
      filter.setAttribute("aria-pressed", String(active));
    });

    skills.forEach(function (skill) {
      const matches = value === "all" || skill.dataset.status === value;
      skill.classList.toggle("is-dimmed", !matches);
      if (matches) {
        skill.removeAttribute("aria-disabled");
        skill.setAttribute("tabindex", "0");
      } else {
        skill.setAttribute("aria-disabled", "true");
        skill.setAttribute("tabindex", "-1");
      }
    });
  }

  filters.forEach(function (filter) {
    filter.addEventListener("click", function () {
      applySkillFilter(filter.dataset.filter);
    });
  });

  skills.forEach(function (skill) {
    skill.addEventListener("click", function () {
      skills.forEach(function (other) {
        other.classList.remove("is-selected");
        other.setAttribute("aria-pressed", "false");
      });

      skill.classList.add("is-selected");
      skill.setAttribute("aria-pressed", "true");

      if (detailTitle) detailTitle.textContent = skill.textContent.trim();
      if (detailText) detailText.textContent = skill.dataset.detail || "";
      if (detailStatus) detailStatus.textContent = statusLabels[skill.dataset.status] || "";
    });
  });

  /* ---------------- Active navigation state ---------------- */
  const sectionLinks = Array.from(document.querySelectorAll('.nav__link[href^="#"]'));
  const trackedSections = sectionLinks
    .map(function (link) { return document.getElementById(link.getAttribute("href").slice(1)); })
    .filter(Boolean);

  function setActiveNav(id) {
    sectionLinks.forEach(function (link) {
      const active = link.getAttribute("href") === "#" + id;
      link.classList.toggle("is-active", active);
      if (active) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  function updateActiveNav() {
    if (!trackedSections.length) return;

    const guide = window.scrollY + (header ? header.offsetHeight : 0) + 120;
    let current = trackedSections[0];

    trackedSections.forEach(function (section) {
      if (section.getBoundingClientRect().top + window.scrollY <= guide) {
        current = section;
      }
    });

    setActiveNav(current.id);
  }

  if (trackedSections.length) {
    updateActiveNav();
    window.addEventListener("scroll", updateActiveNav, { passive: true });
  }

  /* =======================================================
     PHASE 4 — Contact form with mailto fallback
     ======================================================= */
  const contactForm = document.getElementById("contact-form");
  const formStatus = document.getElementById("form-status");
  const contactEmail = "snehal.chorge30@gmail.com";

  if (contactForm) {
    const fields = Array.from(contactForm.querySelectorAll("input, textarea"));

    function errorFor(field) {
      return contactForm.querySelector('[data-error-for="' + field.id + '"]');
    }

    function clearFieldError(field) {
      if (!field) return;
      field.removeAttribute("aria-invalid");
      const error = errorFor(field);
      if (error) error.textContent = "";
    }

    function showFieldError(field, message) {
      if (!field) return;
      field.setAttribute("aria-invalid", "true");
      const error = errorFor(field);
      if (error) error.textContent = message;
    }

    fields.forEach(function (field) {
      field.addEventListener("input", function () {
        clearFieldError(field);
        if (formStatus) {
          formStatus.textContent = "";
          formStatus.className = "form-status";
        }
      });
    });

    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();
      let firstInvalid = null;

      fields.forEach(clearFieldError);

      const nameField = document.getElementById("contact-name");
      const emailField = document.getElementById("contact-email");
      const messageField = document.getElementById("contact-message");

      const name = nameField ? nameField.value.trim() : "";
      const email = emailField ? emailField.value.trim() : "";
      const message = messageField ? messageField.value.trim() : "";

      if (!name) {
        showFieldError(nameField, "Please enter your name.");
        firstInvalid = firstInvalid || nameField;
      }

      if (!email) {
        showFieldError(emailField, "Please enter your email address.");
        firstInvalid = firstInvalid || emailField;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showFieldError(emailField, "Please enter a valid email address.");
        firstInvalid = firstInvalid || emailField;
      }

      if (!message) {
        showFieldError(messageField, "Please enter your message.");
        firstInvalid = firstInvalid || messageField;
      }

      if (firstInvalid) {
        if (formStatus) {
          formStatus.textContent = "Please review the highlighted fields and try again.";
          formStatus.className = "form-status form-status--error";
        }
        firstInvalid.focus();
        return;
      }

      const subject = encodeURIComponent("Portfolio message from " + name);
      const body = encodeURIComponent(message + "\n\nFrom: " + name + "\nEmail: " + email);
      const mailto = "mailto:" + contactEmail + "?subject=" + subject + "&body=" + body;

      if (formStatus) {
        formStatus.textContent = "Your email application will open with the message ready to send. Nothing is sent from this website itself.";
        formStatus.className = "form-status form-status--success";
      }

      window.location.href = mailto;
    });
  }
})();
