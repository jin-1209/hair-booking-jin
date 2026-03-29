// ==========================================
// JIN Dashboard — Full Salon Management
// ==========================================

'use strict';

// --- Data Helpers ---
function loadData(key, fallback) { try { const d = localStorage.getItem(key); return d ? JSON.parse(d) : fallback; } catch(e) { return fallback; } }
function saveData(key, data) { localStorage.setItem(key, JSON.stringify(data)); }

// ==========================================
// IndexedDB — 写真データ保存用
// localStorageは5MBの制限があるため、画像はIndexedDBに保存
// ==========================================
function openPhotoDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('SalonPhotoDB', 1);
    request.onerror = () => reject(request.error);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('photos')) {
        db.createObjectStore('photos', { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
  });
}

function savePhotoToDB(key, dataUrl) {
  return openPhotoDB().then(db => {
    return new Promise((resolve, reject) => {
      const tx = db.transaction('photos', 'readwrite');
      tx.objectStore('photos').put({ id: key, data: dataUrl, updatedAt: Date.now() });
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  });
}

function getPhotoFromDB(key) {
  return openPhotoDB().then(db => {
    return new Promise((resolve, reject) => {
      const tx = db.transaction('photos', 'readonly');
      const request = tx.objectStore('photos').get(key);
      request.onsuccess = () => resolve(request.result ? request.result.data : null);
      request.onerror = () => reject(request.error);
    });
  });
}

function deletePhotoFromDB(key) {
  return openPhotoDB().then(db => {
    return new Promise((resolve, reject) => {
      const tx = db.transaction('photos', 'readwrite');
      tx.objectStore('photos').delete(key);
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  });
}

// サイト情報のデフォルト値（ダッシュボード・予約サイト共通）
// localStorageに保存済みの値がない場合にこの値が使われる
const DEFAULT_SITE_DATA = {
  stylistName: 'JIN',
  salonName: 'Beauty Stylist at TOKI+LIM',
  stylistBio: '東京・原宿、表参道、青山で20年間、美容師として技術を磨いてきました。東京の有名サロン2店舗で経験を積んだ後、2015年に兄と共に原宿で独立。2022年には青山にBar併設サロンをオープン。コロナ禍での閉業を経て、白髪ぼかし専門店で3年間の経験を重ね、2025年4月よりシンガポール・ラッフルズホテル内のTOKI+LIMにて、活動の拠点を移しました。',
  instagram: 'https://instagram.com/jinstaglam.hair',
  yearsExp: '20',
  clientsServed: '3,000',
  rating: '4.9',
  address: '328 North Bridge Road\n#02-33 Raffles Hotel Arcade\nSingapore 188719',
  businessHours: '10:00 〜 20:00',
  closedDay: '毎週火曜日',
  phone: '+65 6259 3200',
  email: 'info@tokilim.com',
  heroBadge: '完全予約制 · マンツーマン施術',
  heroTitle1: '東京20年の技術を、',
  heroTitle2: 'シンガポールで。',
  heroDesc: '原宿・表参道・青山 — 東京のトップサロンで20年磨き上げた技術と感性。完全マンツーマンで、あなただけのスタイルをお届けします。',
  heroCta: '今すぐ予約'
};

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

// --- Unified Booking Data (Server API + localStorage cache) ---
const DASHBOARD_AUTH = 'Bearer jin2025';

function getBookings() { return loadData('salonBookings', DEMO_BOOKINGS); }
function saveBookings(b) { saveData('salonBookings', b); }

// サーバーから全予約を取得しlocalStorageにキャッシュ
function fetchBookingsFromServer() {
  return fetch('/api/bookings?all=true', {
    headers: { 'Authorization': DASHBOARD_AUTH }
  })
  .then(res => res.json())
  .then(result => {
    if (result.success && result.bookings) {
      saveBookings(result.bookings);
      console.log(`サーバーから${result.bookings.length}件の予約を取得`);
      return result.bookings;
    }
    return null;
  })
  .catch(err => {
    console.warn('サーバー予約取得エラー（ローカルキャッシュ使用）:', err.message);
    return null;
  });
}

// サーバーでステータスを更新
function updateBookingOnServer(bookingId, newStatus) {
  return fetch('/api/bookings', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': DASHBOARD_AUTH
    },
    body: JSON.stringify({ id: bookingId, status: newStatus })
  })
  .then(res => res.json())
  .then(result => {
    if (result.success) {
      console.log(`サーバー予約更新: ${bookingId} → ${newStatus}`);
    } else {
      console.warn('サーバー予約更新失敗:', result.error);
    }
    return result;
  })
  .catch(err => {
    console.warn('サーバー予約更新エラー:', err.message);
    return { success: false };
  });
}

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
  initReviewsManage();
  initBookingTimeline();
  initManualBooking();

  // サーバーから最新予約を取得して反映
  syncBookingsFromServer();

  // 60秒ごとに自動リフレッシュ（新規予約をキャッチ）
  setInterval(syncBookingsFromServer, 60000);
}

// サーバーから予約を取得し、画面全体を更新
function syncBookingsFromServer() {
  fetchBookingsFromServer().then(bookings => {
    if (bookings) {
      renderOverviewTimeline();
      renderRecentBookings();
      renderDayTimeline();
      // 現在のフィルタを維持して予約テーブルを再レンダリング
      const bs = document.getElementById('bookingSearch');
      const bf = document.getElementById('bookingFilter');
      renderBookingsTable(bf?.value, bs?.value);
      // KPIも更新
      updateKPI();
    }
  });
}

// KPIカード（概要）を最新予約データで更新
function updateKPI() {
  const bookings = getBookings();
  const todayStr = new Date().toISOString().split('T')[0];
  const todayBookings = bookings.filter(b => b.date === todayStr && b.status !== 'cancelled');
  const monthStr = todayStr.substring(0, 7); // YYYY-MM
  const monthBookings = bookings.filter(b => b.date.startsWith(monthStr) && b.status !== 'cancelled');
  const monthRevenue = monthBookings.reduce((s, b) => s + (b.price || 0), 0);

  const kpiNums = document.querySelectorAll('.kpi-number');
  if (kpiNums[0]) kpiNums[0].textContent = todayBookings.length;
  if (kpiNums[1]) kpiNums[1].textContent = '$' + monthRevenue.toLocaleString();
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
  // 予約管理に切り替えたらタイムラインを更新
  if (section === 'bookings') {
    renderDayTimeline();
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
  tb.innerHTML = data.map(b => {
    let actions = '';
    if (b.status === 'pending') {
      actions = `<button class="action-btn" onclick="changeBookingStatus('${b.id}', 'confirm')">確定</button> <button class="action-btn cancel-btn" onclick="changeBookingStatus('${b.id}', 'cancel')">キャンセル</button>`;
    } else if (b.status === 'confirmed') {
      actions = `<button class="action-btn" onclick="changeBookingStatus('${b.id}', 'complete')">完了</button> <button class="action-btn cancel-btn" onclick="changeBookingStatus('${b.id}', 'cancel')">キャンセル</button>`;
    } else {
      actions = `<span class="text-muted">—</span>`;
    }
    return `
    <tr>
      <td data-label="ID"><span class="booking-id">${b.id}</span></td>
      <td data-label="Client">${b.client}</td>
      <td data-label="Service">${b.menu}</td>
      <td data-label="Date/Time">${b.date} ${b.time}</td>
      <td data-label="Price">$${b.price}</td>
      <td data-label="Status"><span class="status-badge st-${b.status}">${statusLabels[b.status]}</span></td>
      <td data-label="Action">${actions}</td>
    </tr>`;
  }).join('');
}

function changeBookingStatus(bookingId, action) {
  const bookings = getBookings();
  const b = bookings.find(x => x.id === bookingId);
  if (!b) return;

  let newStatus = '';
  if (action === 'confirm' && b.status === 'pending') {
    newStatus = 'confirmed';
    showToast('予約を確定しました');
  } else if (action === 'complete' && b.status === 'confirmed') {
    newStatus = 'completed';
    showToast('施術完了にしました');
  } else if (action === 'cancel' && (b.status === 'pending' || b.status === 'confirmed')) {
    if (!confirm(`${b.client}の予約をキャンセルしますか？\n${b.menu} - ${b.date} ${b.time}`)) return;
    newStatus = 'cancelled';
    showToast('予約をキャンセルしました');
  } else {
    return;
  }

  // ローカルを即時更新（UI反映）
  b.status = newStatus;
  saveBookings(bookings);
  renderBookingsTable();
  renderRecentBookings();
  renderOverviewTimeline();
  updateKPI();

  // サーバーにも同期（予約サイトの空き状況に反映）
  updateBookingOnServer(bookingId, newStatus);

  // キャンセル時WhatsApp送信
  if (newStatus === 'cancelled' && b.phone) {
    fetch('/api/send-sms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'cancellation',
        channel: 'whatsapp',
        to: b.phone,
        customerName: b.client,
        menuName: b.menu,
        date: b.date,
        time: b.time,
        phone: b.phone
      })
    })
    .then(r => r.json())
    .then(result => console.log('Cancellation WhatsApp sent:', result))
    .catch(err => console.error('Cancellation WhatsApp error:', err));
  }
}

