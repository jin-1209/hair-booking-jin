/* ========================================
   JIN Hair Stylist Booking — Main Application
   Multi-language: ja / en / zh
   Hair stylist only
   ======================================== */

// ==========================================
// Translations
// ==========================================
const TRANSLATIONS = {
  ja: {
    nav_top: 'トップ',
    nav_stylist: 'スタイリスト',
    nav_menu: 'メニュー',
    nav_booking: '予約',
    nav_access: 'アクセス',
    header_cta: '予約する',
    hero_badge: '完全予約制 · マンツーマン施術',
    hero_title_1: 'あなただけの',
    hero_title_2: '美しさを、引き出す。',
    hero_desc: 'お客様一人ひとりの骨格・髪質・ライフスタイルに合わせた、再現性の高いスタイルをご提案。マンツーマンだからこそ実現する、パーソナルな施術体験。',
    hero_cta: '今すぐ予約',
    hero_menu: 'メニューを見る',
    trust_exp: '年の経験',
    trust_clients: '施術実績',
    trust_rating: '★ 評価',
    floating_title: '次の空き枠',
    stylist_badge: 'About',
    stylist_title: 'スタイリスト紹介',
    stylist_role: 'Beauty Stylist at TOKI+LIM',
    stylist_bio: '東京都内の有名サロンで経験を積み、数々のヘアコンテストで入賞。お客様一人ひとりの骨格・髪質・ライフスタイルに合わせた、再現性の高いスタイルをご提案いたします。マンツーマンでの施術にこだわり、最高のリラックス空間を提供します。',
    tag_hair: 'ヘアスタイリング',
    tag_color: 'カラーリング',
    tag_treatment: 'トリートメント',
    tag_consultation: '骨格診断',
    menu_badge: 'Menu',
    menu_title: '施術メニュー',
    menu_subtitle: 'すべてマンツーマンの施術です。お一人おひとりに合わせた最適なスタイルをご提案します。',
    booking_badge: 'Booking',
    booking_title: 'ご予約',
    booking_subtitle: '3ステップで簡単予約。お好みのメニューと日時をお選びください。',
    step1_label: 'メニュー選択',
    step2_label: '日時選択',
    step3_label: 'お客様情報',
    panel1_title: 'メニューをお選びください',
    panel2_title: '日時をお選びください',
    panel3_title: 'お客様情報をご入力ください',
    btn_next: '次へ進む →',
    btn_back: '← 戻る',
    btn_submit: '予約を確定する ✓',
    time_select: '時間帯を選択',
    label_name: 'お名前 <span class="req">*</span>',
    label_phone: '電話番号 <span class="req">*</span>',
    label_email: 'メールアドレス',
    label_note: 'ご要望・メッセージ',
    placeholder_name: '田中 花子',
    placeholder_phone: '090-1234-5678',
    placeholder_note: 'ご要望がありましたらお書きください',
    summary_title: '予約内容',
    summary_menu: 'メニュー',
    summary_date: '日付',
    summary_time: '時間',
    summary_price: '料金',
    not_selected: '未選択',
    modal_title: 'ご予約ありがとうございます',
    modal_close: '閉じる',
    modal_confirm_msg: '確認のご連絡をさせていただきます。',
    modal_phone_label: 'お電話番号',
    modal_honorific: '様',
    alert_required: 'お名前と電話番号は必須です。',
    access_badge: 'Access',
    access_title: 'サロン情報',
    info_address: '住所',
    info_address_value: '328 North Bridge Road #02-33<br>Raffles Hotel Arcade<br>Singapore 188719',
    info_hours: '営業時間',
    info_hours_value: '10:00 〜 20:00（最終受付 19:00）',
    info_closed: '定休日：毎週火曜日',
    info_phone: '電話番号',
    info_email: 'メール',
    weekdays: ['日', '月', '火', '水', '木', '金', '土'],
    months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    date_format: (y, m, d) => `${y}年${m}月${d}日`,
    cal_format: (y, m) => `${y}年 ${TRANSLATIONS.ja.months[m]}`,
  },

  en: {
    nav_top: 'Top',
    nav_stylist: 'Stylist',
    nav_menu: 'Menu',
    nav_booking: 'Booking',
    nav_access: 'Access',
    header_cta: 'Book Now',
    hero_badge: 'By Appointment · One-on-One Service',
    hero_title_1: 'Discover Your',
    hero_title_2: 'Unique Beauty.',
    hero_desc: 'Personalized hair styling tailored to your facial structure, hair type, and lifestyle. Experience the difference of one-on-one care.',
    hero_cta: 'Book Now',
    hero_menu: 'View Menu',
    trust_exp: 'Years Exp.',
    trust_clients: 'Clients Served',
    trust_rating: '★ Rating',
    floating_title: 'Next available',
    stylist_badge: 'About',
    stylist_title: 'About the Stylist',
    stylist_role: 'Beauty Stylist at TOKI+LIM',
    stylist_bio: 'With over 10 years of experience at renowned salons in Tokyo, I specialize in creating styles tailored to each client\'s unique features. I provide one-on-one treatments in a relaxing, private atmosphere.',
    tag_hair: 'Hair Styling',
    tag_color: 'Coloring',
    tag_treatment: 'Treatment',
    tag_consultation: 'Face Shape Analysis',
    menu_badge: 'Menu',
    menu_title: 'Service Menu',
    menu_subtitle: 'All services are one-on-one. We recommend the best style for each individual.',
    booking_badge: 'Booking',
    booking_title: 'Booking',
    booking_subtitle: 'Book in 3 easy steps. Choose your preferred service and date.',
    step1_label: 'Select Service',
    step2_label: 'Date & Time',
    step3_label: 'Your Info',
    panel1_title: 'Select a service',
    panel2_title: 'Choose date & time',
    panel3_title: 'Enter your information',
    btn_next: 'Next →',
    btn_back: '← Back',
    btn_submit: 'Confirm Booking ✓',
    time_select: 'Select a time',
    label_name: 'Name <span class="req">*</span>',
    label_phone: 'Phone <span class="req">*</span>',
    label_email: 'Email',
    label_note: 'Requests / Message',
    placeholder_name: 'Hanako Tanaka',
    placeholder_phone: '090-1234-5678',
    placeholder_note: 'Any requests or special notes',
    summary_title: 'Booking Summary',
    summary_menu: 'Service',
    summary_date: 'Date',
    summary_time: 'Time',
    summary_price: 'Price',
    not_selected: 'Not selected',
    modal_title: 'Thank you for your booking',
    modal_close: 'Close',
    modal_confirm_msg: 'We will contact you to confirm.',
    modal_phone_label: 'Phone',
    modal_honorific: '',
    alert_required: 'Name and phone number are required.',
    access_badge: 'Access',
    access_title: 'Salon Information',
    info_address: 'Address',
    info_address_value: '328 North Bridge Road #02-33<br>Raffles Hotel Arcade<br>Singapore 188719',
    info_hours: 'Hours',
    info_hours_value: '10:00 — 20:00 (Last reception 19:00)',
    info_closed: 'Closed: Every Tuesday',
    info_phone: 'Phone',
    info_email: 'Email',
    weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    date_format: (y, m, d) => `${TRANSLATIONS.en.months[m - 1]} ${d}, ${y}`,
    cal_format: (y, m) => `${TRANSLATIONS.en.months[m]} ${y}`,
  },

  zh: {
    nav_top: '首页',
    nav_stylist: '造型师',
    nav_menu: '菜单',
    nav_booking: '预约',
    nav_access: '交通',
    header_cta: '立即预约',
    hero_badge: '预约制 · 一对一服务',
    hero_title_1: '发现专属于你的',
    hero_title_2: '独特之美。',
    hero_desc: '根据每位客户的脸型、发质和生活方式，提供高度还原性的造型方案。一对一的个性化服务，为您量身定制。',
    hero_cta: '立即预约',
    hero_menu: '查看菜单',
    trust_exp: '年经验',
    trust_clients: '服务客户',
    trust_rating: '★ 评分',
    floating_title: '下一个空档',
    stylist_badge: 'About',
    stylist_title: '关于造型师',
    stylist_role: 'Beauty Stylist at TOKI+LIM',
    stylist_bio: '曾在东京知名沙龙积累经验，荣获多项美发大赛奖项。根据每位客户的脸型、发质和生活方式，提供高度还原性的造型方案。坚持一对一服务，提供最佳放松空间。',
    tag_hair: '发型设计',
    tag_color: '染色',
    tag_treatment: '护理',
    tag_consultation: '脸型诊断',
    menu_badge: 'Menu',
    menu_title: '服务菜单',
    menu_subtitle: '所有服务均为一对一。我们为每位客户推荐最适合的造型。',
    booking_badge: 'Booking',
    booking_title: '预约',
    booking_subtitle: '3步轻松预约。选择您喜欢的服务和日期。',
    step1_label: '选择项目',
    step2_label: '选择日期',
    step3_label: '客户信息',
    panel1_title: '请选择服务项目',
    panel2_title: '请选择日期和时间',
    panel3_title: '请填写您的信息',
    btn_next: '下一步 →',
    btn_back: '← 返回',
    btn_submit: '确认预约 ✓',
    time_select: '选择时间段',
    label_name: '姓名 <span class="req">*</span>',
    label_phone: '电话号码 <span class="req">*</span>',
    label_email: '电子邮件',
    label_note: '需求/备注',
    placeholder_name: '田中花子',
    placeholder_phone: '090-1234-5678',
    placeholder_note: '如有特殊需求请在此填写',
    summary_title: '预约概要',
    summary_menu: '项目',
    summary_date: '日期',
    summary_time: '时间',
    summary_price: '价格',
    not_selected: '未选择',
    modal_title: '感谢您的预约',
    modal_close: '关闭',
    modal_confirm_msg: '我们将与您联系确认预约。',
    modal_phone_label: '电话号码',
    modal_honorific: '先生/女士',
    alert_required: '姓名和电话号码为必填项。',
    access_badge: 'Access',
    access_title: '沙龙信息',
    info_address: '地址',
    info_address_value: '328 North Bridge Road #02-33<br>Raffles Hotel Arcade<br>Singapore 188719',
    info_hours: '营业时间',
    info_hours_value: '10:00 — 20:00（最后受理 19:00）',
    info_closed: '定休日：每周二',
    info_phone: '电话',
    info_email: '邮箱',
    weekdays: ['日', '一', '二', '三', '四', '五', '六'],
    months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    date_format: (y, m, d) => `${y}年${m}月${d}日`,
    cal_format: (y, m) => `${y}年 ${TRANSLATIONS.zh.months[m]}`,
  }
};

