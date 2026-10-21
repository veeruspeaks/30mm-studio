/* =========================================================
   30mm Studio — interactions
   ========================================================= */

// Business contact details — update these in one place
const CONTACT = {
  email: "hello@30mmstudio.com",
  whatsapp: "919999999999", // country code + number, digits only
};

// Portfolio items. Add a `video` URL (YouTube/Vimeo embed) to play it in the modal.
const PROJECTS = [
  { title: "Velora Watches — Launch Film", client: "Velora", cat: "brand", label: "Brand Ad", dur: "01:00", hue: 356 },
  { title: "Brewhaus Coffee — Morning Ritual", client: "Brewhaus", cat: "product", label: "Product Shoot", dur: "00:45", hue: 22 },
  { title: "Tech Unboxed — Studio Setup Tour", client: "Tech Unboxed", cat: "youtube", label: "YouTube", dur: "12:48", hue: 210 },
  { title: "Urban Threads — Drop 04", client: "Urban Threads", cat: "reels", label: "Reels & Shorts", dur: "00:30", hue: 340, tall: true },
  { title: "Nova Fitness — Stronger Every Day", client: "Nova Fitness", cat: "brand", label: "Brand Ad", dur: "00:40", hue: 0 },
  { title: "Aura Skincare — Serum Macro Series", client: "Aura", cat: "product", label: "Product Shoot", dur: "00:20", hue: 30 },
  { title: "Kitchen Diaries — Season 2 Episode", client: "Kitchen Diaries", cat: "youtube", label: "YouTube", dur: "18:05", hue: 15 },
  { title: "Café Lumen — 15s Reel Pack", client: "Café Lumen", cat: "reels", label: "Reels & Shorts", dur: "00:15", hue: 45, tall: true },
  { title: "Monarch Realty — Brand Story", client: "Monarch", cat: "brand", label: "Brand Ad", dur: "02:10", hue: 220 },
  { title: "Pulse Audio — Headphones Hero", client: "Pulse Audio", cat: "product", label: "Product Shoot", dur: "00:35", hue: 260 },
  { title: "Wanderlog — Himalaya Travel Vlog", client: "Wanderlog", cat: "youtube", label: "YouTube", dur: "22:31", hue: 190 },
  { title: "Sole Society — Sneaker Shorts", client: "Sole Society", cat: "reels", label: "Reels & Shorts", dur: "00:25", hue: 350, tall: true },
];

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

/* ---------- Loader ---------- */
window.addEventListener("load", () => {
  setTimeout(() => {
    $("#loader").classList.add("done");
    document.body.classList.add("loaded");
    $$(".hero .reveal").forEach((el) => el.classList.add("in"));
  }, 900);
});

$("#year").textContent = new Date().getFullYear();

/* ---------- Header: scroll state, hide on scroll down ---------- */
const header = $("#header");
let lastY = 0;
window.addEventListener("scroll", () => {
  const y = window.scrollY;
  header.classList.toggle("scrolled", y > 30);
  header.classList.toggle("hide", y > lastY && y > 400 && !nav.classList.contains("open"));
  lastY = y;
}, { passive: true });

/* ---------- Mobile menu ---------- */
const burger = $("#burger");
const nav = $("#nav");
function setMenu(open) {
  nav.classList.toggle("open", open);
  burger.classList.toggle("open", open);
  burger.setAttribute("aria-expanded", open);
  document.body.classList.toggle("no-scroll", open);
}
burger.addEventListener("click", () => setMenu(!nav.classList.contains("open")));
$$("a", nav).forEach((a) => a.addEventListener("click", () => setMenu(false)));

/* ---------- Active nav link per section ---------- */
const navLinks = $$(".nav__link");
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (!e.isIntersecting) return;
    navLinks.forEach((l) => l.classList.toggle("active", l.getAttribute("href") === "#" + e.target.id));
  });
}, { rootMargin: "-45% 0px -50% 0px" });
["home", "work", "services", "about", "contact"].forEach((id) => sectionObserver.observe(document.getElementById(id)));

/* ---------- Portfolio grid ---------- */
const grid = $("#grid");
function thumbStyle(hue) {
  return `background-image:
    radial-gradient(circle at 65% 35%, hsl(${hue} 45% 22%) 0, transparent 55%),
    radial-gradient(circle at 15% 85%, hsl(${hue} 20% 14%) 0, transparent 45%),
    linear-gradient(150deg, #1b1b1b, #0b0b0b)`;
}
grid.innerHTML = PROJECTS.map((p, i) => `
  <article class="card${p.tall ? " card--tall" : ""}" data-cat="${p.cat}" data-index="${i}" tabindex="0" role="button" aria-label="Play ${p.title}">
    <div class="card__media">
      <div class="thumb" style="${thumbStyle(p.hue)}"></div>
      <div class="card__overlay"><span><span class="play-ico"></span></span></div>
      <span class="card__dur">${p.dur}</span>
    </div>
    <div class="card__body">
      <span class="tag">${p.label}</span>
      <h3>${p.title}</h3>
      <p>${p.client}</p>
    </div>
  </article>`).join("");

const cards = $$(".card", grid);
$$(".filter").forEach((btn) => {
  btn.addEventListener("click", () => {
    $$(".filter").forEach((b) => { b.classList.toggle("active", b === btn); b.setAttribute("aria-selected", b === btn); });
    const f = btn.dataset.filter;
    cards.forEach((card, i) => {
      const show = f === "all" || card.dataset.cat === f;
      card.classList.toggle("is-hidden", !show);
      if (show) {
        card.classList.add("is-entering");
        setTimeout(() => card.classList.remove("is-entering"), 40 + i * 30);
      }
    });
  });
});

