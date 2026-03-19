// ==========================================
// JIN Dashboard — Full Salon Management
// ==========================================

'use strict';

// --- Data Helpers ---
function loadData(key, fallback) { try { const d = localStorage.getItem(key); return d ? JSON.parse(d) : fallback; } catch(e) { return fallback; } }
function saveData(key, data) { localStorage.setItem(key, JSON.stringify(data)); }

// --- Default Data ---
const DEFAULT_MENU_ITEMS = [
  { id:'cut', name:{ja:'カット',en:'Haircut',zh:'剪发'}, price:'$60〜', priceNum:60, desc:{ja:'骨格診断に基づいた似合わせカット。',en:'Personalized cut based on facial structure.',zh:'根据面部骨骼诊断打造发型。'}, time:{ja:'約60分',en:'~60 min',zh:'约60分钟'}, timeNum:60 },
  { id:'cut-color', name:{ja:'カット + カラー',en:'Cut + Color',zh:'剪发 + 染发'}, price:'$120〜', priceNum:120, desc:{ja:'カットとカラーのセットメニュー。',en:'Cut and color set menu.',zh:'剪发与染发套餐。'}, time:{ja:'約120分',en:'~120 min',zh:'约120分钟'}, timeNum:120 },
  { id:'color', name:{ja:'カラー',en:'Color',zh:'染发'}, price:'$100〜', priceNum:100, desc:{ja:'イルミナカラー等、ダメージレスな薬剤を使用。',en:'Low-damage formulas like Illumina Color.',zh:'使用低损伤染发剂。'}, time:{ja:'約90分',en:'~90 min',zh:'约90分钟'}, timeNum:90 },
  { id:'perm', name:{ja:'パーマ',en:'Perm',zh:'烫发'}, price:'$90〜', priceNum:90, desc:{ja:'デジタルパーマで柔らかいカールを実現。',en:'Soft curls with digital perm.',zh:'数码烫打造柔软卷发。'}, time:{ja:'約120分',en:'~120 min',zh:'约120分钟'}, timeNum:120 },
  { id:'treatment', name:{ja:'トリートメント',en:'Treatment',zh:'护理'}, price:'$50〜', priceNum:50, desc:{ja:'TOKIOトリートメントで髪の内部から補修。',en:'TOKIO treatment repairs hair from within.',zh:'TOKIO护理从内部修复秀发。'}, time:{ja:'約45分',en:'~45 min',zh:'约45分钟'}, timeNum:45 },
  { id:'head-spa', name:{ja:'ヘッドスパ',en:'Head Spa',zh:'头皮SPA'}, price:'$40〜', priceNum:40, desc:{ja:'頭皮の状態に合わせた本格ヘッドスパ。',en:'Professional head spa customized to your scalp.',zh:'根据头皮状况定制SPA。'}, time:{ja:'約40分',en:'~40 min',zh:'约40分钟'}, timeNum:40 }
];

const DEMO_BOOKINGS = [
  { id:'B001', client:'佐藤 美咲', phone:'090-1234-5678', menu:'カット + カラー', date:'2026-03-16', time:'10:00', price:120, status:'confirmed' },
  { id:'B002', client:'田中 花子', phone:'090-2345-6789', menu:'カット', date:'2026-03-16', time:'11:30', price:60, status:'confirmed' },
  { id:'B003', client:'鈴木 一郎', phone:'090-3456-7890', menu:'カット', date:'2026-03-16', time:'13:00', price:60, status:'completed' },
  { id:'B004', client:'高橋 めぐみ', phone:'090-4567-8901', menu:'カラー', date:'2026-03-16', time:'14:00', price:80, status:'confirmed' },
  { id:'B005', client:'伊藤 さくら', phone:'090-5678-9012', menu:'パーマ', date:'2026-03-16', time:'15:30', price:90, status:'pending' },
  { id:'B006', client:'渡辺 大輔', phone:'090-6789-0123', menu:'カット + カラー', date:'2026-03-16', time:'17:00', price:120, status:'confirmed' },
  { id:'B007', client:'山田 陽子', phone:'', menu:'トリートメント', date:'2026-03-17', time:'10:00', price:50, status:'confirmed' },
  { id:'B008', client:'中村 翔太', phone:'', menu:'カット', date:'2026-03-17', time:'11:00', price:60, status:'pending' },
  { id:'B009', client:'小林 真理', phone:'', menu:'ヘッドスパ', date:'2026-03-15', time:'14:00', price:40, status:'completed' },
  { id:'B010', client:'加藤 美紀', phone:'', menu:'カット + カラー', date:'2026-03-14', time:'10:00', price:120, status:'cancelled' }
];

// --- Unified Booking Data ---
function getBookings() { return loadData('salonBookings', DEMO_BOOKINGS); }
function saveBookings(b) { saveData('salonBookings', b); }
function addBooking(booking) {
  const bookings = getBookings();
  booking.id = 'B' + String(bookings.length + 1).padStart(3, '0');
  bookings.push(booking);
  saveBookings(bookings);
  return booking;
}

const DEMO_CLIENTS = [
  { id:'c1', name:'佐藤 美咲', phone:'090-1234-5678', email:'sato@example.com', since:'2024-06', designations:12, tags:'髪質:細い,カラー:暖色系', visits:[{date:'2026-03-16',menu:'カット + カラー',price:120,note:'イルミナ8/NB使用'},{date:'2026-02-10',menu:'カット',price:60,note:''},{date:'2026-01-05',menu:'カラー',price:80,note:'トーンアップ'}], notes:{hair:'細い、柔らかい、猫っ毛',chem:'イルミナカラー 8/NB、OX 3%',pref:'前髪は眉下、量は軽めが好み',other:''} },
  { id:'c2', name:'田中 花子', phone:'090-2345-6789', email:'tanaka@example.com', since:'2025-01', designations:8, tags:'髪質:普通,パーマ好き', visits:[{date:'2026-03-16',menu:'カット',price:60,note:''},{date:'2026-02-20',menu:'パーマ',price:90,note:'デジタルパーマ'}], notes:{hair:'普通、やや硬め',chem:'',pref:'ゆるふわパーマが好み',other:''} },
  { id:'c3', name:'鈴木 一郎', phone:'090-3456-7890', email:'', since:'2025-06', designations:5, tags:'メンズ', visits:[{date:'2026-03-16',menu:'カット',price:60,note:'ツーブロック'}], notes:{hair:'硬い、多い',chem:'',pref:'ツーブロック、サイド短め',other:''} },
  { id:'c4', name:'高橋 めぐみ', phone:'090-4567-8901', email:'takahashi@example.com', since:'2024-12', designations:10, tags:'髪質:ダメージ,トリートメント', visits:[{date:'2026-03-16',menu:'カラー',price:80,note:''},{date:'2026-02-15',menu:'トリートメント',price:50,note:'TOKIO使用'}], notes:{hair:'ダメージあり、乾燥しやすい',chem:'TOKIO IE、OX 3%',pref:'ナチュラル系カラー',other:'頭皮が敏感'} },
  { id:'c5', name:'伊藤 さくら', phone:'090-5678-9012', email:'ito@example.com', since:'2025-09', designations:3, tags:'新規', visits:[{date:'2026-03-16',menu:'パーマ',price:90,note:''}], notes:{hair:'',chem:'',pref:'',other:''} },
  { id:'c6', name:'渡辺 大輔', phone:'090-6789-0123', email:'', since:'2025-03', designations:7, tags:'メンズ,カラー', visits:[{date:'2026-03-16',menu:'カット + カラー',price:120,note:'アッシュ系'},{date:'2026-01-20',menu:'カット',price:60,note:''}], notes:{hair:'普通',chem:'',pref:'アッシュ・マット系カラー好み',other:''} }
];

