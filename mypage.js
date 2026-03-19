// ==========================================
// My Page - Customer Points & History
// ==========================================

// ====== Customer Data Management ======
function getAllCustomers() {
  try {
    const data = localStorage.getItem('salonCustomers');
    if (data) return JSON.parse(data);
  } catch(e) {}
  return {};
}

function saveAllCustomers(customers) {
  localStorage.setItem('salonCustomers', JSON.stringify(customers));
}

function getCustomer(phone) {
  const customers = getAllCustomers();
  return customers[phone] || null;
}

function createCustomer(phone, name, countryCode) {
  const customers = getAllCustomers();
  if (!customers[phone]) {
    customers[phone] = {
      phone: phone,
      countryCode: countryCode || '+65',
      name: name || '未設定',
      points: 0,
      totalEarned: 0,
      totalUsed: 0,
      visitCount: 0,
      referralCode: generateCode(),
      pointsHistory: [],
      bookingHistory: []
    };
    saveAllCustomers(customers);
  }
  return customers[phone];
}

function updateCustomer(phone, data) {
  const customers = getAllCustomers();
  if (customers[phone]) {
    customers[phone] = { ...customers[phone], ...data };
    saveAllCustomers(customers);
  }
}

function generateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'JIN-';
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

function addPoints(phone, amount, description) {
  const customers = getAllCustomers();
  const customer = customers[phone];
  if (!customer) return;

  customer.points += amount;
  if (amount > 0) {
    customer.totalEarned += amount;
  } else {
    customer.totalUsed += Math.abs(amount);
  }
  customer.pointsHistory.unshift({
    date: new Date().toISOString().split('T')[0],
    amount: amount,
    description: description,
    balance: customer.points
  });
  saveAllCustomers(customers);
}

function addBookingRecord(phone, booking) {
  const customers = getAllCustomers();
  const customer = customers[phone];
  if (!customer) return;

  customer.visitCount += 1;
  customer.bookingHistory.unshift({
    date: booking.date || new Date().toISOString().split('T')[0],
    menu: booking.menu || '',
    time: booking.time || '',
    price: booking.price || ''
  });
  saveAllCustomers(customers);

  // Also write to shared salonBookings for dashboard
  try {
    const bookings = JSON.parse(localStorage.getItem('salonBookings') || '[]');
    const newBooking = {
      id: 'B' + String(bookings.length + 1).padStart(3, '0'),
      client: customer.name && customer.name !== '未設定' ? customer.name : phone,
      phone: phone,
      menu: booking.menu || '',
      date: booking.date || new Date().toISOString().split('T')[0],
      time: booking.time || '',
      price: parseInt(booking.price) || 0,
      status: 'confirmed'
    };
    bookings.push(newBooking);
    localStorage.setItem('salonBookings', JSON.stringify(bookings));
  } catch(e) {}
}

// ====== Login / Logout ======
let currentUser = null;

function checkSession() {
  const phone = sessionStorage.getItem('mypagePhone');
  if (phone) {
    const customer = getCustomer(phone);
    if (customer) {
      currentUser = customer;
      showMyPage();
      return;
    }
  }
  // 以前ログインしたことがある場合は国番号を復元
  restoreSavedCountryCode();
  showLogin();
}

function showLogin() {
  document.getElementById('loginScreen').style.display = 'flex';
  document.getElementById('mypageContent').style.display = 'none';
}

function showMyPage() {
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('mypageContent').style.display = 'block';
  renderMyPage();
}

function handleLogin() {
  const phoneInput = document.getElementById('loginPhone');
  const countrySelect = document.getElementById('countryCode');
  const errorEl = document.getElementById('loginError');
  const phone = phoneInput.value.trim();
  const countryCode = countrySelect.value;

  if (!phone) {
    errorEl.textContent = '電話番号を入力してください。';
    return;
  }

  // Clean phone number (remove dashes, spaces)
  const cleaned = phone.replace(/[-\s]/g, '');
  // Full phone key = countryCode + cleaned number
  const fullPhone = countryCode + cleaned;

  let customer = getCustomer(fullPhone);
  if (!customer) {
    // Also try just cleaned number (backwards compat)
    customer = getCustomer(cleaned);
  }

  if (!customer) {
    // Auto-register new customer
    customer = createCustomer(fullPhone, '', countryCode);
    errorEl.textContent = '';
  }

  // Save country code for next login
  localStorage.setItem('mypageSavedCountryCode', countryCode);
  localStorage.setItem('mypageSavedPhone', cleaned);

  currentUser = customer;
  sessionStorage.setItem('mypagePhone', customer.phone);
  showMyPage();
}

