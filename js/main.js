(function () {
  "use strict";

  var HEADER_SEL = "[data-header]";
  var NAV_WRAP_SEL = "#nav-wrap";
  var TOGGLE_SEL = "#nav-toggle";

  function currentPageFile() {
    var path = window.location.pathname || "";
    var file = path.split("/").pop() || "";
    if (!file || file === "") return "index.html";
    return file.split("?")[0].split("#")[0].toLowerCase();
  }

  function highlightNav() {
    var page = currentPageFile();
    if (page === "" || page === "/") page = "index.html";

    document.querySelectorAll("[data-nav-file]").forEach(function (link) {
      var target = (link.getAttribute("data-nav-file") || "").toLowerCase();
      var match = target === page;
      if (link.classList.contains("nav-link")) {
        link.classList.toggle("is-active", match);
      }
      if (match) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
  }

  function initHeaderScroll() {
    var header = document.querySelector(HEADER_SEL);
    var body = document.body;
    if (!header || (!body.classList.contains("page-home") && !body.classList.contains("page-hero-overlay"))) return;

    function onScroll() {
      header.classList.toggle("is-scrolled", window.scrollY > 48);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  function initMobileNav() {
    var wrap = document.querySelector(NAV_WRAP_SEL);
    var toggle = document.querySelector(TOGGLE_SEL);
    if (!wrap || !toggle) return;

    function setOpen(open) {
      wrap.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.style.overflow = open ? "hidden" : "";
    }

    toggle.addEventListener("click", function () {
      setOpen(!wrap.classList.contains("is-open"));
    });

    wrap.addEventListener("click", function (e) {
      if (e.target === wrap) setOpen(false);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setOpen(false);
    });

    wrap.querySelectorAll('a[href]').forEach(function (a) {
      a.addEventListener("click", function () {
        if (window.matchMedia("(max-width: 768px)").matches) setOpen(false);
      });
    });
  }

  function initSmoothScroll() {
    var header = document.querySelector(HEADER_SEL);
    var offset = header ? header.offsetHeight : 0;

    document.addEventListener("click", function (e) {
      var a = e.target.closest('a[href^="#"]');
      if (!a || !a.getAttribute("href") || a.getAttribute("href") === "#") return;
      var id = a.getAttribute("href").slice(1);
      var el = document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      var top = el.getBoundingClientRect().top + window.scrollY - offset - 12;
      window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    });
  }

  function animateCounter(el, target, duration) {
    var start = 0;
    var startTime = null;

    function step(ts) {
      if (!startTime) startTime = ts;
      var p = Math.min((ts - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var val = Math.floor(start + (target - start) * eased);
      el.textContent = String(val);
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = String(target);
    }

    requestAnimationFrame(step);
  }

  function initCounters() {
    var counters = document.querySelectorAll(".stat-counter[data-target]");
    if (!counters.length) return;

    var done = false;

    function run() {
      if (done) return;
      done = true;
      counters.forEach(function (el) {
        var t = parseInt(el.getAttribute("data-target"), 10);
        if (isNaN(t)) return;
        animateCounter(el, t, 1600);
      });
    }

    var section = document.getElementById("stats");
    if (!section) {
      run();
      return;
    }

    if (!("IntersectionObserver" in window)) {
      run();
      return;
    }

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            run();
            io.disconnect();
          }
        });
      },
      { threshold: 0.25 }
    );
    io.observe(section);
  }

  function initTestimonialSlider() {
    var root = document.querySelector("[data-testimonial-slider]");
    if (!root) return;

    var track = root.querySelector("[data-testimonial-track]");
    var dotsWrap = root.querySelector("[data-testimonial-dots]");
    if (!track) return;

    var slides = track.querySelectorAll(".testimonial-slide");
    var n = slides.length;
    if (!n) return;

    var i = 0;
    var timer = null;

    function go(index) {
      i = (index + n) % n;
      track.style.transform = "translateX(-" + i * 100 + "%)";
      if (dotsWrap) {
        dotsWrap.querySelectorAll("button").forEach(function (btn, j) {
          btn.classList.toggle("is-active", j === i);
          btn.setAttribute("aria-selected", j === i ? "true" : "false");
        });
      }
    }

    if (dotsWrap) {
      dotsWrap.innerHTML = "";
      for (var d = 0; d < n; d++) {
        (function (index) {
          var b = document.createElement("button");
          b.type = "button";
          b.setAttribute("aria-label", "Show testimonial " + (index + 1));
          b.addEventListener("click", function () {
            go(index);
            restart();
          });
          dotsWrap.appendChild(b);
        })(d);
      }
    }

    function restart() {
      clearInterval(timer);
      timer = setInterval(function () {
        go(i + 1);
      }, 6000);
    }

    go(0);
    restart();
  }

  function initFaq() {
    var root = document.querySelector("[data-faq]");
    if (!root) return;

    root.querySelectorAll("[data-faq-trigger]").forEach(function (btn) {
      var item = btn.closest(".faq-item");
      var panel = item ? item.querySelector("[data-faq-panel]") : null;
      if (!item || !panel) return;

      btn.addEventListener("click", function () {
        var open = item.classList.contains("is-open");
        root.querySelectorAll(".faq-item.is-open").forEach(function (other) {
          if (other !== item) {
            other.classList.remove("is-open");
            var t = other.querySelector("[data-faq-trigger]");
            var p = other.querySelector("[data-faq-panel]");
            if (t) t.setAttribute("aria-expanded", "false");
            if (p) p.style.maxHeight = "0";
          }
        });
        item.classList.toggle("is-open", !open);
        btn.setAttribute("aria-expanded", !open ? "true" : "false");
        panel.style.maxHeight = !open ? panel.scrollHeight + "px" : "0";
      });
    });
  }

  function validateField(input) {
    var wrap = input.closest(".form-field") || input.parentElement;
    if (!wrap) return true;
    var err = wrap.querySelector(".field-error");
    var ok = true;
    var val = input.tagName === "SELECT" ? String(input.value || "") : String(input.value || "").trim();

    if (input.type === "checkbox") {
      if (input.hasAttribute("required") && !input.checked) ok = false;
    } else if (input.type === "radio") {
      if (input.hasAttribute("required")) {
        var form = input.form || input.closest("form");
        var groupOk = false;
        if (form && input.name) {
          groupOk = !!form.querySelector('input[type="radio"][name="' + input.name + '"]:checked');
        } else {
          groupOk = input.checked;
        }
        if (!groupOk) ok = false;
      }
    } else {
      if (input.hasAttribute("required") && !val) ok = false;
    }
    if (input.type === "email" && val) {
      ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    }
    if (input.type === "password" && input.hasAttribute("minlength")) {
      var min = parseInt(input.getAttribute("minlength"), 10);
      if (String(input.value || "").length < min) ok = false;
    }
    if (ok && input.hasAttribute("data-match")) {
      var sel = (input.getAttribute("data-match") || "").trim();
      var root = input.form || document;
      var other = sel ? root.querySelector(sel) : null;
      if (other && String(input.value || "") !== String(other.value || "")) ok = false;
    }

    wrap.classList.toggle("has-error", !ok);
    if (err) err.setAttribute("role", "alert");
    return ok;
  }

  function initFormValidation() {
    document.querySelectorAll("form[data-validate]").forEach(function (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var inputs = form.querySelectorAll("input[required], textarea[required], input[type='email'], select[required]");
        var allOk = true;
        inputs.forEach(function (inp) {
          if (!validateField(inp)) allOk = false;
        });
        if (!allOk) {
          return;
        }
        var action = (form.getAttribute("action") || "").trim();
        if (action && action !== "#") {
          form.submit();
          return;
        }
        if (form.id === "register-form") {
          var rmsg = document.getElementById("register-success");
          var submitBtn = form.querySelector('button[type="submit"]');
          if (rmsg) {
            if (rmsg._redirectTimer) {
              clearTimeout(rmsg._redirectTimer);
              rmsg._redirectTimer = null;
            }
            rmsg.style.display = "block";
          }
          if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = "Redirecting...";
          }
          var redirectTimer = setTimeout(function () {
            window.location.href = "404.html";
          }, 3000);
          if (rmsg) {
            rmsg._redirectTimer = redirectTimer;
          }
          return;
        }
        if (form.id === "contact-form") {
          var msg = document.getElementById("contact-success");
          var contactSubmitBtn = form.querySelector('button[type="submit"]');
          if (msg) {
            if (msg._redirectTimer) {
              clearTimeout(msg._redirectTimer);
              msg._redirectTimer = null;
            }
            msg.style.display = "block";
          }
          if (contactSubmitBtn) {
            contactSubmitBtn.disabled = true;
            contactSubmitBtn.textContent = "Redirecting...";
          }
          var contactRedirectTimer = setTimeout(function () {
            window.location.href = "404.html";
          }, 3000);
          if (msg) {
            msg._redirectTimer = contactRedirectTimer;
          }
          return;
        }
        if (form.id === "newsletter-form") {
          var scrollY = window.scrollY;
          var nmsg = document.getElementById("newsletter-success");
          if (nmsg) {
            if (nmsg._newsletterHideTimer) {
              clearTimeout(nmsg._newsletterHideTimer);
              nmsg._newsletterHideTimer = null;
            }
            nmsg.style.display = "block";
            nmsg.setAttribute("tabindex", "-1");
            try {
              nmsg.focus({ preventScroll: true });
            } catch (err) {
              nmsg.focus();
            }
            nmsg._newsletterHideTimer = setTimeout(function () {
              nmsg.style.display = "none";
              nmsg.removeAttribute("tabindex");
              if (document.activeElement === nmsg) nmsg.blur();
              nmsg._newsletterHideTimer = null;
            }, 3000);
          }
          form.reset();
          requestAnimationFrame(function () {
            window.scrollTo(0, scrollY);
            requestAnimationFrame(function () {
              window.scrollTo(0, scrollY);
            });
          });
        }
      });

      form.querySelectorAll("input, textarea, select").forEach(function (inp) {
        inp.addEventListener("blur", function () {
          if (inp.value || inp.hasAttribute("required")) validateField(inp);
        });
        if (inp.type === "checkbox" || inp.type === "radio") {
          inp.addEventListener("change", function () {
            validateField(inp);
          });
        }
      });
    });
  }

  function initLoginRedirect() {
    var form = document.getElementById("login-form");
    if (!form) return;

    form.querySelectorAll('input[name="role"]').forEach(function (r) {
      r.addEventListener("change", function () {
        var fs = form.querySelector(".role-fieldset");
        if (fs) {
          fs.classList.remove("has-error");
          var rerr = fs.querySelector(".field-error");
          if (rerr) rerr.style.display = "";
        }
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = form.querySelector("#login-name");
      var email = form.querySelector("#login-email");
      var password = form.querySelector("#login-password");
      var role = form.querySelector('input[name="role"]:checked');
      var ok = true;
      if (name && !validateField(name)) ok = false;
      if (email && !validateField(email)) ok = false;
      if (password && !validateField(password)) ok = false;
      if (!role) {
        ok = false;
        var rs = form.querySelector(".role-fieldset");
        if (rs) {
          rs.classList.add("has-error");
          var re = rs.querySelector(".field-error");
          if (re) re.style.display = "block";
        }
      } else {
        var fs = form.querySelector(".role-fieldset");
        if (fs) {
          fs.classList.remove("has-error");
          var rerr = fs.querySelector(".field-error");
          if (rerr) rerr.style.display = "none";
        }
      }
      if (!ok) return;

      var nextUrl = role.value === "admin" ? "admin-dashboard.html" : "customer-dashboard.html";
      var lmsg = document.getElementById("login-success");
      var submitBtn = form.querySelector('button[type="submit"]');
      if (lmsg) {
        if (lmsg._redirectTimer) {
          clearTimeout(lmsg._redirectTimer);
          lmsg._redirectTimer = null;
        }
        lmsg.style.display = "block";
      }
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Redirecting...";
      }

      var loginRedirectTimer = setTimeout(function () {
        window.location.href = nextUrl;
      }, 3000);

      if (lmsg) {
        lmsg._redirectTimer = loginRedirectTimer;
      }
    });
  }

  function initYear() {
    var y = new Date().getFullYear();
    document.querySelectorAll("[data-year]").forEach(function (el) {
      el.textContent = String(y);
    });
  }

  function initBrandIconFallback() {
    document.querySelectorAll(".logo-pill--brand img").forEach(function (img) {
      function fallback() {
        img.style.display = "none";
        var pill = img.closest(".logo-pill--brand");
        if (!pill) return;
        pill.classList.add("logo-pill--noicon");
        var name = pill.querySelector(".logo-pill__name");
        if (!name) return;
        var initial = (name.textContent || "").trim().slice(0, 1).toUpperCase();
        if (!initial) return;
        if (pill.querySelector(".logo-pill__fallback")) return;
        var b = document.createElement("span");
        b.className = "logo-pill__fallback";
        b.textContent = initial;
        pill.insertBefore(b, name);
      }

      if (img.complete && img.naturalWidth === 0) fallback();
      img.addEventListener("error", fallback);
    });
  }

  function init404GoBack() {
    var btn = document.getElementById("error-go-back");
    if (!btn) return;
    btn.addEventListener("click", function () {
      var ref = document.referrer || "";
      try {
        if (ref && new URL(ref).origin === window.location.origin) {
          window.history.back();
          return;
        }
      } catch (e) {
      
      }
      window.location.href = "index.html";
    });
  }

  function initScrollAutoplayVideos() {
    if (!("IntersectionObserver" in window)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    var videos = document.querySelectorAll("video[data-autoplay-on-scroll]");
    if (!videos.length) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var v = entry.target;
          if (!(v instanceof HTMLVideoElement)) return;
          if (entry.isIntersecting && entry.intersectionRatio >= 0.35) {
            var p = v.play();
            if (p && typeof p.catch === "function") {
              p.catch(function () {});
            }
          } else {
            v.pause();
          }
        });
      },
      { threshold: [0, 0.25, 0.35, 0.5], rootMargin: "0px 0px -10% 0px" }
    );

    videos.forEach(function (v) {
      observer.observe(v);
    });
  }

  function initScrollSpyHome() {
    if (!document.body.classList.contains("page-home")) return;

    var header = document.querySelector(HEADER_SEL);
    var links = document.querySelectorAll(".nav-link[data-section]");
    if (!links.length) return;

    var byId = {};
    links.forEach(function (link) {
      var sid = link.getAttribute("data-section");
      if (sid) byId[sid] = link;
    });

    var sectionEls = Object.keys(byId)
      .map(function (id) {
        return document.getElementById(id);
      })
      .filter(Boolean)
      .sort(function (a, b) {
        return a.offsetTop - b.offsetTop;
      });

    if (!sectionEls.length) return;

    var ticking = false;

    function update() {
      ticking = false;
      var pad = (header ? header.offsetHeight : 0) + 32;
      var y = window.scrollY + pad;
      var currentId = sectionEls[0].id;
      for (var i = 0; i < sectionEls.length; i++) {
        var sec = sectionEls[i];
        if (sec.offsetTop <= y) currentId = sec.id;
      }
      links.forEach(function (link) {
        link.classList.toggle("is-active", link.getAttribute("data-section") === currentId);
      });
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    update();
  }

  function initAos() {
    if (!("AOS" in window)) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      window.AOS.init({ disable: true });
      return;
    }

    var commonTargets = document.querySelectorAll(
      "main section, main article, .card-surface, .service-card, .why-card, .stat-item, .hero-stat, .faq-item, .dashboard-card"
    );

    commonTargets.forEach(function (el, index) {
      if (el.hasAttribute("data-aos")) return;
      el.setAttribute("data-aos", "fade-up");
      el.setAttribute("data-aos-duration", "700");
      el.setAttribute("data-aos-delay", String((index % 5) * 60));
    });

    window.AOS.init({
      duration: 700,
      easing: "ease-out-cubic",
      once: true,
      offset: 80
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    highlightNav();
    initHeaderScroll();
    initMobileNav();
    initSmoothScroll();
    initCounters();
    initTestimonialSlider();
    initFaq();
    initFormValidation();
    initLoginRedirect();
    initYear();
    initBrandIconFallback();
    init404GoBack();
    initScrollSpyHome();
    initScrollAutoplayVideos();
    initAos();
  });
})();
