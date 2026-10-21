/* =========================================================
   30mm Studio interactions
   ========================================================= */

// Business contact details, update these in one place
const CONTACT = {
  email: "hello@30mmstudio.com",
  whatsapp: "919999999999", // country code + number, digits only
};

// Portfolio items. Add a `video` URL (YouTube/Vimeo embed) to play it in the modal.
const PROJECTS = [
  { title: "Launch Film", client: "Velora Watches", cat: "brand", label: "Brand Ad", dur: "01:00", hue: 356 },
  { title: "Morning Ritual", client: "Brewhaus Coffee", cat: "product", label: "Product Shoot", dur: "00:45", hue: 22 },
  { title: "Studio Setup Tour", client: "Tech Unboxed", cat: "youtube", label: "YouTube", dur: "12:48", hue: 210 },
  { title: "Drop 04", client: "Urban Threads", cat: "reels", label: "Reels & Shorts", dur: "00:30", hue: 340, tall: true },
  { title: "Stronger Every Day", client: "Nova Fitness", cat: "brand", label: "Brand Ad", dur: "00:40", hue: 0 },
  { title: "Serum Macro Series", client: "Aura Skincare", cat: "product", label: "Product Shoot", dur: "00:20", hue: 30 },
  { title: "Season 2 Episode", client: "Kitchen Diaries", cat: "youtube", label: "YouTube", dur: "18:05", hue: 15 },
  { title: "15s Reel Pack", client: "Café Lumen", cat: "reels", label: "Reels & Shorts", dur: "00:15", hue: 45, tall: true },
  { title: "Brand Story", client: "Monarch Realty", cat: "brand", label: "Brand Ad", dur: "02:10", hue: 220 },
  { title: "Headphones Hero", client: "Pulse Audio", cat: "product", label: "Product Shoot", dur: "00:35", hue: 260 },
  { title: "Himalaya Travel Vlog", client: "Wanderlog", cat: "youtube", label: "YouTube", dur: "22:31", hue: 190 },
  { title: "Sneaker Shorts", client: "Sole Society", cat: "reels", label: "Reels & Shorts", dur: "00:25", hue: 350, tall: true },
];

