const axios = require('axios');
const cheerio = require('cheerio');

function msToMinutes(ms) {
  const totalSeconds = Math.floor(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

async function spotifyDownload(url) {
  if (!url) throw new Error('Link-nya mana, senpai?')

  const response = await axios.post('https://spotmate.online/en', { urls: spotifyUrl }, {
    headers: {
      'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Mobile Safari/537.36',
    }
  })
    
  const mate = mateResponse.data
  if (!mate || !mate.success || !mate.id)
    throw new Error('Gomen senpai! Aku gagal mengambil info lagunya')

  const response = await axios.post('https://spotmate.online/getTrackData', { urls: spotifyUrl }, {
    headers: {
      'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Mobile Safari/537.36',
    }
  })

  const result = response.data
  if (!result || !result.success || !result.link)
    throw new Error('Yabai! Gagal dapetin link-nya senpai!')

  return {
    artist: meta.artists || meta.artist || 'Unknown',
    title: meta.title || 'Unknown',
    duration: meta.duration_ms ? msToMinutes(meta.duration_ms) : 'Unknown',
    image: meta.cover || null,
    download: result.link
  }
}

module.exports = {
  name: "Spotify",
  desc: "Spotify song downloader",
  category: "Downloader",
  path: "/download/spotify?apikey=&url=",
  async run(req, res) {
    const { apikey, url } = req.query;

    if (!global.apikey.includes(apikey)) {
      return res.json({ status: false, error: "Apikey invalid" });
    }

    if (!url) {
      return res.json({ status: false, error: "Url is required" });
    }

    try {
      const resu = await spotifyDownload(url);
      let dat = resu
      res.status(200).json({
        status: true,
        result: dat
      });
    } catch (error) {
      res.status(500).json({ status: false, error: error.message });
    }
  }
};
