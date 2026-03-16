/* ========================================
   Dashboard Application
   ======================================== */

// ==========================================
// Sample Data
// ==========================================
const CLIENTS_DATA = [
  { id: 1, name: '佐藤 美咲', initial: '佐', since: '2024-06', visits: 24, spent: 198000, lastVisit: '2026-03-10' },
  { id: 2, name: '鈴木 あかり', initial: '鈴', since: '2025-01', visits: 12, spent: 115200, lastVisit: '2026-03-09' },
  { id: 3, name: '高橋 優子', initial: '高', since: '2024-03', visits: 31, spent: 285600, lastVisit: '2026-03-11' },
  { id: 4, name: '田中 花子', initial: '田', since: '2025-06', visits: 8, spent: 72600, lastVisit: '2026-03-08' },
  { id: 5, name: '渡辺 麻衣', initial: '渡', since: '2024-11', visits: 18, spent: 162000, lastVisit: '2026-03-07' },
  { id: 6, name: '伊藤 さゆり', initial: '伊', since: '2025-02', visits: 10, spent: 88000, lastVisit: '2026-03-11' },
  { id: 7, name: '山本 結衣', initial: '山', since: '2024-08', visits: 20, spent: 176000, lastVisit: '2026-03-06' },
  { id: 8, name: '中村 真理', initial: '中', since: '2025-09', visits: 5, spent: 46200, lastVisit: '2026-03-05' },
  { id: 9, name: '小林 舞', initial: '小', since: '2024-05', visits: 28, spent: 264000, lastVisit: '2026-03-10' },
  { id: 10, name: '加藤 千尋', initial: '加', since: '2025-04', visits: 7, spent: 61600, lastVisit: '2026-03-04' },
  { id: 11, name: '吉田 恵', initial: '吉', since: '2024-09', visits: 16, spent: 140800, lastVisit: '2026-03-09' },
  { id: 12, name: '山田 亜美', initial: '山', since: '2025-07', visits: 4, spent: 35200, lastVisit: '2026-03-03' },
];

const TODAY_SCHEDULE = [
  { time: '10:00', name: '佐藤 美咲', menu: 'カット + カラー', price: '¥13,200', status: 'completed' },
  { time: '11:00', name: '高橋 優子', menu: 'カット', price: '¥6,600', status: 'completed' },
  { time: '12:00', name: null, menu: null, price: null, status: 'empty' },
  { time: '13:00', name: '鈴木 あかり', menu: 'パーマ', price: '¥9,900', status: 'current' },
  { time: '14:00', name: '伊藤 さゆり', menu: 'トリートメント', price: '¥5,500', status: 'confirmed' },
  { time: '15:00', name: null, menu: null, price: null, status: 'empty' },
  { time: '15:30', name: '渡辺 麻衣', menu: 'カット + パーマ', price: '¥14,300', status: 'confirmed' },
  { time: '17:00', name: null, menu: null, price: null, status: 'empty' },
  { time: '18:00', name: '田中 花子', menu: 'カラー', price: '¥8,800', status: 'confirmed' },
  { time: '19:00', name: null, menu: null, price: null, status: 'empty' },
];

const BOOKINGS_DATA = [
  { id: 'B-0312-001', name: '佐藤 美咲', menu: 'カット + カラー', date: '2026-03-12 10:00', price: '¥13,200', status: 'completed' },
  { id: 'B-0312-002', name: '高橋 優子', menu: 'カット', date: '2026-03-12 11:00', price: '¥6,600', status: 'completed' },
  { id: 'B-0312-003', name: '鈴木 あかり', menu: 'パーマ', date: '2026-03-12 13:00', price: '¥9,900', status: 'confirmed' },
  { id: 'B-0312-004', name: '伊藤 さゆり', menu: 'トリートメント', date: '2026-03-12 14:00', price: '¥5,500', status: 'confirmed' },
  { id: 'B-0312-005', name: '渡辺 麻衣', menu: 'カット + パーマ', date: '2026-03-12 15:30', price: '¥14,300', status: 'confirmed' },
  { id: 'B-0312-006', name: '田中 花子', menu: 'カラー', date: '2026-03-12 18:00', price: '¥8,800', status: 'pending' },
  { id: 'B-0311-001', name: '高橋 優子', menu: 'ヘッドスパ', date: '2026-03-11 10:00', price: '¥4,400', status: 'completed' },
  { id: 'B-0311-002', name: '山本 結衣', menu: 'カット', date: '2026-03-11 11:30', price: '¥6,600', status: 'completed' },
  { id: 'B-0311-003', name: '小林 舞', menu: 'カット + カラー', date: '2026-03-11 13:00', price: '¥13,200', status: 'completed' },
  { id: 'B-0311-004', name: '吉田 恵', menu: 'ハイライト', date: '2026-03-11 15:00', price: '¥11,000', status: 'completed' },
  { id: 'B-0310-001', name: '佐藤 美咲', menu: 'トリートメント', date: '2026-03-10 10:00', price: '¥5,500', status: 'completed' },
  { id: 'B-0310-002', name: '加藤 千尋', menu: 'カラー', date: '2026-03-10 14:00', price: '¥8,800', status: 'cancelled' },
  { id: 'B-0313-001', name: '山田 亜美', menu: 'カット + カラー', date: '2026-03-13 10:00', price: '¥13,200', status: 'confirmed' },
  { id: 'B-0313-002', name: '中村 真理', menu: 'パーマ', date: '2026-03-13 13:00', price: '¥9,900', status: 'pending' },
];