const DEMO_MESSAGES = [
  { id:'m1', type:'confirmation', to:'佐藤 美咲', content:'佐藤 美咲様、ご予約ありがとうございます。3/16 10:00にお待ちしております。', sentAt:'2026-03-14 18:30', status:'sent' },
  { id:'m2', type:'reminder', to:'佐藤 美咲', content:'佐藤 美咲様、明日のご予約のリマインドです。10:00にお待ちしております。', sentAt:'2026-03-15 09:00', status:'sent' },
  { id:'m3', type:'confirmation', to:'田中 花子', content:'田中 花子様、ご予約ありがとうございます。3/16 11:30にお待ちしております。', sentAt:'2026-03-15 10:00', status:'sent' },
  { id:'m4', type:'cancellation', to:'加藤 美紀', content:'加藤 美紀様、ご予約がキャンセルされました。またのご予約をお待ちしております。', sentAt:'2026-03-13 15:00', status:'sent' },
  { id:'m5', type:'reminder', to:'伊藤 さくら', content:'伊藤 さくら様、明日のご予約のリマインドです。15:30にお待ちしております。', sentAt:'2026-03-15 09:00', status:'sent' },
];

const DEMO_COUPONS = [
  { id:'cp1', name:'新規限定 20%OFF', type:'percent', discount:20, validFrom:'2026-03-01', validTo:'2026-04-30', conditions:'初回来店のお客様限定', isActive:true, usageCount:5 },
  { id:'cp2', name:'平日カラー $10 OFF', type:'fixed', discount:10, validFrom:'2026-03-01', validTo:'2026-03-31', conditions:'月〜金のカラーメニュー', isActive:true, usageCount:12 },
  { id:'cp3', name:'紹介割引 15%OFF', type:'percent', discount:15, validFrom:'2026-01-01', validTo:'2026-12-31', conditions:'既存のお客様のご紹介', isActive:true, usageCount:3 },
];

// --- Init ---
document.addEventListener('DOMContentLoaded', () => {
  initLogin();
});

function initDashboard() {
  initSidebar();
  initMobile();
  setPageDate();
  renderOverviewTimeline();
  renderRecentBookings();
  renderBookingsTable();
  renderClients();
  initCharts();
  initSearch();
  initSiteManage();
  initShifts();
  initClientSection();
  initMessages();
  initCoupons();
  initAnalyticsExtra();
}

// ==========================================
// Login
// ==========================================
function initLogin() {
  const overlay = document.getElementById('loginOverlay');
  const inputs = overlay.querySelectorAll('.pin-digit');
  const error = document.getElementById('loginError');

  inputs.forEach((inp, i) => {
    inp.addEventListener('input', () => {
      if (inp.value && i < 3) inputs[i + 1].focus();
      if (i === 3 && inp.value) {
        const pin = Array.from(inputs).map(x => x.value).join('');
        if (pin === '0000') {
          overlay.classList.add('hide');
          setTimeout(() => { overlay.style.display = 'none'; initDashboard(); }, 400);
        } else {
          error.textContent = 'PINが正しくありません';
          inputs.forEach(x => { x.value = ''; x.classList.add('shake'); setTimeout(() => x.classList.remove('shake'), 300); });
          inputs[0].focus();
        }
      }
    });
    inp.addEventListener('keydown', (e) => { if (e.key === 'Backspace' && !inp.value && i > 0) inputs[i - 1].focus(); });
  });
  inputs[0].focus();
}

// ==========================================
// Sidebar & Navigation
// ==========================================
function initSidebar() {
  document.querySelectorAll('.nav-item[data-section]').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      switchSection(item.dataset.section);
    });
  });
}

function switchSection(section) {
  document.querySelectorAll('.nav-item[data-section]').forEach(n => n.classList.toggle('active', n.dataset.section === section));
  document.querySelectorAll('.main .section').forEach(s => s.classList.remove('active'));
  const target = document.getElementById('section' + section.charAt(0).toUpperCase() + section.slice(1));
  if (target) target.classList.add('active');

  const titles = { overview:'概要', bookings:'予約管理', shifts:'シフト管理', clients:'顧客管理', messages:'メッセージ', coupons:'クーポン', analytics:'売上分析', sitemanage:'サイト管理' };
  document.getElementById('pageTitle').textContent = titles[section] || section;

  // Close mobile menu
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('mainContent').classList.remove('shifted');

  // Redraw charts when switching to sections with canvases
  if (section === 'analytics' || section === 'overview') {
    requestAnimationFrame(() => { setTimeout(() => initCharts(), 100); });
  }
}

function initMobile() {
  const btn = document.getElementById('menuBtn');
  if (btn) btn.addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open');
    document.getElementById('mainContent').classList.toggle('shifted');
  });
}

function setPageDate() {
  const d = new Date();
  const days = ['日','月','火','水','木','金','土'];
  document.getElementById('pageDate').textContent = `${d.getFullYear()}年${d.getMonth()+1}月${d.getDate()}日${days[d.getDay()]}曜日`;
}

// ==========================================
// Overview
// ==========================================
function renderOverviewTimeline() {
  const c = document.getElementById('overviewTimeline');
  if (!c) return;
  const todayStr = new Date().toISOString().split('T')[0];
  const bookings = getBookings();
  const todayBookings = bookings.filter(b => b.date === todayStr);
  if (todayBookings.length === 0) {
    c.innerHTML = '<p class="empty-text">本日の予約はありません</p>';
    return;
  }
  c.innerHTML = todayBookings.map(b => `
    <div class="tl-item">
      <span class="tl-time">${b.time}</span>
      <div class="tl-dot"></div>
      <div class="tl-content"><strong>${b.client}</strong><span>${b.menu} — $${b.price}</span></div>
    </div>`).join('');
}

