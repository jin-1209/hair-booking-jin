// Vercel Serverless Function: 前日リマインダー SMS + WhatsApp 送信
// Vercel Cronで毎日自動実行 (UTC 10:00 = SGT 18:00)

const twilio = require('twilio');

module.exports = async (req, res) => {
  // Vercel Cronからの呼び出しを検証
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    if (req.method !== 'GET' || !req.query.test) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  }

  const {
    TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN,
    TWILIO_PHONE_NUMBER,
    TWILIO_WHATSAPP_NUMBER,
    GOOGLE_SHEETS_API_URL,
    REMINDER_CHANNEL
  } = process.env;

  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN) {
    return res.status(500).json({ error: 'Twilio credentials not configured' });
  }

  const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
  const whatsappFrom = TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886';
  // 送信チャネル: 環境変数で設定（デフォルト: whatsapp）
  const sendChannel = REMINDER_CHANNEL || 'whatsapp';

  try {
    // 明日の日付を計算 (SGT = UTC+8)
    const now = new Date();
    const sgt = new Date(now.getTime() + (8 * 60 * 60 * 1000));
    const tomorrow = new Date(sgt);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    // Google Sheetsから明日の予約を取得
    let bookings = [];

    if (GOOGLE_SHEETS_API_URL) {
      try {
        const response = await fetch(`${GOOGLE_SHEETS_API_URL}?action=getBookings&date=${tomorrowStr}`);
        const data = await response.json();
        if (data.bookings) {
          bookings = data.bookings;
        }
      } catch (err) {
        console.error('Google Sheets fetch error:', err);
      }
    }

    if (req.method === 'POST' && req.body.bookings) {
      bookings = req.body.bookings;
    }

    if (bookings.length === 0) {
      return res.status(200).json({ 
        success: true, 
        message: `No bookings found for ${tomorrowStr}`,
        reminders_sent: 0 
      });
    }

    const results = [];

    for (const booking of bookings) {
      const phone = booking.phone || booking.customerPhone;
      if (!phone) continue;

      const cleanPhone = phone.replace(/\s/g, '');
      const customerName = booking.client || booking.customerName;

      // WhatsApp用メッセージ（太字対応）
      const whatsappMessage = [
        `⏰ *JIN Beauty - Appointment Reminder*`,
        ``,
        `Hi ${customerName},`,
        `This is a reminder for your appointment *tomorrow*.`,
        ``,
        `📋 *Service:* ${booking.menu || booking.menuName}`,
        `📅 *Date:* ${booking.date}`,
        `⏰ *Time:* ${booking.time}`,
        ``,
        `📍 *TOKI+LIM*`,
        `420 North Bridge Rd, #03-06`,
        `Singapore 188727`,
        ``,
        `See you tomorrow! ✨`
      ].join('\n');

      // SMS用メッセージ（書式なし）
      const smsMessage = whatsappMessage.replace(/\*/g, '');

      // WhatsApp送信
      if (sendChannel === 'whatsapp' || sendChannel === 'both') {
        try {
          const waMsg = await client.messages.create({
            body: whatsappMessage,
            from: whatsappFrom,
            to: `whatsapp:${cleanPhone}`
          });
          results.push({ 
            customer: customerName, 
            channel: 'whatsapp',
            sid: waMsg.sid, 
            status: 'sent' 
          });
        } catch (err) {
          results.push({ 
            customer: customerName, 
            channel: 'whatsapp',
            error: err.message, 
            status: 'failed' 
          });
        }
      }

      // SMS送信
      if ((sendChannel === 'sms' || sendChannel === 'both') && TWILIO_PHONE_NUMBER) {
        try {
          const smsMsg = await client.messages.create({
            body: smsMessage,
            from: TWILIO_PHONE_NUMBER,
            to: cleanPhone
          });
          results.push({ 
            customer: customerName, 
            channel: 'sms',
            sid: smsMsg.sid, 
            status: 'sent' 
          });
        } catch (err) {
          results.push({ 
            customer: customerName, 
            channel: 'sms',
            error: err.message, 
            status: 'failed' 
          });
        }
      }
    }

    return res.status(200).json({ 
      success: true, 
      date: tomorrowStr,
      channel: sendChannel,
      reminders_sent: results.filter(r => r.status === 'sent').length,
      results 
    });

  } catch (err) {
    console.error('Reminder Error:', err);
    return res.status(500).json({ error: err.message });
  }
};
