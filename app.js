const REVIEWERS = ["Kacey", "Matt", "Travis", "Greg"];
const EXPERIENCES = [
  "IMAX",
  "IMAX Laser",
  "IMAX 70mm",
  "IMAX 15/70",
  "Dolby Cinema",
  "Dolby Atmos",
  "4DX",
  "ScreenX",
  "D-BOX",
  "RPX",
  "Cinemark XD",
  "AMC Prime",
  "Regal Premium",
  "35mm",
  "70mm",
  "3D",
  "Laser Projection",
  "Standard",
  "Drive-In"
];

const DEMO = [
  {id:1, reviewer:"Matt", experience:"IMAX 70mm", movie:"Oppenheimer", theater:"AMC — 70mm IMAX", date:"2026-08-24", score:98, comment:"The giant screen and 70mm presentation were absolutely unreal."},
  {id:2, reviewer:"Matt", experience:"Dolby Cinema", movie:"Dune: Part Two", theater:"AMC Dolby Cinema", date:"2026-08-09", score:96, comment:"The sound and contrast made every frame feel enormous."},
  {id:3, reviewer:"Matt", experience:"IMAX Laser", movie:"Interstellar", theater:"IMAX", date:"2026-08-13", score:94, comment:"Huge image, huge sound, huge experience."},
  {id:4, reviewer:"Kacey", experience:"Dolby Cinema", movie:"The Batman", theater:"AMC Dolby Cinema", date:"2026-08-18", score:92, comment:"The blacks, bass and seats were fantastic."},
  {id:5, reviewer:"Kacey", experience:"4DX", movie:"Twisters", theater:"4DX", date:"2026-08-11", score:86, comment:"Ridiculously fun. The seats moving around made this one memorable."},
  {id:6, reviewer:"Travis", experience:"IMAX", movie:"Mission: Impossible", theater:"IMAX", date:"2026-08-05", score:90, comment:"Great scale and sound without feeling gimmicky."},
  {id:7, reviewer:"Greg", experience:"70mm", movie:"The Hateful Eight", theater:"70mm Film", date:"2026-07-28", score:97, comment:"Film projection just has a texture that digital cannot quite reproduce."},
  {id:8, reviewer:"Greg", experience:"Standard", movie:"Superman", theater:"Local Cinema", date:"2026-07-20", score:78, comment:"Solid movie night, but nothing especially premium."}
];

let ratings = JSON.parse(localStorage.getItem("movieRatings") || "null") || DEMO;
let selectedExperience = "all";

const $ = id => document.getElementById(id);
const escapeHTML = value => String(value ?? "").replace(/[&<>"']/g, c => ({
  "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
}[c]));

function save() {
  localStorage.setItem("movieRatings", JSON.stringify(ratings));
}

function formatDate(date) {
  if (!date) return "";
  const d = new Date(date + "T12:00:00");
  return d.toLocaleDateString(undefined, {year:"numeric", month:"short", day:"2-digit"});
}

function populateSelectors() {
  $("reviewer").innerHTML = REVIEWERS.map(r => `<option>${r}</option>`).join("");
  const opts = EXPERIENCES.map(e => `<option>${e}</option>`).join("");
  $("experience").innerHTML = opts;
  $("experienceFilter").innerHTML =
    `<option value="all">All experiences</option>` + opts;
  $("experienceChips").innerHTML = EXPERIENCES.map(e =>
    `<button class="chip" data-experience="${escapeHTML(e)}">${escapeHTML(e)}</button>`
  ).join("");
}

function filteredRatings() {
  const query = $("searchInput").value.trim().toLowerCase();
  return ratings.filter(r => {
    const matchesExperience = selectedExperience === "all" || r.experience === selectedExperience;
    const haystack = [r.movie, r.experience, r.theater, r.reviewer, r.comment].join(" ").toLowerCase();
    return matchesExperience && (!query || haystack.includes(query));
  });
}

