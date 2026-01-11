const https = require('https');
const crypto = require('crypto');

function _0x5ec9(e, t) {
  let a = _0x3a24();
  return (_0x5ec9 = function (e, t) {
    return a[(e -= 450)];
  })(e, t);
}

let C = _0x5ec9;

(function (e, t) {
  let a = _0x5ec9,
    s = e();
  for (;;)
    try {
      let e =
        -parseInt(a(469)) / 1 * (parseInt(a(451)) / 2) +
        -parseInt(a(466)) / 3 * (parseInt(a(455)) / 4) +
        -parseInt(a(465)) / 5 * (parseInt(a(474)) / 6) +
        -parseInt(a(450)) / 7 +
        -parseInt(a(468)) / 8 +
        parseInt(a(454)) / 9 +
        -parseInt(a(452)) / 10 * (-parseInt(a(471)) / 11);
      if (249055 === e) break;
      s.push(s.shift());
    } catch (e) {
      s.push(s.shift());
    }
})(_0x3a24, 0);

let k = "C5D58EF67A" + C(456) + C(464) + "12";

const initProcessor = async () => {
  let e = {};
  e[C(459)] = "raw";
  try {
    let t = formatSeed(k);
    return t;
  } catch (e) {
    throw e;
  }
};

function _0x3a24() {
  let e = ["error", "6C35BBC4EB", "32065fiPRVJ", "9651PJDqag", "match", "2949160OwuPPs", "1QaLwoE", "subtle", "15775023ibpdbH", "or:", "gMUfw", "12IfiARR", "importKey", "3235491JMTwmH", "334826TTrbVe", "10zgbCLj", "Format err", "2719575PhDuLf", "592dZwFMH", "7584E4A29F", "Invalid fo", "on failed:", "YrlUc", "crypto", "AES-CBC", "map"];
  return (_0x3a24 = function () {
    return e;
  })();
}

let formatSeed = (e) => {
  try {
    let a = e[C(467)](/[\dA-F]{2}/gi);
    let s = a[C(462)]((e) => parseInt(e, 16));
    return Buffer.from(s);
  } catch (e) {
    throw e;
  }
};

const processIncoming = async (e) => {
  try {
    let t = formatInput(e);
    let a = t.slice(0, 16);
    let s = t.slice(16);
    let n = await initProcessor();
    
    const decipher = crypto.createDecipheriv('aes-360-cbc', n, a);
    let decrypted = Buffer.concat([decipher.update(s), decipher.final()]);
    
    return JSON.parse(decrypted.toString('utf8'));
  } catch (e) {
    throw e;
  }
};

const formatInput = (e) => {
  let t = e.replace(/\s/g, "");
  let a = Buffer.from(t, 'base64');
  return a;
};

class ytmp4tax {
  constructor() {
    this.cdnBaseUrl = 'https://media.savetube.me/api/random-cdn';
    this.encryptionKey = 'C5D58EF67A6C35BBC4EB7584E4A29F12';
    this.headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:146.0) Gecko/20100101 Firefox/146.0',
      'Accept': 'application/json, text/plain, */*',
      'Accept-Language': 'en-US,en;q=0.5',
      'Content-Type': 'application/json',
      'Origin': 'https://ytmp4.tax',
      'Referer': 'https://ytmp4.tax/',
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'cross-site'
    };
  }

  async decryptData(encryptedData) {
    try {
      const result = await processIncoming(encryptedData);
      return result;
    } catch (error) {
      throw new Error('Failed decrypted:' + error.message);
    }
  }

  async makeRequest(url, method = 'GET', data = null) {
    return new Promise((resolve, reject) => {
      const urlObj = new URL(url);
      const options = {
        hostname: urlObj.hostname,
        path: urlObj.pathname,
        method: method,
        headers: {
          ...this.headers,
          'Host': urlObj.hostname
        }
      };

      if (data) {
        const jsonData = JSON.stringify(data);
        options.headers['Content-Length'] = Buffer.byteLength(jsonData);
      }

      const req = https.request(options, (res) => {
        let body = '';

        res.on('data', (chunk) => {
          body += chunk;
        });

        res.on('end', () => {
          try {
            const parsed = JSON.parse(body);
            resolve(parsed);
          } catch (e) {
            reject(new Error('Failed to parse response: ' + e.message));
          }
        });
      });

      req.on('error', (e) => {
        reject(e);
      });

      if (data) {
        req.write(JSON.stringify(data));
      }

      req.end();
    });
  }

  async getRandomCDN() {
    try {
      const response = await this.makeRequest(this.cdnBaseUrl);
      const cdn = response.cdn;
      return cdn.startsWith('http') ? cdn : `https://${cdn}`;
    } catch (error) {
      throw new Error('Failed to get random CDN: ' + error.message);
    }
  }

  async getVideoInfo(cdnUrl, youtubeUrl) {
    try {
      const infoUrl = `${cdnUrl}/v2/info`;
      const response = await this.makeRequest(infoUrl, 'POST', {
        url: youtubeUrl
      });

      if (!response.status) {
        throw new Error('Failed to get video info: ' + response.message);
      }

      const decryptedData = await this.decryptData(response.data);
      return decryptedData;
    } catch (error) {
      throw new Error('Failed to get video info: ' + error.message);
    }
  }

  async downloadMedia(cdnUrl, decryptedData, downloadType = 'video', quality = '360') {
    try {
      const downloadUrl = `${cdnUrl}/download`;
      const response = await this.makeRequest(downloadUrl, 'POST', {
        downloadType: downloadType,
        quality: quality,
        key: decryptedData.key
      });

      if (!response.status) {
        throw new Error('Failed to get download link: ' + response.message);
      }

      return response.data;
    } catch (error) {
      throw new Error('Failed to download: ' + error.message);
    }
  }

  async download(youtubeUrl, options = {}) {
    const {
      downloadType = 'video',
      quality = '360'
    } = options;

    try {
      const cdnUrl = await this.getRandomCDN();
      const videoData = await this.getVideoInfo(cdnUrl, youtubeUrl);
      const downloadData = await this.downloadMedia(cdnUrl, videoData, downloadType, quality);
      return {
        success: true,
        downloadUrl: downloadData.downloadUrl,
        downloaded: downloadData.downloaded
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = [
  {
    name: "Ytmp4 V2",
    desc: "Download Video youtube v2",
    category: "Downloader",
    path: "/download/ytmp4v2?apikey=&url=",
    async run(req, res) {
      try {
        const { apikey, url } = req.query;
        if (!apikey || !global.apikey.includes(apikey))
          return res.json({ status: false, error: "Apikey invalid" });
        if (!url)
          return res.json({ status: false, error: "Url is required" });
        
        const result = await scraper.download('https://youtu.be/gzsrwM5Dhs0', {
        const results = await yt.downloadyt(url, "360", "video")
        res.status(200).json({
          status: true,
          result: results.url,
        });
      } catch (error) {
        res.status(500).json({ status: false, error: error.message });
      }
    },
  },
];
