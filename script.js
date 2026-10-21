/* =========================================================
   30mm Studio interactions
   ========================================================= */

// Business contact details, update these in one place
const CONTACT = {
  email: "30mmstudio09@gmail.com",
  whatsapp: "918197549609", // country code + number, digits only
};

// Portfolio items. Set `youtube` to a YouTube video ID to show its thumbnail and play it in the modal.
const PROJECTS = [
  { title: "XLR/USB Dynamic Microphone", client: "MAONO", cat: "collab", label: "Brand Collab", youtube: "1lbpZiuJzy8", hue: 356 },
  { title: "LM01 RGB Flashlight", client: "ULANZI", cat: "collab", label: "Brand Collab", youtube: "WrjbeJRFvTc", hue: 22 },
  { title: "EI-7010A Tripod", client: "E-Image", cat: "collab", label: "Brand Collab", youtube: "tl1F0aAKXYY", hue: 200 },
  { title: "FM02 Filmog", client: "ULANZI", cat: "collab", label: "Brand Collab", youtube: "MBNIJCKUMvQ", hue: 280 },
  { title: "Ntorq 150cc Scooter", client: "TVS", cat: "collab", label: "Brand Collab", youtube: "bmkZkdGIqYc", hue: 10 },
  { title: "Anmol Garg", client: "", cat: "reels", label: "Reels & Shorts", youtube: "s9NH-iMiIJQ", hue: 350, tall: true },
  { title: "Reel 02", client: "30mm Studio", cat: "reels", label: "Reels & Shorts", youtube: "V-wRv02olPQ", hue: 10, tall: true },
  { title: "AI UGC 01", client: "30mm Studio", cat: "aiugc", label: "AI UGC", youtube: "lOKzthQCX3M", hue: 280 },
  { title: "AI UGC 02", client: "30mm Studio", cat: "aiugc", label: "AI UGC", youtube: "L9FkbrXl1Ws", hue: 160 },
  { title: "AI UGC 03", client: "30mm Studio", cat: "aiugc", label: "AI UGC", youtube: "foid0NQ2hQs", hue: 230 },
];

// Recent work carousel: the real videos, reels first
const REELS = ["reels", "aiugc", "collab"].flatMap((c) => PROJECTS.filter((p) => p.cat === c));

// "Client: Title", or just the title when there is no client
const fullName = (p) => (p.client ? `${p.client}: ${p.title}` : p.title);

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
      ${p.youtube ? `<img class="card__yt" src="https://i.ytimg.com/vi/${p.youtube}/hqdefault.jpg" alt="" loading="lazy" onerror="this.remove()" />` : ""}
      <div class="card__overlay"><span><span class="play-ico"></span></span></div>
      ${p.dur ? `<span class="card__dur">${p.dur}</span>` : ""}
    </div>
    <div class="card__body">
      <span class="tag">${p.label}</span>
      <h3>${p.title}</h3>
      ${p.client ? `<p>${p.client}</p>` : ""}
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

/* ---------- Reel coverflow (endless loop, active reel in front) ---------- */
const track = $("#reelTrack");
const dotsEl = $("#reelDots");
track.innerHTML = REELS.map((r, i) => `
  <article class="reel-card" data-reel="${i}" tabindex="0" role="button" aria-label="${fullName(r)}">
    <div class="thumb" style="${thumbStyle(r.hue)}"></div>
    <img class="card__yt" src="https://i.ytimg.com/vi/${r.youtube}/hqdefault.jpg" alt="" loading="lazy" onerror="this.remove()" />
    <span class="reel-card__play"><span class="play-ico"></span></span>
    <div class="reel-card__info">
      <h3>${r.title}</h3>
      <p>${r.client ? `${r.client} · ` : ""}${r.label}</p>
    </div>
  </article>`).join("");
dotsEl.innerHTML = REELS.map((r, i) => `<button class="coverflow__dot" role="tab" aria-label="${fullName(r)}" data-go="${i}"></button>`).join("");

const reelCards = $$(".reel-card", track);
const dots = $$(".coverflow__dot", dotsEl);
const total = REELS.length;
let active = 0;
const lastOffset = new Array(total).fill(null);

// Shortest signed distance from the active reel, so the loop has no end
function offsetOf(i) {
  let d = (i - active) % total;
  if (d > total / 2) d -= total;
  if (d < -total / 2) d += total;
  return d;
}