function renderStats() {
  const all = ratings;
  $("totalRatings").textContent = all.length;
  if (!all.length) {
    $("highestScore").textContent = "—";
    $("highestEntry").textContent = "No ratings yet";
    return;
  }
  const high = [...all].sort((a,b) => b.score - a.score)[0];
  $("highestScore").textContent = high.score;
  $("highestEntry").textContent = `${high.movie} — ${high.experience}`;
}

function renderReviewers() {
  const visible = filteredRatings();
  $("reviewerList").innerHTML = REVIEWERS.map(reviewer => {
    const list = visible
      .filter(r => r.reviewer === reviewer)
      .sort((a,b) => b.date.localeCompare(a.date));
    const totalForReviewer = ratings.filter(r => r.reviewer === reviewer).length;
    return `
      <article class="reviewer-card" data-reviewer="${reviewer}">
        <button class="reviewer-header" aria-expanded="false">
          <span class="reviewer-name">${escapeHTML(reviewer)} <span class="count">${totalForReviewer}</span></span>
          <span class="chevron">▼</span>
        </button>
        <div class="review-list">
          ${list.length ? list.map(r => `
            <div class="review">
              <div class="review-title">${escapeHTML(r.movie)} — <strong>${escapeHTML(r.experience)}</strong></div>
              <div class="review-meta">${formatDate(r.date)}${r.theater ? " • " + escapeHTML(r.theater) : ""}</div>
              ${r.comment ? `<div class="review-comment">"${escapeHTML(r.comment)}"</div>` : ""}
              <div class="score">${r.score}</div>
            </div>
          `).join("") : `<div class="empty">No matching ratings for ${escapeHTML(reviewer)}.</div>`}
        </div>
      </article>
    `;
  }).join("");

  document.querySelectorAll(".reviewer-header").forEach(btn => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".reviewer-card");
      const open = card.classList.toggle("open");
      btn.setAttribute("aria-expanded", open);
    });
  });
}

function render() {
  renderStats();
  renderReviewers();
  document.querySelectorAll(".chip").forEach(chip => {
    chip.classList.toggle("active", chip.dataset.experience === selectedExperience);
  });
}

$("ratingForm").addEventListener("submit", e => {
  e.preventDefault();
  const score = Number($("score").value);
  if (score < 1 || score > 100) return alert("Score must be between 1 and 100.");

  ratings.push({
    id: Date.now(),
    reviewer: $("reviewer").value,
    experience: $("experience").value,
    movie: $("movie").value.trim(),
    theater: $("theater").value.trim(),
    date: $("date").value,
    score,
    comment: $("comment").value.trim()
  });

  save();
  e.target.reset();
  $("date").value = new Date().toISOString().slice(0,10);
  render();
  location.hash = "ratings";
});

$("searchInput").addEventListener("input", render);

$("experienceFilter").addEventListener("change", e => {
  selectedExperience = e.target.value;
  render();
});

$("experienceChips").addEventListener("click", e => {
  const chip = e.target.closest(".chip");
  if (!chip) return;
  selectedExperience = chip.dataset.experience;
  $("experienceFilter").value = selectedExperience;
  render();
});

$("menuButton").addEventListener("click", () => {
  const menu = $("mobileMenu");
  const open = menu.classList.toggle("open");
  $("menuButton").setAttribute("aria-expanded", open);
  menu.setAttribute("aria-hidden", !open);
});

document.querySelectorAll(".mobile-menu a").forEach(a => {
  a.addEventListener("click", () => {
    $("mobileMenu").classList.remove("open");
    $("menuButton").setAttribute("aria-expanded", "false");
  });
});

$("resetButton").addEventListener("click", () => {
  if (!confirm("Reset the site back to the demo ratings?")) return;
  ratings = [...DEMO];
  save();
  render();
});

populateSelectors();
$("date").value = new Date().toISOString().slice(0,10);
render();
