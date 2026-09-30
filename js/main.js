(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  /* ---------- Light / dark theme ----------
     The initial theme is applied by the inline script in <head> (saved
     preference, else system preference). Here we wire the toggle, persist
     explicit choices, and follow system changes until the user picks one. */
  var root = document.documentElement;
  var themeToggle = document.getElementById("themeToggle");
  var themeMeta = document.querySelector('meta[name="theme-color"]');
  var systemDark = window.matchMedia("(prefers-color-scheme: dark)");

  function getStoredTheme() {
    try {
      var t = localStorage.getItem("theme");
      return t === "light" || t === "dark" ? t : null;
    } catch (e) {
      return null;
    }
  }

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    if (themeMeta) themeMeta.setAttribute("content", theme === "dark" ? "#0c100e" : "#ffffff");
    if (themeToggle) {
      themeToggle.setAttribute("aria-label", theme === "dark" ? "Switch to light theme" : "Switch to dark theme");
    }
  }

  applyTheme(root.getAttribute("data-theme") === "dark" ? "dark" : "light");

  var themeFadeTimer = null;

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      // Cross-fade colours for a moment (see .theme-transition in the CSS).
      if (!prefersReducedMotion) {
        root.classList.add("theme-transition");
        clearTimeout(themeFadeTimer);
        themeFadeTimer = setTimeout(function () {
          root.classList.remove("theme-transition");
        }, 420);
      }
      applyTheme(next);
      try {
        localStorage.setItem("theme", next);
      } catch (e) {
        /* storage unavailable: theme still switches for this visit */
      }
    });
  }

  var handleSystemTheme = function (e) {
    if (!getStoredTheme()) applyTheme(e.matches ? "dark" : "light");
  };
  if (systemDark.addEventListener) {
    systemDark.addEventListener("change", handleSystemTheme);
  } else if (systemDark.addListener) {
    systemDark.addListener(handleSystemTheme);
  }

  /* ---------- Hero: typing role line ----------
     Types each role, pauses, backspaces, then moves to the next, looping.
     The element is aria-hidden (a static sr-only sentence carries the roles),
     so screen readers aren't flooded with per-character updates. With reduced
     motion the first role stays static, as written in the HTML. */
  var typedEl = document.getElementById("heroTyped");
  if (typedEl && !prefersReducedMotion) {
    var roles = ["Software Engineer", "Full-Stack Developer"];
    var TYPE_MS = 105;
    var DELETE_MS = 55;
    var HOLD_MS = 1900;
    var NEXT_MS = 500;
    var roleIndex = 0;
    var charIndex = 0;
    var deleting = false;

    var tick = function () {
      var role = roles[roleIndex];
      if (!deleting) {
        charIndex++;
        typedEl.textContent = role.slice(0, charIndex);
        if (charIndex === role.length) {
          deleting = true;
          setTimeout(tick, HOLD_MS);
          return;
        }
        // Slight jitter so the typing feels natural rather than mechanical.
        setTimeout(tick, TYPE_MS + Math.random() * 40);
      } else {
        charIndex--;
        typedEl.textContent = role.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
          setTimeout(tick, NEXT_MS);
          return;
        }
        setTimeout(tick, DELETE_MS);
      }
    };

    typedEl.textContent = "";
    // Start once the hero entrance animation has settled.
    setTimeout(tick, 900);
  }

  /* ---------- Hero star field ----------
     A flat layer of small dots that turns slowly around a pivot far below the
     hero. On screen that reads as the whole field drifting together (mostly
     leftward, slightly up; ~15–30px/s) with a gentle speed/direction gradient
     across the width, and the direction keeps turning over minutes, matching
     the reference. Each dot also twinkles and fades in and out on its own
     cycle. Canvas + one requestAnimationFrame loop; the loop only runs while
     the hero is on screen. With reduced motion a single still frame is drawn. */
  var starCanvas = document.getElementById("heroStars");
  if (starCanvas && starCanvas.getContext) {
    var sctx = starCanvas.getContext("2d");
    var motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    var DENSITY = 3.2 / 100000; // visible dots per px² (measured)
    var OMEGA = -0.012; // rad/s; negative = anticlockwise on screen
    var PIVOT_DROP = 1700; // px below the hero's middle
    var stars = [];
    var W = 0;
    var H = 0;
    var dpr = 1;
    var pivotX = 0;
    var pivotY = 0;
    var elapsed = 0;
    var last = 0;
    var frameId = 0;
    var heroOnScreen = true;

    var sizeStars = function () {
      W = starCanvas.clientWidth;
      H = starCanvas.clientHeight;
      if (!W || !H) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      starCanvas.width = Math.round(W * dpr);
      starCanvas.height = Math.round(H * dpr);
      sctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      pivotX = W * 0.29;
      pivotY = H * 0.5 + PIVOT_DROP;
      // The layer is a ring around the pivot wide enough to always cover the hero.
      var rMin = Math.max(0, pivotY - H - 20);
      var rMax = Math.hypot(Math.max(pivotX, W - pivotX) + 20, pivotY + 20);
      // Roughly 40% of dots are faded out at any moment, so seed ~1.6x the target.
      var n = Math.round(DENSITY * Math.PI * (rMax * rMax - rMin * rMin) * 1.6);
      stars = [];
      for (var i = 0; i < n; i++) {
        stars.push({
          r: Math.sqrt(rMin * rMin + Math.random() * (rMax * rMax - rMin * rMin)), // uniform by area
          a: Math.random() * Math.PI * 2,
          size: 0.9 + Math.random() * 0.6, // radius 0.9–1.5px (≈2–3px dots)
          tw: 1.5 + Math.random() * 2.5, // twinkle (rad/s)
          fade: 0.4 + Math.random() * 0.4, // fade in/out, ~8–16s cycle
          ph: Math.random() * Math.PI * 2,
          ph2: Math.random() * Math.PI * 2
        });
      }
    };

    var drawStars = function () {
      if (!W || !H) return;
      var dark = root.getAttribute("data-theme") === "dark";
      sctx.clearRect(0, 0, W, H);
      sctx.fillStyle = dark ? "rgb(245, 247, 246)" : "rgb(38, 40, 44)";
      // Light dots on black read larger, so they are drawn a touch smaller.
      var sizeScale = dark ? 0.85 : 1;
      var turn = elapsed * OMEGA;
      for (var i = 0; i < stars.length; i++) {
        var s = stars[i];
        var ang = s.a + turn;
        var x = pivotX + s.r * Math.cos(ang);
        var y = pivotY + s.r * Math.sin(ang);
        if (x < -3 || x > W + 3 || y < -3 || y > H + 3) continue;
        var fade = Math.sin(elapsed * s.fade + s.ph2); // <0 = faded out
        if (fade <= 0) continue;
        var twinkle = 0.78 + 0.22 * Math.sin(elapsed * s.tw + s.ph);
        sctx.globalAlpha = Math.min(1, fade * 1.6) * twinkle;
        sctx.beginPath();
        sctx.arc(x, y, s.size * sizeScale, 0, Math.PI * 2);
        sctx.fill();
      }
      sctx.globalAlpha = 1;
    };

    var tickStars = function (now) {
      var dt = last ? Math.min((now - last) / 1000, 0.05) : 0;
      last = now;
      elapsed += dt;
      drawStars();
      frameId = window.requestAnimationFrame(tickStars);
    };

    var runStars = function () {
      window.cancelAnimationFrame(frameId);
      frameId = 0;
      last = 0;
      if (motionQuery.matches || !heroOnScreen) {
        drawStars(); // still frame
      } else {
        frameId = window.requestAnimationFrame(tickStars);
      }
    };

    sizeStars();
    runStars();

    // Re-fit when the hero changes size (viewport resize, font load, etc.)
    if ("ResizeObserver" in window) {
      new ResizeObserver(function () {
        sizeStars();
        if (!frameId) drawStars();
      }).observe(starCanvas);
    }

    // Only animate while the hero is visible.
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        heroOnScreen = entries[0].isIntersecting;
        runStars();
      }).observe(starCanvas);
    }

    if (themeToggle) {
      themeToggle.addEventListener("click", function () {
        if (!frameId) drawStars();
      });
    }

    if (motionQuery.addEventListener) {
      motionQuery.addEventListener("change", runStars);
    } else if (motionQuery.addListener) {
      motionQuery.addListener(runStars);
    }
  }

  /* ---------- Header: blurred state once the page scrolls ---------- */
  var siteHeader = document.querySelector(".site-header");
  if (siteHeader) {
    var updateHeaderState = function () {
      siteHeader.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    updateHeaderState();
    window.addEventListener("scroll", updateHeaderState, { passive: true });
  }

  /* ---------- Mobile nav toggle ----------
     The menu/close icon swap is driven by aria-expanded via CSS. */
  var navToggle = document.getElementById("navToggle");
  var mobileNav = document.getElementById("mobileNav");

  function closeMobileNav() {
    if (!mobileNav || mobileNav.hidden) return;
    mobileNav.hidden = true;
    navToggle.setAttribute("aria-expanded", "false");
    if (siteHeader) siteHeader.classList.remove("is-open");
  }

  function openMobileNav() {
    mobileNav.hidden = false;
    navToggle.setAttribute("aria-expanded", "true");
    if (siteHeader) siteHeader.classList.add("is-open");
  }

  if (navToggle && mobileNav) {
    navToggle.addEventListener("click", function () {
      if (navToggle.getAttribute("aria-expanded") === "true") {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });

    mobileNav.addEventListener("click", function (e) {
      if (e.target.closest("a")) closeMobileNav();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && navToggle.getAttribute("aria-expanded") === "true") {
        closeMobileNav();
        navToggle.focus();
      }
    });

    // Close when clicking outside the header.
    document.addEventListener("click", function (e) {
      if (siteHeader && !siteHeader.contains(e.target)) closeMobileNav();
    });

    // Close the mobile nav if the viewport grows back to desktop width.
    var desktopMedia = window.matchMedia("(min-width: 961px)");
    var handleMediaChange = function (e) {
      if (e.matches) closeMobileNav();
    };
    if (desktopMedia.addEventListener) {
      desktopMedia.addEventListener("change", handleMediaChange);
    } else if (desktopMedia.addListener) {
      desktopMedia.addListener(handleMediaChange);
    }
  }

  /* ---------- Scroll-spy: highlight active nav link + sliding indicator ---------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".primary-nav a[data-nav]"));
  var sections = navLinks
    .map(function (link) {
      return document.getElementById(link.getAttribute("href").slice(1));
    })
    .filter(Boolean);
  var navIndicator = document.getElementById("navIndicator");
  var navList = document.querySelector(".primary-nav ul");

  function moveIndicatorTo(link) {
    if (!navIndicator || !navList) return;
    if (!link) {
      navIndicator.classList.remove("is-ready");
      return;
    }
    var navRect = navList.getBoundingClientRect();
    var linkRect = link.getBoundingClientRect();
    navIndicator.style.width = linkRect.width + "px";
    navIndicator.style.transform = "translateX(" + (linkRect.left - navRect.left) + "px)";
    navIndicator.classList.add("is-ready");
  }

  function setActiveLink(id) {
    var activeLink = null;
    navLinks.forEach(function (link) {
      if (id && link.getAttribute("href") === "#" + id) {
        link.setAttribute("aria-current", "true");
        activeLink = link;
      } else {
        link.removeAttribute("aria-current");
      }
    });
    moveIndicatorTo(activeLink);
  }

  function refreshIndicator() {
    moveIndicatorTo(document.querySelector('.primary-nav a[aria-current="true"]'));
  }

  // Link widths shift once the web font loads, and on resize.
  window.addEventListener("load", refreshIndicator);
  window.addEventListener("resize", refreshIndicator);

  if ("IntersectionObserver" in window && sections.length) {
    var hero = document.getElementById("home");
    var spyObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          setActiveLink(entry.target === hero ? null : entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );
    sections.forEach(function (section) {
      spyObserver.observe(section);
    });
    if (hero) spyObserver.observe(hero);
  }

  /* ---------- Contact form ----------
     There is no backend, so nothing is sent from the page: after validation
     the message is handed to the visitor's email app via a mailto: link. */
  var contactForm = document.getElementById("contactForm");
  if (contactForm) {
    var CONTACT_EMAIL = "gowsikanlakshmanan@gmail.com";
    var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    var formStatus = document.getElementById("contactFormStatus");
    var formFields = [
      { el: document.getElementById("cfName"), check: function (v) { return v ? "" : "Please enter your name."; } },
      { el: document.getElementById("cfEmail"), check: function (v) { return EMAIL_RE.test(v) ? "" : "Please enter a valid email address."; } },
      { el: document.getElementById("cfMessage"), check: function (v) { return v.length >= 10 ? "" : "Please enter a message of at least 10 characters."; } }
    ];

    var validateField = function (field) {
      var message = field.check(field.el.value.trim());
      var errorEl = document.getElementById(field.el.getAttribute("aria-describedby"));
      if (message) {
        field.el.setAttribute("aria-invalid", "true");
      } else {
        field.el.removeAttribute("aria-invalid");
      }
      errorEl.textContent = message;
      errorEl.hidden = !message;
      return !message;
    };

    formFields.forEach(function (field) {
      // Once a field has been flagged, re-check it as the visitor fixes it.
      field.el.addEventListener("input", function () {
        if (field.el.getAttribute("aria-invalid") === "true") validateField(field);
      });
    });

    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var firstInvalid = null;
      formFields.forEach(function (field) {
        if (!validateField(field) && !firstInvalid) firstInvalid = field.el;
      });
      if (firstInvalid) {
        formStatus.textContent = "";
        firstInvalid.focus();
        return;
      }

      var name = formFields[0].el.value.trim();
      var email = formFields[1].el.value.trim();
      var message = formFields[2].el.value.trim();
      var subject = "Portfolio message from " + name;
      var body = message + "\n\n— " + name + "\n" + email;
      window.location.href = "mailto:" + CONTACT_EMAIL +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);
      formStatus.textContent = "Your email app should open with this message ready to send. " +
        "If it doesn't, you can email me directly at " + CONTACT_EMAIL + ".";
    });
  }

  /* ---------- Reveal-on-scroll ----------
     Elements are only hidden (via html.js-reveal) once we know we can
     reveal them again, so content never gets stuck invisible. */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll(".reveal"));

  if ("IntersectionObserver" in window && !prefersReducedMotion && revealEls.length) {
    document.documentElement.classList.add("js-reveal");
    var revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var target = entry.target;
            target.classList.add("is-visible");
            observer.unobserve(target);
            // Drop the stagger delay afterwards so hover transitions stay instant.
            setTimeout(function () {
              target.style.transitionDelay = "";
            }, 1000);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) {
      // Stagger siblings within the same grid slightly.
      var index = Array.prototype.indexOf.call(el.parentNode.children, el);
      el.style.transitionDelay = Math.min(index, 3) * 70 + "ms";
      revealObserver.observe(el);
    });
  }
})();
