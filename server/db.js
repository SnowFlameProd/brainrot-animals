const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.resolve(__dirname, 'database.db'));

db.prepare(`
    CREATE TABLE IF NOT EXISTS users (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     username TEXT UNIQUE NOT NULL,
     password TEXT NOT NULL,
     created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
`).run();

module.exports = db;
