(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var isFinePointer = window.matchMedia("(pointer: fine)").matches;

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  /* ---------- Header: compact/blurred state once the page scrolls ---------- */
  var siteHeader = document.querySelector(".site-header");
  if (siteHeader) {
    var updateHeaderState = function () {
      siteHeader.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    updateHeaderState();
    window.addEventListener("scroll", updateHeaderState, { passive: true });
  }

  /* ---------- Mobile nav toggle ---------- */
  var navToggle = document.getElementById("navToggle");
  var mobileNav = document.getElementById("mobileNav");

  // The menu/close icon swap is driven purely by aria-expanded via CSS
  // (see .nav-toggle[aria-expanded="true"] rules) rather than toggling
  // the `hidden` property on the <svg> icons directly: `hidden` isn't a
  // reliably reflected DOM property on SVG elements in every engine.
  function closeMobileNav() {
    if (!mobileNav || mobileNav.hidden) return;
    mobileNav.hidden = true;
    navToggle.setAttribute("aria-expanded", "false");
  }

  function openMobileNav() {
    mobileNav.hidden = false;
    navToggle.setAttribute("aria-expanded", "true");
  }

  if (navToggle && mobileNav) {
    navToggle.addEventListener("click", function () {
      var isOpen = navToggle.getAttribute("aria-expanded") === "true";
      if (isOpen) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });

    mobileNav.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        closeMobileNav();
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && navToggle.getAttribute("aria-expanded") === "true") {
        closeMobileNav();
        navToggle.focus();
      }
    });

    // Close mobile nav if the viewport grows back to desktop width.
    var desktopMedia = window.matchMedia("(min-width: 861px)");
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
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.primary-nav a[data-nav]'));
  var sections = navLinks
    .map(function (link) {
      var id = link.getAttribute("href").replace("#", "");
      return document.getElementById(id);
    })
    .filter(Boolean);
  var navIndicator = document.getElementById("navIndicator");
  var navList = document.querySelector(".primary-nav ul");

  function moveIndicatorTo(link) {
    if (!navIndicator || !navList || !link) return;
    var navRect = navList.getBoundingClientRect();
    var linkRect = link.getBoundingClientRect();
    navIndicator.style.width = linkRect.width + "px";
    navIndicator.style.transform = "translateX(" + (linkRect.left - navRect.left) + "px)";
    navIndicator.classList.add("is-ready");
  }

  function setActiveLink(id) {
    var activeLink = null;
    navLinks.forEach(function (link) {
      var match = link.getAttribute("href") === "#" + id;
      if (match) {
        link.setAttribute("aria-current", "true");
        activeLink = link;
      } else {
        link.removeAttribute("aria-current");
      }
    });
    if (activeLink) moveIndicatorTo(activeLink);
  }

  // Link widths can shift slightly once the web font finishes loading, and
  // the layout can change on resize — reposition the indicator in both cases.
  window.addEventListener("load", function () {
    var current = document.querySelector('.primary-nav a[aria-current="true"]');
    if (current) moveIndicatorTo(current);
  });
  window.addEventListener("resize", function () {
    var current = document.querySelector('.primary-nav a[aria-current="true"]');
    if (current) moveIndicatorTo(current);
  });

  if ("IntersectionObserver" in window && sections.length) {
    var spyObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            setActiveLink(entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach(function (section) {
      spyObserver.observe(section);
    });
  }

  /* ---------- Reveal-on-scroll ---------- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll(".reveal"));

  if (!("IntersectionObserver" in window) || prefersReducedMotion) {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  } else {
    var revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el, i) {
      el.style.transitionDelay = Math.min(i % 4, 3) * 60 + "ms";
      revealObserver.observe(el);
    });
  }

  /* ---------- Ambient background particles ----------
     Skipped entirely under prefers-reduced-motion rather than generated
     and merely frozen, since they'd serve no purpose motionless. */
  var particleHost = document.getElementById("bgParticles");
  if (particleHost && !prefersReducedMotion) {
    var particleCount = window.innerWidth < 700 ? 8 : 16;
    for (var p = 0; p < particleCount; p++) {
      var particle = document.createElement("span");
      particle.className = "bg-particle";
      var size = 2 + Math.random() * 2;
      particle.style.left = Math.random() * 100 + "%";
      particle.style.width = size + "px";
      particle.style.height = size + "px";
      particle.style.animationDuration = 16 + Math.random() * 18 + "s";
      particle.style.animationDelay = Math.random() * 20 + "s";
      particleHost.appendChild(particle);
    }
  }

  /* ---------- Subtle pointer tilt for [data-tilt] cards ----------
     Desktop mouse only: skipped for touch pointers (no hover concept) and
     for prefers-reduced-motion. Rotation is kept to a few degrees. */
  if (isFinePointer && !prefersReducedMotion) {
    var tiltEls = Array.prototype.slice.call(document.querySelectorAll("[data-tilt]"));
    tiltEls.forEach(function (el) {
      el.addEventListener("pointermove", function (e) {
        var rect = el.getBoundingClientRect();
        var px = (e.clientX - rect.left) / rect.width - 0.5;
        var py = (e.clientY - rect.top) / rect.height - 0.5;
        el.style.setProperty("--ry", (px * 7).toFixed(2) + "deg");
        el.style.setProperty("--rx", (py * -7).toFixed(2) + "deg");
        el.style.setProperty("--ty", "-4px");
      });
      el.addEventListener("pointerleave", function () {
        el.style.setProperty("--rx", "0deg");
        el.style.setProperty("--ry", "0deg");
        el.style.setProperty("--ty", "0px");
      });
    });
  }

  /* ---------- Subtle avatar parallax on mouse move ----------
     Desktop mouse only; a small, clamped drift toward the pointer, applied
     to the .portrait-parallax wrapper (see main.css comment) rather than
     .portrait-frame, which already has its own float/spin animation. The
     CSS transition on that wrapper smooths and slightly delays the drift,
     so no rAF throttling is needed here. */
  var portraitParallax = document.querySelector(".portrait-parallax");
  var heroSection = document.querySelector(".hero");
  if (portraitParallax && heroSection && isFinePointer && !prefersReducedMotion) {
    heroSection.addEventListener("pointermove", function (e) {
      var rect = heroSection.getBoundingClientRect();
      var px = (e.clientX - rect.left) / rect.width - 0.5;
      var py = (e.clientY - rect.top) / rect.height - 0.5;
      portraitParallax.style.transform =
        "translate(" + (px * 14).toFixed(1) + "px, " + (py * 14).toFixed(1) + "px)";
    });

    heroSection.addEventListener("pointerleave", function () {
      portraitParallax.style.transform = "translate(0, 0)";
    });
  }
})();