function renderRecentBookings() {
  const c = document.getElementById('recentBookings');
  if (!c) return;
  const statusLabels = { confirmed:'確定', pending:'保留中', completed:'完了', cancelled:'キャンセル' };
  const bookings = getBookings();
  const sorted = [...bookings].sort((a,b) => (b.date + b.time).localeCompare(a.date + a.time));
  c.innerHTML = sorted.slice(0, 5).map(b => `
    <div class="recent-item">
      <div class="recent-avatar">${b.client[0]}</div>
      <div class="recent-info"><strong>${b.client}</strong><span>${b.menu} · ${b.date} ${b.time}</span></div>
      <span class="status-badge st-${b.status}">${statusLabels[b.status]}</span>
    </div>`).join('');
}

// ==========================================
// Bookings Table
// ==========================================
function renderBookingsTable(filter, query) {
  const tb = document.getElementById('bookingsTableBody');
  if (!tb) return;
  const statusLabels = { confirmed:'確定', pending:'保留中', completed:'完了', cancelled:'キャンセル' };
  let data = [...getBookings()];
  data.sort((a,b) => (b.date + b.time).localeCompare(a.date + a.time));
  if (filter && filter !== 'all') data = data.filter(b => b.status === filter);
  if (query) { const q = query.toLowerCase(); data = data.filter(b => b.client.toLowerCase().includes(q) || b.menu.toLowerCase().includes(q)); }
  tb.innerHTML = data.map(b => `
    <tr>
      <td><span class="booking-id">${b.id}</span></td>
      <td>${b.client}</td>
      <td>${b.menu}</td>
      <td>${b.date} ${b.time}</td>
      <td>$${b.price}</td>
      <td><span class="status-badge st-${b.status}">${statusLabels[b.status]}</span></td>
      <td><button class="action-btn" onclick="changeBookingStatus('${b.id}')">${b.status === 'confirmed' ? '完了' : b.status === 'pending' ? '確定' : '詳細'}</button></td>
    </tr>`).join('');
}

function changeBookingStatus(bookingId) {
  const bookings = getBookings();
  const b = bookings.find(x => x.id === bookingId);
  if (!b) return;
  if (b.status === 'pending') { b.status = 'confirmed'; showToast('予約を確定しました'); }
  else if (b.status === 'confirmed') { b.status = 'completed'; showToast('施術完了にしました'); }
  else { return; }
  saveBookings(bookings);
  renderBookingsTable();
  renderRecentBookings();
  renderOverviewTimeline();
}

function initSearch() {
  const bs = document.getElementById('bookingSearch');
  const bf = document.getElementById('bookingFilter');
  if (bs) bs.addEventListener('input', () => renderBookingsTable(bf?.value, bs.value));
  if (bf) bf.addEventListener('change', () => renderBookingsTable(bf.value, bs?.value));
}

// ==========================================
// Shifts
// ==========================================
let shiftYear, shiftMonth_;
function initShifts() {
  const now = new Date();
  shiftYear = now.getFullYear();
  shiftMonth_ = now.getMonth();
  renderShiftCalendar();
  document.getElementById('shiftPrev')?.addEventListener('click', () => { shiftMonth_--; if (shiftMonth_ < 0) { shiftMonth_ = 11; shiftYear--; } renderShiftCalendar(); });
  document.getElementById('shiftNext')?.addEventListener('click', () => { shiftMonth_++; if (shiftMonth_ > 11) { shiftMonth_ = 0; shiftYear++; } renderShiftCalendar(); });

  // Weekday headers
  const wk = document.getElementById('shiftWeekdays');
  if (wk) wk.innerHTML = ['日','月','火','水','木','金','土'].map(d => `<div class="shift-wkday">${d}</div>`).join('');

  // Hours form
  const hf = document.getElementById('hoursForm');
  if (hf) hf.addEventListener('submit', (e) => { e.preventDefault(); saveShiftSettings(); showToast('営業時間を保存しました'); });
  loadShiftSettings();
}

function getShifts() { return loadData('salonShifts', {}); }
function saveShifts(s) { saveData('salonShifts', s); }

function getClosedDays() {
  const settings = loadData('salonShiftSettings', { closedDays: [2] });
  return settings.closedDays || [2];
}

function saveShiftSettings() {
  const checks = document.querySelectorAll('#closedDays input[type=checkbox]');
  const closedDays = [];
  checks.forEach(c => { if (c.checked) closedDays.push(parseInt(c.value)); });
  const settings = {
    openTime: document.getElementById('editOpenTime')?.value || '10:00',
    closeTime: document.getElementById('editCloseTime')?.value || '20:00',
    lastReception: document.getElementById('editLastReception')?.value || '19:00',
    closedDays
  };
  saveData('salonShiftSettings', settings);
}

function loadShiftSettings() {
  const s = loadData('salonShiftSettings', { openTime:'10:00', closeTime:'20:00', lastReception:'19:00', closedDays:[2] });
  const ot = document.getElementById('editOpenTime'); if (ot) ot.value = s.openTime || '10:00';
  const ct = document.getElementById('editCloseTime'); if (ct) ct.value = s.closeTime || '20:00';
  const lr = document.getElementById('editLastReception'); if (lr) lr.value = s.lastReception || '19:00';
  const checks = document.querySelectorAll('#closedDays input[type=checkbox]');
  checks.forEach(c => { c.checked = (s.closedDays || [2]).includes(parseInt(c.value)); });
}

