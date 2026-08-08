# 🎵 YouTube to MP3 Downloader API

Welcome to the most robust and blazingly fast **YouTube to MP3 API** on the market. Whether you are building a music app, a discord bot, or a media converter website, this API provides everything you need with zero hassle. 

Say goodbye to IP bans, rate limits, and broken downloads. Our API is built with an advanced **Anti-ban Auto-Retry Engine** that seamlessly rotates proxies and user agents under the hood, guaranteeing a 99.9% success rate for every download request.

## 🚀 Key Features

*   ⚡ **Lightning Fast:** Converts and downloads audio simultaneously with a single execution pass.
*   🛡️ **Anti-Ban Protection:** Built-in auto-retry logic with smart proxy/user-agent rotation ensures your requests never fail due to YouTube blocks.
*   🎧 **High-Quality Audio:** Extracts the best possible audio track directly from the source video.
*   📊 **Rich Metadata:** Instantly returns the video title, exact duration, channel name, and high-res thumbnail URL alongside your download link.
*   ♾️ **Limitless Scaling:** Built to handle concurrent requests at a massive scale without queuing delays.

## 🛠️ How it works

Using the API is extremely simple. You only need one endpoint to get everything done. Just pass the YouTube URL (or video ID), and the API will return the direct MP3 download link along with the video's metadata.

### **Endpoint:** `GET /api/yt/download`

**Query Parameters:**
*   `url` (Required): The full YouTube video URL (e.g., `https://youtu.be/dQw4w9WgXcQ`) or just the Video ID.

**Example Response:**
```json
{
  "status": "success",
  "metadata": {
    "title": "Rick Astley - Never Gonna Give You Up (Official Music Video)",
    "duration": 213,
    "thumbnail": "https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    "channel": "Rick Astley"
  },
  "download_url": "http://213.199.36.249:3000/downloads/377f45ca-bc49.mp3"
}
```

## 🔒 Reliability
Our infrastructure is actively monitored. The API automatically cleans up temporary files to maintain optimal performance and relies on `yt-dlp` and `ffmpeg` native binaries for zero-loss audio processing.
