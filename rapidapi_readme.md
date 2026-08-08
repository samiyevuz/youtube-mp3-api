<p align="center">
  <img src="https://raw.githubusercontent.com/samiyevuz/youtube-mp3-api/main/logo.jpg" alt="YouTube to MP3 API" width="200" height="200" />
</p>

# 🎵 YouTube to MP3 Downloader API

Welcome to the **YouTube to MP3 Downloader API**! This API allows developers to effortlessly convert and download YouTube videos into high-quality MP3 audio files. Whether you are building a music application, a Discord bot, or a custom automation script, this API provides everything you need in a single endpoint.

---

## 🌟 Why Choose This API?

- **Anti-Ban Protection:** Powered by an advanced internal proxy and auto-retry engine. It bypasses YouTube's strict rate limits and IP bans to guarantee a 99.9% success rate.
- **Lightning Fast:** Generates audio instantly in a single stream, delivering the MP3 without any waiting queues.
- **Rich Metadata Extraction:** Instantly retrieve the video's title, duration, channel name, and a high-resolution thumbnail.
- **No Limit on Length:** Download both short clips and long podcasts without disruption.

---

## 🚀 Quick Start Guide

### Base URL
Our API requires no complex authentication headers if you are calling it directly via RapidAPI. RapidAPI will handle the `X-RapidAPI-Key` automatically for you.

### 1. Download & Convert MP3 (`GET /api/yt/download`)
This is the core endpoint. Provide the URL or the Video ID of the YouTube video, and we handle the rest.

**Parameters:**
- `url` *(string, required)* - The full YouTube video URL or the Video ID.

#### Example Request (cURL)
```bash
curl --request GET \
	--url 'https://youtube-mp3-downloader-fast-stable.p.rapidapi.com/api/yt/download?url=https%3A%2F%2Fyoutu.be%2FdQw4w9WgXcQ' \
	--header 'X-RapidAPI-Host: youtube-mp3-downloader-fast-stable.p.rapidapi.com' \
	--header 'X-RapidAPI-Key: YOUR_RAPIDAPI_KEY'
```

#### Example Request (Python - Requests)
```python
import requests

url = "https://youtube-mp3-downloader-fast-stable.p.rapidapi.com/api/yt/download"
querystring = {"url": "https://youtu.be/dQw4w9WgXcQ"}
headers = {
	"X-RapidAPI-Key": "YOUR_RAPIDAPI_KEY",
	"X-RapidAPI-Host": "youtube-mp3-downloader-fast-stable.p.rapidapi.com"
}

response = requests.get(url, headers=headers, params=querystring)
print(response.json())
```

#### Example Response (200 OK)
```json
{
  "status": "success",
  "metadata": {
    "title": "Rick Astley - Never Gonna Give You Up (Official Music Video)",
    "duration": 213,
    "thumbnail": "https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    "channel": "Rick Astley"
  },
  "download_url": "http://213.199.36.249:3000/downloads/377f45ca-bc49-484e-b8d1.mp3"
}
```

---

## 🛠️ Error Handling

We use standard HTTP response codes to indicate the success or failure of an API request:

- `200 OK` - The request was successful.
- `400 Bad Request` - The `url` parameter is missing or invalid.
- `500 Internal Server Error` - Something went wrong on our end (e.g., video is age-restricted, private, or temporarily blocked). Our Anti-Ban engine retries 3 times automatically before returning this error.

---

## 💬 Support
If you experience any issues or need a custom feature (such as higher bitrate limits or MP4 support), feel free to reach out via the **Discussions** tab on RapidAPI!
