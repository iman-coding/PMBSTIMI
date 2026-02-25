import Database from 'better-sqlite3';

const db = new Database('pmb.db');
db.pragma('journal_mode = WAL');

export function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'student',
      paymentStatus TEXT DEFAULT 'Awaiting',
      biodataStatus TEXT DEFAULT 'Incomplete',
      documentStatus TEXT DEFAULT 'Incomplete',
      tkaStatus TEXT DEFAULT 'Incomplete',
      placeOfBirth TEXT,
      dateOfBirth TEXT,
      nik TEXT,
      nisn TEXT,
      address TEXT,
      phoneNumber TEXT,
      tkaScore INTEGER,
      admissionStatus TEXT DEFAULT 'Pending'
    );
  `);
  console.log('Database initialized.');
}

export default db;
