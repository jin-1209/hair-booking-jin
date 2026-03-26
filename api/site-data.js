// Vercel Serverless Function: Site Data API
// GET: サイト設定データを取得
// POST: サイト設定データを保存
// データはVercel Blob Storageに永続化

const { put, list, head } = require('@vercel/blob');

const BLOB_KEY = 'site-data.json';

module.exports = async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET: サイト設定を取得
  if (req.method === 'GET') {
    try {
      // Blobストレージからsite-data.jsonを検索
      const { blobs } = await list({ prefix: BLOB_KEY });
      
      if (blobs.length > 0) {
        // 最新のBlobを取得
        const latestBlob = blobs[blobs.length - 1];
        const response = await fetch(latestBlob.downloadUrl || latestBlob.url);
        const data = await response.json();
        
        // 1時間キャッシュ（CDN）、クライアント側は30秒
        res.setHeader('Cache-Control', 'public, s-maxage=3600, max-age=30, stale-while-revalidate=60');
        return res.status(200).json({ success: true, data });
      }
      
      return res.status(200).json({ success: true, data: null });
    } catch (err) {
      console.error('Site data GET error:', err);
      return res.status(200).json({ success: true, data: null });
    }
  }

  // POST: サイト設定を保存
  if (req.method === 'POST') {
    // 簡易認証（ダッシュボードのパスワード）
    const authKey = req.headers.authorization;
    const dashPassword = process.env.DASHBOARD_PASSWORD || 'jin2025';
    
    if (authKey !== `Bearer ${dashPassword}`) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      const siteData = req.body;
      
      if (!siteData || typeof siteData !== 'object') {
        return res.status(400).json({ error: 'Invalid data' });
      }

      // 写真データは保存しない（大きすぎるため）
      delete siteData.profilePhoto;

      // Blob Storageに保存（Private/Publicどちらでも対応）
      const payload = JSON.stringify(siteData);
      const options = { contentType: 'application/json', addRandomSuffix: false };
      let blob;
      try {
        blob = await put(BLOB_KEY, payload, { ...options, access: 'private' });
      } catch (e1) {
        try {
          blob = await put(BLOB_KEY, payload, { ...options, access: 'public' });
        } catch (e2) {
          blob = await put(BLOB_KEY, payload, options);
        }
      }

      console.log('Site data saved:', blob.url);

      return res.status(200).json({ 
        success: true, 
        message: 'Site data saved successfully',
        url: blob.url
      });
    } catch (err) {
      console.error('Site data POST error:', err);
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