function initSearch() {
  const bs = document.getElementById('bookingSearch');
  const bf = document.getElementById('bookingFilter');
  if (bs) bs.addEventListener('input', () => renderBookingsTable(bf?.value, bs.value));
  if (bf) bf.addEventListener('change', () => renderBookingsTable(bf.value, bs?.value));
}

// ==========================================
// Manual Booking (手動予約追加)
// ==========================================
function openManualBookingModal(dateStr, timeStr) {
  const modal = document.getElementById('addBookingModal');
  const dateInput = document.getElementById('newBookingDate');
  const timeInput = document.getElementById('newBookingTime');

  if (!modal) return;
  resetManualBookingForm();
  populateMenuOptions();
  
  if (dateInput) {
    dateInput.value = dateStr || new Date().toISOString().split('T')[0];
  }
  if (timeStr && timeInput) {
    timeInput.value = timeStr;
  }
  
  modal.classList.add('open');
}

function initManualBooking() {
  const modal = document.getElementById('addBookingModal');
  const openBtn = document.getElementById('addBookingBtn');
  const closeBtn = document.getElementById('addBookingModalClose');
  const cancelBtn = document.getElementById('addBookingCancelBtn');
  const form = document.getElementById('addBookingForm');
  const menuSelect = document.getElementById('newBookingMenu');
  const priceInput = document.getElementById('newBookingPrice');
  const dateInput = document.getElementById('newBookingDate');
  const errorEl = document.getElementById('addBookingError');

  if (!modal || !openBtn) return;

  // モーダルを開く
  openBtn.addEventListener('click', () => {
    openManualBookingModal();
  });

  // モーダルを閉じる
  closeBtn?.addEventListener('click', () => modal.classList.remove('open'));
  cancelBtn?.addEventListener('click', () => modal.classList.remove('open'));
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('open'); });

  // メニュー選択で料金を自動入力
  menuSelect?.addEventListener('change', () => {
    const selected = menuSelect.value;
    if (!selected) { priceInput.value = ''; return; }
    const menuItems = getManagedMenuItems();
    const item = menuItems.find(m => {
      const name = typeof m.name === 'string' ? m.name : (m.name.ja || '');
      return name === selected;
    });
    if (item) {
      const numPrice = item.priceNum || parseInt(String(item.price).replace(/[^0-9]/g, '')) || 0;
      priceInput.value = numPrice;
    }
  });

  // フォーム送信
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorEl.style.display = 'none';

    const client = document.getElementById('newBookingClient').value.trim();
    const phone = document.getElementById('newBookingPhone').value.trim();
    const email = document.getElementById('newBookingEmail').value.trim();
    const menu = menuSelect.value;
    const date = dateInput.value;
    const time = document.getElementById('newBookingTime').value;
    const price = parseInt(priceInput.value) || 0;
    const status = document.getElementById('newBookingStatus').value;
    const note = document.getElementById('newBookingNote').value.trim();

    // バリデーション
    if (!client) { showBookingError('お客様名を入力してください。'); return; }
    if (!menu) { showBookingError('メニューを選択してください。'); return; }
    if (!date) { showBookingError('日付を選択してください。'); return; }
    if (!time) { showBookingError('時間を選択してください。'); return; }

    // 施術時間を取得
    const menuItems = getManagedMenuItems();
    const menuItem = menuItems.find(m => {
      const name = typeof m.name === 'string' ? m.name : (m.name.ja || '');
      return name === menu;
    });
    const duration = menuItem?.timeNum || 60;

    // 送信ボタンを無効化
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = '登録中...';

    try {
      // サーバーAPIで登録（ダブルブッキング防止チェック込み）
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client, phone, email, menu, date, time, price, duration, note
        })
      });
      const result = await response.json();

      if (response.status === 409) {
        // ダブルブッキング
        showBookingError(`この時間帯は既に予約が入っています（${result.conflict?.existingTime} ${result.conflict?.existingMenu}）。別の時間を選択してください。`);
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        return;
      }

      if (!response.ok || !result.success) {
        showBookingError(result.error || '予約の登録に失敗しました。');
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        return;
      }

      // ステータスが保留中の場合、サーバー側でconfirmedになるのでPUTで上書き
      if (status === 'pending' && result.booking?.id) {
        await updateBookingOnServer(result.booking.id, 'pending');
      }

      // ローカルキャッシュを更新
      await syncBookingsFromServer();

      // モーダルを閉じる
      modal.classList.remove('open');
      showToast(`${client}の予約を追加しました`);

    } catch (err) {
      // サーバー不到達の場合はローカルに保存
      console.warn('サーバー登録失敗、ローカルに保存:', err.message);
      const newBooking = addBooking({
        client, phone, email, menu, date, time, price, duration,
        note, status, createdAt: new Date().toISOString()
      });
      renderBookingsTable();
      renderRecentBookings();
      renderOverviewTimeline();
      renderDayTimeline();
      updateKPI();
      modal.classList.remove('open');
      showToast(`${client}の予約を追加しました（オフライン）`);
    }

    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  });
}