// Stagger the cards in when the grid first scrolls into view
cards.forEach((c) => c.classList.add("is-entering"));
new IntersectionObserver((entries, obs) => {
  if (!entries[0].isIntersecting) return;
  cards.forEach((c, i) => setTimeout(() => c.classList.remove("is-entering"), i * 70));
  obs.disconnect();
}, { threshold: 0.1 }).observe(grid);

/* ---------- Video modal ---------- */
const modal = $("#modal");
const screen = $(".modal__screen", modal);
const placeholder = screen.innerHTML;
let lastFocus = null;

function openModal(title, video) {
  lastFocus = document.activeElement;
  $("#modalTitle").textContent = title || "";
  screen.innerHTML = video
    ? `<iframe src="${video}" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen title="${title}"></iframe>`
    : placeholder;
  modal.hidden = false;
  document.body.classList.add("no-scroll");
  $(".modal__close", modal).focus();
}
function closeModal() {
  modal.hidden = true;
  screen.innerHTML = placeholder;
  document.body.classList.remove("no-scroll");
  lastFocus && lastFocus.focus();
}
$$("[data-close]", modal).forEach((el) => el.addEventListener("click", closeModal));
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (!modal.hidden) closeModal();
    else if (nav.classList.contains("open")) setMenu(false);
  }
});

function activate(el) {
  if (el.classList.contains("card")) {
    const p = PROJECTS[el.dataset.index];
    openModal(p.title, p.video);
  } else {
    openModal(el.dataset.title, el.dataset.video);
  }
}
document.addEventListener("click", (e) => {
  const el = e.target.closest(".play-trigger, .reel, .card");
  if (el) activate(el);
});
document.addEventListener("keydown", (e) => {
  if (e.key !== "Enter" && e.key !== " ") return;
  const el = e.target.closest && e.target.closest("article.play-trigger, .card");
  if (el && el === e.target) { e.preventDefault(); activate(el); }
});

/* ---------- Scroll reveal ---------- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("in"); revealObserver.unobserve(e.target); }
  });
}, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
$$(".reveal, .step").forEach((el) => { if (!el.closest(".hero")) revealObserver.observe(el); });

/* ---------- Count-up numbers ---------- */
const countObserver = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const end = +el.dataset.count;
    const dur = 1600;
    const t0 = performance.now();
    const tick = (t) => {
      const k = Math.min((t - t0) / dur, 1);
      el.textContent = Math.round(end * (1 - Math.pow(1 - k, 3)));
      if (k < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    countObserver.unobserve(el);
  });
}, { threshold: 0.6 });
$$("[data-count]").forEach((el) => countObserver.observe(el));

/* ---------- Custom cursor ---------- */
if (matchMedia("(hover: hover) and (pointer: fine)").matches) {
  const cursor = $(".cursor");
  let x = 0, y = 0, cx = 0, cy = 0;
  document.addEventListener("mousemove", (e) => { x = e.clientX; y = e.clientY; cursor.classList.add("visible"); });
  document.addEventListener("mouseleave", () => cursor.classList.remove("visible"));
  (function loop() {
    cx += (x - cx) * 0.2; cy += (y - cy) * 0.2;
    cursor.style.transform = `translate(${cx}px, ${cy}px)`;
    requestAnimationFrame(loop);
  })();
  document.addEventListener("mouseover", (e) => {
    cursor.classList.toggle("hover", !!e.target.closest("a, button, .card, .feat, .service, label"));
  });
}

/* ---------- Project brief form ---------- */
const form = $("#brief");
const note = $("#formNote");

function collectBrief() {
  const data = new FormData(form);
  return {
    name: data.get("name").trim(),
    email: data.get("email").trim(),
    company: data.get("company").trim(),
    phone: data.get("phone").trim(),
    services: data.getAll("service"),
    budget: data.get("budget") || "",
    message: data.get("message").trim(),
  };
}

function validate() {
  let ok = true;
  ["name", "email", "message"].forEach((id) => {
    const input = $("#" + id);
    const valid = input.value.trim() !== "" && (id !== "email" || /^\S+@\S+\.\S+$/.test(input.value.trim()));
    input.parentElement.classList.toggle("error", !valid);
    if (!valid) ok = false;
  });
  note.className = "form-note" + (ok ? "" : " err");
  note.textContent = ok ? "" : "Please fill in your name, a valid email and a short project description.";
  return ok;
}

function briefText(b) {
  const lines = [`Name: ${b.name}`, `Email: ${b.email}`];
  if (b.company) lines.push(`Company: ${b.company}`);
  if (b.phone) lines.push(`Phone: ${b.phone}`);
  if (b.services.length) lines.push(`Services: ${b.services.join(", ")}`);
  if (b.budget) lines.push(`Budget: ${b.budget}`);
  return [...lines, "", b.message].join("\n");
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!validate()) return;
  const b = collectBrief();
  const subject = encodeURIComponent(`New project brief — ${b.company || b.name}`);
  window.location.href = `mailto:${CONTACT.email}?subject=${subject}&body=${encodeURIComponent(briefText(b))}`;
  note.className = "form-note ok";
  note.textContent = "Thanks! Your email app should open with the brief ready to send.";
});

$("#briefWhatsapp").addEventListener("click", () => {
  if (!validate()) return;
  const text = encodeURIComponent("Hi 30mm Studio, here's my project brief:\n\n" + briefText(collectBrief()));
  window.open(`https://wa.me/${CONTACT.whatsapp}?text=${text}`, "_blank", "noopener");
});
