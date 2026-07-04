const TRACKING_START = "2026-07-04";
const COLORS = {
  green: "var(--green)",
  orange: "var(--orange)",
  red: "var(--red)",
};
const VOTE_KEYS = ["green", "orange", "red"];

function normaliseVote(value) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

function formatDate(dateString) {
  if (!dateString) return "—";
  const [year, month, day] = dateString.split("-");
  if (!year || !month || !day) return dateString;
  return `${day}/${month}/${year}`;
}

function computeStats(entries, personKey) {
  const counts = { green: 0, orange: 0, red: 0 };
  let total = 0;

  entries.forEach((entry) => {
    const vote = normaliseVote(entry[personKey]);
    if (VOTE_KEYS.includes(vote)) {
      counts[vote] += 1;
      total += 1;
    }
  });

  const percentages = Object.fromEntries(
    VOTE_KEYS.map((vote) => [vote, total ? (counts[vote] / total) * 100 : 0])
  );

  return { counts, percentages, total };
}

function buildGradient(percentages) {
  const segments = [];
  let cursor = 0;

  VOTE_KEYS.forEach((vote) => {
    const slice = percentages[vote] * 3.6;
    if (slice <= 0) return;
    const nextCursor = cursor + slice;
    segments.push(`${COLORS[vote]} ${cursor}deg ${nextCursor}deg`);
    cursor = nextCursor;
  });

  return segments.length
    ? `conic-gradient(${segments.join(", ")})`
    : "conic-gradient(var(--empty) 0deg 360deg)";
}

function renderLegend(personKey, stats) {
  const legend = document.getElementById(`legend-${personKey}`);
  legend.innerHTML = "";

  VOTE_KEYS.forEach((vote) => {
    const item = document.createElement("li");
    item.innerHTML = `
      <div class="legend-main">
        <span class="swatch" style="background:${COLORS[vote]}"></span>
        <div>
          <strong>${vote.charAt(0).toUpperCase() + vote.slice(1)}</strong>
          <span class="legend-label">${stats.counts[vote]} vote${stats.counts[vote] === 1 ? "" : "s"}</span>
        </div>
      </div>
      <span class="legend-value">${stats.percentages[vote].toFixed(1)}%</span>
    `;
    legend.appendChild(item);
  });

  if (!stats.total) {
    const note = document.createElement("p");
    note.className = "empty-note";
    note.textContent = "No votes recorded yet.";
    legend.appendChild(note);
  }
}

function renderTotals(personKey, stats) {
  const totalsGrid = document.getElementById(`totals-${personKey}`);
  totalsGrid.innerHTML = "";

  const boxes = [
    ["Green", stats.counts.green],
    ["Orange", stats.counts.orange],
    ["Red", stats.counts.red],
    ["Total", stats.total],
  ];

  boxes.forEach(([label, value]) => {
    const box = document.createElement("div");
    box.className = "total-box";
    box.innerHTML = `<span class="total-label">${label}</span><strong>${value}</strong>`;
    totalsGrid.appendChild(box);
  });
}

function renderPerson(personKey, stats) {
  const chart = document.getElementById(`chart-${personKey}`);
  chart.style.background = buildGradient(stats.percentages);
  document.getElementById(`total-${personKey}`).textContent = stats.total;
  renderLegend(personKey, stats);
  renderTotals(personKey, stats);
}

async function loadDashboard() {
  try {
    const response = await fetch(`votes.json?v=${Date.now()}`);
    if (!response.ok) {
      throw new Error(`Unable to load votes.json (${response.status})`);
    }

    const data = await response.json();
    const trackingStart = [TRACKING_START, data.trackingStart]
      .filter(Boolean)
      .sort()
      .slice(-1)[0];
    const filteredEntries = (data.entries || [])
      .filter((entry) => entry.date && entry.date >= trackingStart)
      .sort((a, b) => a.date.localeCompare(b.date));

    const formattedTrackingStart = formatDate(trackingStart);
    document.getElementById("tracking-start").textContent = formattedTrackingStart;
    document.getElementById("tracking-start-inline").textContent = formattedTrackingStart;
    document.querySelectorAll("[data-tracking-label]").forEach((node) => {
      node.textContent = `Since ${formattedTrackingStart}`;
    });
    document.querySelectorAll("[data-totals-heading]").forEach((node) => {
      node.textContent = `Votes since ${formattedTrackingStart}`;
    });
    document.getElementById("last-updated").textContent = filteredEntries.length
      ? formatDate(filteredEntries[filteredEntries.length - 1].date)
      : "—";

    const miraStats = computeStats(filteredEntries, "mira");
    const gianfrancoStats = computeStats(filteredEntries, "gianfranco");

    renderPerson("mira", miraStats);
    renderPerson("gianfranco", gianfrancoStats);
  } catch (error) {
    console.error(error);
    document.getElementById("dashboard-cards").innerHTML = `
      <article class="vote-card">
        <h2>Could not load vote data</h2>
        <p class="hero-copy">${error.message}</p>
      </article>
    `;
  }
}

loadDashboard();