function populateMenuOptions() {
  const menuSelect = document.getElementById('newBookingMenu');
  if (!menuSelect) return;
  const menuItems = getManagedMenuItems();
  menuSelect.innerHTML = '<option value="">メニューを選択...</option>';
  menuItems.forEach(item => {
    const name = typeof item.name === 'string' ? item.name : (item.name.ja || item.name.en || '');
    const price = item.price || '';
    const opt = document.createElement('option');
    opt.value = name;
    opt.textContent = `${name}（${price}）`;
    menuSelect.appendChild(opt);
  });
}

function resetManualBookingForm() {
  const form = document.getElementById('addBookingForm');
  if (form) form.reset();
  const errorEl = document.getElementById('addBookingError');
  if (errorEl) errorEl.style.display = 'none';
}

function showBookingError(message) {
  const errorEl = document.getElementById('addBookingError');
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.style.display = 'block';
  }
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

  // Day modal events
  initShiftDayModal();
}

function initShiftDayModal() {
  const modal = document.getElementById('shiftDayModal');
  if (!modal) return;

  document.getElementById('shiftDayModalClose')?.addEventListener('click', () => modal.classList.remove('open'));
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('open'); });

  // Toggle hours area visibility on status change
  document.querySelectorAll('input[name="shiftDayStatus"]').forEach(radio => {
    radio.addEventListener('change', () => {
      const hoursArea = document.getElementById('shiftDayHoursArea');
      if (hoursArea) hoursArea.style.display = radio.value === 'work' ? 'block' : 'none';
    });
  });

  document.getElementById('shiftDaySave')?.addEventListener('click', () => {
    const dateStr = document.getElementById('shiftDayDate').value;
    const isOff = document.querySelector('input[name="shiftDayStatus"]:checked')?.value === 'off';
    const shifts = getShifts();

    if (isOff) {
      shifts[dateStr] = { isOff: true };
    } else {
      const openTime = document.getElementById('shiftDayOpen').value || '';
      const closeTime = document.getElementById('shiftDayClose').value || '';
      const lastReception = document.getElementById('shiftDayLast').value || '';
      // If all fields empty, it means "use defaults" → still save to override closed day
      shifts[dateStr] = { isOff: false, openTime, closeTime, lastReception };
    }

    saveShifts(shifts);
    renderShiftCalendar();
    modal.classList.remove('open');
    showToast('日別設定を保存しました');
  });

  document.getElementById('shiftDayReset')?.addEventListener('click', () => {
    const dateStr = document.getElementById('shiftDayDate').value;
    const shifts = getShifts();
    delete shifts[dateStr];
    saveShifts(shifts);
    renderShiftCalendar();
    modal.classList.remove('open');
    showToast('日別設定をリセットしました');
  });
}

