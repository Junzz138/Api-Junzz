module.exports = {
  name: "Blue Archive",
  desc: "Random blue archive beautiful",
  category: "Random",
  path: "/random/ba?apikey=",
  async run(req, res) {
    const { apikey } = req.query;
    if (!apikey || !global.apikey.includes(apikey)) {
      return res.json({ status: false, error: 'Apikey invalid' });
    }

    try {
      const data = await fetchJson(`https://raw.githubusercontent.com/rynxzyy/blue-archive-r-img/refs/heads/main/links.json`);
      const image = await getBuffer(data.url);

      res.writeHead(200, {
        'Content-Type': 'image/png',
        'Content-Length': image.length
      });
      res.end(image);
    } catch (error) {
      res.status(500).json({ status: false, error: error.message });
    }
  }
};