const STATUS_LABELS = {
  confirmed: '確定',
  pending: '保留中',
  completed: '完了',
  cancelled: 'キャンセル',
  current: '対応中',
};

// ==========================================
// State
// ==========================================
const dashState = {
  currentSection: 'overview',
  scheduleDate: new Date(),
};

// ==========================================
// DOM Ready
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  initLogin();
});

// ==========================================
// Login
// ==========================================
const CORRECT_PIN = '0000'; // デモ用PIN

function initLogin() {
  const overlay = document.getElementById('loginOverlay');

  // Already authenticated in this session
  if (sessionStorage.getItem('dashboardAuth') === 'true') {
    overlay.classList.add('hidden');
    setTimeout(() => overlay.style.display = 'none', 400);
    initDashboard();
    return;
  }

  const digits = document.querySelectorAll('.pin-digit');
  const errorEl = document.getElementById('loginError');

  // Focus first digit
  digits[0].focus();

  digits.forEach((input, idx) => {
    input.addEventListener('input', (e) => {
      const val = e.target.value;
      if (val && idx < digits.length - 1) {
        digits[idx + 1].focus();
      }

      // Check if all digits filled
      const pin = Array.from(digits).map(d => d.value).join('');
      if (pin.length === 4) {
        if (pin === CORRECT_PIN) {
          sessionStorage.setItem('dashboardAuth', 'true');
          errorEl.textContent = '';
          overlay.classList.add('hidden');
          setTimeout(() => {
            overlay.style.display = 'none';
            initDashboard();
          }, 400);
        } else {
          errorEl.textContent = 'PINコードが正しくありません';
          digits.forEach(d => {
            d.classList.add('error');
            d.value = '';
          });
          digits[0].focus();
          setTimeout(() => digits.forEach(d => d.classList.remove('error')), 600);
        }
      }
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && !input.value && idx > 0) {
        digits[idx - 1].focus();
      }
    });

    // Allow only numbers
    input.addEventListener('keypress', (e) => {
      if (!/[0-9]/.test(e.key)) e.preventDefault();
    });
  });
}

function initDashboard() {
  initSidebar();
  initMobile();
  setPageDate();
  renderOverviewTimeline();
  renderRecentBookings();
  renderBookingsTable();
  renderSchedule();
  renderClients();
  initCharts();
  initSearch();
  initSiteManage();
}

// ==========================================
// Sidebar Navigation
// ==========================================
function initSidebar() {
  document.querySelectorAll('.nav-item[data-section]').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const section = item.dataset.section;
      switchSection(section);
    });
  });
}

function switchSection(section) {
  dashState.currentSection = section;

  // Update nav
  document.querySelectorAll('.nav-item[data-section]').forEach(i => {
    i.classList.toggle('active', i.dataset.section === section);
  });

  // Update section
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  const sectionEl = document.getElementById(`section${capitalize(section)}`);
  if (sectionEl) sectionEl.classList.add('active');

  // Update title
  const titles = {
    overview: '概要',
    bookings: '予約管理',
    schedule: '本日のスケジュール',
    clients: '顧客管理',
    analytics: '売上分析',
    sitemanage: 'サイト管理',
  };
  document.getElementById('pageTitle').textContent = titles[section] || section;

  // Close mobile sidebar
  document.getElementById('sidebar').classList.remove('open');

  // Redraw charts when section becomes visible
  if (section === 'analytics' || section === 'overview') {
    requestAnimationFrame(() => {
      if (section === 'analytics') {
        drawWeekdayChart();
        drawHourChart();
        drawClientTypeChart();
      } else {
        drawRevenueChart();
        drawMenuChart();
      }
    });
  }
}

function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

// ==========================================
// Mobile
// ==========================================
function initMobile() {
  const menuBtn = document.getElementById('menuBtn');
  const sidebar = document.getElementById('sidebar');

  menuBtn.addEventListener('click', () => {
    sidebar.classList.toggle('open');
  });

  // Close on overlay click
  document.addEventListener('click', (e) => {
    if (sidebar.classList.contains('open') &&
        !sidebar.contains(e.target) &&
        !menuBtn.contains(e.target)) {
      sidebar.classList.remove('open');
    }
  });
}

// ==========================================
// Page Date
// ==========================================
function setPageDate() {
  const now = new Date();
  const opts = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
  document.getElementById('pageDate').textContent = now.toLocaleDateString('ja-JP', opts);
}

