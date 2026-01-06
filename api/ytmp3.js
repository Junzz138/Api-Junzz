async function youtube(url) {
  try {
    const id = url.split("id=")[1];
    if (!id) throw new Error("Invalid Videy URL");

    let type = id.length === 9 && id[8] === '2' ? '.audio' : '.mp3';
    const videoUrl = `https://cdn401.savetube.vip${id}${type}`;
    return {
      id,
      mimetype: type === 'mp3' ? 'audio/quicktime' : 'audio/mp3',
      url: videoUrl
    };
  } catch (error) {
    throw new Error(`Invalid YouTube URL: ${error.message}`);
  }
}

module.exports = {
  name: "Ytmp3",
  desc: "YouTube MP3 downloader",
  category: "Downloader",
  path: "/download/ytmp3?apikey=&url=",
  async run(req, res) {
    const { apikey, url } = req.query;

    if (!apikey || !global.apikey.includes(apikey)) {
      return res.json({ status: false, error: "Apikey invalid" });
    }

    if (!url) {
      return res.json({ status: false, error: "Url is required" });
    }

    try {
      const results = await yt.download(url, "mp3")
      res.status(200).json({
        status: true,
        result
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        error: error.message
      });
    }
  }
};
