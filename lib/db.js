
let db = null;

// Mock database (works on Vercel)
const mockDB = {
  prepare: (sql) => ({
    run: (...args) => ({ changes: 1, lastID: 1 }),
    all: (...args) => [],
    get: (...args) => null
  })
};

async function initDB() {
  if (db) return db;
  
  // Skip SQLite on Vercel
  if (process.env.VERCEL) {
    db = mockDB;
    console.log('📦 Vercel - using in-memory database');
    return db;
  }
  
  // Try to load SQLite locally
  try {
    const Database = (await import('better-sqlite3')).default;
    db = new Database('billing.db');
    
    db.prepare(`
      CREATE TABLE IF NOT EXISTS bills (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        patientName TEXT NOT NULL,
        status TEXT DEFAULT 'Pending',
        totalAmount REAL DEFAULT 0,
        createdAt TEXT
      )
    `).run();

    db.prepare(`
      CREATE TABLE IF NOT EXISTS billItems (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        billId INTEGER NOT NULL,
        medicineName TEXT NOT NULL,
        quantity INTEGER DEFAULT 1,
        unit TEXT DEFAULT 'Qty',
        hsn TEXT,
        price REAL DEFAULT 0,
        FOREIGN KEY (billId) REFERENCES bills(id) ON DELETE CASCADE
      )
    `).run();
    
    console.log('✓ SQLite loaded');
    return db;
  } catch (err) {
    console.warn('⚠️ SQLite not available, using mock database');
    db = mockDB;
    return db;
  }
}

// Initialize and export
export const dbPromise = initDB();
export default mockDB; // Default export in case sync access is needed
