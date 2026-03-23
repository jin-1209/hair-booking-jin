/* ========================================
   JIN Hair Stylist Booking — Main Application
   Multi-language: ja / en / zh
   Hair stylist only
   ======================================== */

// ==========================================
// EmailJS Configuration
// EmailJSアカウント作成後、以下の値を設定してください
// https://www.emailjs.com/ で無料アカウント作成
// ==========================================
const EMAIL_CONFIG = {
  publicKey: 'HxdlNtOf7gTBQlq1h',
  serviceId: 'service_jyv8se9',
  // お客様への予約確認メール用テンプレートID
  customerTemplateId: 'template_np6xm6n',
  // 美容師への新規予約通知メール用テンプレートID
  stylistTemplateId: 'template_cck0a6j',
  // 美容師のメールアドレス
  stylistEmail: 'yj591209@gmail.com',
  // サロン名
  salonName: 'JIN — Beauty Stylist at TOKI+LIM',
  // サロン住所
  salonAddress: '420 North Bridge Road, #03-06, Singapore 188727'
};

// ==========================================
// Google Sheets Configuration
// Google Apps Script でWebアプリをデプロイし、そのURLを設定してください
// セットアップ手順: google_sheets_setup.md を参照
// ==========================================
const GOOGLE_SHEETS_CONFIG = {
  enabled: true,
  webAppUrl: 'https://script.google.com/macros/s/AKfycbzH1kQjz2ML_qjlEzOTaoXmfUrTPMV0nS2p_JDPfv93Rfnev0tedljGa2Aj65rnxnEenw/exec'
};

// ==========================================
// Twilio SMS Configuration
// Vercel環境変数にTwilio認証情報を設定してください
// ==========================================
const TWILIO_CONFIG = {
  enabled: true,
  // Vercelサーバーレス関数のURL
  smsUrl: '/api/send-sms',
  reminderUrl: '/api/send-reminder'
};

// ==========================================
// Instagram Configuration
// ==========================================
const INSTAGRAM_CONFIG = {
  handle: '@jinstaglam.hair',
  profileUrl: 'https://instagram.com/jinstaglam.hair',
  // Instagram Graph API を使う場合は以下を設定
  accessToken: '',
  userId: ''
};