function renderShiftCalendar() {
  const grid = document.getElementById('shiftGrid');
  const label = document.getElementById('shiftMonth');
  if (!grid || !label) return;
  label.textContent = `${shiftYear}年${shiftMonth_ + 1}月`;

  const firstDay = new Date(shiftYear, shiftMonth_, 1).getDay();
  const daysInMonth = new Date(shiftYear, shiftMonth_ + 1, 0).getDate();
  const shifts = getShifts();
  const closedDays = getClosedDays();
  let html = '';

  for (let i = 0; i < firstDay; i++) html += '<div class="shift-cell empty"></div>';
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${shiftYear}-${String(shiftMonth_ + 1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const dow = new Date(shiftYear, shiftMonth_, d).getDay();
    const isClosedDay = closedDays.includes(dow);
    const shiftData = shifts[dateStr];
    const isOff = shiftData?.isOff || false;
    let cls = 'shift-cell';
    if (isClosedDay && !shiftData) cls += ' holiday';
    else if (isOff) cls += ' off';
    else cls += ' work';
    const today = new Date();
    if (d === today.getDate() && shiftMonth_ === today.getMonth() && shiftYear === today.getFullYear()) cls += ' today';

    html += `<div class="${cls}" data-date="${dateStr}"><span class="shift-day">${d}</span><span class="shift-status">${isClosedDay && !shiftData ? '定休' : isOff ? '休み' : '出勤'}</span></div>`;
  }
  grid.innerHTML = html;

  grid.querySelectorAll('.shift-cell:not(.empty)').forEach(cell => {
    cell.addEventListener('click', () => {
      const date = cell.dataset.date;
      const shifts = getShifts();
      if (shifts[date]?.isOff) { delete shifts[date]; }
      else { shifts[date] = { isOff: true }; }
      saveShifts(shifts);
      renderShiftCalendar();
    });
  });
}

// ==========================================
// Client Management
// ==========================================
function getClients() {
  // Merge dashboard clients and mypage customers
  const dashClients = loadData('salonClients', DEMO_CLIENTS);
  
  // Get mypage customers (phone-keyed object)
  const mypageCustomers = loadData('salonCustomers', {});
  
  // Convert mypage customers to client format and add if not already in dashboard
  Object.keys(mypageCustomers).forEach(phone => {
    const mc = mypageCustomers[phone];
    const exists = dashClients.some(c => c.phone === phone || c.phone === mc.phone);
    if (!exists) {
      dashClients.push({
        id: 'mp-' + phone.replace(/[^0-9]/g, ''),
        name: mc.name && mc.name !== '未設定' ? mc.name : phone,
        phone: mc.phone || phone,
        countryCode: mc.countryCode || '',
        email: '',
        since: new Date().toISOString().slice(0, 7),
        designations: mc.visitCount || 0,
        tags: 'マイページ登録',
        visits: (mc.bookingHistory || []).map(bh => ({
          date: bh.date || '',
          menu: bh.menu || '',
          price: bh.price || 0,
          note: ''
        })),
        notes: { hair: '', chem: '', pref: '', other: '' },
        points: mc.points || 0,
        totalEarned: mc.totalEarned || 0,
        mypageLinked: true
      });
    }
  });
  
  return dashClients;
}

function saveClients(c) { saveData('salonClients', c); }

// Also sync back to salonCustomers when editing a mypage-linked client
function syncToMypageCustomer(client) {
  if (!client.mypageLinked) return;
  const customers = loadData('salonCustomers', {});
  const phone = client.phone;
  if (customers[phone]) {
    customers[phone].name = client.name;
    if (client.name === phone) customers[phone].name = '未設定';
    saveData('salonCustomers', customers);
  }
}

let currentClientId = null;

function renderClients(query) {
  const grid = document.getElementById('clientsGrid');
  if (!grid) return;
  let clients = getClients();
  if (query) { const q = query.toLowerCase(); clients = clients.filter(c => c.name.toLowerCase().includes(q) || (c.tags||'').toLowerCase().includes(q) || (c.phone||'').includes(q)); }

  grid.innerHTML = clients.map(c => {
    const totalSpent = (c.visits||[]).reduce((s,v) => s + (v.price||0), 0);
    const lastVisit = (c.visits||[]).length > 0 ? c.visits[0].date : '—';
    const pointsBadge = c.points ? `<span class="tag" style="background:#f0e6d4;color:#8B6914">🎁 ${c.points}pt</span>` : '';
    const linkedBadge = c.mypageLinked ? '<span class="tag" style="background:#e8f5e9;color:#2e7d32">📱 マイページ</span>' : '';
    return `
    <div class="client-card" data-id="${c.id}">
      <div class="client-avatar">${c.name[0]}</div>
      <div class="client-info">
        <strong>${c.name}</strong>
        <span>${c.phone || '—'}</span>
        <div class="client-stats">
          <span>指名: ${c.designations || 0}回</span>
          <span>累計: $${totalSpent}</span>
        </div>
        <span class="client-last">最終来店: ${lastVisit}</span>
      </div>
      <div class="client-tags">${linkedBadge}${pointsBadge}${(c.tags||'').split(',').filter(t=>t).map(t => `<span class="tag">${t.trim()}</span>`).join('')}</div>
    </div>`;
  }).join('');

  grid.querySelectorAll('.client-card').forEach(card => {
    card.addEventListener('click', () => openClientModal(card.dataset.id));
  });
}

function initClientSection() {
  const searchInput = document.getElementById('clientSearch');
  if (searchInput) searchInput.addEventListener('input', () => renderClients(searchInput.value));

  document.getElementById('addClientBtn')?.addEventListener('click', () => openClientModal(null));
  document.getElementById('clientModalClose')?.addEventListener('click', closeClientModal);
  document.getElementById('clientCancelBtn')?.addEventListener('click', closeClientModal);

  // Tabs
  document.querySelectorAll('.detail-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.detail-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.detail-panel').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById('tab' + tab.dataset.tab.charAt(0).toUpperCase() + tab.dataset.tab.slice(1))?.classList.add('active');
    });
  });

  // Client form submit
  document.getElementById('clientForm')?.addEventListener('submit', (e) => { e.preventDefault(); saveClientFromForm(); });

  // Visit add
  document.getElementById('addVisitBtn')?.addEventListener('click', () => { document.getElementById('visitAddForm').style.display = 'block'; });
  document.getElementById('visitCancelBtn')?.addEventListener('click', () => { document.getElementById('visitAddForm').style.display = 'none'; });
  document.getElementById('visitSaveBtn')?.addEventListener('click', saveVisit);

  // Save notes
  document.getElementById('saveNotesBtn')?.addEventListener('click', saveClientNotes);
}

function openClientModal(id) {
  currentClientId = id;
  const modal = document.getElementById('clientModal');
  const title = document.getElementById('clientModalTitle');

  // Reset tabs
  document.querySelectorAll('.detail-tab').forEach((t,i) => t.classList.toggle('active', i===0));
  document.querySelectorAll('.detail-panel').forEach((p,i) => p.classList.toggle('active', i===0));

  if (id) {
    const clients = getClients();
    const c = clients.find(x => x.id === id);
    if (!c) return;
    title.textContent = c.name + ' — 顧客詳細';
    document.getElementById('clientEditId').value = c.id;
    document.getElementById('clientName').value = c.name;
    document.getElementById('clientPhone').value = c.phone || '';
    document.getElementById('clientEmail').value = c.email || '';
    document.getElementById('clientSince').value = c.since || '';
    document.getElementById('clientDesignations').value = c.designations || 0;
    document.getElementById('clientTags').value = c.tags || '';
    // Notes
    document.getElementById('clientNoteHair').value = c.notes?.hair || '';
    document.getElementById('clientNoteChem').value = c.notes?.chem || '';
    document.getElementById('clientNotePref').value = c.notes?.pref || '';
    document.getElementById('clientNoteOther').value = c.notes?.other || '';
    // Visit history
    renderVisitHistory(c.visits || []);
  } else {
    title.textContent = '新規顧客登録';
    document.getElementById('clientEditId').value = '';
    document.getElementById('clientForm').reset();
    document.getElementById('clientNoteHair').value = '';
    document.getElementById('clientNoteChem').value = '';
    document.getElementById('clientNotePref').value = '';
    document.getElementById('clientNoteOther').value = '';
    document.getElementById('visitHistoryList').innerHTML = '<p class="empty-text">来店履歴はまだありません</p>';
  }
  document.getElementById('visitAddForm').style.display = 'none';
  modal.classList.add('open');
}