// ==========================================
// Overview Timeline
// ==========================================
function renderOverviewTimeline() {
  const container = document.getElementById('overviewTimeline');
  container.innerHTML = '';

  TODAY_SCHEDULE.filter(s => s.status !== 'empty').forEach(item => {
    const div = document.createElement('div');
    div.className = `timeline-item ${item.status}`;
    div.innerHTML = `
      <span class="tl-time">${item.time}</span>
      <div class="tl-content">
        <div class="tl-name">${item.name}</div>
        <div class="tl-menu">${item.menu} — ${item.price}</div>
      </div>
      <span class="tl-status status status-${item.status}">${STATUS_LABELS[item.status] || item.status}</span>
    `;
    container.appendChild(div);
  });

  document.getElementById('todayCount').textContent = TODAY_SCHEDULE.filter(s => s.status !== 'empty').length + '件';
}

// ==========================================
// Recent Bookings
// ==========================================
function renderRecentBookings() {
  const container = document.getElementById('recentBookings');
  container.innerHTML = '';

  BOOKINGS_DATA.slice(0, 6).forEach(b => {
    const div = document.createElement('div');
    div.className = 'recent-item';
    div.innerHTML = `
      <div class="recent-avatar">${b.name.charAt(0)}</div>
      <div class="recent-info">
        <div class="recent-name">${b.name}</div>
        <div class="recent-detail">${b.menu} · ${b.date.split(' ')[1]}</div>
      </div>
      <span class="recent-price">${b.price}</span>
    `;
    container.appendChild(div);
  });
}