function openShiftDayModal(dateStr) {
  const modal = document.getElementById('shiftDayModal');
  if (!modal) return;

  // Parse date for display
  const [y, m, d] = dateStr.split('-');
  const weekDay = ['日','月','火','水','木','金','土'][new Date(parseInt(y), parseInt(m)-1, parseInt(d)).getDay()];
  document.getElementById('shiftDayModalTitle').textContent = `${parseInt(m)}/${parseInt(d)}（${weekDay}）の設定`;
  document.getElementById('shiftDayDate').value = dateStr;

  // Load existing data
  const shifts = getShifts();
  const shiftData = shifts[dateStr];
  const defaults = loadData('salonShiftSettings', { openTime:'10:00', closeTime:'20:00', lastReception:'19:00' });

  if (shiftData?.isOff) {
    document.querySelector('input[name="shiftDayStatus"][value="off"]').checked = true;
    document.getElementById('shiftDayHoursArea').style.display = 'none';
  } else {
    document.querySelector('input[name="shiftDayStatus"][value="work"]').checked = true;
    document.getElementById('shiftDayHoursArea').style.display = 'block';
  }

  // Populate hours (use day-specific or default)
  document.getElementById('shiftDayOpen').value = shiftData?.openTime || defaults.openTime || '10:00';
  document.getElementById('shiftDayClose').value = shiftData?.closeTime || defaults.closeTime || '20:00';
  document.getElementById('shiftDayLast').value = shiftData?.lastReception || defaults.lastReception || '19:00';

  modal.classList.add('open');
}

function getShifts() { return loadData('salonShifts', {}); }
function saveShifts(s) {
  saveData('salonShifts', s);
  syncShiftsToServer();
}

function getClosedDays() {
  const settings = loadData('salonShiftSettings', { closedDays: [2] });
  return settings.closedDays || [2];
}

// 曜日別の営業時間を取得
function getDayHours(dayOfWeek) {
  const settings = loadData('salonShiftSettings', {});
  const weeklyHours = settings.weeklyHours || {};
  const daySettings = weeklyHours[dayOfWeek];
  if (daySettings) return daySettings;
  // フォールバック: 旧形式の共通設定
  return {
    openTime: settings.openTime || '10:00',
    closeTime: settings.closeTime || '20:00',
    lastReception: settings.lastReception || '19:00'
  };
}

function saveShiftSettings() {
  const rows = document.querySelectorAll('.wh-row');
  const closedDays = [];
  const weeklyHours = {};

  rows.forEach(row => {
    const day = parseInt(row.dataset.day);
    const isClosed = row.querySelector('.wh-closed')?.checked || false;
    const openTime = row.querySelector('.wh-open')?.value || '10:00';
    const closeTime = row.querySelector('.wh-close')?.value || '20:00';
    const lastReception = row.querySelector('.wh-last')?.value || '19:00';

    if (isClosed) closedDays.push(day);

    weeklyHours[day] = { openTime, closeTime, lastReception };
  });

  // 旧形式との互換性のため、月曜のデータをデフォルトとして保存
  const defaultDay = weeklyHours[1] || { openTime: '10:00', closeTime: '20:00', lastReception: '19:00' };

  const settings = {
    openTime: defaultDay.openTime,
    closeTime: defaultDay.closeTime,
    lastReception: defaultDay.lastReception,
    closedDays,
    weeklyHours
  };
  saveData('salonShiftSettings', settings);
  syncShiftsToServer();
}

// シフトデータをサーバーに同期
function syncShiftsToServer() {
  const siteData = getSiteData();
  siteData.shiftSettings = loadData('salonShiftSettings', {});
  siteData.shifts = loadData('salonShifts', {});
  fetch('/api/site-data', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': DASHBOARD_AUTH },
    body: JSON.stringify(siteData)
  })
  .then(res => res.json())
  .then(r => { if (r.success) console.log('シフトをサーバーに同期'); })
  .catch(e => console.warn('シフト同期エラー:', e.message));
}