function closeClientModal() { document.getElementById('clientModal').classList.remove('open'); currentClientId = null; }

function saveClientFromForm() {
  const id = document.getElementById('clientEditId').value;
  const clients = getClients();
  const existing = id ? clients.find(c => c.id === id) : null;

  const client = {
    id: id || 'c-' + Date.now(),
    name: document.getElementById('clientName').value.trim(),
    phone: document.getElementById('clientPhone').value.trim(),
    email: document.getElementById('clientEmail').value.trim(),
    since: document.getElementById('clientSince').value,
    designations: parseInt(document.getElementById('clientDesignations').value) || 0,
    tags: document.getElementById('clientTags').value.trim(),
    visits: existing?.visits || [],
    notes: existing?.notes || { hair:'', chem:'', pref:'', other:'' },
    points: existing?.points || 0,
    totalEarned: existing?.totalEarned || 0,
    mypageLinked: existing?.mypageLinked || false,
    countryCode: existing?.countryCode || ''
  };

  if (existing) { Object.assign(existing, client); }
  else { clients.push(client); }
  
  // Filter out mypage-merged clients before saving to salonClients
  const dashOnly = clients.filter(c => !c.mypageLinked);
  saveClients(dashOnly);
  
  // Sync back to mypage if linked
  syncToMypageCustomer(client);
  
  renderClients();
  closeClientModal();
  showToast(id ? '顧客情報を更新しました' : '新規顧客を登録しました');
}

function renderVisitHistory(visits) {
  const list = document.getElementById('visitHistoryList');
  if (!list) return;
  if (!visits.length) { list.innerHTML = '<p class="empty-text">来店履歴はまだありません</p>'; return; }
  list.innerHTML = visits.map((v, i) => `
    <div class="visit-item">
      <span class="visit-date">${v.date}</span>
      <span class="visit-menu">${v.menu}</span>
      <span class="visit-price">$${v.price}</span>
      <span class="visit-note">${v.note || '—'}</span>
    </div>`).join('');
}

function saveVisit() {
  if (!currentClientId) return;
  const clients = getClients();
  const c = clients.find(x => x.id === currentClientId);
  if (!c) return;
  const visit = {
    date: document.getElementById('visitDate').value,
    menu: document.getElementById('visitMenu').value.trim(),
    price: parseInt(document.getElementById('visitPrice').value) || 0,
    note: document.getElementById('visitNote').value.trim()
  };
  if (!visit.date || !visit.menu) { showToast('日付とメニューを入力してください'); return; }
  if (!c.visits) c.visits = [];
  c.visits.unshift(visit);
  saveClients(clients);
  renderVisitHistory(c.visits);
  document.getElementById('visitAddForm').style.display = 'none';
  showToast('来店履歴を追加しました');
}

function saveClientNotes() {
  if (!currentClientId) return;
  const clients = getClients();
  const c = clients.find(x => x.id === currentClientId);
  if (!c) return;
  c.notes = {
    hair: document.getElementById('clientNoteHair').value.trim(),
    chem: document.getElementById('clientNoteChem').value.trim(),
    pref: document.getElementById('clientNotePref').value.trim(),
    other: document.getElementById('clientNoteOther').value.trim()
  };
  saveClients(clients);
  showToast('メモを保存しました');
}

// ==========================================
// Messages
// ==========================================
function initMessages() {
  const msgs = loadData('salonMessages', DEMO_MESSAGES);
  renderMessageHistory(msgs);
  document.getElementById('saveMsgTemplates')?.addEventListener('click', () => {
    saveData('salonMsgTemplates', {
      confirm: document.getElementById('tmplConfirm')?.value || '',
      reminder: document.getElementById('tmplReminder')?.value || '',
      cancel: document.getElementById('tmplCancel')?.value || ''
    });
    showToast('テンプレートを保存しました');
  });
  // Load saved templates
  const t = loadData('salonMsgTemplates', null);
  if (t) {
    if (t.confirm) document.getElementById('tmplConfirm').value = t.confirm;
    if (t.reminder) document.getElementById('tmplReminder').value = t.reminder;
    if (t.cancel) document.getElementById('tmplCancel').value = t.cancel;
  }
}

function renderMessageHistory(msgs) {
  const c = document.getElementById('msgHistory');
  if (!c) return;
  const typeLabels = { confirmation:'予約確定', reminder:'リマインド', cancellation:'キャンセル' };
  c.innerHTML = msgs.map(m => `
    <div class="msg-item">
      <div class="msg-type-badge msg-${m.type}">${typeLabels[m.type] || m.type}</div>
      <div class="msg-detail"><strong>${m.to}</strong><p>${m.content}</p><span class="msg-time">${m.sentAt}</span></div>
      <span class="msg-status-badge">${m.status === 'sent' ? '送信済' : '保留'}</span>
    </div>`).join('');
}

// ==========================================
// Coupons
// ==========================================
function getCoupons() { return loadData('salonCoupons', DEMO_COUPONS); }
function saveCouponsData(c) { saveData('salonCoupons', c); }

function initCoupons() {
  renderCoupons();
  document.getElementById('addCouponBtn')?.addEventListener('click', () => openCouponModal(null));
  document.getElementById('couponModalClose')?.addEventListener('click', closeCouponModal);
  document.getElementById('couponCancelBtn')?.addEventListener('click', closeCouponModal);
  document.getElementById('couponForm')?.addEventListener('submit', (e) => { e.preventDefault(); saveCouponFromModal(); });
}

function renderCoupons() {
  const grid = document.getElementById('couponsGrid');
  if (!grid) return;
  const coupons = getCoupons();
  grid.innerHTML = coupons.map(c => `
    <div class="coupon-card ${c.isActive ? '' : 'expired'}">
      <div class="coupon-header">
        <h4>${c.name}</h4>
        <span class="coupon-badge">${c.type === 'percent' ? c.discount + '%OFF' : '$' + c.discount + ' OFF'}</span>
      </div>
      <div class="coupon-body">
        <p>${c.conditions || '条件なし'}</p>
        <span class="coupon-period">${c.validFrom} 〜 ${c.validTo}</span>
        <span class="coupon-usage">使用回数: ${c.usageCount || 0}回</span>
      </div>
      <div class="coupon-actions">
        <button class="edit-btn" onclick="openCouponModal(getCoupons().find(x=>x.id==='${c.id}'))">編集</button>
        <button class="delete-btn" onclick="deleteCoupon('${c.id}')">削除</button>
      </div>
    </div>`).join('');
}

