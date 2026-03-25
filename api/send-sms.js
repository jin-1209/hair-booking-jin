// Vercel Serverless Function: WhatsApp / SMS Notifications (Twilio)
// Booking confirmation, cancellation, and thank you messages
// Channel: 'whatsapp', 'sms', 'both' (default: whatsapp)

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
  
  // Ensure whatsapp: prefix on the from number
  let whatsappFrom = TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886';
  if (!whatsappFrom.startsWith('whatsapp:')) {
    whatsappFrom = `whatsapp:${whatsappFrom}`;
  }

  console.log('[send-sms] Config:', {
    sid: TWILIO_ACCOUNT_SID ? TWILIO_ACCOUNT_SID.substring(0, 6) + '...' : 'MISSING',
    token: TWILIO_AUTH_TOKEN ? '***set***' : 'MISSING',
    whatsappFrom,
    stylistPhone: STYLIST_PHONE_NUMBER || 'NOT SET'
  });

  try {
    const { type, to, customerName, menuName, date, time, price, phone, email, channel } = req.body;
    const sendChannel = channel || 'whatsapp';

    let customerMessage = '';
    let stylistMessage = '';

    switch (type) {

      // ① Booking Confirmation
      case 'confirmation':
        customerMessage = [
          `✅ *Booking Confirmed — JIN at TOKI+LIM*`,
          ``,
          `Hi ${customerName},`,
          `Thank you for your booking! Here are the details:`,
          ``,
          `📋 *Service:* ${menuName}`,
          `📅 *Date:* ${date}`,
          `⏰ *Time:* ${time}`,
          `💰 *Price:* ${price}`,
          ``,
          `📍 *Location:*`,
          `TOKI+LIM, Raffles Hotel Arcade`,
          `420 North Bridge Rd, #03-06`,
          `Singapore 188727`,
          ``,
          `If you need to reschedule or cancel, please reply to this message or contact us directly.`,
          ``,
          `We look forward to seeing you! ✨`
        ].join('\n');

        stylistMessage = [
          `📩 *New Booking*`,
          ``,
          `*Client:* ${customerName}`,
          `*Service:* ${menuName}`,
          `*Date & Time:* ${date} ${time}`,
          `*Price:* ${price}`,
          phone ? `*Phone:* ${phone}` : '',
          email ? `*Email:* ${email}` : ''
        ].filter(Boolean).join('\n');
        break;

      // ② Thank You (Post-appointment)
      case 'thankyou':
        customerMessage = [
          `🙏 *Thank You — JIN at TOKI+LIM*`,
          ``,
          `Hi ${customerName},`,
          ``,
          `Thank you so much for visiting us today!`,
          `I hope you love your new look. 💇`,
          ``,
          `If you'd like to book your next appointment, you can do so here:`,
          `🔗 https://hair-booking-jin.vercel.app`,
          ``,
          `We'd also love it if you could share your experience! Feel free to tag us on Instagram:`,
          `📸 @jinstaglam.hair`,
          ``,
          `See you again soon! ✨`,
          `— JIN`
        ].join('\n');

        stylistMessage = '';
        break;

      // ③ Cancellation
      case 'cancellation':
        customerMessage = [
          `❌ *Booking Cancelled — JIN at TOKI+LIM*`,
          ``,
          `Hi ${customerName},`,
          `Your booking has been cancelled:`,
          ``,
          `📋 *Service:* ${menuName}`,
          `📅 *Date:* ${date} ${time}`,
          ``,
          `We hope to see you again soon!`,
          `You can rebook anytime here:`,
          `🔗 https://hair-booking-jin.vercel.app`,
          ``,
          `Thank you! 🙏`
        ].join('\n');

        stylistMessage = [
          `❌ *Booking Cancelled*`,
          ``,
          `*Client:* ${customerName}`,
          `*Service:* ${menuName}`,
          `*Date & Time:* ${date} ${time}`,
          phone ? `*Phone:* ${phone}` : ''
        ].filter(Boolean).join('\n');
        break;

      default:
        return res.status(400).json({ error: 'Invalid type. Use: confirmation, thankyou, cancellation' });
    }

    const results = [];

    // Send to customer
    if (to) {
      let cleanTo = to.replace(/\s/g, '');
      // Ensure whatsapp: prefix for customer
      const waTo = cleanTo.startsWith('whatsapp:') ? cleanTo : `whatsapp:${cleanTo}`;

      console.log('[send-sms] Sending to customer:', { channel: sendChannel, to: waTo, type });

      if (sendChannel === 'whatsapp' || sendChannel === 'both') {
        try {
          const waMsg = await client.messages.create({
            body: customerMessage,
            from: whatsappFrom,
            to: waTo
          });
          console.log('[send-sms] Customer WhatsApp sent:', waMsg.sid, waMsg.status);
          results.push({ target: 'customer', channel: 'whatsapp', sid: waMsg.sid, status: waMsg.status || 'sent' });
        } catch (err) {
          console.error('[send-sms] Customer WhatsApp FAILED:', err.code, err.message);
          results.push({ target: 'customer', channel: 'whatsapp', error: err.message, code: err.code, status: 'failed' });
        }
      }

      if ((sendChannel === 'sms' || sendChannel === 'both') && TWILIO_PHONE_NUMBER) {
        try {
          const smsMsg = await client.messages.create({
            body: customerMessage.replace(/\*/g, ''),
            from: TWILIO_PHONE_NUMBER,
            to: cleanTo
          });
          results.push({ target: 'customer', channel: 'sms', sid: smsMsg.sid, status: smsMsg.status || 'sent' });
        } catch (err) {
          console.error('[send-sms] Customer SMS FAILED:', err.code, err.message);
          results.push({ target: 'customer', channel: 'sms', error: err.message, code: err.code, status: 'failed' });
        }
      }
    }

    // Send to stylist (skip for thank you messages)
    if (STYLIST_PHONE_NUMBER && stylistMessage) {
      let cleanStylist = STYLIST_PHONE_NUMBER.replace(/\s/g, '');
      // Ensure whatsapp: prefix for stylist
      const waStylist = cleanStylist.startsWith('whatsapp:') ? cleanStylist : `whatsapp:${cleanStylist}`;

      console.log('[send-sms] Sending to stylist:', { channel: sendChannel, to: waStylist });

      if (sendChannel === 'whatsapp' || sendChannel === 'both') {
        try {
          const waMsg = await client.messages.create({
            body: stylistMessage,
            from: whatsappFrom,
            to: waStylist
          });
          console.log('[send-sms] Stylist WhatsApp sent:', waMsg.sid, waMsg.status);
          results.push({ target: 'stylist', channel: 'whatsapp', sid: waMsg.sid, status: waMsg.status || 'sent' });
        } catch (err) {
          console.error('[send-sms] Stylist WhatsApp FAILED:', err.code, err.message);
          results.push({ target: 'stylist', channel: 'whatsapp', error: err.message, code: err.code, status: 'failed' });
        }
      }

      if ((sendChannel === 'sms' || sendChannel === 'both') && TWILIO_PHONE_NUMBER) {
        try {
          const smsMsg = await client.messages.create({
            body: stylistMessage.replace(/\*/g, ''),
            from: TWILIO_PHONE_NUMBER,
            to: cleanStylist
          });
          results.push({ target: 'stylist', channel: 'sms', sid: smsMsg.sid, status: smsMsg.status || 'sent' });
        } catch (err) {
          console.error('[send-sms] Stylist SMS FAILED:', err.code, err.message);
          results.push({ target: 'stylist', channel: 'sms', error: err.message, code: err.code, status: 'failed' });
        }
      }
    }

    console.log('[send-sms] Results:', JSON.stringify(results));
    return res.status(200).json({ success: true, type, channel: sendChannel, results });

  } catch (err) {
    console.error('Notification Error:', err);
    return res.status(500).json({ error: err.message });
  }
};
