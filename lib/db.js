
import Database from 'better-sqlite3';

const db = new Database('billing.db');

// Create bills table
db.prepare(`
  CREATE TABLE IF NOT EXISTS bills (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patientName TEXT NOT NULL,
    status TEXT DEFAULT 'Pending',
    totalAmount REAL DEFAULT 0,
    createdAt TEXT
  )
`).run();

// Create bill items table
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

// Migrate existing data if needed
try {
  const oldBills = db.prepare('SELECT * FROM bills WHERE service IS NOT NULL').all();
  if (oldBills.length > 0) {
    const deleteOldTable = db.prepare('DROP TABLE IF EXISTS bills_old');
    deleteOldTable.run();
    
    // Backup and migrate
    oldBills.forEach(bill => {
      const newBill = db.prepare(
        'INSERT OR IGNORE INTO bills (id, patientName, status, totalAmount, createdAt) VALUES (?, ?, ?, ?, ?)'
      );
      newBill.run(bill.id, bill.patientName, bill.status, bill.amount, bill.createdAt);
      
      if (bill.service) {
        const item = db.prepare(
          'INSERT INTO billItems (billId, medicineName, quantity, unit, price) VALUES (?, ?, ?, ?, ?)'
        );
        item.run(bill.id, bill.service, 1, 'Qty', bill.amount);
      }
    });
  }
} catch (err) {
  // Table might already be migrated
}

export default db;
