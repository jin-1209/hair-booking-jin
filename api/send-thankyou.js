// Vercel Serverless Function: Post-Appointment Thank You Message
// Runs daily via Vercel Cron (UTC 12:00 = SGT 20:00)
// Sends thank you WhatsApp messages to clients who had appointments today

const twilio = require('twilio');

module.exports = async (req, res) => {
  // Verify Vercel Cron call
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
  const sendChannel = REMINDER_CHANNEL || 'whatsapp';

  try {
    // Today's date (SGT = UTC+8)
    const now = new Date();
    const sgt = new Date(now.getTime() + (8 * 60 * 60 * 1000));
    const todayStr = sgt.toISOString().split('T')[0];

    // Fetch today's bookings from Google Sheets
    let bookings = [];

    if (GOOGLE_SHEETS_API_URL) {
      try {
        const response = await fetch(`${GOOGLE_SHEETS_API_URL}?action=getBookings&date=${todayStr}`);
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
        message: `No bookings found for ${todayStr}`,
        thankyous_sent: 0 
      });
    }

    const results = [];

    for (const booking of bookings) {
      const phone = booking.phone || booking.customerPhone;
      if (!phone) continue;

      // Skip cancelled bookings
      if (booking.status === 'cancelled') continue;

      const cleanPhone = phone.replace(/\s/g, '');
      const customerName = booking.client || booking.customerName;

      const thankYouMessage = [
        `🙏 *Thank You — JIN at TOKI+LIM*`,
        ``,
        `Hi ${customerName},`,
        ``,
        `Thank you so much for visiting us today!`,
        `I hope you love your new look. 💇`,
        ``,
        `If you'd like to book your next appointment:`,
        `🔗 https://hair-booking-jin.vercel.app`,
        ``,
        `We'd love it if you could share your experience!`,
        `Feel free to tag us on Instagram:`,
        `📸 @jinstaglam.hair`,
        ``,
        `See you again soon! ✨`,
        `— JIN`
      ].join('\n');

      const smsMessage = thankYouMessage.replace(/\*/g, '');

      // WhatsApp
      if (sendChannel === 'whatsapp' || sendChannel === 'both') {
        try {
          const waMsg = await client.messages.create({
            body: thankYouMessage,
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

      // SMS
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
      date: todayStr,
      channel: sendChannel,
      thankyous_sent: results.filter(r => r.status === 'sent').length,
      results 
    });

  } catch (err) {
    console.error('Thank You Message Error:', err);
    return res.status(500).json({ error: err.message });
  }
};