// ==========================================
// Menu data — Hair stylist only
// ==========================================
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
    price: '$120〜', priceNum: 120,
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
    price: '$100〜', priceNum: 100,
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

const TIME_SLOTS = [
  '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30', '19:00'
];

const LANG_META = {
  ja: { flag: '🇯🇵', code: 'JP' },
  en: { flag: '🇺🇸', code: 'EN' },
  zh: { flag: '🇨🇳', code: 'CN' }
};

// ==========================================
// State
// ==========================================
const state = {
  currentStep: 1,
  selectedMenu: null,
  selectedDate: null,
  selectedTime: null,
  calendarYear: new Date().getFullYear(),
  calendarMonth: new Date().getMonth(),
  lang: 'ja'
};

// ==========================================
// Load saved menu from localStorage (dashboard edits)
// ==========================================
function getMenuItems() {
  try {
    const saved = localStorage.getItem('salonMenuItems');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch(e) { /* ignore */ }
  return DEFAULT_MENU_ITEMS;
}

// Load saved site data from localStorage (dashboard edits)
function getSiteData() {
  try {
    const saved = localStorage.getItem('salonSiteData');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch(e) { /* ignore */ }
  return null;
}

// ==========================================
// Helpers
// ==========================================
function t(key) {
  return TRANSLATIONS[state.lang][key] || key;
}

function menuText(item, field) {
  if (typeof item[field] === 'string') return item[field];
  return item[field][state.lang] || item[field]['ja'];
}

// ==========================================
// DOM Ready
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  applySiteData();
  initHeader();
  initLanguageSwitcher();
  initScrollAnimations();
  initMenuSection();
  initBooking();
  initCalendar();
  initModal();
  updateNextSlot();
  initActiveNavTracking();
});

