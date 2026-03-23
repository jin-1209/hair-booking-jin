// Instagram長期トークン自動更新API
// Vercel Cronで月1回実行し、60日有効の長期トークンを更新
// 注意: Vercelの環境変数は自動では書き換えられないため、
// このAPIはトークンの有効性チェック＆ログ出力を行う
// トークンが期限切れ間近の場合、新しいトークンをログに出力する

export default async function handler(req, res) {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;

  if (!accessToken) {
    console.log('INSTAGRAM_ACCESS_TOKEN が設定されていません');
    return res.status(200).json({ message: 'トークン未設定' });
  }

  try {
    // 現在のトークンで新しい長期トークンを取得
    const refreshUrl = `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${accessToken}`;
    
    const response = await fetch(refreshUrl);
    const data = await response.json();

    if (data.error) {
      console.error('トークン更新エラー:', data.error);
      return res.status(200).json({ 
        success: false, 
        error: data.error.message,
        message: '⚠️ Instagram トークンの更新に失敗しました。手動で新しいトークンを取得してください。'
      });
    }

    // 新しいトークンが返された場合
    if (data.access_token) {
      console.log('✅ Instagram トークンが正常に更新されました');
      console.log('有効期限:', data.expires_in, '秒（約', Math.round(data.expires_in / 86400), '日）');
      console.log('⚠️ 重要: Vercel環境変数の INSTAGRAM_ACCESS_TOKEN を以下に更新してください:');
      console.log('新しいトークン:', data.access_token.substring(0, 20) + '...');
      
      return res.status(200).json({ 
        success: true, 
        message: 'トークン更新成功。Vercel環境変数を更新してください。',
        expiresIn: data.expires_in,
        // セキュリティのため、トークンの一部のみ返す
        tokenPreview: data.access_token.substring(0, 20) + '...'
      });
    }

    return res.status(200).json({ success: true, message: 'トークンは有効です' });
  } catch (error) {
    console.error('トークン更新中のエラー:', error);
    return res.status(200).json({ 
      success: false, 
      error: error.message 
    });
  }
}
