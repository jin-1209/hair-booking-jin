// Instagram投稿取得API
// Vercel環境変数からトークンを読み取り、Instagram Graph APIにリクエスト
// フロントエンドからはこのAPIを呼ぶだけでOK（トークンは隠蔽）

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  
  // キャッシュ: 1時間
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=7200');

  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  const userId = process.env.INSTAGRAM_USER_ID;

  if (!accessToken || !userId) {
    return res.status(200).json({ 
      data: [], 
      error: 'Instagram APIが未設定です' 
    });
  }

  try {
    const limit = req.query.limit || 8;
    const url = `https://graph.instagram.com/${userId}/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&limit=${limit}&access_token=${accessToken}`;
    
    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      console.error('Instagram API error:', data.error);
      return res.status(200).json({ 
        data: [], 
        error: data.error.message 
      });
    }

    // 必要なフィールドだけ返す（トークンは返さない）
    const posts = (data.data || []).map(post => ({
      id: post.id,
      caption: post.caption || '',
      mediaType: post.media_type,
      mediaUrl: post.media_url,
      thumbnailUrl: post.thumbnail_url,
      permalink: post.permalink,
      timestamp: post.timestamp
    }));

    return res.status(200).json({ data: posts });
  } catch (error) {
    console.error('Instagram fetch error:', error);
    return res.status(200).json({ 
      data: [], 
      error: 'Instagram投稿の取得に失敗しました' 
    });
  }
}