// ==========================================
// Bookings Table
// ==========================================
function renderBookingsTable(filter = 'all', search = '') {
  const tbody = document.getElementById('bookingsTableBody');
  tbody.innerHTML = '';

  let data = BOOKINGS_DATA;
  if (filter !== 'all') data = data.filter(b => b.status === filter);
  if (search) {
    const q = search.toLowerCase();
    data = data.filter(b =>
      b.name.toLowerCase().includes(q) ||
      b.menu.toLowerCase().includes(q) ||
      b.id.toLowerCase().includes(q)
    );
  }

  data.forEach(b => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="font-family:monospace;font-size:0.8rem;color:var(--color-text-muted)">${b.id}</td>
      <td class="td-name">${b.name}</td>
      <td>${b.menu}</td>
      <td>${b.date}</td>
      <td class="td-price">${b.price}</td>
      <td><span class="status status-${b.status}">${STATUS_LABELS[b.status]}</span></td>
      <td><button class="action-btn">詳細</button></td>
    `;
    tbody.appendChild(tr);
  });
}

function initSearch() {
  const searchInput = document.getElementById('bookingSearch');
  const filterSelect = document.getElementById('bookingFilter');

  searchInput.addEventListener('input', () => {
    renderBookingsTable(filterSelect.value, searchInput.value);
  });

  filterSelect.addEventListener('change', () => {
    renderBookingsTable(filterSelect.value, searchInput.value);
  });

  // Client search
  const clientSearch = document.getElementById('clientSearch');
  clientSearch.addEventListener('input', () => {
    renderClients(clientSearch.value);
  });
}

// ==========================================
// Schedule
// ==========================================
function renderSchedule() {
  const grid = document.getElementById('scheduleGrid');
  const dateEl = document.getElementById('schDate');

  const d = dashState.scheduleDate;
  const opts = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
  dateEl.textContent = d.toLocaleDateString('ja-JP', opts);

  grid.innerHTML = '';

  const times = ['10:00','10:30','11:00','11:30','12:00','12:30','13:00','13:30','14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30','18:00','18:30','19:00'];

  times.forEach(time => {
    const booking = TODAY_SCHEDULE.find(s => s.time === time && s.status !== 'empty');
    const row = document.createElement('div');
    row.className = 'sch-row';
    row.innerHTML = `
      <div class="sch-time">${time}</div>
      <div class="sch-slot">
        ${booking ? `
          <div class="sch-booking">
            <div class="sch-booking-name">${booking.name}</div>
            <div class="sch-booking-menu">${booking.menu} — ${booking.price}</div>
          </div>
          <span class="status status-${booking.status}">${STATUS_LABELS[booking.status]}</span>
        ` : `<span class="sch-empty">空き</span>`}
      </div>
    `;
    grid.appendChild(row);
  });

  // Nav
  document.getElementById('schPrev').onclick = () => {
    dashState.scheduleDate.setDate(dashState.scheduleDate.getDate() - 1);
    renderSchedule();
  };
  document.getElementById('schNext').onclick = () => {
    dashState.scheduleDate.setDate(dashState.scheduleDate.getDate() + 1);
    renderSchedule();
  };
}

// ==========================================
// Clients
// ==========================================
function renderClients(search = '') {
  const grid = document.getElementById('clientsGrid');
  grid.innerHTML = '';

  let data = CLIENTS_DATA;
  if (search) {
    const q = search.toLowerCase();
    data = data.filter(c => c.name.toLowerCase().includes(q));
  }

  data.forEach(c => {
    const card = document.createElement('div');
    card.className = 'client-card';
    card.innerHTML = `
      <div class="client-top">
        <div class="client-avatar">${c.initial}</div>
        <div>
          <div class="client-name">${c.name}</div>
          <div class="client-since">${c.since}〜</div>
        </div>
      </div>
      <div class="client-stats">
        <div class="client-stat">
          <span class="client-stat-value">${c.visits}</span>
          <span class="client-stat-label">来店回数</span>
        </div>
        <div class="client-stat">
          <span class="client-stat-value">¥${(c.spent / 1000).toFixed(0)}k</span>
          <span class="client-stat-label">累計金額</span>
        </div>
        <div class="client-stat">
          <span class="client-stat-value">${c.lastVisit.slice(5)}</span>
          <span class="client-stat-label">最終来店</span>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

// ==========================================
// Charts (Pure Canvas - no library)
// ==========================================
function initCharts() {
  drawRevenueChart();
  drawMenuChart();
  drawWeekdayChart();
  drawHourChart();
  drawClientTypeChart();
}

// --- Revenue Bar Chart ---
function drawRevenueChart() {
  const canvas = document.getElementById('revenueChart');
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;

  const rect = canvas.parentElement.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  canvas.style.width = rect.width + 'px';
  canvas.style.height = rect.height + 'px';
  ctx.scale(dpr, dpr);

  const w = rect.width;
  const h = rect.height;
  const data = [320000, 385000, 410000, 365000, 445000, 487200];
  const labels = ['10月', '11月', '12月', '1月', '2月', '3月'];
  const max = Math.max(...data) * 1.15;

  const pad = { top: 20, right: 20, bottom: 40, left: 60 };
  const chartW = w - pad.left - pad.right;
  const chartH = h - pad.top - pad.bottom;
  const barW = chartW / data.length * 0.5;
  const gap = chartW / data.length;

  // Grid lines
  ctx.strokeStyle = 'rgba(255,255,255,0.04)';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = pad.top + (chartH / 4) * i;
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(w - pad.right, y);
    ctx.stroke();

    // Labels
    ctx.fillStyle = '#555';
    ctx.font = '10px "Noto Sans JP"';
    ctx.textAlign = 'right';
    const val = Math.round(max - (max / 4) * i);
    ctx.fillText('¥' + (val / 10000).toFixed(0) + '万', pad.left - 8, y + 3);
  }

  // Bars
  data.forEach((val, i) => {
    const x = pad.left + gap * i + (gap - barW) / 2;
    const barH = (val / max) * chartH;
    const y = pad.top + chartH - barH;

    // Gradient
    const grad = ctx.createLinearGradient(x, y, x, y + barH);
    grad.addColorStop(0, '#c9a96e');
    grad.addColorStop(1, 'rgba(201,169,110,0.3)');

    ctx.fillStyle = grad;
    roundRect(ctx, x, y, barW, barH, 4);
    ctx.fill();

    // Value on top
    ctx.fillStyle = '#c9a96e';
    ctx.font = '10px "Cormorant Garamond"';
    ctx.textAlign = 'center';
    ctx.fillText('¥' + (val / 10000).toFixed(1) + '万', x + barW / 2, y - 6);

    // X label
    ctx.fillStyle = '#666';
    ctx.font = '11px "Noto Sans JP"';
    ctx.fillText(labels[i], x + barW / 2, h - pad.bottom + 20);
  });
}

// --- Donut Chart ---
function drawMenuChart() {
  const canvas = document.getElementById('menuChart');
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;

  canvas.width = 160 * dpr;
  canvas.height = 160 * dpr;
  canvas.style.width = '160px';
  canvas.style.height = '160px';
  ctx.scale(dpr, dpr);

  const data = [
    { label: 'カット', value: 28, color: '#c9a96e' },
    { label: 'カラー', value: 22, color: '#34d399' },
    { label: 'パーマ', value: 15, color: '#60a5fa' },
    { label: 'トリートメント', value: 18, color: '#fbbf24' },
    { label: 'その他', value: 17, color: '#a78bfa' },
  ];

  const total = data.reduce((s, d) => s + d.value, 0);
  const cx = 80, cy = 80, r = 60, innerR = 40;
  let angle = -Math.PI / 2;

  data.forEach(d => {
    const sliceAngle = (d.value / total) * Math.PI * 2;
    ctx.beginPath();
    ctx.arc(cx, cy, r, angle, angle + sliceAngle);
    ctx.arc(cx, cy, innerR, angle + sliceAngle, angle, true);
    ctx.closePath();
    ctx.fillStyle = d.color;
    ctx.fill();
    angle += sliceAngle;
  });

  // Center text
  ctx.fillStyle = '#f0f0eb';
  ctx.font = '600 18px "Cormorant Garamond"';
  ctx.textAlign = 'center';
  ctx.fillText(total, cx, cy + 2);
  ctx.fillStyle = '#666';
  ctx.font = '9px "Noto Sans JP"';
  ctx.fillText('施術数', cx, cy + 16);

  // Legend
  const legend = document.getElementById('donutLegend');
  legend.innerHTML = data.map(d => `
    <div class="legend-item">
      <span class="legend-dot" style="background:${d.color}"></span>
      ${d.label} (${d.value}%)
    </div>
  `).join('');
}

// --- Weekday Chart ---
function drawWeekdayChart() {
  const canvas = document.getElementById('weekdayChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;

  const rect = canvas.parentElement.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  canvas.style.width = rect.width + 'px';
  canvas.style.height = rect.height + 'px';
  ctx.scale(dpr, dpr);

  const w = rect.width, h = rect.height;
  const data = [4, 0, 0, 5, 7, 8, 6]; // 日〜土, 火曜定休
  const labels = ['日', '月', '火', '水', '木', '金', '土'];
  const max = Math.max(...data) * 1.2;
  const pad = { top: 20, right: 20, bottom: 40, left: 40 };
  const chartW = w - pad.left - pad.right;
  const chartH = h - pad.top - pad.bottom;
  const barW = chartW / data.length * 0.5;
  const gap = chartW / data.length;

  // Grid
  ctx.strokeStyle = 'rgba(255,255,255,0.04)';
  for (let i = 0; i <= 4; i++) {
    const y = pad.top + (chartH / 4) * i;
    ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(w - pad.right, y); ctx.stroke();
  }

  data.forEach((val, i) => {
    const x = pad.left + gap * i + (gap - barW) / 2;
    const barH = max > 0 ? (val / max) * chartH : 0;
    const y = pad.top + chartH - barH;

    const color = val === 0 ? 'rgba(255,255,255,0.05)' : (i === 5 ? '#c9a96e' : 'rgba(201,169,110,0.5)');
    ctx.fillStyle = color;
    roundRect(ctx, x, y, barW, barH || 2, 3);
    ctx.fill();

    if (val > 0) {
      ctx.fillStyle = '#c9a96e';
      ctx.font = '10px "Cormorant Garamond"';
      ctx.textAlign = 'center';
      ctx.fillText(val, x + barW / 2, y - 6);
    }

    ctx.fillStyle = i === 2 ? '#f87171' : '#666';
    ctx.font = '11px "Noto Sans JP"';
    ctx.textAlign = 'center';
    ctx.fillText(labels[i], x + barW / 2, h - pad.bottom + 20);
  });
}

// --- Hour Chart ---
function drawHourChart() {
  const canvas = document.getElementById('hourChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;

  const rect = canvas.parentElement.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  canvas.style.width = rect.width + 'px';
  canvas.style.height = rect.height + 'px';
  ctx.scale(dpr, dpr);

  const w = rect.width, h = rect.height;
  const data = [5, 7, 4, 8, 9, 6, 7, 5, 3, 2];
  const labels = ['10', '11', '12', '13', '14', '15', '16', '17', '18', '19'];
  const max = Math.max(...data) * 1.2;
  const pad = { top: 20, right: 20, bottom: 40, left: 40 };
  const chartW = w - pad.left - pad.right;
  const chartH = h - pad.top - pad.bottom;

  // Draw area
  const stepX = chartW / (data.length - 1);

  // Fill area
  ctx.beginPath();
  ctx.moveTo(pad.left, pad.top + chartH);
  data.forEach((val, i) => {
    const x = pad.left + stepX * i;
    const y = pad.top + chartH - (val / max) * chartH;
    if (i === 0) ctx.lineTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.lineTo(pad.left + chartW, pad.top + chartH);
  ctx.closePath();

  const grad = ctx.createLinearGradient(0, pad.top, 0, pad.top + chartH);
  grad.addColorStop(0, 'rgba(201,169,110,0.2)');
  grad.addColorStop(1, 'rgba(201,169,110,0)');
  ctx.fillStyle = grad;
  ctx.fill();

  // Draw line
  ctx.beginPath();
  data.forEach((val, i) => {
    const x = pad.left + stepX * i;
    const y = pad.top + chartH - (val / max) * chartH;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.strokeStyle = '#c9a96e';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Dots
  data.forEach((val, i) => {
    const x = pad.left + stepX * i;
    const y = pad.top + chartH - (val / max) * chartH;
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#c9a96e';
    ctx.fill();

    ctx.fillStyle = '#666';
    ctx.font = '10px "Noto Sans JP"';
    ctx.textAlign = 'center';
    ctx.fillText(labels[i] + '時', x, h - pad.bottom + 20);
  });
}

// --- Client Type Chart ---
function drawClientTypeChart() {
  const canvas = document.getElementById('clientTypeChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;

  const rect = canvas.parentElement.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  canvas.style.width = rect.width + 'px';
  canvas.style.height = rect.height + 'px';
  ctx.scale(dpr, dpr);

  const w = rect.width, h = rect.height;
  const newClients = [12, 15, 10, 18, 14, 18];
  const repeaters = [38, 42, 45, 40, 48, 52];
  const labels = ['10月', '11月', '12月', '1月', '2月', '3月'];
  const max = Math.max(...repeaters.map((r, i) => r + newClients[i])) * 1.15;
  const pad = { top: 20, right: 20, bottom: 40, left: 50 };
  const chartW = w - pad.left - pad.right;
  const chartH = h - pad.top - pad.bottom;
  const gap = chartW / labels.length;
  const barW = gap * 0.3;

  // Grid
  ctx.strokeStyle = 'rgba(255,255,255,0.04)';
  for (let i = 0; i <= 4; i++) {
    const y = pad.top + (chartH / 4) * i;
    ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(w - pad.right, y); ctx.stroke();
    ctx.fillStyle = '#555'; ctx.font = '10px "Noto Sans JP"'; ctx.textAlign = 'right';
    ctx.fillText(Math.round(max - (max / 4) * i), pad.left - 8, y + 3);
  }

  labels.forEach((lbl, i) => {
    const cx = pad.left + gap * i + gap / 2;

    // Repeater bar
    const rH = (repeaters[i] / max) * chartH;
    const rY = pad.top + chartH - rH;
    ctx.fillStyle = '#c9a96e';
    roundRect(ctx, cx - barW - 2, rY, barW, rH, 3);
    ctx.fill();

    // New client bar
    const nH = (newClients[i] / max) * chartH;
    const nY = pad.top + chartH - nH;
    ctx.fillStyle = '#60a5fa';
    roundRect(ctx, cx + 2, nY, barW, nH, 3);
    ctx.fill();

    ctx.fillStyle = '#666'; ctx.font = '11px "Noto Sans JP"'; ctx.textAlign = 'center';
    ctx.fillText(lbl, cx, h - pad.bottom + 20);
  });

  // Legend
  ctx.fillStyle = '#c9a96e';
  roundRect(ctx, w - 180, 8, 10, 10, 2); ctx.fill();
  ctx.fillStyle = '#999'; ctx.font = '10px "Noto Sans JP"'; ctx.textAlign = 'left';
  ctx.fillText('リピーター', w - 166, 17);

  ctx.fillStyle = '#60a5fa';
  roundRect(ctx, w - 90, 8, 10, 10, 2); ctx.fill();
  ctx.fillStyle = '#999';
  ctx.fillText('新規', w - 76, 17);
}

// --- Utility: rounded rectangle ---
function roundRect(ctx, x, y, w, h, r) {
  if (h < 0) { y += h; h = -h; }
  r = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

// ==========================================
// Resize handler for charts
// ==========================================
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    initCharts();
  }, 200);
});

// ==========================================
// Site Management — Full CRUD
// ==========================================

// Default menu items (same as app.js DEFAULT_MENU_ITEMS)
const DEFAULT_MENU_ITEMS = [
  {
    id: 'cut',
    name: { ja: 'カット', en: 'Haircut', zh: '剪发' },
    price: '$60', priceNum: 60,
    desc: {
      ja: '骨格診断に基づいた似合わせカット。再現性の高いスタイルをご提案。',
      en: 'Personalized cut based on facial structure analysis.',
      zh: '根据面部骨骼诊断打造最适合您的发型。'
    },
    time: { ja: '約60分', en: '~60 min', zh: '约60分钟' },
    timeNum: 60
  },
  {
    id: 'cut-color',
    name: { ja: 'カット + カラー', en: 'Cut + Color', zh: '剪发 + 染发' },
    price: '$120', priceNum: 120,
    desc: {
      ja: 'カットとカラーのセットメニュー。トレンドからナチュラルまで。',
      en: 'A set menu of cut and color. Trendy to natural shades.',
      zh: '剪发与染发套餐。从流行到自然色。'
    },
    time: { ja: '約120分', en: '~120 min', zh: '约120分钟' },
    timeNum: 120
  },
  {
    id: 'color',
    name: { ja: 'カラー', en: 'Color', zh: '染发' },
    price: '$80', priceNum: 80,
    desc: {
      ja: 'イルミナカラー等、ダメージレスな薬剤を使用。',
      en: 'Low-damage formulas like Illumina Color.',
      zh: '使用Illumina Color等低损伤染发剂。'
    },
    time: { ja: '約90分', en: '~90 min', zh: '约90分钟' },
    timeNum: 90
  },
  {
    id: 'perm',
    name: { ja: 'パーマ', en: 'Perm', zh: '烫发' },
    price: '$90', priceNum: 90,
    desc: {
      ja: 'デジタルパーマで柔らかいカールを実現。',
      en: 'Soft curls with digital perm technique.',
      zh: '数码烫打造柔软卷发。'
    },
    time: { ja: '約120分', en: '~120 min', zh: '约120分钟' },
    timeNum: 120
  },
  {
    id: 'treatment',
    name: { ja: 'トリートメント', en: 'Treatment', zh: '护理' },
    price: '$50', priceNum: 50,
    desc: {
      ja: 'TOKIOトリートメントで髪の内部から補修。',
      en: 'TOKIO treatment repairs hair from within.',
      zh: 'TOKIO护理从内部修复秀发。'
    },
    time: { ja: '約45分', en: '~45 min', zh: '约45分钟' },
    timeNum: 45
  },
  {
    id: 'head-spa',
    name: { ja: 'ヘッドスパ', en: 'Head Spa', zh: '头皮SPA' },
    price: '$40', priceNum: 40,
    desc: {
      ja: '頭皮の状態に合わせた本格ヘッドスパ。',
      en: 'Professional head spa customized to your scalp.',
      zh: '根据头皮状况定制的专业SPA。'
    },
    time: { ja: '約40分', en: '~40 min', zh: '约40分钟' },
    timeNum: 40
  }
];

function getManagedMenuItems() {
  try {
    const saved = localStorage.getItem('salonMenuItems');
    if (saved) return JSON.parse(saved);
  } catch(e) { /* ignore */ }
  return JSON.parse(JSON.stringify(DEFAULT_MENU_ITEMS));
}

function saveManagedMenuItems(items) {
  localStorage.setItem('salonMenuItems', JSON.stringify(items));
}

function getSiteData() {
  try {
    const saved = localStorage.getItem('salonSiteData');
    if (saved) return JSON.parse(saved);
  } catch(e) { /* ignore */ }
  return {};
}

function saveSiteData(data) {
  localStorage.setItem('salonSiteData', JSON.stringify(data));
}

function initSiteManage() {
  initSiteInfoForm();
  initMenuManagement();
  initPhotoManagement();
}

// --- Site Info Form ---
function initSiteInfoForm() {
  const form = document.getElementById('siteInfoForm');
  if (!form) return;

  // Load saved data into form
  loadSiteInfoIntoForm();

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = getSiteData();

    data.stylistName = document.getElementById('editStylistName').value.trim() || null;
    data.salonName = document.getElementById('editSalonName').value.trim() || null;
    data.stylistBio = document.getElementById('editStylistBio').value.trim() || null;
    data.instagram = document.getElementById('editInstagram').value.trim() || null;
    data.yearsExp = document.getElementById('editYearsExp').value.trim() || null;
    data.clientsServed = document.getElementById('editClientsServed').value.trim() || null;
    data.rating = document.getElementById('editRating').value.trim() || null;
    data.address = document.getElementById('editAddress').value.trim() || null;
    data.businessHours = document.getElementById('editBusinessHours').value.trim() || null;
    data.closedDay = document.getElementById('editClosedDay').value.trim() || null;
    data.phone = document.getElementById('editPhone').value.trim() || null;
    data.email = document.getElementById('editEmail').value.trim() || null;

    saveSiteData(data);
    showToast('サイト情報を保存しました');
  });

  // Reset button
  const resetBtn = document.getElementById('resetSiteInfoBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (confirm('サイト情報をリセットしますか？')) {
        const data = getSiteData();
        delete data.stylistName;
        delete data.salonName;
        delete data.stylistBio;
        delete data.instagram;
        delete data.yearsExp;
        delete data.clientsServed;
        delete data.rating;
        delete data.address;
        delete data.businessHours;
        delete data.closedDay;
        delete data.phone;
        delete data.email;
        saveSiteData(data);
        loadSiteInfoIntoForm();
        showToast('リセットしました');
      }
    });
  }
}

