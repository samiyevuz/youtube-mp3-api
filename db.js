const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'stats.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Baza bilan bog\'lanishda xato:', err.message);
    } else {
        console.log('SQLite bazasiga ulanish muvaffaqiyatli.');
    }
});

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS downloads (
            id TEXT PRIMARY KEY,
            video_url TEXT,
            client_ip TEXT,
            status TEXT,
            duration_ms INTEGER,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);
});

const logDownload = (id, video_url, client_ip, status, duration_ms) => {
    return new Promise((resolve, reject) => {
        const query = `INSERT INTO downloads (id, video_url, client_ip, status, duration_ms) VALUES (?, ?, ?, ?, ?)`;
        db.run(query, [id, video_url, client_ip, status, duration_ms], function (err) {
            if (err) {
                console.error("Ma'lumot saqlashda xato:", err.message);
                reject(err);
            } else {
                resolve(this.lastID);
            }
        });
    });
};

const getStats = () => {
    return new Promise((resolve, reject) => {
        db.get('SELECT COUNT(*) as total_downloads, AVG(duration_ms) as avg_duration FROM downloads WHERE status = "success"', (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
};

module.exports = { db, logDownload, getStats };
