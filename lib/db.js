import { MongoClient } from 'mongodb';

let db = null;
let client = null;

// Initialize database connection
async function initDB() {
  if (db) return db;
  
  const isProduction = process.env.VERCEL || process.env.NODE_ENV === 'production';
  const databaseUrl = process.env.DATABASE_URL;
  
  // Production: MongoDB Atlas
  if (isProduction && databaseUrl) {
    try {
      console.log('🌐 Connecting to MongoDB Atlas...');
      
      // Parse MongoDB connection string
      if (!databaseUrl.includes('mongodb')) {
        throw new Error('DATABASE_URL must be a valid MongoDB connection string');
      }
      
      client = new MongoClient(databaseUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      
      await client.connect();
      db = client.db('medical_billing');
      
      console.log('✅ Connected to MongoDB Atlas');
      return db;
    } catch (error) {
      console.error('❌ MongoDB connection failed:', error.message);
      throw new Error('Failed to connect to MongoDB: ' + error.message);
    }
  }
  
  // Local/Development: SQLite
  try {
    console.log('📦 Using SQLite for local development');
    const Database = (await import('better-sqlite3')).default;
    db = new Database('billing.db');
    
    // Create tables
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
    
    console.log('✓ SQLite database initialized');
    return db;
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    throw error;
  }
}

// Export as promise for async initialization
export const dbPromise = initDB();

export default db;
