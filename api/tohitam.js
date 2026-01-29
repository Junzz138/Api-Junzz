module.exports = {
  name: "To Hitam",
  desc: "Hitamkan foto orang",
  category: "Imagecreator",
  path: "/imagecreator/tohitam?apikey=&url=",
  async run(req, res) {
    const { apikey, url } = req.query;

    if (!apikey || !global.apikey.includes(apikey)) {
      return res.json({ status: false, error: "Apikey invalid" });
    }

    if (!url) {
      return res.json({ status: false, error: "Url is required" });
    }

    try {
      const api = await fetchJson(
        `https://api-faa.my.id/faa/tohitam?url=${encodeURIComponent(url)}`
      );

      if (!api.status) {
        return res.status(500).json({
          status: false,
          error: api.error || "API error"
        });
      }

      res.status(200).json({
        status: true,
        creator: api.creator,
        result: api.result
      });

    } catch (e) {
      res.status(500).json({
        status: false,
        error: e.message
      });
    }
  }
};
