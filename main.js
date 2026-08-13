/* ═══════════════════════════════════════════
   MAIN.JS — Portfolio Interactive Logic
   ═══════════════════════════════════════════ */

document.addEventListener("DOMContentLoaded", () => {
  // Initialize Lucide icons if available
  if (window.lucide && typeof lucide.createIcons === 'function') {
    lucide.createIcons();
  }

  initCursorGlow();
  initNavbar();
  initMobileMenu();
  initSmoothScroll();
  initTypingAnimation();
  initScrollReveal();
  initCopyEmail();
  initContactForm();
  initActiveNavHighlight();
  initCVDropdown();
});

/* ─── Cursor Glow ───────────────────────── */
function initCursorGlow() {
  const glow = document.getElementById("cursor-glow");
  if (!glow) return;

  const isTouch = window.matchMedia("(pointer: coarse)").matches;
  if (isTouch) {
    glow.style.display = "none";
    return;
  }

  let mouseX = -200, mouseY = -200;
  let curX = -200, curY = -200;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animate() {
    curX += (mouseX - curX) * 0.15;
    curY += (mouseY - curY) * 0.15;
    glow.style.transform = `translate(${curX - 200}px, ${curY - 200}px)`;
    requestAnimationFrame(animate);
  }
  animate();
}

/* ─── Sticky Navbar (Always Visible on Scroll) ─────────── */
function initNavbar() {
  const navbar = document.getElementById("navbar");
  if (!navbar) return;

  window.addEventListener("scroll", () => {
    const currentScroll = window.scrollY;

    if (currentScroll > 20) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  }, { passive: true });
}

/* ─── CV Dropdown Toggle (TR & EN) ──────── */
function initCVDropdown() {
  const wrappers = document.querySelectorAll(".cv-dropdown-wrapper");

  wrappers.forEach((wrapper) => {
    const trigger = wrapper.querySelector(".cv-trigger-btn");
    if (!trigger) return;

    trigger.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      // Close other dropdowns first
      wrappers.forEach((w) => {
        if (w !== wrapper) {
          w.classList.remove("active");
          const btn = w.querySelector(".cv-trigger-btn");
          if (btn) btn.setAttribute("aria-expanded", "false");
        }
      });

      const isActive = wrapper.classList.toggle("active");
      trigger.setAttribute("aria-expanded", isActive ? "true" : "false");
    });
  });

  // Close when clicking outside
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".cv-dropdown-wrapper")) {
      wrappers.forEach((w) => {
        w.classList.remove("active");
        const btn = w.querySelector(".cv-trigger-btn");
        if (btn) btn.setAttribute("aria-expanded", "false");
      });
    }
  });

  // Close dropdown when an item is clicked
  document.querySelectorAll(".cv-dropdown-item").forEach((item) => {
    item.addEventListener("click", () => {
      wrappers.forEach((w) => {
        w.classList.remove("active");
        const btn = w.querySelector(".cv-trigger-btn");
        if (btn) btn.setAttribute("aria-expanded", "false");
      });
    });
  });
}

/* ─── Mobile Menu ───────────────────────── */
function initMobileMenu() {
  const toggle = document.getElementById("nav-toggle");
  const menu = document.getElementById("nav-menu");
  if (!toggle || !menu) return;

  const links = menu.querySelectorAll(".nav-link");

  toggle.addEventListener("click", () => {
    toggle.classList.toggle("active");
    menu.classList.toggle("active");
    document.body.classList.toggle("menu-open");
  });

  links.forEach((link) => {
    link.addEventListener("click", () => {
      toggle.classList.remove("active");
      menu.classList.remove("active");
      document.body.classList.remove("menu-open");
    });
  });
}

/* ─── Smooth Scroll ─────────────────────── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const navbar = document.getElementById("navbar");
        const navHeight = navbar ? navbar.offsetHeight : 70;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight + 10;
        window.scrollTo({ top: targetPosition, behavior: "smooth" });
      }
    });
  });
}

/* ─── Typing Animation ─────────────────── */
function initTypingAnimation() {
  const titles = [
    "Yazılım Geliştirici",
    "Backend Developer",
    ".NET Core & C# Uzmanı",
    "Veri Bilimi Meraklısı",
    "Problem Çözücü",
  ];

  const el = document.getElementById("typing-text");
  if (!el) return;

  let titleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeSpeed = 80;

  function type() {
    const currentTitle = titles[titleIndex];

    if (isDeleting) {
      el.textContent = currentTitle.substring(0, charIndex - 1);
      charIndex--;
      typeSpeed = 40;
    } else {
      el.textContent = currentTitle.substring(0, charIndex + 1);
      charIndex++;
      typeSpeed = 80;
    }

    if (!isDeleting && charIndex === currentTitle.length) {
      typeSpeed = 2200;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      titleIndex = (titleIndex + 1) % titles.length;
      typeSpeed = 400;
    }

    setTimeout(type, typeSpeed);
  }

  type();
}

/* ─── Scroll Reveal (Intersection Observer) */
function initScrollReveal() {
  const revealElements = document.querySelectorAll(".reveal");
  if (!revealElements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
        }
      });
    },
    {
      threshold: 0.08,
      rootMargin: "0px 0px -40px 0px",
    }
  );

  revealElements.forEach((el) => observer.observe(el));
}

/* ─── Copy Email to Clipboard ───────────── */
function initCopyEmail() {
  document.querySelectorAll(".copy-btn").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      e.preventDefault();
      e.stopPropagation();
      const text = btn.getAttribute("data-copy");
      try {
        await navigator.clipboard.writeText(text);
        btn.classList.add("copied");
        setTimeout(() => {
          btn.classList.remove("copied");
        }, 2000);
      } catch {
        const ta = document.createElement("textarea");
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        btn.classList.add("copied");
        setTimeout(() => {
          btn.classList.remove("copied");
        }, 2000);
      }
    });
  });
}

/* ─── Contact Form ──────────────────────── */
function initContactForm() {
  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const btn = form.querySelector(".btn-submit");
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<span>Gönderiliyor...</span>';
    }

    setTimeout(() => {
      if (status) {
        status.className = "form-status success";
        status.textContent = "✅ Mesajınız başarıyla iletildi! En kısa sürede dönüş yapacağım.";
      }
      form.reset();
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = '<span>Gönder</span>';
      }

      setTimeout(() => {
        if (status) {
          status.className = "form-status";
          status.textContent = "";
        }
      }, 5000);
    }, 1200);
  });
}

/* ─── Active Nav Link Highlight ─────────── */
function initActiveNavHighlight() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          navLinks.forEach((link) => {
            link.classList.toggle("active", link.getAttribute("data-section") === id);
          });
        }
      });
    },
    {
      threshold: 0.25,
      rootMargin: "-70px 0px -40% 0px",
    }
  );

  sections.forEach((section) => observer.observe(section));
}
