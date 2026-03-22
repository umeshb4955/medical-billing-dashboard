import { MongoClient } from 'mongodb';

let db = null;
let client = null;

// Initialize database connection
async function initDB() {
  if (db) return db;
  
  const isProduction = process.env.VERCEL || process.env.NODE_ENV === 'production';
  const databaseUrl = process.env.DATABASE_URL;
  
  console.log('📋 Database Init - Environment:', {
    isProduction,
    hasDatabaseUrl: !!databaseUrl,
    nodeEnv: process.env.NODE_ENV,
    vercel: process.env.VERCEL
  });
  
  // Production: MongoDB Atlas
  if (isProduction && databaseUrl) {
    try {
      console.log('🌐 Connecting to MongoDB Atlas...');
      console.log('📦 Connection string starts with:', databaseUrl.substring(0, 20) + '...');
      
      // Parse MongoDB connection string
      if (!databaseUrl.includes('mongodb')) {
        throw new Error('DATABASE_URL must be a valid MongoDB connection string (starts with mongodb://)');
      }
      
      client = new MongoClient(databaseUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 10000,
      });
      
      await client.connect();
      db = client.db('medical_billing');
      
      console.log('✅ Connected to MongoDB Atlas');
      return db;
    } catch (error) {
      console.error('❌ MongoDB connection failed:', error);
      console.error('Error details:', error.message);
      console.error('DATABASE_URL check:', {
        exists: !!databaseUrl,
        length: databaseUrl?.length,
        startsWithMongodb: databaseUrl?.startsWith('mongodb')
      });
      
      // Don't throw - this will crash the app
      // Instead return a mock database that will fail on operations with clear error
      console.error('❌ CRITICAL: MongoDB failed and no SQLite available on Vercel');
      console.error('📝 ACTION: Set DATABASE_URL environment variable in Vercel project settings');
      return null;
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
    console.error('❌ Database initialization error:', error.message);
    console.error('📝 This is expected on Vercel (no persistent filesystem for SQLite)');
    console.error('📝 ACTION: Set DATABASE_URL environment variable for MongoDB Atlas');
    return null;
  }
}

// Export as promise for async initialization
export const dbPromise = initDB();

export default db;
