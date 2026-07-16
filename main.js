const THEME_KEY = "noxte-theme";

function prefersReducedMotion() {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}

function getPreferredTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia?.("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem(THEME_KEY, theme);
}

function showToast(message) {
  const toast = document.querySelector(".toast");
  const inner = document.querySelector("[data-toast]");
  if (!toast || !inner) return;

  inner.textContent = message;
  toast.hidden = false;
  // Force reflow so enter transition always runs
  void toast.offsetWidth;
  toast.dataset.show = "true";

  window.clearTimeout(showToast._t);
  showToast._t = window.setTimeout(() => {
    toast.dataset.show = "false";
    window.setTimeout(() => {
      toast.hidden = true;
    }, prefersReducedMotion() ? 0 : 160);
  }, 2200);
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    showToast("کپی شد");
    return true;
  } catch {
    showToast("کپی نشد (مرورگر اجازه نداد)");
    return false;
  }
}

function initThemeToggle() {
  applyTheme(getPreferredTheme());

  const btn = document.querySelector("[data-theme-toggle]");
  if (!btn) return;

  btn.addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "light" ? "dark" : "light";
    applyTheme(next);
    showToast(next === "light" ? "تم روشن" : "تم تیره");
  });
}

function initCopyLinks() {
  document.querySelectorAll("[data-copy-link]").forEach((button) => {
    button.addEventListener("click", () => {
      const card = button.closest(".product");
      const link = card?.querySelector('a[href^="http"]')?.getAttribute("href");
      if (!link) return;
      copyText(link);
    });
  });
}

function initContactForm() {
  const form = document.querySelector("[data-contact-form]");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();

    const text = [
      "پیام از پورتفوی Noxte",
      name ? `نام: ${name}` : null,
      email ? `ایمیل: ${email}` : null,
      message ? `پیام:\n${message}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    copyText(text || "سلام! برای همکاری پیام دادم.");
  });
}

function initToTop() {
  const btn = document.querySelector("[data-to-top]");
  if (!btn) return;
  btn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  });
}

function initReveals() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  if (prefersReducedMotion() || !("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );

  items.forEach((el) => observer.observe(el));
}

initThemeToggle();
initCopyLinks();
initContactForm();
initToTop();
initReveals();