// ==========================================
// Apply dashboard site data
// ==========================================
function applySiteData() {
  const data = getSiteData();
  if (!data) return;

  // Apply profile photo
  if (data.profilePhoto) {
    const heroImg = document.getElementById('heroImg');
    const stylistImg = document.getElementById('stylistImg');
    if (heroImg) heroImg.src = data.profilePhoto;
    if (stylistImg) stylistImg.src = data.profilePhoto;
  }

  // Apply stylist name
  if (data.stylistName) {
    const nameEl = document.querySelector('.stylist-name');
    if (nameEl) nameEl.textContent = data.stylistName;
    // Also update logo text
    const logoText = document.querySelector('.logo-text');
    if (logoText) logoText.textContent = data.stylistName;
  }

  // Apply stylist bio
  if (data.stylistBio) {
    const bioEl = document.querySelector('.stylist-bio');
    if (bioEl) bioEl.textContent = data.stylistBio;
  }

  // Apply salon info
  if (data.salonName) {
    const roleEl = document.querySelector('.stylist-role');
    if (roleEl) roleEl.textContent = data.salonName;
  }

  if (data.address) {
    const addrEls = document.querySelectorAll('[data-i18n="info_address_value"]');
    addrEls.forEach(el => el.innerHTML = data.address.replace(/\n/g, '<br>'));
  }

  if (data.businessHours) {
    const hourEls = document.querySelectorAll('[data-i18n="info_hours_value"]');
    hourEls.forEach(el => el.textContent = data.businessHours);
  }

  if (data.closedDay) {
    const closedEls = document.querySelectorAll('[data-i18n="info_closed"]');
    closedEls.forEach(el => el.textContent = data.closedDay);
  }

  if (data.phone) {
    // Find the phone info item and update
    const phoneItems = document.querySelectorAll('.detail-item');
    phoneItems.forEach(item => {
      const h4 = item.querySelector('h4');
      if (h4 && (h4.getAttribute('data-i18n') === 'info_phone')) {
        const p = item.querySelector('p:not(.detail-sub)');
        if (p) p.textContent = data.phone;
      }
    });
  }

  if (data.email) {
    const emailItems = document.querySelectorAll('.detail-item');
    emailItems.forEach(item => {
      const h4 = item.querySelector('h4');
      if (h4 && (h4.getAttribute('data-i18n') === 'info_email')) {
        const p = item.querySelector('p:not(.detail-sub)');
        if (p) p.textContent = data.email;
      }
    });
  }

  // Apply hero stats
  if (data.yearsExp) {
    const nums = document.querySelectorAll('.trust-num');
    if (nums[0]) nums[0].textContent = data.yearsExp + '+';
  }

  if (data.clientsServed) {
    const nums = document.querySelectorAll('.trust-num');
    if (nums[1]) nums[1].textContent = data.clientsServed + '+';
  }

  if (data.rating) {
    const nums = document.querySelectorAll('.trust-num');
    if (nums[2]) nums[2].textContent = data.rating;
  }

  // Apply Instagram link
  if (data.instagram) {
    const igLink = document.querySelector('.social-icon[aria-label="Instagram"]');
    if (igLink) igLink.href = data.instagram;
  }
}