// Googleスプレッドシートに予約データを送信
function sendToGoogleSheets(data) {
  if (!GOOGLE_SHEETS_CONFIG.enabled || !GOOGLE_SHEETS_CONFIG.webAppUrl) {
    console.log('Google Sheets連携は無効です（設定が未完了）');
    return;
  }

  const payload = JSON.stringify({
    customerName: data.customerName,
    customerPhone: data.customerPhone,
    customerEmail: data.customerEmail || '',
    menuName: data.menuName,
    date: data.dateISO,
    time: data.time,
    price: data.price,
    note: data.note || ''
  });

  fetch(GOOGLE_SHEETS_CONFIG.webAppUrl, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: payload
  }).then(() => {
    console.log('Google Sheetsへの送信完了');
  }).catch(err => {
    console.error('Google Sheets送信エラー:', err);
  });
}

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
    hero_title_1: '東京20年の技術を、',
    hero_title_2: 'シンガポールで。',
    hero_desc: '原宿・表参道・青山 — 東京のトップサロンで20年磨き上げた技術と感性。完全マンツーマンで、あなただけのスタイルをお届けします。',
    hero_cta: '今すぐ予約',
    hero_menu: 'メニューを見る',
    trust_exp: '年の経験',
    trust_clients: '施術実績',
    trust_rating: '★ 評価',
    floating_title: '次の空き枠',
    stylist_badge: 'About',
    stylist_title: 'スタイリスト紹介',
    stylist_role: 'Beauty Stylist at TOKI+LIM',
    stylist_bio: '東京・原宿、表参道、青山で20年間、美容師として技術を磨いてきました。東京の有名サロン2店舗で経験を積んだ後、2015年に兄と共に原宿で独立。2022年には青山にBar併設サロンをオープン。コロナ禍での閉業を経て、白髪ぼかし専門店で3年間の経験を重ね、2025年4月よりシンガポール・ラッフルズホテル内のTOKI+LIMにて、活動の拠点を移しました。',
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
    step1_label: '日時選択',
    step2_label: 'メニュー選択',
    step3_label: 'お客様情報',
    panel1_title: '日時をお選びください',
    panel2_title: 'メニューをお選びください',
    panel3_title: 'お客様情報をご入力ください',
    btn_next: '次へ進む →',
    btn_back: '← 戻る',
    btn_submit: '予約を確定する ✓',
    time_select: '時間帯を選択',
    label_name: 'お名前 <span class="req">*</span>',
    label_phone: '電話番号',
    label_email: 'メールアドレス',
    label_note: 'ご要望・メッセージ',
    contact_hint: '電話番号またはメールアドレスのどちらかを入力してください。',
    contact_error: '電話番号またはメールアドレスを入力してください。',
    alert_name_required: 'お名前を入力してください。',
    placeholder_name: '田中 花子',
    placeholder_phone: '9123 4567',
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
    reviews_badge: 'Reviews',
    reviews_title: 'お客様の声',
    reviews_subtitle: 'ご来店いただいたお客様からの口コミをご紹介します。',
    label_promo: '紹介コード / プロモコード',
    placeholder_promo: 'コードを入力 (任意)',
    referral_badge: 'Referral',
    referral_title: 'お友達紹介プログラム',
    referral_subtitle: 'お友達を紹介してください。ご紹介者もお友達も特典があります。',
    ref_step1_title: 'コードをシェア',
    ref_step1_desc: '下の紹介リンクをお友達に送るだけ。',
    ref_step2_title: 'お友達が予約',
    ref_step2_desc: 'お友達が紹介コードを使って予約。',
    ref_step3_title: '特典をGET',
    ref_step3_desc: 'お二人とも次回の施術がお得に。',
    ref_share_label: 'あなたの紹介リンク',
    ref_copy: 'コピー',
    cal_badge: 'Schedule',
    cal_title: '予約状況カレンダー',
    cal_subtitle: '空き状況を確認して、お好きな日に予約できます。',
    cal_available: '予約可能',
    cal_holiday: '定休日',
    cal_past: '過去',
    ig_badge: 'Gallery',
    ig_title: '最新のスタイル',
    ig_subtitle: 'Instagramで最新の施術事例をご覧ください。',
    ig_follow: '@jinstaglam.hair をフォロー',
    map_directions: '🗯️ 経路を検索',
    map_larger: '🗺️ 大きな地図で開く',
    pwa_title: 'ホーム画面に追加',
    pwa_desc: 'アプリとして簡単アクセス',
    pwa_install: '追加',
    notif_new_booking: '新規予約',
    notif_booking_msg: '新しい予約が入りました。',
    sms_sent: 'SMS通知を送信しました',
  },

  en: {
    nav_top: 'Top',
    nav_stylist: 'Stylist',
    nav_menu: 'Menu',
    nav_booking: 'Booking',
    nav_access: 'Access',
    header_cta: 'Book Now',
    hero_badge: 'By Appointment Only',
    hero_title_1: '20 Years of Tokyo Craft,',
    hero_title_2: 'Now in Singapore.',
    hero_desc: 'Honed over two decades in Harajuku, Omotesando, and Aoyama — Tokyo\'s most iconic hair districts. Bringing world-class styling to Singapore.',
    hero_cta: 'Book Now',
    hero_menu: 'View Menu',
    trust_exp: 'Years Exp.',
    trust_clients: 'Clients Served',
    trust_rating: '★ Rating',
    floating_title: 'Next available',
    stylist_badge: 'About',
    stylist_title: 'About the Stylist',
    stylist_role: 'Beauty Stylist at TOKI+LIM',
    stylist_bio: 'I spent 20 years perfecting my craft in Tokyo\'s top hair districts — Harajuku, Omotesando, and Aoyama. After working at two prestigious salons, I opened my own salon in Harajuku with my brother in 2015, then launched a salon-bar in Aoyama in 2022. I later spent 3 years specializing in gray hair blending before moving to Singapore in April 2025, where I now work at TOKI+LIM inside the iconic Raffles Hotel.',
    tag_hair: 'Hair Styling',
    tag_color: 'Coloring',
    tag_treatment: 'Treatment',
    tag_consultation: 'Face Shape Analysis',
    menu_badge: 'Menu',
    menu_title: 'Service Menu',
    menu_subtitle: 'We recommend the best style for each individual.',
    booking_badge: 'Booking',
    booking_title: 'Booking',
    booking_subtitle: 'Book in 3 easy steps. Choose your preferred service and date.',
    step1_label: 'Date & Time',
    step2_label: 'Select Service',
    step3_label: 'Your Info',
    panel1_title: 'Choose date & time',
    panel2_title: 'Select a service',
    panel3_title: 'Enter your details',
    btn_next: 'Next →',
    btn_back: '← Back',
    btn_submit: 'Confirm Booking ✓',
    time_select: 'Select a time',
    label_name: 'Name <span class="req">*</span>',
    label_phone: 'Phone Number',
    label_email: 'Email',
    label_note: 'Requests / Message',
    contact_hint: 'Please enter at least one: phone number or email.',
    contact_error: 'Please enter a phone number or email address.',
    alert_name_required: 'Please enter your name.',
    placeholder_name: 'Your name',
    placeholder_phone: '9123 4567',
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
    reviews_badge: 'Reviews',
    reviews_title: 'Customer Reviews',
    reviews_subtitle: 'Hear what our clients have to say about their experience.',
    label_promo: 'Referral / Promo Code',
    placeholder_promo: 'Enter code (optional)',
    referral_badge: 'Referral',
    referral_title: 'Refer a Friend',
    referral_subtitle: 'Share with friends. Both you and your friend receive benefits.',
    ref_step1_title: 'Share the Code',
    ref_step1_desc: 'Just send the referral link below to your friend.',
    ref_step2_title: 'Friend Books',
    ref_step2_desc: 'Your friend books using the referral code.',
    ref_step3_title: 'Get Rewards',
    ref_step3_desc: 'Both of you get a discount on your next visit.',
    ref_share_label: 'Your Referral Link',
    ref_copy: 'Copy',
    cal_badge: 'Schedule',
    cal_title: 'Booking Calendar',
    cal_subtitle: 'Check availability and book your preferred date.',
    cal_available: 'Available',
    cal_holiday: 'Closed',
    cal_past: 'Past',
    ig_badge: 'Gallery',
    ig_title: 'Latest Styles',
    ig_subtitle: 'Check out our latest work on Instagram.',
    ig_follow: 'Follow @jinstaglam.hair',
    map_directions: '🗯️ Get Directions',
    map_larger: '🗺️ View Larger Map',
    pwa_title: 'Add to Home Screen',
    pwa_desc: 'Quick access as an app',
    pwa_install: 'Install',
    notif_new_booking: 'New Booking',
    notif_booking_msg: 'A new booking has been received.',
    sms_sent: 'SMS notification sent',
  },

  zh: {
    nav_top: '首页',
    nav_stylist: '造型师',
    nav_menu: '菜单',
    nav_booking: '预约',
    nav_access: '交通',
    header_cta: '立即预约',
    hero_badge: '仅限预约',
    hero_title_1: '东京20年匠心，',
    hero_title_2: '现于新加坡。',
    hero_desc: '在原宿、表参道、青山——东京最具代表性的美发圣地磨练20年的技术与审美，现为您提供专属造型服务。',
    hero_cta: '立即预约',
    hero_menu: '查看菜单',
    trust_exp: '年经验',
    trust_clients: '服务客户',
    trust_rating: '★ 评分',
    floating_title: '下一个空档',
    stylist_badge: 'About',
    stylist_title: '关于造型师',
    stylist_role: 'Beauty Stylist at TOKI+LIM',
    stylist_bio: '在20年间，我在东京最顶尖的美发圣地——原宿、表参道、青山磨练技术。在两家知名沙龙工作后，2015年与兄长在原宿开设了自己的沙龙，2022年又在青山开了一家酒吧风格沙龙。之后花了3年专攻白发挑染技术，2025年4月来到新加坡，现在莱佛士酒店内的TOKI+LIM为大家服务。',
    tag_hair: '发型设计',
    tag_color: '染色',
    tag_treatment: '护理',
    tag_consultation: '脸型诊断',
    menu_badge: 'Menu',
    menu_title: '服务菜单',
    menu_subtitle: '我们为每位客户推荐最适合的造型。',
    booking_badge: 'Booking',
    booking_title: '预约',
    booking_subtitle: '3步轻松预约。选择您喜欢的服务和日期。',
    step1_label: '选择日期',
    step2_label: '选择项目',
    step3_label: '客户信息',
    panel1_title: '请选择日期和时间',
    panel2_title: '请选择服务项目',
    panel3_title: '请输入客户信息',
    btn_next: '下一步 →',
    btn_back: '← 返回',
    btn_submit: '确认预约 ✓',
    time_select: '选择时间段',
    label_name: '姓名 <span class="req">*</span>',
    label_phone: '电话号码',
    label_email: '电子邮件',
    label_note: '需求/备注',
    contact_hint: '请至少输入电话号码或电子邮件之一。',
    contact_error: '请输入电话号码或电子邮件地址。',
    alert_name_required: '请输入姓名。',
    placeholder_name: '您的姓名',
    placeholder_phone: '9123 4567',
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
    reviews_badge: 'Reviews',
    reviews_title: '客户评价',
    reviews_subtitle: '来自客户的真实评价。',
    label_promo: '推荐码 / 优惠码',
    placeholder_promo: '输入代码 (可选)',
    referral_badge: 'Referral',
    referral_title: '朋友推荐计划',
    referral_subtitle: '推荐朋友，双方均可享受优惠。',
    ref_step1_title: '分享代码',
    ref_step1_desc: '将下方的推荐链接发送给朋友。',
    ref_step2_title: '朋友预约',
    ref_step2_desc: '朋友使用推荐码进行预约。',
    ref_step3_title: '获得奖励',
    ref_step3_desc: '双方均可享受下次施术优惠。',
    ref_share_label: '您的推荐链接',
    ref_copy: '复制',
    cal_badge: 'Schedule',
    cal_title: '预约日历',
    cal_subtitle: '查看可用时间并预约。',
    cal_available: '可预约',
    cal_holiday: '休息日',
    cal_past: '已过',
    ig_badge: 'Gallery',
    ig_title: '最新作品',
    ig_subtitle: '在Instagram上查看最新作品。',
    ig_follow: '关注 @jinstaglam.hair',
    map_directions: '🗯️ 获取路线',
    map_larger: '🗺️ 查看大地图',
    pwa_title: '添加到主屏幕',
    pwa_desc: '像应用程序一样快速访问',
    pwa_install: '添加',
    notif_new_booking: '新预约',
    notif_booking_msg: '收到新的预约。',
    sms_sent: 'SMS通知已发送',
  }
};

