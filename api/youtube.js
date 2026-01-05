const fetch = require("node-fetch");

class YouTubeDownloader {
    constructor() {
        this.baseUrl = 'https://ssvid.net';
        this.baseHeaders = {
            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'origin': this.baseUrl,
            'referer': this.baseUrl + '/youtube-to-mp3'
        };
        this.validFormats = ['mp3', '360p', '720p', '1080p'];
    }

    validateFormat(format) {
        if (!this.validFormats.includes(format)) {
            throw new Error(`Invalid format! Available formats: ${this.validFormats.join(', ')}`);
        }
    }

    handleFormat(format, searchJson) {
        this.validateFormat(format);
        let result;
        if (format === 'mp3') {
            result = searchJson.links?.mp3?.mp3128?.k;
        } else {
            const allFormats = Object.entries(searchJson.links.mp4);
            const qualities = allFormats
                .map(([key, value]) => value.q)
                .filter(q => /\d+p/.test(q))
                .map(q => parseInt(q))
                .sort((a, b) => b - a)
                .map(q => q + 'p');

            let selectedFormat = qualities.includes(format) ? format : qualities[0];
            if (selectedFormat !== format) {
                console.log(`Format ${format} not available. Auto fallback to best available: ${selectedFormat}`);
            }
            const find = allFormats.find(([key, value]) => value.q === selectedFormat);
            result = find?.[1]?.k;
        }
        if (!result) {
            throw new Error(`Format ${format} not available.`);
        }
        return result;
    }

    async hit(path, payload) {
        try {
            const body = new URLSearchParams(payload);
            const opts = {
                headers: this.baseHeaders,
                body,
                method: 'POST'
            };
            const response = await fetch(`${this.baseUrl}${path}`, opts);
            console.log('Hit:', path);
            if (!response.ok) {
                throw new Error(`${response.status} ${response.statusText}\n${await response.text()}`);
            }
            const json = await response.json();
            return json;
        } catch (error) {
            throw new Error(`${path}\n${error.message}`);
        }
    }

    async download(queryOrYtUrl, format = 'mp3') {
        this.validateFormat(format);

        // First search
        let search = await this.hit('/api/ajax/search', {
            query: queryOrYtUrl,
            cf_token: '',
            vt: 'youtube'
        });

        if (search.p === 'search') {
            if (!search?.items?.length) {
                throw new Error(`No search results for ${queryOrYtUrl}`);
            }
            const { v, t } = search.items[0];
            const videoUrl = 'https://www.youtube.com/watch?v=' + v;
            console.log(`[Found]\nTitle: ${t}\nURL: ${videoUrl}`);

            // Search again with video URL
            search = await this.hit('/api/ajax/search', {
                query: videoUrl,
                cf_token: '',
                vt: 'youtube'
            });
        }

        const vid = search.vid;
        const k = this.handleFormat(format, search);

        // Convert request
        const convert = await this.hit('/api/ajax/convert', { k, vid });

        if (convert.c_status === 'CONVERTING') {
            const limit = 5;
            let attempt = 0;
            let convertResult;
            do {
                attempt++;
                console.log(`Checking conversion ${attempt}/${limit}`);
                convertResult = await this.hit('/api/convert/check?hl=en', {
                    vid,
                    b_id: convert.b_id
                });
                if (convertResult.c_status === 'CONVERTED') {
                    return convertResult;
                }
                await new Promise(resolve => setTimeout(resolve, 5000));
            } while (attempt < limit && convertResult.c_status === 'CONVERTING');
            throw new Error('File not ready or status unknown');
        } else {
            return convert;
        }
    }
}

const yt = new YouTubeDownloader();

module.exports = [
    {
        name: "Ytmp4",
        desc: "Download YouTube video",
        category: "Downloader",
        path: "/download/ytmp4?apikey=&url=",
        async run(req, res) {
            try {
                const { apikey, url } = req.query;
                if (!apikey || !global.apikey.includes(apikey)) {
                    return res.json({ status: false, error: "Invalid API key" });
                }
                if (!url) {
                    return res.json({ status: false, error: "URL is required" });
                }

                const results = await yt.download(url, "360p");
                res.status(200).json({
                    status: true,
                    result: results.dlink
                });
            } catch (error) {
                res.status(500).json({ status: false, error: error.message });
            }
        }
    },
    {
        name: "Ytmp3",
        desc: "Download YouTube audio",
        category: "Downloader",
        path: "/download/ytmp3?apikey=&url=",
        async run(req, res) {
            try {
                const { apikey, url } = req.query;
                if (!apikey || !global.apikey.includes(apikey)) {
                    return res.json({ status: false, error: "Invalid API key" });
                }
                if (!url) {
                    return res.json({ status: false, error: "URL is required" });
                }

                const results = await yt.download(url, "mp3");
                res.status(200).json({
                    status: true,
                    result: results.dlink
                });
            } catch (error) {
                res.status(500).json({ status: false, error: error.message });
            }
        }
    }
];