function loadSiteInfoIntoForm() {
  const data = getSiteData();
  document.getElementById('editStylistName').value = data.stylistName || '';
  document.getElementById('editSalonName').value = data.salonName || '';
  document.getElementById('editStylistBio').value = data.stylistBio || '';
  document.getElementById('editInstagram').value = data.instagram || '';
  document.getElementById('editYearsExp').value = data.yearsExp || '';
  document.getElementById('editClientsServed').value = data.clientsServed || '';
  document.getElementById('editRating').value = data.rating || '';
  document.getElementById('editAddress').value = data.address || '';
  document.getElementById('editBusinessHours').value = data.businessHours || '';
  document.getElementById('editClosedDay').value = data.closedDay || '';
  document.getElementById('editPhone').value = data.phone || '';
  document.getElementById('editEmail').value = data.email || '';
}

// --- Menu Management ---
function initMenuManagement() {
  renderMenuMgmtList();

  // Add button
  const addBtn = document.getElementById('addMenuBtn');
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      openMenuModal(null);
    });
  }

  // Form submit
  const menuForm = document.getElementById('menuForm');
  if (menuForm) {
    menuForm.addEventListener('submit', (e) => {
      e.preventDefault();
      saveMenuFromModal();
    });
  }

  // Close/Cancel
  const closeBtn = document.getElementById('modalClose');
  const cancelBtn = document.getElementById('modalCancelBtn');
  if (closeBtn) closeBtn.addEventListener('click', closeMenuModal);
  if (cancelBtn) cancelBtn.addEventListener('click', closeMenuModal);
}