// ==========================================
// Reviews data
// ==========================================
const DEFAULT_REVIEWS = [
  {
    id: 'r1',
    name: 'Y.T',
    rating: 5,
    date: '2026/03/10',
    text: '初めて伺いましたが、丁寧なカウンセリングで理想のスタイルになりました。カラーも透明感があってとても気に入っています！',
    menu: 'カット + カラー'
  },
  {
    id: 'r2',
    name: 'M.S',
    rating: 5,
    date: '2026/03/05',
    text: '毎回安心してお任せできます。髪質に合わせたトリートメントで、仵まとまりも良くなりました。',
    menu: 'トリートメント'
  },
  {
    id: 'r3',
    name: 'A.K',
    rating: 5,
    date: '2026/02/28',
    text: 'マンツーマンでゆったり施術してもらえるのが嵌しいです。パーマの仵ちも自然でとても満足です！',
    menu: 'パーマ'
  },
  {
    id: 'r4',
    name: 'K.H',
    rating: 5,
    date: '2026/02/20',
    text: 'シンガポールで日本人の美容師さんに出会えて嵌しいです。細かい要望もしっかり聞いてくれます。',
    menu: 'カット'
  },
  {
    id: 'r5',
    name: 'S.N',
    rating: 5,
    date: '2026/02/15',
    text: 'ヘッドスパが最高でした！頭が軽くなって、リラックスできました。またお願いしたいです。',
    menu: 'ヘッドスパ'
  },
  {
    id: 'r6',
    name: 'R.M',
    rating: 5,
    date: '2026/02/10',
    text: 'イルミナカラーで透明感のある仕上がりに。ダメージも少なく、大満足です！',
    menu: 'カラー'
  }
];

