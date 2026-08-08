require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { logDownload } = require('./db');
const { getMp3 } = require('./downloader');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// MP3 larni serve qilish uchun public papka (Faqat fayllar uchun)
app.use(express.static(path.join(__dirname, 'public')));

// RapidAPI Proxy Tekshiruvi (Opsional)
const rapidApiAuth = (req, res, next) => {
    // Agar faqat RapidAPIdan so'rovlarni qabul qilmoqchi bo'lsangiz
    // const proxySecret = req.headers['x-rapidapi-proxy-secret'];
    // if (proxySecret !== process.env.RAPIDAPI_PROXY_SECRET) {
    //     return res.status(403).json({ error: "Ruxsat etilmagan" });
    // }
    next();
};

app.get('/', (req, res) => {
    res.json({ message: "YouTube to MP3 API is running smoothly!" });
});

app.get('/api/yt/download', rapidApiAuth, async (req, res) => {
    const startTime = Date.now();
    const url = req.query.url || req.query.videoId;
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    if (!url) {
        return res.status(400).json({ status: "error", message: "url parameter is required (e.g. ?url=https://youtube.com/watch?v=...)" });
    }

    try {
        const fullUrl = url.includes('http') ? url : `https://www.youtube.com/watch?v=${url}`;
        
        const result = await getMp3(fullUrl);
        const durationMs = Date.now() - startTime;

        // Log to stats DB
        await logDownload(result.id, fullUrl, clientIp, 'success', durationMs);

        // To'liq yuklash havolasini shakllantirish
        const fullDownloadUrl = `${req.protocol}://${req.get('host')}${result.download_url}`;
        result.download_url = fullDownloadUrl;

        res.json({
            status: "success",
            metadata: {
                title: result.title,
                duration: result.duration,
                thumbnail: result.thumbnail,
                channel: result.channel
            },
            download_url: result.download_url
        });

    } catch (error) {
        const durationMs = Date.now() - startTime;
        await logDownload('err-'+Date.now(), url, clientIp, 'error', durationMs);
        
        res.status(500).json({
            status: "error",
            message: "Failed to download the video or rate limit reached.",
            details: error.message
        });
    }
});


app.listen(PORT, () => {
    console.log(`Server http://localhost:${PORT} da ishga tushdi`);
});