// ==========================================
// Header
// ==========================================
function initHeader() {
  const header = document.getElementById('header');
  const mobileToggle = document.getElementById('mobileToggle');
  const mainNav = document.getElementById('mainNav');

  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
  });

  mobileToggle.addEventListener('click', () => {
    mobileToggle.classList.toggle('active');
    mainNav.classList.toggle('open');
  });

  mainNav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileToggle.classList.remove('active');
      mainNav.classList.remove('open');
    });
  });

  // Restore saved language
  try {
    const saved = localStorage.getItem('salon-lang');
    if (saved && TRANSLATIONS[saved]) {
      setLanguage(saved);
    }
  } catch (e) { /* ignore */ }
}

// ==========================================
// Language Switcher
// ==========================================
function initLanguageSwitcher() {
  const switcher = document.getElementById('langSwitcher');
  const toggle = document.getElementById('langToggle');
  const dropdown = document.getElementById('langDropdown');

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    switcher.classList.toggle('open');
  });

  document.addEventListener('click', () => {
    switcher.classList.remove('open');
  });

  dropdown.addEventListener('click', (e) => {
    e.stopPropagation();
  });

  dropdown.querySelectorAll('.lang-option').forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.dataset.lang;
      if (lang === state.lang) {
        switcher.classList.remove('open');
        return;
      }
      setLanguage(lang);
      switcher.classList.remove('open');
    });
  });
}