function openCouponModal(c) {
  const modal = document.getElementById('couponModal');
  const title = document.getElementById('couponModalTitle');
  if (c) {
    title.textContent = 'クーポン編集';
    document.getElementById('couponEditId').value = c.id;
    document.getElementById('couponName').value = c.name;
    document.getElementById('couponType').value = c.type;
    document.getElementById('couponDiscount').value = c.discount;
    document.getElementById('couponFrom').value = c.validFrom;
    document.getElementById('couponTo').value = c.validTo;
    document.getElementById('couponConditions').value = c.conditions || '';
  } else {
    title.textContent = '新規クーポン';
    document.getElementById('couponEditId').value = '';
    document.getElementById('couponForm').reset();
  }
  modal.classList.add('open');
}

function closeCouponModal() { document.getElementById('couponModal').classList.remove('open'); }

function saveCouponFromModal() {
  const id = document.getElementById('couponEditId').value;
  const coupon = {
    id: id || 'cp-' + Date.now(),
    name: document.getElementById('couponName').value.trim(),
    type: document.getElementById('couponType').value,
    discount: parseInt(document.getElementById('couponDiscount').value) || 0,
    validFrom: document.getElementById('couponFrom').value,
    validTo: document.getElementById('couponTo').value,
    conditions: document.getElementById('couponConditions').value.trim(),
    isActive: true,
    usageCount: 0
  };
  const coupons = getCoupons();
  const idx = coupons.findIndex(c => c.id === id);
  if (idx >= 0) { coupon.usageCount = coupons[idx].usageCount; coupons[idx] = coupon; }
  else { coupons.push(coupon); }
  saveCouponsData(coupons);
  renderCoupons();
  closeCouponModal();
  showToast(idx >= 0 ? 'クーポンを更新しました' : '新規クーポンを作成しました');
}

function deleteCoupon(id) {
  if (!confirm('このクーポンを削除しますか？')) return;
  saveCouponsData(getCoupons().filter(c => c.id !== id));
  renderCoupons();
  showToast('クーポンを削除しました');
}

// ==========================================
// Charts
// ==========================================
function getCanvasSize(canvas, defaultW, defaultH) {
  const parent = canvas.parentElement;
  const rect = parent.getBoundingClientRect();
  let w = rect.width;
  let h = rect.height;
  if (w < 10) w = parent.offsetWidth || defaultW || 500;
  if (h < 10) h = parent.offsetHeight || defaultH || 220;
  if (w < 10) w = defaultW || 500;
  if (h < 10) h = defaultH || 220;
  return { w, h };
}

function initCharts() {
  drawRevenueChart();
  drawMenuDonut();
  drawWeekdayChart();
  drawHourChart();
  drawClientTypeChart();
  drawDailyRevenueChart();
}

function drawRevenueChart() {
  const canvas = document.getElementById('revenueChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const rect = canvas.parentElement.getBoundingClientRect();
  canvas.width = rect.width; canvas.height = rect.height;
  const data = [3200, 3800, 4100, 3600, 4500, 4872];
  const labels = ['10月','11月','12月','1月','2月','3月'];
  const max = Math.max(...data) * 1.2;
  const w = canvas.width, h = canvas.height, pad = 50, gw = w - pad * 2, gh = h - pad * 2;

  ctx.clearRect(0, 0, w, h);
  // Grid
  ctx.strokeStyle = 'rgba(255,255,255,0.06)'; ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) { const y = pad + gh - (gh * i / 4); ctx.beginPath(); ctx.moveTo(pad, y); ctx.lineTo(w - pad, y); ctx.stroke(); ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.font = '11px sans-serif'; ctx.textAlign = 'right'; ctx.fillText('$' + Math.round(max * i / 4), pad - 8, y + 4); }
  // Line + gradient
  const grad = ctx.createLinearGradient(0, pad, 0, h - pad);
  grad.addColorStop(0, 'rgba(198,163,124,0.3)'); grad.addColorStop(1, 'rgba(198,163,124,0)');
  ctx.beginPath();
  data.forEach((v, i) => { const x = pad + (gw / (data.length - 1)) * i; const y = pad + gh - (v / max * gh); if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y); });
  ctx.strokeStyle = '#c6a37c'; ctx.lineWidth = 2.5; ctx.stroke();
  // Fill
  const lastX = pad + gw; const lastY = pad + gh - (data[data.length - 1] / max * gh);
  ctx.lineTo(lastX, pad + gh); ctx.lineTo(pad, pad + gh); ctx.closePath(); ctx.fillStyle = grad; ctx.fill();
  // Dots + labels
  data.forEach((v, i) => { const x = pad + (gw / (data.length - 1)) * i; const y = pad + gh - (v / max * gh); ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2); ctx.fillStyle = '#c6a37c'; ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.font = '11px sans-serif'; ctx.textAlign = 'center'; ctx.fillText(labels[i], x, h - pad + 20); });
}