function loadShiftSettings() {
  const s = loadData('salonShiftSettings', {
    openTime: '10:00', closeTime: '20:00', lastReception: '19:00', closedDays: [2]
  });
  const weeklyHours = s.weeklyHours || {};
  const closedDays = s.closedDays || [2];
  const defaultOpen = s.openTime || '10:00';
  const defaultClose = s.closeTime || '20:00';
  const defaultLast = s.lastReception || '19:00';

  const rows = document.querySelectorAll('.wh-row');
  rows.forEach(row => {
    const day = parseInt(row.dataset.day);
    const dayData = weeklyHours[day];
    const isClosed = closedDays.includes(day);

    row.querySelector('.wh-open').value = dayData?.openTime || defaultOpen;
    row.querySelector('.wh-close').value = dayData?.closeTime || defaultClose;
    row.querySelector('.wh-last').value = dayData?.lastReception || defaultLast;
    row.querySelector('.wh-closed').checked = isClosed;

    // 定休日の行をグレーアウト
    row.classList.toggle('wh-closed-row', isClosed);

    // 定休日チェックボックスのイベント
    row.querySelector('.wh-closed').addEventListener('change', function() {
      row.classList.toggle('wh-closed-row', this.checked);
    });
  });
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
  const defaults = loadData('salonShiftSettings', { openTime:'10:00', closeTime:'20:00', lastReception:'19:00' });
  let html = '';

  for (let i = 0; i < firstDay; i++) html += '<div class="shift-cell empty"></div>';
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${shiftYear}-${String(shiftMonth_ + 1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const dow = new Date(shiftYear, shiftMonth_, d).getDay();
    const isClosedDay = closedDays.includes(dow);
    const shiftData = shifts[dateStr];
    const isOff = shiftData?.isOff || false;
    let cls = 'shift-cell';
    let statusText = '';
    let hoursText = '';

    if (isClosedDay && !shiftData) {
      cls += ' holiday';
      statusText = '定休';
    } else if (isOff) {
      cls += ' off';
      statusText = '休み';
    } else {
      cls += ' work';
      statusText = '出勤';
      // Show custom hours if set
      const openTime = shiftData?.openTime || defaults.openTime || '10:00';
      const closeTime = shiftData?.closeTime || defaults.closeTime || '20:00';
      if (shiftData && (shiftData.openTime || shiftData.closeTime)) {
        hoursText = `${openTime}~${closeTime}`;
      }
    }

    const today = new Date();
    if (d === today.getDate() && shiftMonth_ === today.getMonth() && shiftYear === today.getFullYear()) cls += ' today';

    html += `<div class="${cls}" data-date="${dateStr}">
      <span class="shift-day">${d}</span>
      <span class="shift-status">${statusText}</span>
      ${hoursText ? `<span class="shift-hours">${hoursText}</span>` : ''}
    </div>`;
  }
  grid.innerHTML = html;

  grid.querySelectorAll('.shift-cell:not(.empty)').forEach(cell => {
    cell.addEventListener('click', () => {
      openShiftDayModal(cell.dataset.date);
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

  // プッシュ通知有効化ボタン
  const pushBtn = document.getElementById('enablePushBtn');
  if (pushBtn) {
    // 現在の状態を反映
    if ('Notification' in window && Notification.permission === 'granted') {
      pushBtn.textContent = '有効 ✓';
      pushBtn.style.background = '#22c55e';
    }
    pushBtn.addEventListener('click', async () => {
      if (typeof requestNotificationPermission === 'function') {
        const granted = await requestNotificationPermission();
        if (granted) {
          pushBtn.textContent = '有効 ✓';
          pushBtn.style.background = '#22c55e';
          showToast('プッシュ通知を有効にしました');
          // テスト通知を送信
          if (typeof sendLocalNotification === 'function') {
            sendLocalNotification('通知テスト', 'プッシュ通知が正常に有効化されました。', { tag: 'test' });
          }
        } else {
          showToast('通知の許可が拒否されました。ブラウザの設定を確認してください。');
        }
      } else {
        showToast('通知機能が利用できません。サイトをHTTPS環境でお使いください。');
      }
    });
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
function saveManagedMenuItems(items) {
  saveData('salonMenuItems', items);
  // サーバーにもメニューを同期（全デバイス共有）
  syncMenuToServer(items);
}

// サーバーへメニューデータを同期
function syncMenuToServer(items) {
  fetch('/api/site-data', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': DASHBOARD_AUTH
    },
    body: JSON.stringify({ ...getSiteData(), menuItems: items })
  })
  .then(res => res.json())
  .then(result => {
    if (result.success) console.log('メニューをサーバーに同期しました');
    else console.warn('メニュー同期失敗:', result.error);
  })
  .catch(err => console.warn('メニューサーバー同期エラー:', err.message));
}

// デフォルト値とlocalStorageの保存済みデータをマージして返す
function getSiteData() {
  const saved = loadData('salonSiteData', {});
  // デフォルト値をベースに、保存済みのデータ（null以外）で上書き
  const merged = { ...DEFAULT_SITE_DATA };
  Object.keys(saved).forEach(key => {
    if (saved[key] !== null && saved[key] !== undefined) {
      merged[key] = saved[key];
    }
  });
  return merged;
}
function saveSiteData(data) {
  try {
    // 写真データは除外
    const dataForStorage = { ...data };
    delete dataForStorage.profilePhoto;
    
    // localStorageに保存（即時反映用キャッシュ）
    saveData('salonSiteData', dataForStorage);
    
    // サーバーにも保存（全デバイス共有）
    syncSiteDataToServer(dataForStorage);
    
    return true;
  } catch (e) {
    console.error('saveSiteData error:', e);
    return false;
  }
}

// サーバーへ設定データを同期
function syncSiteDataToServer(data) {
  fetch('/api/site-data', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer jin2025'
    },
    body: JSON.stringify(data)
  })
  .then(res => res.json())
  .then(result => {
    if (result.success) {
      console.log('Site data synced to server');
    } else {
      console.warn('Server sync failed:', result.error);
    }
  })
  .catch(err => {
    console.warn('Server sync error (will retry on next save):', err);
  });
}

function initSiteManage() { initHeroTextForm(); initSiteInfoForm(); initMenuManagement(); initPhotoManagement(); }

function initHeroTextForm() {
  const form = document.getElementById('heroTextForm');
  if (!form) return;
  loadHeroTextIntoForm();
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = getSiteData();
    ['heroBadge','heroTitle1','heroTitle2','heroDesc','heroCta'].forEach(key => {
      const el = document.getElementById('edit' + key.charAt(0).toUpperCase() + key.slice(1));
      if (el) data[key] = el.value.trim() || null;
    });
    saveSiteData(data);
    showToast('トップページの文章を保存しました');
  });
  document.getElementById('resetHeroTextBtn')?.addEventListener('click', () => {
    if (!confirm('デフォルトに戻しますか？')) return;
    const data = getSiteData();
    ['heroBadge','heroTitle1','heroTitle2','heroDesc','heroCta'].forEach(k => delete data[k]);
    saveSiteData(data);
    loadHeroTextIntoForm();
    showToast('リセットしました');
  });
}

function loadHeroTextIntoForm() {
  const data = getSiteData();
  const fields = {
    editHeroBadge: 'heroBadge',
    editHeroTitle1: 'heroTitle1',
    editHeroTitle2: 'heroTitle2',
    editHeroDesc: 'heroDesc',
    editHeroCta: 'heroCta'
  };
  Object.entries(fields).forEach(([elId, key]) => {
    const el = document.getElementById(elId);
    if (el) el.value = data[key] || DEFAULT_SITE_DATA[key] || '';
  });
}

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
  const fields = {
    editStylistName: 'stylistName',
    editSalonName: 'salonName',
    editStylistBio: 'stylistBio',
    editInstagram: 'instagram',
    editYearsExp: 'yearsExp',
    editClientsServed: 'clientsServed',
    editRating: 'rating',
    editAddress: 'address',
    editBusinessHours: 'businessHours',
    editClosedDay: 'closedDay',
    editPhone: 'phone',
    editEmail: 'email'
  };
  Object.entries(fields).forEach(([elId, key]) => {
    const el = document.getElementById(elId);
    if (el) el.value = data[key] || DEFAULT_SITE_DATA[key] || '';
  });
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

  let dragSrcIndex = null;

  items.forEach((item, index) => {
    const div = document.createElement('div'); div.className = 'menu-mgmt-item';
    div.setAttribute('draggable', 'true');
    div.dataset.index = index;

    // ドラッグハンドル
    const handle = `<span class="menu-drag-handle" title="ドラッグして並び替え">⠿</span>`;

    // 上下ボタン
    const upDisabled = index === 0 ? ' disabled' : '';
    const downDisabled = index === items.length - 1 ? ' disabled' : '';
    const orderBtns = `<div class="menu-order-btns"><button class="menu-order-btn move-up-btn"${upDisabled}>▲</button><button class="menu-order-btn move-down-btn"${downDisabled}>▼</button></div>`;

    div.innerHTML = `${handle}${orderBtns}<span class="menu-mgmt-name">${item.name.ja}</span><span class="menu-mgmt-price">${item.price}</span><span class="menu-mgmt-time">${item.time?.ja || (item.timeNum||'')+'分'}</span><div class="menu-mgmt-actions"><button class="edit-btn">編集</button><button class="delete-btn">削除</button></div>`;

    // 上下ボタンイベント
    div.querySelector('.move-up-btn')?.addEventListener('click', () => {
      if (index <= 0) return;
      const arr = getManagedMenuItems();
      [arr[index - 1], arr[index]] = [arr[index], arr[index - 1]];
      saveManagedMenuItems(arr); renderMenuMgmtList(); showToast('順番を変更しました');
    });
    div.querySelector('.move-down-btn')?.addEventListener('click', () => {
      if (index >= items.length - 1) return;
      const arr = getManagedMenuItems();
      [arr[index], arr[index + 1]] = [arr[index + 1], arr[index]];
      saveManagedMenuItems(arr); renderMenuMgmtList(); showToast('順番を変更しました');
    });

    // ドラッグ&ドロップイベント
    div.addEventListener('dragstart', (e) => {
      dragSrcIndex = index;
      div.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', index);
    });
    div.addEventListener('dragend', () => {
      div.classList.remove('dragging');
      c.querySelectorAll('.menu-mgmt-item').forEach(el => el.classList.remove('drag-over'));
    });
    div.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      div.classList.add('drag-over');
    });
    div.addEventListener('dragleave', () => {
      div.classList.remove('drag-over');
    });
    div.addEventListener('drop', (e) => {
      e.preventDefault();
      div.classList.remove('drag-over');
      const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
      const toIndex = index;
      if (fromIndex === toIndex) return;
      const arr = getManagedMenuItems();
      const [moved] = arr.splice(fromIndex, 1);
      arr.splice(toIndex, 0, moved);
      saveManagedMenuItems(arr); renderMenuMgmtList(); showToast('順番を変更しました');
    });

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

  document.getElementById('photoUpload')?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    console.log('写真アップロード開始:', file.name, 'サイズ:', Math.round(file.size / 1024) + 'KB');

    // 画像をリサイズ
    resizeImage(file, 800, 1000, 0.9)
      .then(dataUrl => {
        console.log('リサイズ完了。base64サイズ:', Math.round(dataUrl.length / 1024) + 'KB');

        // プレビューを即座に更新
        if (previewImg) previewImg.src = dataUrl;

        // リサイズした画像を stylist.jpg としてダウンロード
        downloadImage(dataUrl, 'stylist.jpg');

        showToast('stylist.jpg をダウンロードしました。プロジェクトフォルダに配置してデプロイしてください。');
      })
      .catch(err => {
        console.error('画像処理エラー:', err);
        showToast('画像の処理に失敗しました: ' + err.message);
      });
  });

  document.getElementById('resetPhotoBtn')?.addEventListener('click', () => {
    if (previewImg) previewImg.src = 'stylist.jpg';
    showToast('デフォルトの写真に戻しました');
  });
}

