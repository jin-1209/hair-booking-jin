// Vercel Serverless Function: Reviews API
// GET: 承認済みクチコミを取得
// POST: 新しいクチコミを投稿（未承認状態で保存）
// PUT: クチコミのステータス更新（承認/削除）— ダッシュボード用

const { put, list } = require('@vercel/blob');

const BLOB_KEY = 'reviews.json';

async function getReviews() {
  try {
    const { blobs } = await list({ prefix: BLOB_KEY });
    if (blobs.length > 0) {
      const latestBlob = blobs[blobs.length - 1];
      const response = await fetch(latestBlob.downloadUrl || latestBlob.url);
      return await response.json();
    }
  } catch (err) {
    console.error('Error fetching reviews:', err);
  }
  return [];
}

async function saveReviews(reviews) {
  const payload = JSON.stringify(reviews);
  const options = { contentType: 'application/json', addRandomSuffix: false };
  try {
    return await put(BLOB_KEY, payload, { ...options, access: 'private' });
  } catch (e1) {
    try {
      return await put(BLOB_KEY, payload, { ...options, access: 'public' });
    } catch (e2) {
      return await put(BLOB_KEY, payload, options);
    }
  }
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET: 公開クチコミ取得
  if (req.method === 'GET') {
    try {
      const reviews = await getReviews();
      const showAll = req.query.all === 'true';
      
      // ダッシュボード用: 全件返す（認証必要）
      if (showAll) {
        const authKey = req.headers.authorization;
        const dashPassword = process.env.DASHBOARD_PASSWORD || 'jin2025';
        if (authKey !== `Bearer ${dashPassword}`) {
          return res.status(401).json({ error: 'Unauthorized' });
        }
        res.setHeader('Cache-Control', 'no-cache');
        return res.status(200).json({ success: true, reviews });
      }

      // 公開用: 承認済みのみ
      const approved = reviews.filter(r => r.status === 'approved');
      res.setHeader('Cache-Control', 'public, s-maxage=300, max-age=60');
      return res.status(200).json({ success: true, reviews: approved });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // POST: 新しいクチコミ投稿
  if (req.method === 'POST') {
    try {
      const { name, rating, text, menu } = req.body;

      if (!name || !rating || !text) {
        return res.status(400).json({ error: 'Name, rating, and text are required' });
      }

      if (rating < 1 || rating > 5) {
        return res.status(400).json({ error: 'Rating must be 1-5' });
      }

      const reviews = await getReviews();
      const newReview = {
        id: 'r' + Date.now(),
        name: name.trim(),
        rating: parseInt(rating),
        text: text.trim(),
        menu: menu ? menu.trim() : '',
        date: new Date().toISOString().split('T')[0].replace(/-/g, '/'),
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      reviews.unshift(newReview);
      await saveReviews(reviews);

      return res.status(200).json({ 
        success: true, 
        message: 'Review submitted! It will be published after approval.' 
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // PUT: ステータス更新（ダッシュボード用）
  if (req.method === 'PUT') {
    const authKey = req.headers.authorization;
    const dashPassword = process.env.DASHBOARD_PASSWORD || 'jin2025';
    if (authKey !== `Bearer ${dashPassword}`) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      const { id, action } = req.body;
      if (!id || !action) {
        return res.status(400).json({ error: 'id and action required' });
      }

      const reviews = await getReviews();
      const review = reviews.find(r => r.id === id);
      if (!review) {
        return res.status(404).json({ error: 'Review not found' });
      }

      if (action === 'approve') {
        review.status = 'approved';
      } else if (action === 'reject') {
        review.status = 'rejected';
      } else if (action === 'delete') {
        const idx = reviews.indexOf(review);
        reviews.splice(idx, 1);
      } else {
        return res.status(400).json({ error: 'Invalid action' });
      }

      await saveReviews(reviews);
      return res.status(200).json({ success: true, message: `Review ${action}d` });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