function setLanguage(lang) {
  state.lang = lang;
  document.documentElement.lang = lang === 'zh' ? 'zh-CN' : lang;

  document.getElementById('langFlag').textContent = LANG_META[lang].flag;
  document.getElementById('langCode').textContent = LANG_META[lang].code;

  document.querySelectorAll('.lang-option').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });

  // Translate static elements
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const text = t(key);
    if (el.getAttribute('data-i18n-html') === 'true') {
      el.innerHTML = text;
    } else {
      el.textContent = text;
    }
  });

  // Translate placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    el.placeholder = t(key);
  });

  // Re-render dynamic sections
  renderMenuSection();
  renderBookingMenuList();
  renderCalendarWeekdays();
  renderCalendar();
  updateNextSlot();

  if (state.currentStep === 3) {
    updateBookingSummary();
  }

  if (state.selectedDate) {
    renderTimeSlots();
  }

  // Re-apply site data after language switch
  applySiteData();

  try {
    localStorage.setItem('salon-lang', lang);
  } catch (e) { /* ignore */ }
}

// ==========================================
// Active Nav Tracking
// ==========================================
function initActiveNavTracking() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          const href = link.getAttribute('href');
          link.classList.toggle('active', href === `#${id}`);
        });
      }
    });
  }, { threshold: 0.3, rootMargin: '-80px 0px -40% 0px' });

  sections.forEach(section => observer.observe(section));
}

// ==========================================
// Scroll Animations
// ==========================================
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay * 100);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  document.querySelectorAll('.animate-in').forEach((el, i) => {
    el.dataset.delay = i % 5;
    observer.observe(el);
  });
}

// ==========================================
// Menu Section
// ==========================================
function initMenuSection() {
  renderMenuSection();
}

function renderMenuSection() {
  const grid = document.getElementById('menuGrid');
  grid.innerHTML = '';
  const items = getMenuItems();

  items.forEach((item, index) => {
    const card = document.createElement('div');
    card.className = 'menu-card';
    card.style.animationDelay = `${index * 60}ms`;

    card.innerHTML = `
      <div class="menu-card-body">
        <div class="menu-card-top">
          <span class="menu-card-name">${menuText(item, 'name')}</span>
          <span class="menu-card-price">${item.price}</span>
        </div>
        <p class="menu-card-desc">${menuText(item, 'desc')}</p>
        <div class="menu-card-meta">
          <span class="meta-item">⏱ ${menuText(item, 'time')}</span>
        </div>
      </div>
    `;

    card.addEventListener('click', () => {
      state.selectedMenu = item;
      renderBookingMenuList();

      setTimeout(() => {
        document.querySelectorAll('.booking-menu-item').forEach(el => {
          el.classList.toggle('selected', el.dataset.id === item.id);
        });
        document.getElementById('toStep2').disabled = false;
      }, 100);

      document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
    });

    grid.appendChild(card);
  });
}

// ==========================================
// Booking System
// ==========================================
function initBooking() {
  renderBookingMenuList();

  document.getElementById('toStep2').addEventListener('click', () => goToStep(2));
  document.getElementById('toStep3').addEventListener('click', () => goToStep(3));
  document.getElementById('backToStep1').addEventListener('click', () => goToStep(1));
  document.getElementById('backToStep2').addEventListener('click', () => goToStep(2));
  document.getElementById('bookingForm').addEventListener('submit', handleSubmit);
}

function renderBookingMenuList() {
  const list = document.getElementById('bookingMenuList');
  list.innerHTML = '';

  const items = getMenuItems();

  items.forEach(item => {
    const div = document.createElement('div');
    div.className = 'booking-menu-item';
    div.dataset.id = item.id;

    if (state.selectedMenu && state.selectedMenu.id === item.id) {
      div.classList.add('selected');
    }

    div.innerHTML = `
      <div class="radio-dot"></div>
      <div class="item-info">
        <div class="item-name">${menuText(item, 'name')}</div>
        <div class="item-detail">${menuText(item, 'time')}</div>
      </div>
      <div class="item-price">${item.price}</div>
    `;
    div.addEventListener('click', () => selectBookingMenu(item, div));
    list.appendChild(div);
  });
}

