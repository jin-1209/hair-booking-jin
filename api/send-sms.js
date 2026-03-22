// Vercel Serverless Function: SMS送信 (Twilio)
// 予約確認・キャンセル通知用

const twilio = require('twilio');

module.exports = async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN,
    TWILIO_PHONE_NUMBER,
    STYLIST_PHONE_NUMBER
  } = process.env;

  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
    return res.status(500).json({ error: 'Twilio credentials not configured' });
  }

  const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

  try {
    const { type, to, customerName, menuName, date, time, price, phone, email } = req.body;

    let customerMessage = '';
    let stylistMessage = '';

    switch (type) {
      // ① 予約確認SMS
      case 'confirmation':
        customerMessage = [
          `【JIN Beauty - Booking Confirmed】`,
          ``,
          `Hi ${customerName},`,
          `Your booking has been confirmed!`,
          ``,
          `📋 Service: ${menuName}`,
          `📅 Date: ${date}`,
          `⏰ Time: ${time}`,
          `💰 Price: ${price}`,
          ``,
          `📍 TOKI+LIM`,
          `420 North Bridge Rd, #03-06`,
          `Singapore 188727`,
          ``,
          `To cancel or change, please contact us.`,
          `Thank you! ✨`
        ].join('\n');

        stylistMessage = [
          `【新規予約通知】`,
          ``,
          `顧客: ${customerName}`,
          `メニュー: ${menuName}`,
          `日時: ${date} ${time}`,
          `料金: ${price}`,
          phone ? `電話: ${phone}` : '',
          email ? `Email: ${email}` : ''
        ].filter(Boolean).join('\n');
        break;

      // ③ キャンセル通知SMS
      case 'cancellation':
        customerMessage = [
          `【JIN Beauty - Booking Cancelled】`,
          ``,
          `Hi ${customerName},`,
          `Your booking has been cancelled.`,
          ``,
          `📋 ${menuName}`,
          `📅 ${date} ${time}`,
          ``,
          `We hope to see you again soon!`,
          `To rebook: https://hair-booking-jin.vercel.app`
        ].join('\n');

        stylistMessage = [
          `【予約キャンセル】`,
          ``,
          `顧客: ${customerName}`,
          `メニュー: ${menuName}`,
          `日時: ${date} ${time}`,
          phone ? `電話: ${phone}` : ''
        ].filter(Boolean).join('\n');
        break;

      default:
        return res.status(400).json({ error: 'Invalid SMS type. Use: confirmation, cancellation' });
    }

    const results = [];

    // 顧客にSMS送信（電話番号がある場合）
    if (to) {
      try {
        const customerSms = await client.messages.create({
          body: customerMessage,
          from: TWILIO_PHONE_NUMBER,
          to: to.replace(/\s/g, '') // スペースを除去
        });
        results.push({ target: 'customer', sid: customerSms.sid, status: 'sent' });
      } catch (err) {
        results.push({ target: 'customer', error: err.message, status: 'failed' });
      }
    }

    // スタイリストにSMS送信
    if (STYLIST_PHONE_NUMBER) {
      try {
        const stylistSms = await client.messages.create({
          body: stylistMessage,
          from: TWILIO_PHONE_NUMBER,
          to: STYLIST_PHONE_NUMBER
        });
        results.push({ target: 'stylist', sid: stylistSms.sid, status: 'sent' });
      } catch (err) {
        results.push({ target: 'stylist', error: err.message, status: 'failed' });
      }
    }

    return res.status(200).json({ success: true, results });

  } catch (err) {
    console.error('SMS Error:', err);
    return res.status(500).json({ error: err.message });
  }
};