function renderMenuMgmtList() {
  const container = document.getElementById('menuMgmtList');
  if (!container) return;
  container.innerHTML = '';

  const items = getManagedMenuItems();

  items.forEach(item => {
    const div = document.createElement('div');
    div.className = 'menu-mgmt-item';
    div.innerHTML = `
      <span class="menu-mgmt-name">${item.name.ja}</span>
      <span class="menu-mgmt-price">${item.price}</span>
      <span class="menu-mgmt-time">${item.timeNum || ''}分</span>
      <div class="menu-mgmt-actions">
        <button class="edit-btn" data-id="${item.id}">編集</button>
        <button class="delete-btn" data-id="${item.id}">削除</button>
      </div>
    `;

    div.querySelector('.edit-btn').addEventListener('click', () => openMenuModal(item));
    div.querySelector('.delete-btn').addEventListener('click', () => deleteMenuItem(item.id));

    container.appendChild(div);
  });
}

function openMenuModal(item) {
  const modal = document.getElementById('menuModal');
  const title = document.getElementById('modalTitle');

  if (item) {
    title.textContent = 'メニュー編集';
    document.getElementById('editMenuId').value = item.id;
    document.getElementById('editNameJa').value = item.name.ja || '';
    document.getElementById('editNameEn').value = item.name.en || '';
    document.getElementById('editNameZh').value = item.name.zh || '';
    document.getElementById('editPrice').value = item.priceNum || 0;
    document.getElementById('editTime').value = item.timeNum || 0;
    document.getElementById('editDescJa').value = item.desc.ja || '';
    document.getElementById('editDescEn').value = item.desc.en || '';
    document.getElementById('editDescZh').value = item.desc.zh || '';
  } else {
    title.textContent = '新規メニュー追加';
    document.getElementById('editMenuId').value = '';
    document.getElementById('menuForm').reset();
  }

  modal.classList.add('open');
}

