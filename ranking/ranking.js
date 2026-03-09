// ── Leaderboard del club — ranking.html ────────────────────────────────────

// Lista de participantes: agrega o modifica entradas aquí.
// El sistema los ordenará automáticamente de mayor a menor puntuación.
let participants = [
    { name: "Julian Collado",   pts: 980 },
    { name: "Alejandro Lugo",   pts: 850 },
    { name: "Obet Perez",       pts: 720 },
    { name: "Federico Caldera", pts: 610 },
    { name: "Eric Rosales",     pts: 540 },
    { name: "Alan Arrieta",     pts: 430 },
];

const medals        = ["🥇", "🥈", "🥉"];
const podiumAccents = ["#c8a96e", "#6eb5c8", "#c86e9a"];

// Devuelve los participantes ordenados de mayor a menor puntuación
function sorted() { return [...participants].sort((a, b) => b.pts - a.pts); }

// Puntuación máxima (para calcular porcentaje de barra)
function maxPts() { return sorted()[0]?.pts || 1; }

// Porcentaje de la barra de progreso
function pct(pts) { return Math.round((pts / maxPts()) * 100); }

// Renderiza podio + tabla
function render() {
    const data = sorted();
    renderPodium(data.slice(0, 3));
    renderTable(data.slice(3));
}

// Renderiza las 3 tarjetas del podio (Top 1, 2 y 3)
function renderPodium(top) {
    const podium = document.getElementById("podium");
    podium.innerHTML = "";
    if (top.length === 0) {
        podium.innerHTML = '<p class="empty-state" style="width:100%">Aún no hay participantes.</p>';
        return;
    }
    const visualOrder = [1, 0, 2]; // 2.º · 1.º · 3.º (podio visual)
    visualOrder.forEach(i => {
        if (!top[i]) return;
        const p    = top[i];
        const rank = i + 1;
        const card = document.createElement("div");
        card.className = `podium-card rank-${rank}`;
        card.innerHTML = `
            <div class="podium-medal">${medals[i]}</div>
            <div class="podium-pos">#${rank}</div>
            <div class="podium-name">${escHtml(p.name)}</div>
            <div class="podium-pts">${p.pts} <span>pts</span></div>
            <div class="pts-bar-wrap"><div class="pts-bar" data-pct="${pct(p.pts)}"></div></div>
        `;
        podium.appendChild(card);
    });
    animateBars();
}

// Renderiza la tabla para los participantes a partir del 4.º lugar
function renderTable(rest) {
    const wrap = document.getElementById("table-wrap");
    if (rest.length === 0) { wrap.innerHTML = ""; return; }
    const rows = rest.map((p, i) => `
        <tr>
            <td class="rank-num">#${i + 4}</td>
            <td class="player-name">${escHtml(p.name)}</td>
            <td class="bar-cell">
                <div class="table-bar-wrap"><div class="table-bar" data-pct="${pct(p.pts)}"></div></div>
            </td>
            <td class="pts-value">${p.pts} pts</td>
        </tr>
    `).join("");
    wrap.innerHTML = `
        <table class="ranking-table">
            <thead><tr><th>#</th><th>Participante</th><th>Progreso</th><th style="text-align:right">Puntos</th></tr></thead>
            <tbody>${rows}</tbody>
        </table>
    `;
    animateBars();
}

// Anima las barras de progreso con doble requestAnimationFrame
function animateBars() {
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            document.querySelectorAll(".pts-bar, .table-bar").forEach(bar => {
                bar.style.width = bar.dataset.pct + "%";
            });
        });
    });
}

// Escapa caracteres HTML para prevenir XSS
function escHtml(str) {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

document.addEventListener("DOMContentLoaded", () => { render(); });