function drawMenuDonut() {
  const canvas = document.getElementById('menuChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const rect = canvas.parentElement.getBoundingClientRect();
  canvas.width = Math.min(rect.width, 200); canvas.height = Math.min(rect.height, 200);
  const data = [30, 25, 20, 12, 8, 5];
  const labels = ['カット+カラー','カット','カラー','パーマ','トリートメント','ヘッドスパ'];
  const colors = ['#c6a37c','#e8a87c','#9c8b7a','#d4a574','#a08c78','#b89b72'];
  const total = data.reduce((a, b) => a + b, 0);
  const cx = canvas.width / 2, cy = canvas.height / 2, r = Math.min(cx, cy) - 10;
  let start = -Math.PI / 2;
  data.forEach((v, i) => { const angle = (v / total) * Math.PI * 2; ctx.beginPath(); ctx.arc(cx, cy, r, start, start + angle); ctx.arc(cx, cy, r * 0.6, start + angle, start, true); ctx.closePath(); ctx.fillStyle = colors[i]; ctx.fill(); start += angle; });
  // Legend
  const legend = document.getElementById('donutLegend');
  if (legend) legend.innerHTML = labels.map((l, i) => `<div class="legend-item"><span class="legend-dot" style="background:${colors[i]}"></span>${l} ${data[i]}%</div>`).join('');
}

function drawWeekdayChart() {
  const canvas = document.getElementById('weekdayChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const size = getCanvasSize(canvas, 500, 220);
  canvas.width = size.w; canvas.height = size.h;
  const data = [8, 12, 0, 15, 14, 18, 20];
  const labels = ['日','月','火','水','木','金','土'];
  const max = Math.max(...data) * 1.2 || 1;
  const w = canvas.width, h = canvas.height, pad = 40, bw = (w - pad * 2) / data.length * 0.6;
  ctx.clearRect(0, 0, w, h);
  data.forEach((v, i) => { const x = pad + ((w - pad * 2) / data.length) * i + bw * 0.3; const bh = (v / max) * (h - pad * 2); const y = h - pad - bh; ctx.fillStyle = i === 2 ? 'rgba(198,163,124,0.2)' : '#c6a37c'; ctx.beginPath(); ctx.roundRect(x, y, bw, bh, 4); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.font = '11px sans-serif'; ctx.textAlign = 'center'; ctx.fillText(labels[i], x + bw / 2, h - pad + 16); if (v > 0) { ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.fillText(v, x + bw / 2, y - 6); } });
}

function drawHourChart() {
  const canvas = document.getElementById('hourChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const size = getCanvasSize(canvas, 500, 220);
  canvas.width = size.w; canvas.height = size.h;
  const data = [5, 8, 12, 10, 14, 12, 8, 6, 3, 1];
  const labels = ['10','11','12','13','14','15','16','17','18','19'];
  const max = Math.max(...data) * 1.2;
  const w = canvas.width, h = canvas.height, pad = 40, bw = (w - pad * 2) / data.length * 0.6;
  ctx.clearRect(0, 0, w, h);
  data.forEach((v, i) => { const x = pad + ((w - pad * 2) / data.length) * i + bw * 0.3; const bh = (v / max) * (h - pad * 2); const y = h - pad - bh; ctx.fillStyle = '#c6a37c'; ctx.beginPath(); ctx.roundRect(x, y, bw, bh, 4); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.font = '10px sans-serif'; ctx.textAlign = 'center'; ctx.fillText(labels[i] + ':00', x + bw / 2, h - pad + 16); if (v > 0) { ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.fillText(v, x + bw / 2, y - 6); } });
}

function drawClientTypeChart() {
  const canvas = document.getElementById('clientTypeChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const size = getCanvasSize(canvas, 800, 220);
  canvas.width = size.w; canvas.height = size.h;
  const newC = [8, 10, 7, 12, 9, 18];
  const rep = [25, 28, 30, 22, 35, 44];
  const labels = ['10月','11月','12月','1月','2月','3月'];
  const max = Math.max(...newC.map((v, i) => v + rep[i])) * 1.2;
  const w = canvas.width, h = canvas.height, pad = 50, bw = (w - pad * 2) / labels.length * 0.35;
  ctx.clearRect(0, 0, w, h);
  labels.forEach((l, i) => {
    const cx = pad + ((w - pad * 2) / labels.length) * i + ((w - pad * 2) / labels.length) / 2;
    const bh1 = (newC[i] / max) * (h - pad * 2); const bh2 = (rep[i] / max) * (h - pad * 2);
    ctx.fillStyle = '#e8a87c'; ctx.beginPath(); ctx.roundRect(cx - bw - 2, h - pad - bh1, bw, bh1, 3); ctx.fill();
    ctx.fillStyle = '#c6a37c'; ctx.beginPath(); ctx.roundRect(cx + 2, h - pad - bh2, bw, bh2, 3); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.font = '11px sans-serif'; ctx.textAlign = 'center'; ctx.fillText(l, cx, h - pad + 18);
  });
  // Legend
  ctx.fillStyle = '#e8a87c'; ctx.fillRect(w - 160, 12, 12, 12); ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.font = '11px sans-serif'; ctx.textAlign = 'left'; ctx.fillText('新規', w - 143, 22);
  ctx.fillStyle = '#c6a37c'; ctx.fillRect(w - 100, 12, 12, 12); ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.fillText('リピーター', w - 83, 22);
}

function drawDailyRevenueChart() {
  const canvas = document.getElementById('dailyRevenueChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const size = getCanvasSize(canvas, 800, 220);
  canvas.width = size.w; canvas.height = size.h;
  const data = [];
  for (let i = 1; i <= 16; i++) data.push(Math.floor(Math.random() * 300 + 100));
  const max = Math.max(...data) * 1.2;
  const w = canvas.width, h = canvas.height, pad = 50, gw = w - pad * 2, gh = h - pad * 2;
  ctx.clearRect(0, 0, w, h);
  // Grid
  for (let i = 0; i <= 4; i++) { const y = pad + gh - (gh * i / 4); ctx.strokeStyle = 'rgba(255,255,255,0.06)'; ctx.beginPath(); ctx.moveTo(pad, y); ctx.lineTo(w - pad, y); ctx.stroke(); }
  // Bars
  const bw = (gw / data.length) * 0.7;
  data.forEach((v, i) => { const x = pad + (gw / data.length) * i + (gw / data.length - bw) / 2; const bh = (v / max) * gh; const y = pad + gh - bh; ctx.fillStyle = '#c6a37c'; ctx.beginPath(); ctx.roundRect(x, y, bw, bh, 3); ctx.fill(); if (i % 5 === 0 || i === data.length - 1) { ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.font = '10px sans-serif'; ctx.textAlign = 'center'; ctx.fillText((i + 1) + '日', x + bw / 2, h - pad + 14); } });
}

function initAnalyticsExtra() {
  // Analytics KPIs are static demo data for now
}

// ==========================================
// Schedule (kept for overview)
// ==========================================
function renderSchedule() { /* used by overview timeline */ }

// ==========================================
// Site Management
// ==========================================
function getManagedMenuItems() { return loadData('salonMenuItems', JSON.parse(JSON.stringify(DEFAULT_MENU_ITEMS))); }
function saveManagedMenuItems(items) { saveData('salonMenuItems', items); }
function getSiteData() { return loadData('salonSiteData', {}); }
function saveSiteData(data) { saveData('salonSiteData', data); }

function initSiteManage() { initSiteInfoForm(); initMenuManagement(); initPhotoManagement(); }

function initSiteInfoForm() {
  const form = document.getElementById('siteInfoForm');
  if (!form) return;
  loadSiteInfoIntoForm();
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = getSiteData();
    ['stylistName','salonName','stylistBio','instagram','yearsExp','clientsServed','rating','address','businessHours','closedDay','phone','email'].forEach(key => {
      const el = document.getElementById('edit' + key.charAt(0).toUpperCase() + key.slice(1));
      if (el) data[key] = el.value.trim() || null;
    });
    saveSiteData(data); showToast('サイト情報を保存しました');
  });
  document.getElementById('resetSiteInfoBtn')?.addEventListener('click', () => {
    if (!confirm('リセットしますか？')) return;
    const data = getSiteData();
    ['stylistName','salonName','stylistBio','instagram','yearsExp','clientsServed','rating','address','businessHours','closedDay','phone','email'].forEach(k => delete data[k]);
    saveSiteData(data); loadSiteInfoIntoForm(); showToast('リセットしました');
  });
}

function loadSiteInfoIntoForm() {
  const data = getSiteData();
  const fields = {editStylistName:'stylistName',editSalonName:'salonName',editStylistBio:'stylistBio',editInstagram:'instagram',editYearsExp:'yearsExp',editClientsServed:'clientsServed',editRating:'rating',editAddress:'address',editBusinessHours:'businessHours',editClosedDay:'closedDay',editPhone:'phone',editEmail:'email'};
  Object.entries(fields).forEach(([elId, key]) => { const el = document.getElementById(elId); if (el) el.value = data[key] || ''; });
}

function initMenuManagement() {
  renderMenuMgmtList();
  document.getElementById('addMenuBtn')?.addEventListener('click', () => openMenuModal(null));
  document.getElementById('menuForm')?.addEventListener('submit', (e) => { e.preventDefault(); saveMenuFromModal(); });
  document.getElementById('modalClose')?.addEventListener('click', closeMenuModal);
  document.getElementById('modalCancelBtn')?.addEventListener('click', closeMenuModal);
}

const MAX_MENU_ITEMS = 20;

function renderMenuMgmtList() {
  const c = document.getElementById('menuMgmtList');
  if (!c) return; c.innerHTML = '';
  const items = getManagedMenuItems();
  const countLabel = document.getElementById('menuCountLabel');
  if (countLabel) countLabel.textContent = `${items.length} / ${MAX_MENU_ITEMS}`;
  const addBtn = document.getElementById('addMenuBtn');
  if (addBtn) {
    if (items.length >= MAX_MENU_ITEMS) {
      addBtn.disabled = true; addBtn.style.opacity = '0.5'; addBtn.style.cursor = 'not-allowed'; addBtn.title = `メニュー上限（${MAX_MENU_ITEMS}件）に達しています`;
    } else {
      addBtn.disabled = false; addBtn.style.opacity = ''; addBtn.style.cursor = ''; addBtn.title = '';
    }
  }
  items.forEach(item => {
    const div = document.createElement('div'); div.className = 'menu-mgmt-item';
    div.innerHTML = `<span class="menu-mgmt-name">${item.name.ja}</span><span class="menu-mgmt-price">${item.price}</span><span class="menu-mgmt-time">${item.time?.ja || (item.timeNum||'')+'分'}</span><div class="menu-mgmt-actions"><button class="edit-btn">編集</button><button class="delete-btn">削除</button></div>`;
    div.querySelector('.edit-btn').addEventListener('click', () => openMenuModal(item));
    div.querySelector('.delete-btn').addEventListener('click', () => { if (!confirm('削除しますか？')) return; saveManagedMenuItems(getManagedMenuItems().filter(x => x.id !== item.id)); renderMenuMgmtList(); showToast('削除しました'); });
    c.appendChild(div);
  });
}

function openMenuModal(item) {
  const modal = document.getElementById('menuModal');
  if (item) {
    document.getElementById('modalTitle').textContent = 'メニュー編集';
    document.getElementById('editMenuId').value = item.id;
    document.getElementById('editNameJa').value = item.name.ja||''; document.getElementById('editNameEn').value = item.name.en||''; document.getElementById('editNameZh').value = item.name.zh||'';
    document.getElementById('editPrice').value = (item.price||'').replace(/^\$/, '') || item.priceNum||0;
    const timeDisplay = (item.time?.ja || '').replace(/^約/, '').replace(/分$/, '') || item.timeNum||0;
    document.getElementById('editTime').value = timeDisplay;
    document.getElementById('editDescJa').value = item.desc.ja||''; document.getElementById('editDescEn').value = item.desc.en||''; document.getElementById('editDescZh').value = item.desc.zh||'';
  } else { document.getElementById('modalTitle').textContent = '新規メニュー'; document.getElementById('editMenuId').value = ''; document.getElementById('menuForm').reset(); }
  modal.classList.add('open');
}
function closeMenuModal() { document.getElementById('menuModal').classList.remove('open'); }

function saveMenuFromModal() {
  const id = document.getElementById('editMenuId').value;
  const priceInput = document.getElementById('editPrice').value.trim();
  const priceStr = priceInput.replace(/^\$/, '');
  const pn = parseInt(priceStr.replace(/[〜~].*/,'')) || 0;
  const displayPrice = '$' + priceStr;
  const timeInput = document.getElementById('editTime').value.trim();
  const timeStr = timeInput.replace(/分$/, '');
  const tn = parseInt(timeStr.replace(/[〜~].*/,'')) || 0;
  const mi = { id: id||'m-'+Date.now(), name:{ja:document.getElementById('editNameJa').value.trim(),en:document.getElementById('editNameEn').value.trim(),zh:document.getElementById('editNameZh').value.trim()}, price:displayPrice, priceNum:pn, desc:{ja:document.getElementById('editDescJa').value.trim(),en:document.getElementById('editDescEn').value.trim(),zh:document.getElementById('editDescZh').value.trim()}, time:{ja:`約${timeStr}分`,en:`~${timeStr} min`,zh:`约${timeStr}分钟`}, timeNum:tn };
  const items = getManagedMenuItems(); const idx = items.findIndex(x => x.id === id);
  if (idx < 0 && items.length >= MAX_MENU_ITEMS) {
    showToast(`メニューは最大${MAX_MENU_ITEMS}件までです`); return;
  }
  if (idx >= 0) items[idx] = mi; else items.push(mi);
  saveManagedMenuItems(items); renderMenuMgmtList(); closeMenuModal(); showToast(idx >= 0 ? '更新しました' : '追加しました');
}

function initPhotoManagement() {
  const previewImg = document.getElementById('currentPhoto');
  const siteData = getSiteData();
  if (siteData.profilePhoto && previewImg) previewImg.src = siteData.profilePhoto;
  document.getElementById('photoUpload')?.addEventListener('change', (e) => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { if (previewImg) previewImg.src = ev.target.result; const d = getSiteData(); d.profilePhoto = ev.target.result; saveSiteData(d); showToast('写真を更新しました'); };
    reader.readAsDataURL(file);
  });
  document.getElementById('resetPhotoBtn')?.addEventListener('click', () => { if (previewImg) previewImg.src = 'stylist.jpg'; const d = getSiteData(); delete d.profilePhoto; saveSiteData(d); showToast('デフォルトに戻しました'); });
}

// ==========================================
// Toast
// ==========================================
function showToast(message) {
  const existing = document.querySelector('.toast'); if (existing) existing.remove();
  const toast = document.createElement('div'); toast.className = 'toast'; toast.textContent = message;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 300); }, 2500);
}

// Resize handler
let resizeTimer;
window.addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(() => initCharts(), 200); });