// ==========================================
// Menu data — Hair stylist only
// ==========================================
const DEFAULT_MENU_ITEMS = [
  {
    id: 'cut',
    name: { ja: 'カット', en: 'Haircut', zh: '剪发' },
    price: '$60〜', priceNum: 60,
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
    price: '$90〜', priceNum: 90,
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
    price: '$50〜', priceNum: 50,
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
    price: '$40〜', priceNum: 40,
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
  lang: 'en'
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

// サイト情報のデフォルト値
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

// Load saved site data from localStorage (dashboard edits)
// デフォルト値と保存済みデータをマージして返す
function getSiteData() {
  try {
    const saved = localStorage.getItem('salonSiteData');
    if (saved) {
      const parsedData = JSON.parse(saved);
      // デフォルト値をベースに、保存済みデータ（null以外）で上書き
      const merged = { ...DEFAULT_SITE_DATA };
      Object.keys(parsedData).forEach(key => {
        if (parsedData[key] !== null && parsedData[key] !== undefined) {
          merged[key] = parsedData[key];
        }
      });
      return merged;
    }
  } catch(e) { /* ignore */ }
  return { ...DEFAULT_SITE_DATA };
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
  initReviews();
  initBooking();
  initCalendar();
  initModal();
  initReferral();
  initQuickCalendar();
  updateNextSlot();
  initActiveNavTracking();
  initInstagramGallery();
  initPWAInstall();
  initPushNotifications();
});

// ==========================================
// Apply dashboard site data
// ==========================================
function applySiteData() {
  const data = getSiteData();
  const isJa = state.lang === 'ja';

  // スタイリスト名（全言語共通）
  if (data.stylistName) {
    const nameEl = document.querySelector('.stylist-name');
    if (nameEl) nameEl.textContent = data.stylistName;
    const logoText = document.querySelector('.logo-text');
    if (logoText) logoText.textContent = data.stylistName;
  }

  // スタイリスト紹介文（日本語の時のみsiteDataを適用、他言語は翻訳を使用）
  if (isJa && data.stylistBio) {
    const bioEl = document.querySelector('.stylist-bio');
    if (bioEl) bioEl.textContent = data.stylistBio;
  }

  // サロン名（全言語共通）
  if (data.salonName) {
    const roleEl = document.querySelector('.stylist-role');
    if (roleEl) roleEl.textContent = data.salonName;
  }

  // 住所・営業時間等（言語非依存の情報）
  if (data.address) {
    const addrEls = document.querySelectorAll('[data-i18n="info_address_value"]');
    addrEls.forEach(el => el.innerHTML = data.address.replace(/\n/g, '<br>'));
  }

  if (data.businessHours) {
    const hourEls = document.querySelectorAll('[data-i18n="info_hours_value"]');
    hourEls.forEach(el => el.textContent = data.businessHours);
  }

  if (data.closedDay && isJa) {
    const closedEls = document.querySelectorAll('[data-i18n="info_closed"]');
    closedEls.forEach(el => el.textContent = data.closedDay);
  }

  if (data.phone) {
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

  // Heroテキスト（日本語の時のみsiteDataを適用、他言語は翻訳を使用）
  if (isJa) {
    if (data.heroBadge) {
      const badgeEl = document.querySelector('[data-i18n="hero_badge"]');
      if (badgeEl) badgeEl.textContent = data.heroBadge;
    }
    if (data.heroTitle1) {
      const t1 = document.querySelector('[data-i18n="hero_title_1"]');
      if (t1) t1.textContent = data.heroTitle1;
    }
    if (data.heroTitle2) {
      const t2 = document.querySelector('[data-i18n="hero_title_2"]');
      if (t2) t2.textContent = data.heroTitle2;
    }
    if (data.heroDesc) {
      const descEl = document.querySelector('[data-i18n="hero_desc"]');
      if (descEl) descEl.textContent = data.heroDesc;
    }
    if (data.heroCta) {
      const ctaEl = document.querySelector('[data-i18n="hero_cta"]');
      if (ctaEl) ctaEl.textContent = data.heroCta;
    }
  }

  // 経験年数（数値なので全言語共通）
  if (data.yearsExp) {
    const nums = document.querySelectorAll('.trust-num');
    if (nums[0]) nums[0].textContent = data.yearsExp + '+';
  }

  // Instagramリンク（全言語共通）
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
  document.getElementById('toStep3').disabled = false;
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

  if (step === 2) {
    renderBookingMenuList();
    document.getElementById('toStep3').disabled = !state.selectedMenu;
  }

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
  const phoneRaw = document.getElementById('customerPhone').value.trim();
  const countryCode = document.getElementById('countryCode')?.value || '+65';
  const phone = phoneRaw ? countryCode + ' ' + phoneRaw : '';
  const email = document.getElementById('customerEmail')?.value.trim() || '';
  const note = '';

  // 名前は必須
  if (!name) {
    alert(t('alert_name_required'));
    return;
  }

  // 電話番号かメールのどちらか一つは必須
  const contactError = document.getElementById('contactError');
  if (!phoneRaw && !email) {
    if (contactError) contactError.style.display = 'block';
    return;
  }
  if (contactError) contactError.style.display = 'none';

  let dateStr = '';
  let dateISO = '';
  if (state.selectedDate) {
    const df = TRANSLATIONS[state.lang].date_format;
    dateStr = df(
      state.selectedDate.getFullYear(),
      state.selectedDate.getMonth() + 1,
      state.selectedDate.getDate()
    );
    dateISO = `${state.selectedDate.getFullYear()}-${String(state.selectedDate.getMonth() + 1).padStart(2, '0')}-${String(state.selectedDate.getDate()).padStart(2, '0')}`;
  }

  const menuName = menuText(state.selectedMenu, 'name');
  const menuPrice = state.selectedMenu.price;
  const menuPriceNum = state.selectedMenu.priceNum || 0;

  // Save booking to shared salonBookings (for dashboard integration)
  try {
    const bookings = JSON.parse(localStorage.getItem('salonBookings') || '[]');
    const newBooking = {
      id: 'B' + String(bookings.length + 1).padStart(3, '0'),
      client: name,
      phone: phone,
      email: email,
      menu: menuName,
      date: dateISO,
      time: state.selectedTime || '',
      price: menuPriceNum,
      note: note,
      status: 'pending'
    };
    bookings.push(newBooking);
    localStorage.setItem('salonBookings', JSON.stringify(bookings));
  } catch(e) {}

  // Send email notifications via EmailJS
  if (EMAIL_CONFIG.publicKey && EMAIL_CONFIG.serviceId) {
    sendBookingEmails({
      customerName: name,
      customerPhone: phone,
      customerEmail: email,
      menuName: menuName,
      dateStr: dateStr,
      dateISO: dateISO,
      time: state.selectedTime || '',
      price: menuPrice,
      note: note
    });
  }

  // Send to Google Sheets
  sendToGoogleSheets({
    customerName: name,
    customerPhone: phone,
    customerEmail: email,
    menuName: menuName,
    dateISO: dateISO,
    time: state.selectedTime || '',
    price: menuPrice,
    note: note
  });

  // プッシュ通知を送信（ダッシュボードが開いている場合）
  sendBookingNotification({
    customerName: name,
    customerPhone: phone,
    menuName: menuName,
    dateStr: dateStr,
    time: state.selectedTime || '',
    price: menuPrice
  });

  // SMS通知を送信（Twilio経由）
  sendSMSNotification({
    customerName: name,
    customerPhone: phone,
    customerEmail: email,
    menuName: menuName,
    dateStr: dateStr,
    time: state.selectedTime || '',
    price: menuPrice
  });

  const modalText = document.getElementById('modalText');
  modalText.innerHTML = `
    <strong>${name}</strong><br><br>
    📋 ${menuName}<br>
    📅 ${dateStr} ${state.selectedTime}<br>
    💰 ${menuPrice}<br><br>
    ${t('modal_confirm_msg')}<br>
    ${phone ? '📞 ' + phone + '<br>' : ''}
    ${email ? '📧 ' + email : ''}
  `;

  document.getElementById('confirmModal').classList.add('active');
}

// ==========================================
// Email Notification (EmailJS)
// ==========================================
let emailjsInitialized = false;

function initEmailJS() {
  if (emailjsInitialized) return true;
  if (typeof emailjs === 'undefined') {
    console.warn('EmailJS SDK が読み込まれていません');
    return false;
  }
  try {
    emailjs.init({ publicKey: EMAIL_CONFIG.publicKey });
    emailjsInitialized = true;
    console.log('EmailJS initialized successfully');
    return true;
  } catch (err) {
    console.error('EmailJS init error:', err);
    return false;
  }
}

function sendBookingEmails(data) {
  // EmailJSが読み込まれていない場合はスキップ
  if (!initEmailJS()) return;

  // お客様へ予約確認メール送信
  if (data.customerEmail && EMAIL_CONFIG.customerTemplateId) {
    emailjs.send(
      EMAIL_CONFIG.serviceId,
      EMAIL_CONFIG.customerTemplateId,
      {
        to_name: data.customerName,
        to_email: data.customerEmail,
        menu: data.menuName,
        date: data.dateStr,
        time: data.time,
        price: data.price,
        salon_name: EMAIL_CONFIG.salonName,
        salon_address: EMAIL_CONFIG.salonAddress,
        note: data.note || 'なし'
      },
      { publicKey: EMAIL_CONFIG.publicKey }
    ).then(() => {
      console.log('お客様への確認メール送信成功');
    }).catch((err) => {
      console.error('お客様メール送信エラー:', err);
      console.error('Error status:', err?.status, 'Error text:', err?.text);
    });
  }

  // 美容師へ新規予約通知メール送信
  if (EMAIL_CONFIG.stylistEmail && EMAIL_CONFIG.stylistTemplateId) {
    emailjs.send(
      EMAIL_CONFIG.serviceId,
      EMAIL_CONFIG.stylistTemplateId,
      {
        to_email: EMAIL_CONFIG.stylistEmail,
        customer_name: data.customerName,
        customer_phone: data.customerPhone,
        customer_email: data.customerEmail || '未入力',
        menu: data.menuName,
        date: data.dateStr,
        time: data.time,
        price: data.price,
        note: data.note || 'なし'
      },
      { publicKey: EMAIL_CONFIG.publicKey }
    ).then(() => {
      console.log('美容師への通知メール送信成功');
    }).catch((err) => {
      console.error('美容師メール送信エラー:', err);
      console.error('Error status:', err?.status, 'Error text:', err?.text);
    });
  }
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

  // Load shift settings from dashboard
  let closedDays = [2]; // default: Tuesday
  try {
    const shiftSettings = localStorage.getItem('salonShiftSettings');
    if (shiftSettings) {
      const parsed = JSON.parse(shiftSettings);
      if (parsed.closedDays) closedDays = parsed.closedDays;
    }
  } catch(e) {}

  let individualShifts = {};
  try {
    const shifts = localStorage.getItem('salonShifts');
    if (shifts) individualShifts = JSON.parse(shifts);
  } catch(e) {}

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

    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayOfWeek = date.getDay();
    const isClosedDay = closedDays.includes(dayOfWeek);
    const shiftData = individualShifts[dateStr];
    const isIndividualOff = shiftData?.isOff || false;
    const isHoliday = (isClosedDay && !shiftData) || isIndividualOff;

    if (date < today) {
      cell.classList.add('disabled');
    } else if (isHoliday) {
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
  document.getElementById('toStep2').disabled = true;
}

function renderTimeSlots() {
  const container = document.getElementById('timeSlotsContainer');
  const slotsGrid = document.getElementById('timeSlots');
  container.style.display = 'block';
  slotsGrid.innerHTML = '';

  // Get business hours for the selected date
  const date = state.selectedDate;
  const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

  let defaults = { openTime: '10:00', closeTime: '20:00', lastReception: '19:00' };
  try {
    const settings = localStorage.getItem('salonShiftSettings');
    if (settings) {
      const parsed = JSON.parse(settings);
      defaults.openTime = parsed.openTime || '10:00';
      defaults.closeTime = parsed.closeTime || '20:00';
      defaults.lastReception = parsed.lastReception || '19:00';
    }
  } catch(e) {}

  // Check for day-specific hours
  let dayOpenTime = defaults.openTime;
  let dayLastReception = defaults.lastReception;
  try {
    const shifts = localStorage.getItem('salonShifts');
    if (shifts) {
      const parsed = JSON.parse(shifts);
      const dayData = parsed[dateStr];
      if (dayData && !dayData.isOff) {
        if (dayData.openTime) dayOpenTime = dayData.openTime;
        if (dayData.lastReception) dayLastReception = dayData.lastReception;
      }
    }
  } catch(e) {}

  // Generate time slots in 30-minute increments from open to last reception
  const timeSlots = [];
  const [openH, openM] = dayOpenTime.split(':').map(Number);
  const [lastH, lastM] = dayLastReception.split(':').map(Number);
  let currentMinutes = openH * 60 + openM;
  const lastMinutes = lastH * 60 + lastM;

  while (currentMinutes <= lastMinutes) {
    const h = Math.floor(currentMinutes / 60);
    const m = currentMinutes % 60;
    timeSlots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
    currentMinutes += 30;
  }

  const seed = date.getDate();

  timeSlots.forEach((time, index) => {
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
  document.getElementById('toStep2').disabled = false;

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

// ==========================================
// Reviews
// ==========================================
function getReviews() {
  const stored = localStorage.getItem('salonReviews');
  if (stored) {
    try { return JSON.parse(stored); } catch(e) {}
  }
  return DEFAULT_REVIEWS;
}

function saveReviews(reviews) {
  localStorage.setItem('salonReviews', JSON.stringify(reviews));
}

function initReviews() {
  renderReviews();
}

function renderReviews() {
  const grid = document.getElementById('reviewsGrid');
  if (!grid) return;

  const reviews = getReviews();
  if (!reviews.length) {
    grid.innerHTML = '<p style="text-align:center;color:var(--text-muted);">まだ口コミはありません。</p>';
    return;
  }

  // Calculate average
  const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  const avgNum = document.getElementById('reviewsAvgNum');
  const avgStars = document.getElementById('reviewsAvgStars');
  const avgCount = document.getElementById('reviewsAvgCount');
  
  if (avgNum) avgNum.textContent = avg.toFixed(1);
  if (avgStars) avgStars.textContent = renderStarText(avg);
  if (avgCount) avgCount.textContent = `${reviews.length}件の口コミ`;

  grid.innerHTML = reviews.map((review, i) => `
    <div class="review-card" style="animation: reviewFadeIn 0.5s ease-out ${i * 0.1}s both;">
      <div class="review-header">
        <div class="review-avatar">${review.name.charAt(0)}</div>
        <div class="review-meta">
          <div class="review-name">${review.name}</div>
          <div class="review-date">${review.date}</div>
        </div>
      </div>
      <div class="review-stars">${renderStarText(review.rating)}</div>
      <p class="review-text">${review.text}</p>
      ${review.menu ? `<span class="review-menu">${review.menu}</span>` : ''}
    </div>
  `).join('');
}

function renderStarText(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return '★'.repeat(full) + (half ? '★' : '') + '☆'.repeat(empty);
}

// ==========================================
// Referral / Promo Code
// ==========================================
function generateReferralCode() {
  // Generate a random 6-char code
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'JIN-';
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

function getMyReferralCode() {
  let code = localStorage.getItem('myReferralCode');
  if (!code) {
    code = generateReferralCode();
    localStorage.setItem('myReferralCode', code);
  }
  return code;
}

function initReferral() {
  const urlInput = document.getElementById('referralUrl');
  const copyBtn = document.getElementById('copyReferralBtn');
  const feedback = document.getElementById('copyFeedback');
  const promoInput = document.getElementById('promoCode');

  if (urlInput) {
    const myCode = getMyReferralCode();
    const baseUrl = window.location.origin + window.location.pathname;
    urlInput.value = `${baseUrl}?ref=${myCode}`;
  }

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      if (urlInput) {
        navigator.clipboard.writeText(urlInput.value).then(() => {
          if (feedback) {
            feedback.textContent = '✅ コピーしました！お友達にシェアしてください。';
            setTimeout(() => { feedback.textContent = ''; }, 3000);
          }
          copyBtn.textContent = '✅';
          setTimeout(() => { copyBtn.textContent = t('ref_copy') || 'コピー'; }, 2000);
        });
      }
    });
  }

  // Auto-fill promo code from URL parameter
  if (promoInput) {
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get('ref');
    if (refCode) {
      promoInput.value = refCode.toUpperCase();
      const status = document.getElementById('promoStatus');
      if (status) {
        status.textContent = '✅ 紹介コード適用済み';
        status.className = 'promo-status valid';
      }
    }
  }
}

// ==========================================
// Quick Calendar (Schedule overview)
// ==========================================
let qcalYear = new Date().getFullYear();
let qcalMonth = new Date().getMonth();

function initQuickCalendar() {
  const grid = document.getElementById('qcalGrid');
  if (!grid) return;

  renderQuickCalendar();

  document.getElementById('qcalPrev').addEventListener('click', () => {
    qcalMonth--;
    if (qcalMonth < 0) { qcalMonth = 11; qcalYear--; }
    renderQuickCalendar();
  });

  document.getElementById('qcalNext').addEventListener('click', () => {
    qcalMonth++;
    if (qcalMonth > 11) { qcalMonth = 0; qcalYear++; }
    renderQuickCalendar();
  });
}

function renderQuickCalendar() {
  const grid = document.getElementById('qcalGrid');
  const monthEl = document.getElementById('qcalMonth');
  const weekdaysEl = document.getElementById('qcalWeekdays');
  if (!grid || !monthEl) return;

  const lang = state.lang;
  const weekdays = TRANSLATIONS[lang].weekdays;
  
  // Month label
  if (typeof TRANSLATIONS[lang].cal_format === 'function') {
    monthEl.textContent = TRANSLATIONS[lang].cal_format(qcalYear, qcalMonth);
  } else {
    monthEl.textContent = `${qcalYear}年 ${qcalMonth + 1}月`;
  }

  // Weekday headers
  weekdaysEl.innerHTML = weekdays.map((d, i) => {
    let cls = 'qcal-weekday';
    if (i === 0) cls += ' sun';
    if (i === 6) cls += ' sat';
    return `<div class="${cls}">${d}</div>`;
  }).join('');

  // Days
  const firstDay = new Date(qcalYear, qcalMonth, 1).getDay();
  const daysInMonth = new Date(qcalYear, qcalMonth + 1, 0).getDate();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Get closed days from dashboard shift settings
  let closedDays = [2]; // default: Tuesday
  try {
    const shiftSettings = localStorage.getItem('salonShiftSettings');
    if (shiftSettings) {
      const parsed = JSON.parse(shiftSettings);
      if (parsed.closedDays) closedDays = parsed.closedDays;
    }
  } catch(e) {}

  // Get individual day-off from dashboard shift calendar
  let individualShifts = {};
  try {
    const shifts = localStorage.getItem('salonShifts');
    if (shifts) individualShifts = JSON.parse(shifts);
  } catch(e) {}

  let html = '';

  // Empty cells before first day
  for (let i = 0; i < firstDay; i++) {
    html += '<div class="qcal-day empty"></div>';
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(qcalYear, qcalMonth, d);
    const dayOfWeek = date.getDay();
    const isPast = date < today;
    const isToday = date.getTime() === today.getTime();

    // Check if this day of week is a regular closed day
    const isClosedDay = closedDays.includes(dayOfWeek);
    
    // Check individual shift (day off set in dashboard shift calendar)
    const dateStr = `${qcalYear}-${String(qcalMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const shiftData = individualShifts[dateStr];
    const isIndividualOff = shiftData?.isOff || false;
    
    const isHoliday = (isClosedDay && !shiftData) || isIndividualOff;

    let cls = 'qcal-day';
    if (isToday) cls += ' today';
    
    if (isPast) {
      cls += ' past';
    } else if (isHoliday) {
      cls += ' holiday';
    } else {
      cls += ' available';
    }

    const clickHandler = (!isPast && !isHoliday)
      ? `onclick="quickBook(${qcalYear}, ${qcalMonth}, ${d})"`
      : '';

    html += `<button class="${cls}" ${clickHandler}>${d}</button>`;
  }

  grid.innerHTML = html;
}

function quickBook(year, month, day) {
  // Scroll to booking section and pre-select the date
  const bookingSection = document.getElementById('booking');
  if (bookingSection) {
    bookingSection.scrollIntoView({ behavior: 'smooth' });
    
    // Set the calendar to the right month/year
    state.calendarYear = year;
    state.calendarMonth = month;
    
    // Wait for scroll, then select the date
    setTimeout(() => {
      renderCalendar();
      
      // Find and click the matching date cell
      setTimeout(() => {
        const cells = document.querySelectorAll('.calendar-grid .cal-day');
        cells.forEach(cell => {
          if (cell.textContent == day && !cell.classList.contains('disabled') && !cell.classList.contains('empty')) {
            cell.click();
          }
        });
      }, 200);
    }, 500);
  }
}

// ==========================================
// Instagram ギャラリー
// ==========================================
const DEFAULT_IG_POSTS = [
  {
    id: 'ig1',
    imageUrl: '',
    caption: '透明感カラー✨ イルミナカラーでツヤ感のある仕上がり',
    likes: 128,
    color: '#e8c4a8'
  },
  {
    id: 'ig2',
    imageUrl: '',
    caption: 'レイヤーカットで軽やかな動きをプラス',
    likes: 95,
    color: '#d4a574'
  },
  {
    id: 'ig3',
    imageUrl: '',
    caption: 'デジタルパーマで柔らかカール🌀',
    likes: 156,
    color: '#c9a487'
  },
  {
    id: 'ig4',
    imageUrl: '',
    caption: 'バレイヤージュ × グレージュ',
    likes: 112,
    color: '#b89a7e'
  },
  {
    id: 'ig5',
    imageUrl: '',
    caption: 'ヘッドスパで極上のリラックスタイム💆',
    likes: 89,
    color: '#d4c4a8'
  },
  {
    id: 'ig6',
    imageUrl: '',
    caption: 'ハイライトカラーで夯陽の下でも透け感✨',
    likes: 143,
    color: '#e0c09a'
  },
  {
    id: 'ig7',
    imageUrl: '',
    caption: 'TOKIOトリートメントで髪質改善✨',
    likes: 78,
    color: '#c4b090'
  },
  {
    id: 'ig8',
    imageUrl: '',
    caption: 'ショートボブでおしゃれ可愛く💇‍♀️',
    likes: 167,
    color: '#dab896'
  }
];

function initInstagramGallery() {
  const grid = document.getElementById('igGrid');
  if (!grid) return;

  // Vercel API経由でInstagram投稿を取得（トークンはサーバー側で管理）
  fetchInstagramPosts(grid);
}

function fetchInstagramPosts(grid) {
  fetch('/api/instagram?limit=8')
    .then(res => res.json())
    .then(result => {
      if (result.data && result.data.length > 0) {
        renderInstagramLive(grid, result.data);
      } else {
        renderInstagramMock(grid);
      }
    })
    .catch(err => {
      console.warn('Instagram API error:', err);
      renderInstagramMock(grid);
    });
}

function renderInstagramLive(grid, posts) {
  grid.innerHTML = posts.slice(0, 8).map(post => {
    const imgUrl = post.mediaType === 'VIDEO' ? post.thumbnailUrl : post.mediaUrl;
    const caption = (post.caption || '').substring(0, 50);
    return `
      <a href="${post.permalink}" target="_blank" class="ig-item">
        <img src="${imgUrl}" alt="${caption}" loading="lazy">
        <div class="ig-item-overlay">
          <span class="ig-caption">${caption}</span>
        </div>
      </a>
    `;
  }).join('');
}

function renderInstagramMock(grid) {
  grid.innerHTML = DEFAULT_IG_POSTS.map(post => {
    // 画像がない場合はCSSグラデーションで美しいプレースホルダーを生成
    const bgStyle = post.imageUrl 
      ? '' 
      : `background: linear-gradient(135deg, ${post.color}, ${adjustColor(post.color, -20)}); display: flex; align-items: center; justify-content: center;`;
    
    const imgContent = post.imageUrl
      ? `<img src="${post.imageUrl}" alt="${post.caption}" loading="lazy">`
      : `<div style="${bgStyle} width:100%; height:100%;"><span style="font-size:2.5rem;">✂️</span></div>`;

    return `
      <a href="${INSTAGRAM_CONFIG.profileUrl}" target="_blank" class="ig-item">
        ${imgContent}
        <div class="ig-item-overlay">
          <span class="ig-likes">❤️ ${post.likes}</span>
          <span class="ig-caption">${post.caption}</span>
        </div>
      </a>
    `;
  }).join('');
}

function adjustColor(hex, amount) {
  hex = hex.replace('#', '');
  const r = Math.max(0, Math.min(255, parseInt(hex.substring(0,2), 16) + amount));
  const g = Math.max(0, Math.min(255, parseInt(hex.substring(2,4), 16) + amount));
  const b = Math.max(0, Math.min(255, parseInt(hex.substring(4,6), 16) + amount));
  return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`;
}

// ==========================================
// PWA インストール
// ==========================================
let deferredPrompt = null;

function initPWAInstall() {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    // 既に拒否済みなら表示しない
    if (localStorage.getItem('pwa-dismissed')) return;
    
    // 3秒後にバナーを表示
    setTimeout(() => showPWABanner(), 3000);
  });

  // インストール済み椅別
  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    hidePWABanner();
    console.log('PWA インストール完了');
  });
}

function showPWABanner() {
  // 既存のバナーを削除
  const existing = document.querySelector('.pwa-install-banner');
  if (existing) existing.remove();

  const banner = document.createElement('div');
  banner.className = 'pwa-install-banner';
  banner.innerHTML = `
    <div class="pwa-icon">
      <img src="icons/icon-192.png" alt="JIN">
    </div>
    <div class="pwa-text">
      <div class="pwa-title" data-i18n="pwa_title">${t('pwa_title')}</div>
      <div class="pwa-desc" data-i18n="pwa_desc">${t('pwa_desc')}</div>
    </div>
    <div class="pwa-actions">
      <button class="pwa-install-btn" id="pwaInstallBtn">${t('pwa_install')}</button>
      <button class="pwa-dismiss" id="pwaDismissBtn">×</button>
    </div>
  `;

  document.body.appendChild(banner);

  // アニメーションで表示
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      banner.classList.add('visible');
    });
  });

  // インストールボタン
  document.getElementById('pwaInstallBtn').addEventListener('click', async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;
    if (result.outcome === 'accepted') {
      console.log('PWA インストール承認');
    }
    deferredPrompt = null;
    hidePWABanner();
  });

  // 拒否ボタン
  document.getElementById('pwaDismissBtn').addEventListener('click', () => {
    hidePWABanner();
    localStorage.setItem('pwa-dismissed', 'true');
  });
}