function selectBookingMenu(item, el) {
  document.querySelectorAll('.booking-menu-item').forEach(i => i.classList.remove('selected'));
  el.classList.add('selected');
  state.selectedMenu = item;
  document.getElementById('toStep2').disabled = false;
}

function goToStep(step) {
  state.currentStep = step;

  document.querySelectorAll('.progress-step').forEach(s => {
    const stepNum = parseInt(s.dataset.step);
    s.classList.remove('active', 'completed');
    if (stepNum === step) s.classList.add('active');
    else if (stepNum < step) s.classList.add('completed');
  });

  const fills = document.querySelectorAll('.progress-fill');
  if (fills[0]) fills[0].style.width = step > 1 ? '100%' : '0';
  if (fills[1]) fills[1].style.width = step > 2 ? '100%' : '0';

  document.querySelectorAll('.booking-panel').forEach(p => p.classList.remove('active'));
  document.getElementById(`bookingStep${step}`).classList.add('active');

  if (step === 3) {
    updateBookingSummary();
  }

  document.getElementById('booking').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function updateBookingSummary() {
  const summary = document.getElementById('bookingSummary');
  let dateStr = t('not_selected');
  if (state.selectedDate) {
    const df = TRANSLATIONS[state.lang].date_format;
    dateStr = df(
      state.selectedDate.getFullYear(),
      state.selectedDate.getMonth() + 1,
      state.selectedDate.getDate()
    );
  }

  const menuName = state.selectedMenu ? menuText(state.selectedMenu, 'name') : t('not_selected');

  summary.innerHTML = `
    <div class="summary-label">${t('summary_title')}</div>
    <div class="summary-row">
      <span class="s-label">${t('summary_menu')}</span>
      <span class="s-value">${menuName}</span>
    </div>
    <div class="summary-row">
      <span class="s-label">${t('summary_date')}</span>
      <span class="s-value">${dateStr}</span>
    </div>
    <div class="summary-row">
      <span class="s-label">${t('summary_time')}</span>
      <span class="s-value">${state.selectedTime || t('not_selected')}</span>
    </div>
    <div class="summary-row">
      <span class="s-label">${t('summary_price')}</span>
      <span class="s-value accent">${state.selectedMenu ? state.selectedMenu.price : '-'}</span>
    </div>
  `;
}

function handleSubmit(e) {
  e.preventDefault();

  const name = document.getElementById('customerName').value.trim();
  const phone = document.getElementById('customerPhone').value.trim();

  if (!name || !phone) {
    alert(t('alert_required'));
    return;
  }

  let dateStr = '';
  if (state.selectedDate) {
    const df = TRANSLATIONS[state.lang].date_format;
    dateStr = df(
      state.selectedDate.getFullYear(),
      state.selectedDate.getMonth() + 1,
      state.selectedDate.getDate()
    );
  }

  const honorific = t('modal_honorific');
  const nameDisplay = honorific ? `${name} ${honorific}` : name;

  const modalText = document.getElementById('modalText');
  modalText.innerHTML = `
    <strong>${nameDisplay}</strong><br><br>
    📋 ${menuText(state.selectedMenu, 'name')}<br>
    📅 ${dateStr} ${state.selectedTime}<br>
    💰 ${state.selectedMenu.price}<br><br>
    ${t('modal_confirm_msg')}<br>
    ${t('modal_phone_label')}: ${phone}
  `;

  document.getElementById('confirmModal').classList.add('active');
}

// ==========================================
// Calendar
// ==========================================
function initCalendar() {
  renderCalendarWeekdays();
  renderCalendar();

  document.getElementById('calPrev').addEventListener('click', () => {
    state.calendarMonth--;
    if (state.calendarMonth < 0) {
      state.calendarMonth = 11;
      state.calendarYear--;
    }
    renderCalendar();
  });

  document.getElementById('calNext').addEventListener('click', () => {
    state.calendarMonth++;
    if (state.calendarMonth > 11) {
      state.calendarMonth = 0;
      state.calendarYear++;
    }
    renderCalendar();
  });
}

function renderCalendarWeekdays() {
  const weekdaysEl = document.getElementById('calendarWeekdays');
  const weekdays = TRANSLATIONS[state.lang].weekdays;
  weekdaysEl.innerHTML = weekdays.map(d => `<span>${d}</span>`).join('');
}

function renderCalendar() {
  const grid = document.getElementById('calendarGrid');
  const monthLabel = document.getElementById('calMonth');
  const year = state.calendarYear;
  const month = state.calendarMonth;

  const cf = TRANSLATIONS[state.lang].cal_format;
  monthLabel.textContent = cf(year, month);

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  grid.innerHTML = '';

  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement('div');
    empty.className = 'cal-day empty';
    grid.appendChild(empty);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const cell = document.createElement('div');
    cell.className = 'cal-day';
    cell.textContent = day;

    if (date < today) {
      cell.classList.add('disabled');
    } else if (date.getDay() === 2) {
      // Tuesday is closed
      cell.classList.add('disabled');
    } else {
      if (date.getTime() === today.getTime()) {
        cell.classList.add('today');
      }
      if (state.selectedDate && date.getTime() === state.selectedDate.getTime()) {
        cell.classList.add('selected');
      }
      cell.addEventListener('click', () => selectDate(date));
    }

    grid.appendChild(cell);
  }
}