// リサイズした画像をファイルとしてダウンロード
function downloadImage(dataUrl, filename) {
  // base64 → Blob
  const byteString = atob(dataUrl.split(',')[1]);
  const mimeType = dataUrl.split(',')[0].split(':')[1].split(';')[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  const blob = new Blob([ab], { type: mimeType });

  // ダウンロードリンク作成
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// 画像をCanvas APIでリサイズ
function resizeImage(file, maxWidth, maxHeight, quality) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('ファイル読み込み失敗'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('画像データが不正です'));
      img.onload = () => {
        let w = img.width;
        let h = img.height;

        console.log('元画像サイズ:', w, 'x', h);

        // アスペクト比を維持してリサイズ
        if (w > maxWidth) {
          h = Math.round(h * maxWidth / w);
          w = maxWidth;
        }
        if (h > maxHeight) {
          w = Math.round(w * maxHeight / h);
          h = maxHeight;
        }

        console.log('リサイズ後:', w, 'x', h);

        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);

        resolve(canvas.toDataURL('image/jpeg', quality || 0.8));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
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

// ==========================================
// Reviews Management
// ==========================================
function initReviewsManage() {
  loadDashboardReviews();
}

async function loadDashboardReviews() {
  const pendingList = document.getElementById('pendingReviewsList');
  const approvedList = document.getElementById('approvedReviewsList');
  if (!pendingList || !approvedList) return;

  try {
    const res = await fetch('/api/reviews?all=true', {
      headers: { 'Authorization': 'Bearer jin2025' }
    });
    const result = await res.json();
    
    if (!result.success) {
      pendingList.innerHTML = '<p class="text-muted" style="padding:12px;">APIエラー</p>';
      approvedList.innerHTML = '<p class="text-muted" style="padding:12px;">APIエラー</p>';
      return;
    }

    const reviews = result.reviews || [];
    const pending = reviews.filter(r => r.status === 'pending');
    const approved = reviews.filter(r => r.status === 'approved');

    if (pending.length === 0) {
      pendingList.innerHTML = '<p class="text-muted" style="padding:16px;">未承認のクチコミはありません</p>';
    } else {
      pendingList.innerHTML = pending.map(r => renderDashboardReviewCard(r, true)).join('');
    }

    if (approved.length === 0) {
      approvedList.innerHTML = '<p class="text-muted" style="padding:16px;">承認済みのクチコミはありません</p>';
    } else {
      approvedList.innerHTML = approved.map(r => renderDashboardReviewCard(r, false)).join('');
    }
  } catch (err) {
    console.error('Reviews load error:', err);
    pendingList.innerHTML = '<p class="text-muted" style="padding:12px;">読み込みエラー</p>';
    approvedList.innerHTML = '';
  }
}

function renderDashboardReviewCard(review, isPending) {
  const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
  const actions = isPending ?
    `<div style="display:flex;gap:8px;flex-wrap:wrap;">
      <button class="action-btn" onclick="reviewAction('${review.id}', 'approve')">承認</button>
      <button class="action-btn cancel-btn" onclick="reviewAction('${review.id}', 'reject')">却下</button>
    </div>` :
    `<div style="display:flex;gap:8px;">
      <button class="action-btn cancel-btn" onclick="reviewAction('${review.id}', 'delete')">削除</button>
    </div>`;

  return `
    <div style="padding:16px;border-bottom:1px solid var(--color-border);">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;flex-wrap:wrap;gap:4px;">
        <div>
          <span style="font-weight:600;">${review.name}</span>
          <span style="color:var(--color-text-muted);font-size:0.8rem;margin-left:8px;">${review.date}</span>
          ${review.menu ? `<span style="color:var(--color-accent);font-size:0.8rem;margin-left:8px;">${review.menu}</span>` : ''}
        </div>
        <span style="color:#f59e0b;letter-spacing:2px;">${stars}</span>
      </div>
      <p style="font-size:0.9rem;color:var(--color-text-secondary);margin-bottom:12px;line-height:1.6;">${review.text}</p>
      ${actions}
    </div>
  `;
}

async function reviewAction(id, action) {
  if (action === 'delete' && !confirm('このクチコミを削除しますか？')) return;
  
  try {
    const res = await fetch('/api/reviews', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer jin2025'
      },
      body: JSON.stringify({ id, action })
    });
    const result = await res.json();
    
    if (result.success) {
      const msg = action === 'approve' ? '承認しました' :
                  action === 'reject' ? '却下しました' : '削除しました';
      showToast(msg);
      loadDashboardReviews();
    } else {
      showToast('エラー: ' + result.error);
    }
  } catch (err) {
    showToast('通信エラーが発生しました');
  }
}

