const fetch = require("node-fetch");

module.exports = [
  {
    name: "Ytmp3",
    desc: "Download audio youtube",
    category: "Downloader",
    path: "/download/ytmp3?apikey=&url=",
    async run(req, res) {
      try {
        const { apikey, url } = req.query;

        if (!apikey || !global.apikey.includes(apikey)) {
          return res.json({ status: false, error: "Apikey invalid" });
        }

        if (!url) {
          return res.json({ status: false, error: "Url is required" });
        }

        // 🔥 Panggil API kriszzyy
        const api = `https://api.kriszzyy.xyz/downloader/yta?url=${encodeURIComponent(url)}`;
        const response = await fetch(api);
        const json = await response.json();

        if (!json.status) {
          return res.json({ status: false, error: "Gagal mengambil data" });
        }

        const data = json.data;

        res.status(200).json({
          status: true,
          creator: json.creator,
          result: {
            title: data.metadata.title,
            channel: data.metadata.channel,
            duration: data.metadata.lengthSeconds,
            thumbnail: data.metadata.thumbnail,
            download_url: data.download.url,
            filename: data.download.filename
          }
        });

      } catch (error) {
        res.status(500).json({
          status: false,
          error: error.message
        });
      }
    },
  },
];