// Recent work reels (vertical carousel). Add a `video` embed URL to play it in the modal.
const REELS = [
  { title: "Launch Film", client: "Velora Watches", views: "1.2M", dur: "00:30", hue: 356 },
  { title: "Morning Ritual", client: "Brewhaus Coffee", views: "860K", dur: "00:20", hue: 22 },
  { title: "Drop 04", client: "Urban Threads", views: "3.2M", dur: "00:15", hue: 340 },
  { title: "Stronger Every Day", client: "Nova Fitness", views: "940K", dur: "00:25", hue: 0 },
  { title: "Serum Macro Series", client: "Aura Skincare", views: "510K", dur: "00:18", hue: 30 },
  { title: "15s Reel Pack", client: "Café Lumen", views: "720K", dur: "00:15", hue: 45 },
  { title: "Headphones Hero", client: "Pulse Audio", views: "1.8M", dur: "00:22", hue: 260 },
  { title: "Sneaker Shorts", client: "Sole Society", views: "2.4M", dur: "00:28", hue: 350 },
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

/* ---------- Reel carousel ---------- */
const track = $("#reelTrack");
track.innerHTML = REELS.map((r, i) => `
  <article class="reel-card" data-reel="${i}" tabindex="0" role="button" aria-label="Play ${r.client}: ${r.title}">
    <div class="thumb" style="${thumbStyle(r.hue)}"></div>
    <span class="reel-card__dur">${r.dur}</span>
    <span class="reel-card__play"><span class="play-ico"></span></span>
    <div class="reel-card__info">
      <h3>${r.title}</h3>
      <p>${r.client} · ${r.views} views</p>
    </div>
  </article>`).join("");

const reelStep = () => track.querySelector(".reel-card").offsetWidth + 16;
const atEnd = () => track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
function slide(dir) {
  if (dir > 0 && atEnd()) track.scrollTo({ left: 0, behavior: "smooth" });
  else track.scrollBy({ left: dir * reelStep(), behavior: "smooth" });
}
$("#reelPrev").addEventListener("click", () => slide(-1));
$("#reelNext").addEventListener("click", () => slide(1));
track.addEventListener("scroll", () => {
  const max = track.scrollWidth - track.clientWidth;
  $("#reelProgress").style.width = (max > 0 ? 20 + 80 * (track.scrollLeft / max) : 100) + "%";
}, { passive: true });

// Auto-advance, paused while the visitor is interacting
let autoTimer = null;
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
function startAuto() { if (!reduceMotion) { stopAuto(); autoTimer = setInterval(() => slide(1), 3500); } }
function stopAuto() { clearInterval(autoTimer); }
["mouseenter", "touchstart", "focusin"].forEach((ev) => track.addEventListener(ev, stopAuto, { passive: true }));
["mouseleave", "focusout"].forEach((ev) => track.addEventListener(ev, startAuto));
startAuto();

// Drag to scroll with a mouse
let drag = null;
track.addEventListener("pointerdown", (e) => {
  if (e.pointerType !== "mouse") return;
  drag = { x: e.clientX, left: track.scrollLeft, moved: false };
  track.classList.add("dragging");
});
window.addEventListener("pointermove", (e) => {
  if (!drag) return;
  const dx = e.clientX - drag.x;
  if (Math.abs(dx) > 5) drag.moved = true;
  track.scrollLeft = drag.left - dx;
});
window.addEventListener("pointerup", () => {
  if (!drag) return;
  track.classList.remove("dragging");
  const moved = drag.moved;
  setTimeout(() => { drag = null; }, 0);
  if (moved) track.scrollTo({ left: Math.round(track.scrollLeft / reelStep()) * reelStep(), behavior: "smooth" });
});
track.addEventListener("click", (e) => { if (drag && drag.moved) { e.stopPropagation(); e.preventDefault(); } }, true);

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
    openModal(`${p.client}: ${p.title}`, p.video);
  } else if (el.classList.contains("reel-card")) {
    const r = REELS[el.dataset.reel];
    openModal(`${r.client}: ${r.title}`, r.video);
  } else {
    openModal(el.dataset.title, el.dataset.video);
  }
}
document.addEventListener("click", (e) => {
  const el = e.target.closest(".play-trigger, .card, .reel-card");
  if (el) activate(el);
});
document.addEventListener("keydown", (e) => {
  if (e.key !== "Enter" && e.key !== " ") return;
  const el = e.target.closest && e.target.closest(".card, .reel-card");
  if (el && el === e.target) { e.preventDefault(); activate(el); }
});

/* ---------- Scroll reveal ---------- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("in"); revealObserver.unobserve(e.target); }
  });
}, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
$$(".reveal").forEach((el) => { if (!el.closest(".hero")) revealObserver.observe(el); });

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
  const subject = encodeURIComponent(`New project brief: ${b.company || b.name}`);
  window.location.href = `mailto:${CONTACT.email}?subject=${subject}&body=${encodeURIComponent(briefText(b))}`;
  note.className = "form-note ok";
  note.textContent = `Your brief is ready in your email app. If it didn't open, write to us at ${CONTACT.email}.`;
});

// Keep the WhatsApp link's prefilled text in sync with the form
const waLink = $("#briefWhatsapp");
function updateWhatsapp() {
  const text = encodeURIComponent("Hi 30mm Studio, here's my project brief:\n\n" + briefText(collectBrief()));
  waLink.href = `https://wa.me/${CONTACT.whatsapp}?text=${text}`;
}
form.addEventListener("input", updateWhatsapp);
updateWhatsapp();
waLink.addEventListener("click", (e) => { if (!validate()) e.preventDefault(); });
