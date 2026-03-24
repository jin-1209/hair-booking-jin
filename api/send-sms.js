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
  const whatsappFrom = TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886';

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
      const cleanTo = to.replace(/\s/g, '');

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

      if ((sendChannel === 'sms' || sendChannel === 'both') && TWILIO_PHONE_NUMBER) {
        try {
          const smsMsg = await client.messages.create({
            body: customerMessage.replace(/\*/g, ''),
            from: TWILIO_PHONE_NUMBER,
            to: cleanTo
          });
          results.push({ target: 'customer', channel: 'sms', sid: smsMsg.sid, status: 'sent' });
        } catch (err) {
          results.push({ target: 'customer', channel: 'sms', error: err.message, status: 'failed' });
        }
      }
    }

    // Send to stylist (skip for thank you messages)
    if (STYLIST_PHONE_NUMBER && stylistMessage) {
      const cleanStylist = STYLIST_PHONE_NUMBER.replace(/\s/g, '');

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

    return res.status(200).json({ success: true, type, channel: sendChannel, results });

  } catch (err) {
    console.error('Notification Error:', err);
    return res.status(500).json({ error: err.message });
  }
};