function layout() {
  const w = reelCards[0].offsetWidth;
  const narrow = innerWidth < 640;
  const gap = w * (narrow ? 0.62 : 0.95);
  reelCards.forEach((card, i) => {
    const d = offsetOf(i);
    const a = Math.abs(d);
    const visible = a <= (narrow ? 2 : 3);
    // A reel wrapping from one end to the other jumps instead of sliding across
    card.classList.toggle("no-anim", lastOffset[i] !== null && Math.abs(d - lastOffset[i]) > 1);
    lastOffset[i] = d;
    const x = Math.sign(d) * (a === 0 ? 0 : gap * (1 + (a - 1) * 0.72));
    card.style.transform = `translateX(calc(-50% + ${x}px)) translateZ(${-a * 140}px) rotateY(${-d * 22}deg) scale(${1 - a * 0.1})`;
    card.style.zIndex = 100 - a;
    card.style.opacity = visible ? 1 - a * 0.18 : 0;
    card.style.pointerEvents = visible ? "" : "none";
    card.classList.toggle("is-active", d === 0);
    card.setAttribute("aria-label", `${fullName(REELS[i])}${d === 0 ? " (play)" : ""}`);
  });
  dots.forEach((dot, i) => { dot.classList.toggle("active", i === active); dot.setAttribute("aria-selected", i === active); });
  requestAnimationFrame(() => reelCards.forEach((c) => c.classList.remove("no-anim")));
}
function goTo(i) { active = (i + total) % total; layout(); }
const slide = (dir) => goTo(active + dir);

$("#reelPrev").addEventListener("click", () => { slide(-1); startAuto(); });
$("#reelNext").addEventListener("click", () => { slide(1); startAuto(); });
dots.forEach((dot) => dot.addEventListener("click", () => { goTo(+dot.dataset.go); startAuto(); }));
window.addEventListener("resize", layout);
layout();

// Auto-advance, paused while the visitor hovers or interacts
const coverflow = $("#coverflow");
let autoTimer = null;
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
function stopAuto() { clearInterval(autoTimer); }
function startAuto() {
  stopAuto();
  // Stay paused while a video is playing in the modal
  if (!reduceMotion && document.getElementById("modal").hidden) autoTimer = setInterval(() => slide(1), 3000);
}
coverflow.addEventListener("mouseenter", stopAuto);
coverflow.addEventListener("mouseleave", startAuto);
coverflow.addEventListener("focusin", stopAuto);
coverflow.addEventListener("focusout", startAuto);
document.addEventListener("visibilitychange", () => (document.hidden ? stopAuto() : startAuto()));
startAuto();

// Swipe / drag to move one reel at a time
let drag = null;
let dragged = false;
coverflow.addEventListener("pointerdown", (e) => { drag = { x: e.clientX }; dragged = false; stopAuto(); });
window.addEventListener("pointerup", (e) => {
  if (!drag) return;
  const dx = e.clientX - drag.x;
  drag = null;
  if (Math.abs(dx) > 40) { dragged = true; slide(dx < 0 ? 1 : -1); }
  if (!coverflow.matches(":hover")) startAuto();
});
coverflow.addEventListener("click", (e) => { if (dragged) { e.stopPropagation(); dragged = false; } }, true);
coverflow.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") { slide(1); reelCards[active].focus(); }
  if (e.key === "ArrowLeft") { slide(-1); reelCards[active].focus(); }
});

/* ---------- Video modal ---------- */
const modal = $("#modal");
const screen = $(".modal__screen", modal);
const placeholder = screen.innerHTML;
let lastFocus = null;

function openModal(title, video, youtube) {
  lastFocus = document.activeElement;
  $("#modalTitle").textContent = title || "";
  if (youtube) video = `https://www.youtube-nocookie.com/embed/${youtube}?autoplay=1&rel=0&playsinline=1`;
  screen.innerHTML = video
    ? `<iframe src="${video}" allow="autoplay; encrypted-media; fullscreen; picture-in-picture" allowfullscreen title="${title}"></iframe>`
    : placeholder;
  // Direct link as a fallback where embedded players are blocked
  const link = $("#modalLink");
  link.hidden = !youtube;
  if (youtube) link.href = `https://youtu.be/${youtube}`;
  modal.hidden = false;
  stopAuto();
  document.body.classList.add("no-scroll");
  $(".modal__close", modal).focus();
}
function closeModal() {
  modal.hidden = true;
  screen.innerHTML = placeholder;
  document.body.classList.remove("no-scroll");
  lastFocus && lastFocus.focus();
  if (!coverflow.matches(":hover")) startAuto();
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
    openModal(fullName(p), p.video, p.youtube);
  } else if (el.classList.contains("reel-card")) {
    const i = +el.dataset.reel;
    if (i !== active) { goTo(i); return; } // side reels come to the front first
    const r = REELS[i];
    openModal(fullName(r), r.video, r.youtube);
  }
}
document.addEventListener("click", (e) => {
  const el = e.target.closest(".card, .reel-card");
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

// Pressing Enter in the form sends the brief through WhatsApp
form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (validate()) waLink.click();
});

// Keep the WhatsApp link's prefilled text in sync with the form
const waLink = $("#briefWhatsapp");
function updateWhatsapp() {
  const text = encodeURIComponent("Hi 30mm Studio, here's my project brief:\n\n" + briefText(collectBrief()));
  waLink.href = `https://wa.me/${CONTACT.whatsapp}?text=${text}`;
}
form.addEventListener("input", () => {
  updateWhatsapp();
  if (note.classList.contains("err")) validate(); // clear the error once fixed
});
updateWhatsapp();
waLink.addEventListener("click", (e) => { if (!validate()) e.preventDefault(); });