function closeMenuModal() {
  document.getElementById('menuModal').classList.remove('open');
}

function saveMenuFromModal() {
  const id = document.getElementById('editMenuId').value;
  const priceNum = parseInt(document.getElementById('editPrice').value) || 0;
  const timeNum = parseInt(document.getElementById('editTime').value) || 0;

  const menuItem = {
    id: id || 'menu-' + Date.now(),
    name: {
      ja: document.getElementById('editNameJa').value.trim(),
      en: document.getElementById('editNameEn').value.trim(),
      zh: document.getElementById('editNameZh').value.trim()
    },
    price: '$' + priceNum,
    priceNum: priceNum,
    desc: {
      ja: document.getElementById('editDescJa').value.trim(),
      en: document.getElementById('editDescEn').value.trim(),
      zh: document.getElementById('editDescZh').value.trim()
    },
    time: {
      ja: `約${timeNum}分`,
      en: `~${timeNum} min`,
      zh: `约${timeNum}分钟`
    },
    timeNum: timeNum
  };

  const items = getManagedMenuItems();
  const existingIdx = items.findIndex(item => item.id === id);

  if (existingIdx >= 0) {
    items[existingIdx] = menuItem;
  } else {
    items.push(menuItem);
  }

  saveManagedMenuItems(items);
  renderMenuMgmtList();
  closeMenuModal();
  showToast(existingIdx >= 0 ? 'メニューを更新しました' : '新規メニューを追加しました');
}

function deleteMenuItem(id) {
  if (!confirm('このメニューを削除しますか？')) return;

  const items = getManagedMenuItems().filter(item => item.id !== id);
  saveManagedMenuItems(items);
  renderMenuMgmtList();
  showToast('メニューを削除しました');
}

// --- Photo Management ---
function initPhotoManagement() {
  const photoUpload = document.getElementById('photoUpload');
  const resetBtn = document.getElementById('resetPhotoBtn');
  const previewImg = document.getElementById('currentPhoto');

  // Load saved photo
  const siteData = getSiteData();
  if (siteData.profilePhoto && previewImg) {
    previewImg.src = siteData.profilePhoto;
  }

  if (photoUpload) {
    photoUpload.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = ev.target.result;
        if (previewImg) previewImg.src = dataUrl;

        const data = getSiteData();
        data.profilePhoto = dataUrl;
        saveSiteData(data);
        showToast('写真を更新しました');
      };
      reader.readAsDataURL(file);
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (previewImg) previewImg.src = 'stylist.jpg';
      const data = getSiteData();
      delete data.profilePhoto;
      saveSiteData(data);
      showToast('デフォルトに戻しました');
    });
  }
}

// --- Toast ---
function showToast(message) {
  // Remove existing toast
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}