// ==========================================
// 予約タイムラインビュー（縦型）
// ==========================================
let timelineDate = new Date();

function initBookingTimeline() {
  const prevBtn = document.getElementById('timelinePrev');
  const nextBtn = document.getElementById('timelineNext');
  const todayBtn = document.getElementById('timelineToday');

  if (!prevBtn) return;

  prevBtn.addEventListener('click', () => {
    timelineDate.setDate(timelineDate.getDate() - 1);
    renderDayTimeline();
  });
  nextBtn.addEventListener('click', () => {
    timelineDate.setDate(timelineDate.getDate() + 1);
    renderDayTimeline();
  });
  todayBtn.addEventListener('click', () => {
    timelineDate = new Date();
    renderDayTimeline();
  });

  renderDayTimeline();
}

function renderDayTimeline() {
  const container = document.getElementById('dayTimeline');
  const dateDisplay = document.getElementById('timelineDateDisplay');
  if (!container || !dateDisplay) return;

  const dateStr = formatDateISO(timelineDate);
  const dayNames = ['日', '月', '火', '水', '木', '金', '土'];
  const dayOfWeek = dayNames[timelineDate.getDay()];
  const todayStr = formatDateISO(new Date());
  const isToday = dateStr === todayStr;

  // 日付表示
  const m = timelineDate.getMonth() + 1;
  const d = timelineDate.getDate();
  dateDisplay.textContent = `${timelineDate.getFullYear()}年${m}月${d}日（${dayOfWeek}）`;
  if (isToday) dateDisplay.textContent += ' ← 今日';

  // 予約データを取得
  const allBookings = getBookings();
  const dayBookings = allBookings.filter(b =>
    b.date === dateStr && b.status !== 'cancelled'
  );

  // サーバーからも取得（非同期で更新）
  fetchTimelineFromServer(dateStr).then(serverBookings => {
    if (serverBookings && serverBookings.length > 0) {
      renderTimelineSlots(container, dateStr, mergeBookings(dayBookings, serverBookings), isToday);
    }
  });

  renderTimelineSlots(container, dateStr, dayBookings, isToday);
}

