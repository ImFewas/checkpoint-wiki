/* ==========================================================================
   Tower tab groups — renders "organized by realm" and "organized by
   category" tab cards from a flat TOWER_DATA array. Shared across every
   ToH difficulty page.
   ========================================================================== */

const ICON_PALETTE = ["■", "◆", "●", "▲", "✦", "◈", "▣", "❖", "✚", "✧", "⬡", "✱", "❋", "◐", "▰"];

function iconFor(label) {
  let h = 0;
  for (let i = 0; i < label.length; i++) h = (h * 31 + label.charCodeAt(i)) >>> 0;
  return ICON_PALETTE[h % ICON_PALETTE.length];
}

const CATEGORY_ORDER = ["Canon", "Non-Canon", "Monthly", "Event", "Classic", "Removed"];
const CATEGORY_LABEL = {
  "Canon": "Canon Towers",
  "Non-Canon": "Non-Canon Towers",
  "Monthly": "Monthly Towers",
  "Event": "Event Towers",
  "Classic": "Classic Towers",
  "Removed": "Removed Towers"
};

function slug(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function towerLi(t) {
  const icon = iconFor(t.group1);
  const rating = t.ratingDisplay || "—";
  return `<li>
    <span class="r-icon">${icon}</span>
    <span class="t-abbr">${t.abbr}</span>
    <span class="t-name">— ${t.name}</span>
    <span class="t-sub" style="color:var(--accent);">${t.sub}</span>
    <span class="t-rating">(${rating})</span>
    <span class="r-icon">${icon}</span>
  </li>`;
}

function sortKey(t) {
  // towers with a numeric rating sort by it; unrated ones fall back to
  // their original list order so the tab still reads top-to-bottom sensibly
  return (typeof t.rating === "number") ? t.rating : (1000 + t.order);
}

function renderTowerTabs(mountId, data, opts) {
  const mount = document.getElementById(mountId);
  if (!mount) return;
  const tierName = opts.tierName;
  const realmLabel = opts.realmLabel || "Organized by Realm";

  // ---- Group 1: by realm / verification ----
  const realms = [];
  data.forEach(t => { if (!realms.includes(t.group1)) realms.push(t.group1); });

  let realmTabsHtml = `<div class="tabrow" role="tablist">` +
    realms.map((r, i) => `<button class="tabbtn${i === 0 ? " active" : ""}" data-panel="realm-${slug(r)}">${r}</button>`).join("") +
    `</div>`;
  let realmPanelsHtml = realms.map((r, i) => {
    const items = data.filter(t => t.group1 === r).sort((a, b) => sortKey(a) - sortKey(b));
    return `<div class="tabpanel${i === 0 ? " active" : ""}" id="realm-${slug(r)}">
      <p class="tabpanel-title">${iconFor(r)} ${r} ${iconFor(r)}</p>
      <ul class="tower-list">${items.map(towerLi).join("")}</ul>
    </div>`;
  }).join("");

  // ---- Group 2: by category ----
  let catTabsHtml = `<div class="tabrow" role="tablist">` +
    CATEGORY_ORDER.map((c, i) => `<button class="tabbtn${i === 0 ? " active" : ""}" data-panel="cat-${slug(c)}">${CATEGORY_LABEL[c]}</button>`).join("") +
    `</div>`;
  let catPanelsHtml = CATEGORY_ORDER.map((c, i) => {
    const items = data.filter(t => t.category === c).sort((a, b) => sortKey(a) - sortKey(b));
    const body = items.length
      ? `<ul class="tower-list">${items.map(towerLi).join("")}</ul>`
      : `<p class="empty-note">No ${tierName} towers tracked in this category yet.</p>`;
    return `<div class="tabpanel${i === 0 ? " active" : ""}" id="cat-${slug(c)}">
      <p class="tabpanel-title">${CATEGORY_LABEL[c]}</p>
      ${body}
    </div>`;
  }).join("");

  const catGroupHtml = opts.hideDifficultyChartTab ? "" : `
    <div class="tabgroup">
      <div class="tabgroup-head">Towers in this difficulty <span class="tag">organized by position in the Difficulty Chart</span></div>
      ${catTabsHtml}
      ${catPanelsHtml}
    </div>
  `;

  mount.innerHTML = `
    <div class="tabgroup">
      <div class="tabgroup-head">Towers in this difficulty <span class="tag">${realmLabel}</span></div>
      ${realmTabsHtml}
      ${realmPanelsHtml}
    </div>
    ${catGroupHtml}
  `;

  mount.querySelectorAll(".tabgroup").forEach(group => {
    group.querySelectorAll(".tabbtn").forEach(btn => {
      btn.addEventListener("click", () => {
        group.querySelectorAll(".tabbtn").forEach(b => b.classList.remove("active"));
        group.querySelectorAll(".tabpanel").forEach(p => p.classList.remove("active"));
        btn.classList.add("active");
        group.querySelector("#" + CSS.escape(btn.dataset.panel)).classList.add("active");
      });
    });
  });
}
