// Database adapter - handles both SQLite (local) and mock (Vercel)

const isVercel = !!process.env.VERCEL;

let db = null;
let dbReady = false;

// Initialize database based on environment
export async function initializeDatabase() {
  if (dbReady) return db;
  
  if (isVercel) {
    // Vercel environment - use mock database
    console.log('📦 Running on Vercel - Using in-memory database');
    db = createMockDatabase();
  } else {
    // Local environment - try to use SQLite
    try {
      const Database = (await import('better-sqlite3')).default;
      db = new Database('billing.db');
      setupTables(db);
      console.log('✓ SQLite database initialized');
    } catch (err) {
      // Fallback to mock
      console.warn('⚠️ better-sqlite3 not available, using in-memory database');
      db = createMockDatabase();
    }
  }
  
  dbReady = true;
  return db;
}

function createMockDatabase() {
  return {
    prepare: (sql) => ({
      run: (...params) => ({ changes: 1, lastID: Date.now() }),
      all: (...params) => [],
      get: (...params) => null
    })
  };
}

function setupTables(database) {
  database.prepare(`
    CREATE TABLE IF NOT EXISTS bills (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patientName TEXT NOT NULL,
      status TEXT DEFAULT 'Pending',
      totalAmount REAL DEFAULT 0,
      createdAt TEXT
    )
  `).run();

  database.prepare(`
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
}

// Export lazy-initialized database
export default db;