function restoreSavedCountryCode() {
  const savedCode = localStorage.getItem('mypageSavedCountryCode');
  const savedPhone = localStorage.getItem('mypageSavedPhone');
  const countrySelect = document.getElementById('countryCode');
  const phoneInput = document.getElementById('loginPhone');

  if (savedCode && countrySelect) {
    countrySelect.value = savedCode;
    // 保存された国番号がある場合は固定する
    countrySelect.classList.add('locked');
  }
  if (savedPhone && phoneInput) {
    phoneInput.value = savedPhone;
  }
}

function handleLogout() {
  sessionStorage.removeItem('mypagePhone');
  // 国番号は保持する（次回ログインで固定するため）
  currentUser = null;
  showLogin();
  // 復元された電話番号を表示
  restoreSavedCountryCode();
}

// ====== Render My Page ======
function renderMyPage() {
  if (!currentUser) return;

  // Refresh data
  currentUser = getCustomer(currentUser.phone) || currentUser;

  // User name
  const nameEl = document.getElementById('mypageUserName');
  const displayPhone = currentUser.countryCode 
    ? `${currentUser.countryCode} ${currentUser.phone.replace(currentUser.countryCode, '')}` 
    : currentUser.phone;
  nameEl.textContent = currentUser.name && currentUser.name !== '未設定' 
    ? `${currentUser.name} 様` 
    : displayPhone;

  // Points card
  document.getElementById('pointsValue').textContent = currentUser.points.toLocaleString();
  document.getElementById('totalEarned').textContent = currentUser.totalEarned.toLocaleString();
  document.getElementById('totalUsed').textContent = currentUser.totalUsed.toLocaleString();
  document.getElementById('visitCount').textContent = currentUser.visitCount;

  // Available points for use
  const availEl = document.getElementById('availablePoints');
  if (availEl) availEl.textContent = `${currentUser.points} pt`;

  // Referral URL
  const refUrlEl = document.getElementById('mypageReferralUrl');
  if (refUrlEl) {
    const baseUrl = window.location.origin + '/index.html';
    refUrlEl.value = `${baseUrl}?ref=${currentUser.referralCode}`;
  }

  // Points History
  renderPointsHistory();

  // Booking History
  renderBookingHistory();
}

function renderPointsHistory() {
  const container = document.getElementById('pointsHistory');
  if (!currentUser.pointsHistory || currentUser.pointsHistory.length === 0) {
    container.innerHTML = '<p class="history-empty">まだポイント履歴がありません。</p>';
    return;
  }

  container.innerHTML = currentUser.pointsHistory.map(item => {
    const isEarn = item.amount > 0;
    return `
      <div class="history-item">
        <div class="history-icon ${isEarn ? 'earn' : 'spend'}">
          ${isEarn ? '＋' : '−'}
        </div>
        <div class="history-detail">
          <div class="history-detail-title">${item.description}</div>
          <div class="history-detail-date">${item.date}</div>
        </div>
        <div class="history-amount ${isEarn ? 'earn' : 'spend'}">
          ${isEarn ? '+' : ''}${item.amount} pt
        </div>
      </div>
    `;
  }).join('');
}

function renderBookingHistory() {
  const container = document.getElementById('bookingHistory');
  if (!currentUser.bookingHistory || currentUser.bookingHistory.length === 0) {
    container.innerHTML = '<p class="history-empty">まだ予約履歴がありません。</p>';
    return;
  }

  container.innerHTML = currentUser.bookingHistory.map(item => `
    <div class="history-item">
      <div class="history-icon booking">📋</div>
      <div class="history-detail">
        <div class="history-detail-title">${item.menu}</div>
        <div class="history-detail-date">${item.date} ${item.time ? '/ ' + item.time : ''}</div>
      </div>
      <div class="history-amount" style="color: #b5835a;">
        ${item.price}
      </div>
    </div>
  `).join('');
}

// ====== Event Listeners ======
document.addEventListener('DOMContentLoaded', () => {
  // Login
  document.getElementById('loginBtn').addEventListener('click', handleLogin);
  document.getElementById('loginPhone').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleLogin();
  });

  // Logout
  document.getElementById('logoutBtn').addEventListener('click', handleLogout);

  // Show Referral
  document.getElementById('showReferralBtn').addEventListener('click', () => {
    const card = document.getElementById('referralCard');
    card.style.display = card.style.display === 'none' ? 'block' : 'none';
  });

  // Copy Referral
  document.getElementById('mypageCopyBtn').addEventListener('click', () => {
    const urlInput = document.getElementById('mypageReferralUrl');
    const feedback = document.getElementById('mypageCopyFeedback');
    navigator.clipboard.writeText(urlInput.value).then(() => {
      feedback.textContent = '✅ コピーしました！';
      setTimeout(() => { feedback.textContent = ''; }, 3000);
    });
  });

  // Use Points
  document.getElementById('usePointsBtn').addEventListener('click', () => {
    document.getElementById('usePointsModal').style.display = 'flex';
  });
  document.getElementById('closeUsePoints').addEventListener('click', () => {
    document.getElementById('usePointsModal').style.display = 'none';
  });

  // Check session
  checkSession();
});
