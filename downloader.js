const youtubedl = require('youtube-dl-exec');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const ffmpeg = require('ffmpeg-static');

// Proxy listni ENV dan olish
const proxies = process.env.PROXIES ? process.env.PROXIES.split(',').filter(p => p.trim() !== '') : [];

const getRandomProxy = () => {
    if (proxies.length === 0) return null;
    return proxies[Math.floor(Math.random() * proxies.length)];
};

const getRandomUserAgent = () => {
    const userAgents = [
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Safari/605.1.15",
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0"
    ];
    return userAgents[Math.floor(Math.random() * userAgents.length)];
};

const getMp3 = async (url, retries = 3) => {
    let attempt = 0;
    
    while (attempt < retries) {
        attempt++;
        try {
            const id = uuidv4();
            const outputPath = path.resolve(__dirname, 'public', 'downloads', `${id}.mp3`);
            
            // Ensure downloads directory exists
            const dir = path.dirname(outputPath);
            if (!fs.existsSync(dir)){
                fs.mkdirSync(dir, { recursive: true });
            }

            const proxy = getRandomProxy();
            const userAgent = getRandomUserAgent();

            const options = {
                extractAudio: true,
                audioFormat: 'mp3',
                audioQuality: 5,
                output: outputPath,
                ffmpegLocation: ffmpeg,
                noCheckCertificates: true,
                noWarnings: true,
                preferFreeFormats: true,
                printJson: true, // Download bilan birga metadata ni ham stdout ga chiqaradi
                addHeader: [
                    `referer:https://www.youtube.com/`,
                    `user-agent:${userAgent}`
                ]
            };

            if (proxy) {
                options.proxy = proxy;
            }

            console.log(`Yuklash boshlandi (Urinish ${attempt}/${retries}): ${url} (Proxy: ${proxy ? proxy : "Yo'q"})`);
            
            // yuklash va metadata ni olish (bir urinishda)
            const result = await youtubedl(url, options);

            let title = "Unknown", duration = 0, thumbnail = "", channel = "";
            try {
                // youtube-dl-exec stdout da JSON string qaytaradi (printJson tufayli)
                const metadata = typeof result === 'string' ? JSON.parse(result.split('\n')[0]) : result;
                title = metadata.title || "Unknown";
                duration = metadata.duration || 0;
                thumbnail = metadata.thumbnail || "";
                channel = metadata.uploader || "";
            } catch (err) {
                console.error("Metadata JSON parse xatosi:", err.message);
            }

            return {
                id,
                title,
                duration,
                thumbnail,
                channel,
                download_url: `/downloads/${id}.mp3`
            };

        } catch (error) {
            console.error(`Xatolik yuz berdi (Urinish ${attempt}):`, error.message);
            if (attempt >= retries) {
                throw new Error("Maksimal urinishlar soniga yetdi. Video yuklanmadi (Ehtimoliy blok).");
            }
            console.log("Anti-ban himoyasi: 3 soniyadan so'ng yangi proxy/user-agent bilan qayta urinib ko'riladi...");
            await new Promise(res => setTimeout(res, 3000));
        }
    }
};

module.exports = { getMp3 };