function hidePWABanner() {
  const banner = document.querySelector('.pwa-install-banner');
  if (banner) {
    banner.classList.remove('visible');
    setTimeout(() => banner.remove(), 500);
  }
}

// ==========================================
// プッシュ通知
// ==========================================
function initPushNotifications() {
  // ダッシュボード側のみで有効化（一般ユーザーには不要）
  // dashboard.js から呼び出される
}

function requestNotificationPermission() {
  if (!('Notification' in window)) {
    console.warn('このブラウザは通知をサポートしていません');
    return Promise.resolve(false);
  }

  if (Notification.permission === 'granted') {
    return Promise.resolve(true);
  }

  if (Notification.permission === 'denied') {
    console.warn('通知がブロックされています');
    return Promise.resolve(false);
  }

  return Notification.requestPermission().then(permission => {
    return permission === 'granted';
  });
}

function sendLocalNotification(title, body, options = {}) {
  if (Notification.permission !== 'granted') return;

  // Service Worker経由で通知（バックグラウンド対応）
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.ready.then(registration => {
      registration.showNotification(title, {
        body: body,
        icon: 'icons/icon-192.png',
        badge: 'icons/icon-192.png',
        vibrate: [200, 100, 200],
        tag: options.tag || 'general',
        renotify: true,
        data: { url: options.url || '/' },
        ...options
      });
    });
  } else {
    // フォールバック：通常のNotification API
    new Notification(title, {
      body: body,
      icon: 'icons/icon-192.png',
      ...options
    });
  }
}

