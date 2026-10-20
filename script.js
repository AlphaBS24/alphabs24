document.addEventListener("DOMContentLoaded", function () {
  /* ===== SIDEBAR ===== */
  const menuToggle = document.getElementById("menu-toggle");
  const sidebar = document.getElementById("sidebar");
  const closeBtn = document.getElementById("close-btn");
  const overlay = document.getElementById("overlay");

  function openMenu() {
    sidebar.classList.add("active");
    overlay.classList.add("active");
  }

  function closeMenu() {
    sidebar.classList.remove("active");
    overlay.classList.remove("active");
  }

  menuToggle.addEventListener("click", openMenu);
  closeBtn.addEventListener("click", closeMenu);
  overlay.addEventListener("click", closeMenu);

  /* ===== ABOUT MODAL ===== */
  const aboutLinks = document.querySelectorAll(".about");
  const aboutModal = document.getElementById("about-modal");
  const aboutClose = document.getElementById("about-close");

  function openAbout() {
    aboutModal.classList.add("active");
    document.body.style.overflow = "hidden";
    closeMenu();
  }

  function closeAbout() {
    aboutModal.classList.remove("active");
    document.body.style.overflow = "auto";
  }

  aboutLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      openAbout();
    });
  });

  aboutClose.addEventListener("click", closeAbout);

  aboutModal.addEventListener("click", function (e) {
    if (e.target === aboutModal) closeAbout();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closeAbout();
      closeMenu();
    }
  });

  /* ===== THEME (yadda qalır) ===== */
  function setTheme(dark) {
    document.body.classList.toggle("dark-mode", dark);
    try {
      localStorage.setItem("alphabs-theme", dark ? "dark" : "light");
    } catch (e) {}
  }

  try {
    if (localStorage.getItem("alphabs-theme") === "dark") setTheme(true);
  } catch (e) {}

  function toggleTheme() {
    setTheme(!document.body.classList.contains("dark-mode"));
  }

  document.getElementById("theme-toggle").addEventListener("click", toggleTheme);
  document
    .getElementById("about-theme-toggle")
    .addEventListener("click", toggleTheme);

  /* ===== STATS: 2.5K+ ===== */
  const counter = document.querySelector("[data-count]");
  if (counter) {
    const end = parseInt(counter.dataset.count, 10);
    const num = counter.querySelector(".num");
    const unit = counter.querySelector(".unit");
    const plus = counter.querySelector(".plus");
    const fmt = (v) =>
      v < 1000 ? Math.floor(v) : (Math.round(v / 100) / 10).toFixed(1);

    function run() {
      const t0 = performance.now();
      (function step(now) {
        const p = Math.min((now - t0) / 3200, 1);
        const v = end * (1 - Math.pow(1 - p, 3));
        num.textContent = fmt(v);
        if (v >= 1000) unit.classList.add("show");
        if (p < 1) {
          requestAnimationFrame(step);
        } else {
          num.textContent = fmt(end);
          unit.classList.add("show");
          setTimeout(() => plus.classList.add("show"), 250);
        }
      })(t0);
    }

    if ("IntersectionObserver" in window) {
      num.textContent = "0";
      unit.classList.remove("show");
      plus.classList.remove("show");
      new IntersectionObserver(
        (entries, io) => {
          if (entries[0].isIntersecting) {
            io.disconnect();
            run();
          }
        },
        { threshold: 0.6 },
      ).observe(counter);
    }
  }

  /* ===== "3 Platforms": platformalara sürüşdür + mavi animasiya ===== */
  const statLink = document.querySelector(".stat-link");
  const grid = document.querySelector(".features-grid");
  if (statLink && grid) {
    statLink.addEventListener("click", function (e) {
      e.preventDefault();
      document
        .getElementById("platforms")
        .scrollIntoView({ behavior: "smooth", block: "start" });

      if (grid.classList.contains("busy")) return;

      const cards = [...grid.querySelectorAll(".card")];
      let left = cards.length;

      // Animasiya bitənə qədər hover işləməsin
      grid.classList.add("busy");

      function finish() {
        grid.classList.remove("busy");
      }

      cards.forEach((card) => {
        card.addEventListener(
          "animationend",
          () => {
            card.classList.remove("pulse");
            if (--left === 0) finish();
          },
          { once: true },
        );
      });

      setTimeout(() => {
        cards.forEach((card, i) => {
          setTimeout(() => {
            card.classList.remove("pulse");
            void card.offsetWidth;
            card.classList.add("pulse");
          }, i * 150);
        });
      }, 600);

      // Ehtiyat: nəsə səhv olsa, hover həmişəlik bloklanmasın
      setTimeout(finish, 600 + cards.length * 150 + 1500);
    });
  }

  /* ===== Səhifələr arası smooth keçid ===== */
  document.querySelectorAll('a[href$=".html"]').forEach((link) => {
    link.addEventListener("click", function (e) {
      if (e.ctrlKey || e.metaKey || e.shiftKey || link.target === "_blank")
        return;
      e.preventDefault();
      document.body.classList.add("leaving");
      setTimeout(() => (window.location.href = link.href), 300);
    });
  });
  window.addEventListener("pageshow", () =>
    document.body.classList.remove("leaving"),
  );

  /* ===== Giriş animasiyası ===== */
  if ("IntersectionObserver" in window) {
    const ro = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          ro.unobserve(en.target);
          const el = en.target;
          const delay = Math.min(
            [...el.parentElement.children].indexOf(el) * 0.12,
            0.6,
          );
          el.style.setProperty("--d", delay + "s");
          el.classList.add("in");
          setTimeout(
            () => {
              el.classList.remove("reveal", "in");
              el.style.removeProperty("--d");
            },
            1100 + delay * 1000,
          );
        });
      },
      { threshold: 0.12 },
    );
    document
      .querySelectorAll(
        ".hero-badge, .hero h1, .hero p, .hero-links, .stat-card, .perk, .features h2, .features .card, .contact-title, #contactForm, .faq h2, .faq-item",
      )
      .forEach((el) => {
        el.classList.add("reveal");
        ro.observe(el);
      });
  }

  /* ===== FAQ: biri açılanda digəri bağlanır ===== */
  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach((item) => {
    const btn = item.querySelector(".faq-q");
    btn.addEventListener("click", () => {
      const willOpen = !item.classList.contains("open");
      faqItems.forEach((other) => {
        other.classList.remove("open");
        other.querySelector(".faq-q").setAttribute("aria-expanded", "false");
      });
      if (willOpen) {
        item.classList.add("open");
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });

  /* ===== Yuxarı qayıt düyməsi ===== */
  const toTop = document.createElement("button");
  toTop.className = "to-top";
  toTop.setAttribute("aria-label", "Back to top");
  toTop.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
  document.body.appendChild(toTop);
  window.addEventListener(
    "scroll",
    () => toTop.classList.toggle("show", window.scrollY > 500),
    { passive: true },
  );
  toTop.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" }),
  );

  /* ===== CONTACT FORM (yalnız contact.html-də işləyir) ===== */
  const form = document.getElementById("contactForm");
  if (form) {
    // EmailJS ayarları: https://www.emailjs.com saytından alın və bura yazın.
    // Boş qalsa, mesaj e-poçt proqramında hazır şəkildə açılacaq.
    const EMAILJS = {
      publicKey: "YOUR_PUBLIC_KEY",
      serviceId: "YOUR_SERVICE_ID",
      templateId: "YOUR_TEMPLATE_ID",
    };
    const TO = "alphabs240@gmail.com";

    const statusBox = document.getElementById("status");
    const message = document.getElementById("message");
    const count = document.getElementById("count");

    message.addEventListener("input", () => {
      count.textContent = message.value.length;
    });

    function show(ok, text) {
      statusBox.style.color = ok ? "#0a8f3d" : "#dc2626";
      statusBox.innerHTML =
        '<i class="fa-solid ' +
        (ok ? "fa-circle-check" : "fa-circle-xmark") +
        '"></i> ' +
        text;
    }

    const configured =
      window.emailjs &&
      !EMAILJS.publicKey.startsWith("YOUR_") &&
      !EMAILJS.serviceId.startsWith("YOUR_") &&
      !EMAILJS.templateId.startsWith("YOUR_");

    if (configured) emailjs.init({ publicKey: EMAILJS.publicKey });

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const sendBtn = form.querySelector(".send-btn");
      const params = {
        name: document.getElementById("name").value.trim(),
        email: document.getElementById("email").value.trim(),
        subject: document.getElementById("subject").value.trim(),
        message: message.value.trim(),
      };

      if (params.message.length < 10) {
        show(false, "Message is too short (min 10 characters).");
        return;
      }

      // EmailJS qurulmayıbsa: e-poçt proqramı ilə göndər
      if (!configured) {
        const su = encodeURIComponent(params.subject);
        const body = encodeURIComponent(
          "Name: " +
            params.name +
            "\nEmail: " +
            params.email +
            "\n\n" +
            params.message,
        );
        if (/Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)) {
          window.location.href =
            "mailto:" + TO + "?subject=" + su + "&body=" + body;
        } else {
          window.open(
            "https://mail.google.com/mail/?view=cm&fs=1&to=" +
              TO +
              "&su=" +
              su +
              "&body=" +
              body,
            "_blank",
          );
        }
        show(true, "Opening your email app...");
        return;
      }

      sendBtn.disabled = true;
      sendBtn.innerHTML =
        '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';

      emailjs
        .send(EMAILJS.serviceId, EMAILJS.templateId, params)
        .then(() => {
          show(true, "Message sent successfully!");
          form.reset();
          count.textContent = 0;
        })
        .catch((error) => {
          console.error(error);
          show(false, "Failed to send message.");
        })
        .finally(() => {
          sendBtn.disabled = false;
          sendBtn.innerHTML =
            '<i class="fa-solid fa-paper-plane"></i> Send Message';
        });
    });
  }
});