function mergeBookings(local, server) {
  const map = new Map();
  local.forEach(b => map.set(b.time + '_' + b.date, b));
  server.forEach(b => {
    const key = b.time + '_' + b.date;
    if (!map.has(key)) map.set(key, b);
  });
  return Array.from(map.values());
}

function fetchTimelineFromServer(dateStr) {
  return fetch(`/api/bookings?date=${dateStr}`)
    .then(r => r.json())
    .then(result => {
      if (result.success && result.bookings) return result.bookings;
      return [];
    })
    .catch(() => []);
}

function renderTimelineSlots(container, dateStr, bookings, isToday) {
  const statusLabels = { confirmed: '確定', pending: '保留中', completed: '完了', cancelled: 'キャンセル' };

  // シフト設定から営業時間を動的に取得
  const dateParts = dateStr.split('-').map(Number);
  const dateObj = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
  const dayOfWeek = dateObj.getDay();

  // 日別の個別設定を優先チェック
  const individualShifts = loadData('salonShifts', {});
  const dayShift = individualShifts[dateStr];

  let dayOpenTime = '10:00';
  let dayCloseTime = '20:00';

  if (dayShift && !dayShift.isOff) {
    // 日別設定がある場合
    if (dayShift.openTime) dayOpenTime = dayShift.openTime;
    if (dayShift.closeTime) dayCloseTime = dayShift.closeTime;
  } else if (!dayShift) {
    // 曜日別設定を取得
    const dayHours = getDayHours(dayOfWeek);
    dayOpenTime = dayHours.openTime || '10:00';
    dayCloseTime = dayHours.closeTime || '20:00';
  }

  const startHour = parseInt(dayOpenTime.split(':')[0]);
  const endHour = parseInt(dayCloseTime.split(':')[0]);

  // サマリー
  const totalBookings = bookings.length;
  const totalRevenue = bookings.reduce((s, b) => s + (b.price || 0), 0);
  let summaryHTML = `<div class="tl-day-summary">
    <span>予約数: <strong>${totalBookings}件</strong></span>
    <span>売上: <strong>$${totalRevenue.toLocaleString()}</strong></span>
  </div>`;

  // 時間帯スロット 30分刻み
  let slotsHTML = '';
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  let nowLineAdded = false;

  for (let h = startHour; h < endHour; h++) {
    for (let m = 0; m < 60; m += 30) {
      const timeStr = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
      const slotMinutes = h * 60 + m;
      const isHour = m === 0;

      // この時間帯に予約があるか
      const booking = bookings.find(b => b.time === timeStr);

      // 現在時刻ライン
      let nowLine = '';
      if (isToday && !nowLineAdded && slotMinutes >= nowMinutes) {
        const offset = ((nowMinutes - (startHour * 60)) / 30) * 54;
        nowLine = `<div class="tl-now-line" style="top: ${offset + 38}px;"></div>`;
        nowLineAdded = true;
      }

      const bookedClass = booking ? ' tl-slot-booked' : '';
      const hourClass = isHour ? ' tl-slot-hour' : '';
      const timeClass = isHour ? ' tl-hour-time' : '';

      let contentHTML = '';
      if (booking) {
        const initial = (booking.client || 'G')[0];
        const statusBadge = statusLabels[booking.status] || booking.status;
        contentHTML = `
          <div class="tl-booking-card">
            <div class="tl-booking-avatar">${initial}</div>
            <div class="tl-booking-info">
              <div class="tl-booking-name">${booking.client || 'Guest'}</div>
              <div class="tl-booking-menu">${booking.menu || ''} ${booking.duration ? '(' + booking.duration + '分)' : ''}</div>
            </div>
            <div class="tl-booking-price">$${booking.price || 0}</div>
            <span class="tl-booking-status st-${booking.status || 'confirmed'}">${statusBadge}</span>
          </div>`;
      } else {
        contentHTML = '<span class="tl-empty-text">—</span>';
      }

      const clickHandler = booking ? '' : `onclick="openManualBookingModal('${dateStr}', '${timeStr}')" style="cursor: pointer;"`;

      slotsHTML += `
        ${nowLine}
        <div class="tl-slot${hourClass}${bookedClass}" ${clickHandler}>
          <div class="tl-slot-time${timeClass}">${timeStr}</div>
          <div class="tl-slot-line"></div>
          <div class="tl-slot-content">${contentHTML}</div>
        </div>`;
    }
  }

  container.innerHTML = summaryHTML + slotsHTML;
}

function formatDateISO(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