// 予約完了時にプッシュ通知を送信（美容師向け）
function sendBookingNotification(bookingData) {
  const title = t('notif_new_booking');
  const body = `${bookingData.customerName} - ${bookingData.menuName}\n${bookingData.dateStr} ${bookingData.time}`;
  
  sendLocalNotification(title, body, {
    tag: 'new-booking',
    url: '/dashboard.html'
  });
}

// ==========================================
// WhatsApp / SMS 通知（Twilio via Vercel API）
// ==========================================

// ① 予約確認 WhatsApp通知
function sendSMSNotification(data) {
  if (!TWILIO_CONFIG.enabled) {
    console.log('通知は無効です');
    return Promise.resolve(false);
  }

  return fetch(TWILIO_CONFIG.smsUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'confirmation',
      channel: 'whatsapp',
      to: data.customerPhone,
      customerName: data.customerName,
      menuName: data.menuName,
      date: data.dateStr,
      time: data.time,
      price: data.price,
      phone: data.customerPhone,
      email: data.customerEmail || ''
    })
  })
  .then(res => res.json())
  .then(result => {
    console.log('予約確認WhatsApp送信完了:', result);
    return true;
  })
  .catch(err => {
    console.error('予約確認WhatsApp送信エラー:', err);
    return false;
  });
}

// ③ キャンセル通知 WhatsApp
function sendCancellationSMS(booking) {
  if (!TWILIO_CONFIG.enabled) {
    console.log('通知は無効です');
    return Promise.resolve(false);
  }

  const phone = booking.phone || booking.customerPhone;
  if (!phone) {
    console.log('電話番号がないため通知送信をスキップ');
    return Promise.resolve(false);
  }

  return fetch(TWILIO_CONFIG.smsUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'cancellation',
      channel: 'whatsapp',
      to: phone,
      customerName: booking.client || booking.customerName,
      menuName: booking.menu || booking.menuName,
      date: booking.date,
      time: booking.time,
      phone: phone
    })
  })
  .then(res => res.json())
  .then(result => {
    console.log('キャンセル通知WhatsApp送信完了:', result);
    return true;
  })
  .catch(err => {
    console.error('キャンセル通知WhatsApp送信エラー:', err);
    return false;
  });
}

