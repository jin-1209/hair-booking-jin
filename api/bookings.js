// Vercel Serverless Function: Bookings API
// サーバーサイドで予約を管理し、ダブルブッキングを防止
// GET: 特定日の予約を取得（時間帯の空き確認用）
// POST: 新しい予約を登録
// PUT: 予約ステータス更新（確認/キャンセル）

const { put, list } = require('@vercel/blob');

const BLOB_KEY = 'bookings.json';

async function getBookings() {
  try {
    const { blobs } = await list({ prefix: BLOB_KEY });
    if (blobs.length > 0) {
      const latestBlob = blobs[blobs.length - 1];
      const response = await fetch(latestBlob.downloadUrl || latestBlob.url);
      if (!response.ok) {
        console.error('[bookings] Blob fetch failed:', response.status);
        return [];
      }
      const text = await response.text();
      if (!text || text.trim() === '') return [];
      return JSON.parse(text);
    }
  } catch (err) {
    console.error('[bookings] getBookings error:', err.message);
  }
  return [];
}

async function saveBookings(bookings) {
  const payload = JSON.stringify(bookings);
  const options = {
    contentType: 'application/json',
    addRandomSuffix: false
  };

  try {
    // Try with public access first
    const blob = await put(BLOB_KEY, payload, { ...options, access: 'public' });
    console.log('[bookings] Saved to blob (public)');
    return blob;
  } catch (err1) {
    console.log('[bookings] Public access failed, trying without access param:', err1.message);
    try {
      const blob = await put(BLOB_KEY, payload, options);
      console.log('[bookings] Saved to blob (default)');
      return blob;
    } catch (err2) {
      console.log('[bookings] Default failed, trying private:', err2.message);
      const blob = await put(BLOB_KEY, payload, { ...options, access: 'private' });
      console.log('[bookings] Saved to blob (private)');
      return blob;
    }
  }
}

// 時間の重なりを判定する関数
function isOverlapping(existingStart, existingDuration, newStart, newDuration) {
  const [eh, em] = existingStart.split(':').map(Number);
  const existingStartMin = eh * 60 + em;
  const existingEndMin = existingStartMin + existingDuration;

  const [nh, nm] = newStart.split(':').map(Number);
  const newStartMin = nh * 60 + nm;
  const newEndMin = newStartMin + newDuration;

  // 重なり判定: 一方の開始が他方の終了前 AND 一方の終了が他方の開始後
  return newStartMin < existingEndMin && newEndMin > existingStartMin;
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET: 特定日の予約を取得
  if (req.method === 'GET') {
    try {
      const bookings = await getBookings();
      const { date, all } = req.query;

      // ダッシュボード用: 全件返す
      if (all === 'true') {
        const authKey = req.headers.authorization;
        const dashPassword = process.env.DASHBOARD_PASSWORD || 'jin2025';
        if (authKey !== `Bearer ${dashPassword}`) {
          return res.status(401).json({ error: 'Unauthorized' });
        }
        res.setHeader('Cache-Control', 'no-cache');
        return res.status(200).json({ success: true, bookings });
      }

      // 特定日の予約（有効なもののみ）
      if (date) {
        const dayBookings = bookings.filter(b => 
          b.date === date && 
          b.status !== 'cancelled' && 
          b.status !== 'rejected'
        );
        res.setHeader('Cache-Control', 'no-cache');
        return res.status(200).json({ 
          success: true, 
          bookings: dayBookings.map(b => ({
            time: b.time,
            duration: b.duration || 60,
            menu: b.menu
          }))
        });
      }

      // 日付指定なし — 今後の有効な予約を返す
      const today = new Date().toISOString().split('T')[0];
      const upcoming = bookings.filter(b => 
        b.date >= today && 
        b.status !== 'cancelled' && 
        b.status !== 'rejected'
      );
      res.setHeader('Cache-Control', 'no-cache');
      return res.status(200).json({ success: true, bookings: upcoming });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // POST: 新しい予約を登録
  if (req.method === 'POST') {
    try {
      const { client, phone, email, menu, date, time, price, duration, note } = req.body;

      if (!client || !date || !time || !menu) {
        return res.status(400).json({ error: 'client, date, time, menu are required' });
      }

      const bookingDuration = duration || 60;
      const bookings = await getBookings();

      // ダブルブッキングチェック
      const dayBookings = bookings.filter(b => 
        b.date === date && 
        b.status !== 'cancelled' && 
        b.status !== 'rejected'
      );

      for (const existing of dayBookings) {
        if (isOverlapping(existing.time, existing.duration || 60, time, bookingDuration)) {
          return res.status(409).json({ 
            error: 'Time slot unavailable',
            message: 'This time slot overlaps with an existing booking.',
            conflict: {
              existingTime: existing.time,
              existingMenu: existing.menu
            }
          });
        }
      }

      const newBooking = {
        id: 'B' + Date.now(),
        client,
        phone: phone || '',
        email: email || '',
        menu,
        date,
        time,
        duration: bookingDuration,
        price: price || 0,
        note: note || '',
        status: 'confirmed',
        createdAt: new Date().toISOString()
      };

      bookings.push(newBooking);
      await saveBookings(bookings);

      // WhatsApp通知を送信
      try {
        const notifyRes = await fetch(`https://${req.headers.host}/api/send-sms`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'confirmation',
            channel: 'whatsapp',
            to: phone,
            customerName: client,
            menuName: menu,
            date: date,
            time: time,
            price: price ? `$${price}` : '',
            phone: phone,
            email: email || ''
          })
        });
        const notifyResult = await notifyRes.json();
        console.log('[bookings] Notification sent:', JSON.stringify(notifyResult));
      } catch (notifyErr) {
        console.error('[bookings] Notification error:', notifyErr.message);
      }

      return res.status(200).json({ 
        success: true, 
        booking: newBooking,
        message: 'Booking confirmed'
      });
    } catch (err) {
      console.error('[bookings] Error:', err);
      return res.status(500).json({ error: err.message });
    }
  }

  // PUT: 予約ステータス更新（ダッシュボード用）
  if (req.method === 'PUT') {
    const authKey = req.headers.authorization;
    const dashPassword = process.env.DASHBOARD_PASSWORD || 'jin2025';
    if (authKey !== `Bearer ${dashPassword}`) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      const { id, status } = req.body;
      if (!id || !status) {
        return res.status(400).json({ error: 'id and status required' });
      }

      const bookings = await getBookings();
      const booking = bookings.find(b => b.id === id);
      if (!booking) {
        return res.status(404).json({ error: 'Booking not found' });
      }

      booking.status = status;
      await saveBookings(bookings);

      // キャンセル通知
      if (status === 'cancelled' && booking.phone) {
        try {
          await fetch(`https://${req.headers.host}/api/send-sms`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'cancellation',
              channel: 'whatsapp',
              to: booking.phone,
              customerName: booking.client,
              menuName: booking.menu,
              date: booking.date,
              time: booking.time,
              phone: booking.phone
            })
          });
        } catch (e) {
          console.error('[bookings] Cancel notification error:', e.message);
        }
      }

      return res.status(200).json({ success: true, message: `Booking ${status}` });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
// force rebuild Thu Mar 26 10:15:28 +08 2026
