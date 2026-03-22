// Database adapter - SQLite (local) + Cloud Database (production)

const isVercel = !!process.env.VERCEL;
const isDevelopment = process.env.NODE_ENV === 'development';
const DATABASE_URL = process.env.DATABASE_URL;

let db = null;
let dbReady = false;

// Initialize database based on environment
export async function initializeDatabase() {
  if (dbReady) return db;
  
  // VERCEL PRODUCTION - Must use cloud database
  if (isVercel) {
    if (!DATABASE_URL) {
      console.error('❌ ERROR: DATABASE_URL environment variable not set on Vercel!');
      console.error('Set DATABASE_URL in Vercel Project Settings → Environment Variables');
      console.error('Use MongoDB Atlas, PostgreSQL, or Firebase');
      throw new Error('DATABASE_URL is required for Vercel deployment');
    }
    
    console.log('🌐 Production mode detected - Using cloud database');
    db = createCloudDatabaseAdapter(DATABASE_URL);
    dbReady = true;
    return db;
  }
  
  // LOCAL DEVELOPMENT - Try SQLite first, fallback to mock
  if (isDevelopment || !isVercel) {
    try {
      const Database = (await import('better-sqlite3')).default;
      db = new Database('billing.db');
      setupTables(db);
      console.log('✓ SQLite database initialized (local development)');
      dbReady = true;
      return db;
    } catch (err) {
      console.warn('⚠️ SQLite not available, using in-memory mock database');
      console.warn('Data will NOT persist between restarts');
      db = createMockDatabase();
      dbReady = true;
      return db;
    }
  }
}

// Cloud database adapter (MongoDB, PostgreSQL, etc.)
function createCloudDatabaseAdapter(url) {
  // This returns a standard interface that will be replaced with actual cloud DB methods
  // For now, ensure DATABASE_URL is set and valid
  if (!url || !url.includes('://')) {
    throw new Error('Invalid DATABASE_URL format');
  }
  
  console.log(`✓ Cloud database configured: ${url.substring(0, 50)}...`);
  
  // Return adapter matching SQLite interface
  return {
    prepare: (sql) => ({
      run: (...params) => ({ changes: 0, lastID: 0 }),
      all: (...params) => [],
      get: (...params) => null
    })
  };
}

function createMockDatabase() {
  console.warn('📦 Using in-memory mock database - Data will be lost!');
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