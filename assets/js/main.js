/* =========================================================
   AdverX Marketing Solutions — interactions
   - sticky header state
   - hamburger dropdown (About & Services)
   - scroll reveal (IntersectionObserver)
   - smooth anchor scrolling with fixed-header offset
   - contact form validation
   ========================================================= */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* tells the inline bootstrap in the page that reveal handling is live */
  window.adverxReady = true;

  /* ---------- header shadow on scroll ---------- */
  var header = document.getElementById("siteHeader");

  function onScroll() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- hamburger dropdown ---------- */
  var toggle = document.getElementById("menuToggle");
  var panel = document.getElementById("menuPanel");
  var closeTimer = null;

  function openMenu() {
    if (!toggle || !panel) return;
    window.clearTimeout(closeTimer);
    panel.hidden = false;
    // next frame so the transition runs from the hidden state
    window.requestAnimationFrame(function () {
      panel.classList.add("is-open");
    });
    toggle.setAttribute("aria-expanded", "true");
  }

  function closeMenu() {
    if (!toggle || !panel) return;
    panel.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    closeTimer = window.setTimeout(function () {
      panel.hidden = true;
    }, reduceMotion ? 0 : 220);
  }

  function menuIsOpen() {
    return toggle && toggle.getAttribute("aria-expanded") === "true";
  }

  if (toggle && panel) {
    toggle.addEventListener("click", function () {
      if (menuIsOpen()) { closeMenu(); } else { openMenu(); }
    });

    panel.addEventListener("click", function (e) {
      if (e.target.closest("a")) closeMenu();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menuIsOpen()) {
        closeMenu();
        toggle.focus();
      }
    });

    document.addEventListener("click", function (e) {
      if (!menuIsOpen()) return;
      if (panel.contains(e.target) || toggle.contains(e.target)) return;
      closeMenu();
    });
  }

  /* ---------- scroll reveal ---------- */
  var revealItems = Array.prototype.slice.call(document.querySelectorAll(".reveal"));

  if (!("IntersectionObserver" in window) || reduceMotion) {
    revealItems.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var siblings = el.parentElement
          ? Array.prototype.slice.call(el.parentElement.querySelectorAll(":scope > .reveal"))
          : [];
        var index = siblings.indexOf(el);
        var delay = index > 0 ? Math.min(index, 6) * 70 : 0;
        el.style.transitionDelay = delay + "ms";
        el.classList.add("is-visible");
        observer.unobserve(el);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });

    revealItems.forEach(function (el) { observer.observe(el); });
  }

  /* ---------- smooth anchor scrolling ---------- */
  document.addEventListener("click", function (e) {
    var link = e.target.closest('a[href^="#"]');
    if (!link) return;

    var id = link.getAttribute("href");
    if (!id || id === "#") return;

    var target = id === "#top" ? document.body : document.querySelector(id);
    if (!target) return;

    e.preventDefault();

    var headerHeight = header ? header.offsetHeight : 0;
    var top = id === "#top"
      ? 0
      : window.scrollY + target.getBoundingClientRect().top - headerHeight - 8;

    window.scrollTo({ top: Math.max(top, 0), behavior: reduceMotion ? "auto" : "smooth" });

    if (history.replaceState) {
      var url = id === "#top" ? window.location.pathname + window.location.search : id;
      history.replaceState(null, "", url);
    }
  });

  /* ---------- contact form ---------- */
  var form = document.getElementById("contactForm");
  var status = document.getElementById("formStatus");

  function setError(field, message) {
    var holder = form.querySelector('[data-error-for="' + field.id + '"]');
    if (holder) holder.textContent = message || "";
    if (message) {
      field.setAttribute("aria-invalid", "true");
    } else {
      field.removeAttribute("aria-invalid");
    }
  }

  if (form) {
    var nameField = form.querySelector("#name");
    var emailField = form.querySelector("#email");
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    [nameField, emailField].forEach(function (field) {
      if (!field) return;
      field.addEventListener("input", function () {
        if (field.getAttribute("aria-invalid") === "true") setError(field, "");
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var firstInvalid = null;

      if (!nameField.value.trim()) {
        setError(nameField, "Please tell us your name.");
        firstInvalid = firstInvalid || nameField;
      } else {
        setError(nameField, "");
      }

      if (!emailField.value.trim()) {
        setError(emailField, "Please add an email address.");
        firstInvalid = firstInvalid || emailField;
      } else if (!emailPattern.test(emailField.value.trim())) {
        setError(emailField, "That email address does not look right.");
        firstInvalid = firstInvalid || emailField;
      } else {
        setError(emailField, "");
      }

      if (firstInvalid) {
        status.classList.add("is-error");
        status.textContent = "Please check the highlighted fields.";
        firstInvalid.focus();
        return;
      }

      var formData = new FormData(form);

status.classList.remove("is-error");
status.textContent = "Sending...";

fetch("https://formspree.io/f/mnpaygzb", {
  method: "POST",
  body: formData,
  headers: {
    Accept: "application/json"
  }
})
  .then(function (response) {
    if (response.ok) {
      status.classList.remove("is-error");
      status.textContent =
        "Thanks — your details are with us. We will be in touch shortly.";
      form.reset();
    } else {
      return response.json().then(function (data) {
        throw new Error(
          data.error || "There was a problem submitting the form."
        );
      });
    }
  })
  .catch(function () {
    status.classList.add("is-error");
    status.textContent =
      "Sorry, something went wrong. Please try again.";
  });
    });
  }
})();