function selectDate(date) {
  state.selectedDate = date;
  state.selectedTime = null;
  renderCalendar();
  renderTimeSlots();
  document.getElementById('toStep3').disabled = true;
}

function renderTimeSlots() {
  const container = document.getElementById('timeSlotsContainer');
  const slotsGrid = document.getElementById('timeSlots');
  container.style.display = 'block';
  slotsGrid.innerHTML = '';

  const seed = state.selectedDate.getDate();

  TIME_SLOTS.forEach((time, index) => {
    const slot = document.createElement('div');
    slot.className = 'time-slot';
    slot.textContent = time;

    const isUnavailable = (seed + index) % 5 === 0;
    if (isUnavailable) {
      slot.classList.add('unavailable');
    } else {
      if (state.selectedTime === time) {
        slot.classList.add('selected');
      }
      slot.addEventListener('click', (e) => selectTime(time, e));
    }

    slotsGrid.appendChild(slot);
  });
}

function selectTime(time, e) {
  state.selectedTime = time;
  document.getElementById('toStep3').disabled = false;

  document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
  e.target.classList.add('selected');
}

// ==========================================
// Modal
// ==========================================
function initModal() {
  const modal = document.getElementById('confirmModal');
  const closeBtn = document.getElementById('modalClose');

  closeBtn.addEventListener('click', () => {
    modal.classList.remove('active');
    resetBooking();
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
      resetBooking();
    }
  });
}

function resetBooking() {
  state.currentStep = 1;
  state.selectedMenu = null;
  state.selectedDate = null;
  state.selectedTime = null;

  document.querySelectorAll('.booking-menu-item').forEach(i => i.classList.remove('selected'));
  document.getElementById('toStep2').disabled = true;
  document.getElementById('toStep3').disabled = true;
  document.getElementById('bookingForm').reset();
  document.getElementById('timeSlotsContainer').style.display = 'none';

  document.querySelectorAll('.progress-fill').forEach(f => f.style.width = '0');

  goToStep(1);
  renderCalendar();
}

// ==========================================
// Next Slot indicator
// ==========================================
function updateNextSlot() {
  const el = document.getElementById('nextSlot');
  if (!el) return;

  const now = new Date();
  const hour = now.getHours();

  let nextTime;
  if (hour < 10) nextTime = '10:00';
  else if (hour < 14) nextTime = '14:00';
  else if (hour < 17) nextTime = '17:00';
  else nextTime = '10:00';

  const isToday = hour >= 8 && hour < 19;

  if (state.lang === 'en') {
    el.textContent = isToday ? `Today ${nextTime}~` : `Tomorrow 10:00~`;
  } else if (state.lang === 'zh') {
    el.textContent = isToday ? `今天 ${nextTime}〜` : `明天 10:00〜`;
  } else {
    el.textContent = isToday ? `本日 ${nextTime}〜` : `明日 10:00〜`;
  }
}
