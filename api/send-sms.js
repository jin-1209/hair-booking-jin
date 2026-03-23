// Vercel Serverless Function: SMS + WhatsApp 送信 (Twilio)
// 予約確認・キャンセル通知用
// channel: 'sms', 'whatsapp', 'both' で送信チャネルを選択

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
    TWILIO_WHATSAPP_NUMBER,
    STYLIST_PHONE_NUMBER
  } = process.env;

  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN) {
    return res.status(500).json({ error: 'Twilio credentials not configured' });
  }

  const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

  // WhatsApp送信元番号（Twilio Sandbox: whatsapp:+14155238886、本番は自分の番号）
  const whatsappFrom = TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886';

  try {
    const { type, to, customerName, menuName, date, time, price, phone, email, channel } = req.body;

    // 送信チャネル: 'whatsapp', 'sms', 'both'（デフォルト: whatsapp）
    const sendChannel = channel || 'whatsapp';

    let customerMessage = '';
    let stylistMessage = '';

    switch (type) {
      // ① 予約確認
      case 'confirmation':
        customerMessage = [
          `✅ *JIN Beauty - Booking Confirmed*`,
          ``,
          `Hi ${customerName},`,
          `Your booking has been confirmed!`,
          ``,
          `📋 *Service:* ${menuName}`,
          `📅 *Date:* ${date}`,
          `⏰ *Time:* ${time}`,
          `💰 *Price:* ${price}`,
          ``,
          `📍 *TOKI+LIM*`,
          `420 North Bridge Rd, #03-06`,
          `Singapore 188727`,
          ``,
          `To cancel or change, please contact us.`,
          `Thank you! ✨`
        ].join('\n');

        stylistMessage = [
          `📩 *新規予約通知*`,
          ``,
          `*顧客:* ${customerName}`,
          `*メニュー:* ${menuName}`,
          `*日時:* ${date} ${time}`,
          `*料金:* ${price}`,
          phone ? `*電話:* ${phone}` : '',
          email ? `*Email:* ${email}` : ''
        ].filter(Boolean).join('\n');
        break;

      // ③ キャンセル通知
      case 'cancellation':
        customerMessage = [
          `❌ *JIN Beauty - Booking Cancelled*`,
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
          `❌ *予約キャンセル*`,
          ``,
          `*顧客:* ${customerName}`,
          `*メニュー:* ${menuName}`,
          `*日時:* ${date} ${time}`,
          phone ? `*電話:* ${phone}` : ''
        ].filter(Boolean).join('\n');
        break;

      default:
        return res.status(400).json({ error: 'Invalid type. Use: confirmation, cancellation' });
    }

    const results = [];

    // 顧客に送信（電話番号がある場合）
    if (to) {
      const cleanTo = to.replace(/\s/g, '');

      // WhatsApp送信
      if (sendChannel === 'whatsapp' || sendChannel === 'both') {
        try {
          const waMsg = await client.messages.create({
            body: customerMessage,
            from: whatsappFrom,
            to: `whatsapp:${cleanTo}`
          });
          results.push({ target: 'customer', channel: 'whatsapp', sid: waMsg.sid, status: 'sent' });
        } catch (err) {
          results.push({ target: 'customer', channel: 'whatsapp', error: err.message, status: 'failed' });
        }
      }

      // SMS送信
      if ((sendChannel === 'sms' || sendChannel === 'both') && TWILIO_PHONE_NUMBER) {
        try {
          const smsMsg = await client.messages.create({
            body: customerMessage.replace(/\*/g, ''), // WhatsApp書式を除去
            from: TWILIO_PHONE_NUMBER,
            to: cleanTo
          });
          results.push({ target: 'customer', channel: 'sms', sid: smsMsg.sid, status: 'sent' });
        } catch (err) {
          results.push({ target: 'customer', channel: 'sms', error: err.message, status: 'failed' });
        }
      }
    }

    // スタイリストに送信
    if (STYLIST_PHONE_NUMBER) {
      const cleanStylist = STYLIST_PHONE_NUMBER.replace(/\s/g, '');

      // WhatsAppでスタイリストに送信
      if (sendChannel === 'whatsapp' || sendChannel === 'both') {
        try {
          const waMsg = await client.messages.create({
            body: stylistMessage,
            from: whatsappFrom,
            to: `whatsapp:${cleanStylist}`
          });
          results.push({ target: 'stylist', channel: 'whatsapp', sid: waMsg.sid, status: 'sent' });
        } catch (err) {
          results.push({ target: 'stylist', channel: 'whatsapp', error: err.message, status: 'failed' });
        }
      }

      // SMSでスタイリストに送信
      if ((sendChannel === 'sms' || sendChannel === 'both') && TWILIO_PHONE_NUMBER) {
        try {
          const smsMsg = await client.messages.create({
            body: stylistMessage.replace(/\*/g, ''),
            from: TWILIO_PHONE_NUMBER,
            to: cleanStylist
          });
          results.push({ target: 'stylist', channel: 'sms', sid: smsMsg.sid, status: 'sent' });
        } catch (err) {
          results.push({ target: 'stylist', channel: 'sms', error: err.message, status: 'failed' });
        }
      }
    }

    return res.status(200).json({ success: true, channel: sendChannel, results });

  } catch (err) {
    console.error('Send Error:', err);
    return res.status(500).json({ error: err.message });
  }
};
