module.exports = {
  name: "Pap ayang",
  desc: "Random Pap ayang",
  category: "Random",
  path: "/random/papayang?apikey=",
  async run(req, res) {
    const { apikey } = req.query;
    if (!apikey || !global.apikey.includes(apikey)) {
      return res.json({ status: false, error: 'Apikey invalid' });
    }

    try {
      const data = await fetchJson(`https://img12.pixhost.to/images/507/570627648_skyzopedia.jpg`);
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
