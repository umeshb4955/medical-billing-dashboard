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

// Create billItems table
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

// Clear existing data
db.prepare('DELETE FROM billItems').run();
db.prepare('DELETE FROM bills').run();

// Insert sample bills with items
const sampleBills = [
  {
    patientName: 'Rajesh Kumar',
    status: 'Paid',
    createdAt: new Date('2026-03-10').toISOString(),
    items: [
      { medicineName: 'Amoxicillin', quantity: 10, unit: 'Tablets', hsn: '3004', price: 250 },
      { medicineName: 'Paracetamol', quantity: 15, unit: 'Tablets', hsn: '2941', price: 150 }
    ]
  },
  {
    patientName: 'Priya Sharma',
    status: 'Paid',
    createdAt: new Date('2026-03-12').toISOString(),
    items: [
      { medicineName: 'Ibuprofen', quantity: 20, unit: 'Capsules', hsn: '2941', price: 300 },
      { medicineName: 'Aspirin', quantity: 30, unit: 'Tablets', hsn: '2941', price: 200 },
      { medicineName: 'Vitamin D3', quantity: 1, unit: 'Bottle', hsn: '2106', price: 450 }
    ]
  },
  {
    patientName: 'Amit Patel',
    status: 'Pending',
    createdAt: new Date('2026-03-13').toISOString(),
    items: [
      { medicineName: 'Azithromycin', quantity: 6, unit: 'Tablets', hsn: '3004', price: 400 },
      { medicineName: 'Cough Syrup', quantity: 1, unit: 'Bottle', hsn: '3003', price: 180 }
    ]
  },
  {
    patientName: 'Neha Singh',
    status: 'Pending',
    createdAt: new Date('2026-03-14').toISOString(),
    items: [
      { medicineName: 'Metformin', quantity: 30, unit: 'Tablets', hsn: '3004', price: 350 },
      { medicineName: 'Lisinopril', quantity: 30, unit: 'Tablets', hsn: '3004', price: 600 },
      { medicineName: 'Atorvastatin', quantity: 30, unit: 'Tablets', hsn: '3004', price: 500 }
    ]
  },
  {
    patientName: 'Vikram Desai',
    status: 'Paid',
    createdAt: new Date('2026-03-15').toISOString(),
    items: [
      { medicineName: 'Eye Drops', quantity: 1, unit: 'Bottle', hsn: '3005', price: 250 },
      { medicineName: 'Antibiotic Ointment', quantity: 1, unit: 'Tube', hsn: '3005', price: 150 }
    ]
  },
  {
    patientName: 'Anjali Verma',
    status: 'Pending',
    createdAt: new Date('2026-03-16').toISOString(),
    items: [
      { medicineName: 'Omeprazole', quantity: 30, unit: 'Capsules', hsn: '3004', price: 400 },
      { medicineName: 'Domperidone', quantity: 30, unit: 'Tablets', hsn: '3004', price: 250 }
    ]
  },
  {
    patientName: 'Rohan Singh',
    status: 'Paid',
    createdAt: new Date('2026-03-17').toISOString(),
    items: [
      { medicineName: 'Cetirizine', quantity: 10, unit: 'Tablets', hsn: '3004', price: 180 },
      { medicineName: 'Salbutamol Inhaler', quantity: 1, unit: 'Piece', hsn: '3003', price: 280 }
    ]
  },
  {
    patientName: 'Divya Nair',
    status: 'Pending',
    createdAt: new Date('2026-03-18').toISOString(),
    items: [
      { medicineName: 'Prenatal Vitamin', quantity: 60, unit: 'Tablets', hsn: '2106', price: 800 },
      { medicineName: 'Folic Acid', quantity: 30, unit: 'Tablets', hsn: '2106', price: 200 }
    ]
  }
];

// Insert bills and their items
console.log('🔄 Seeding database with sample bills...');
let totalItems = 0;

sampleBills.forEach(bill => {
  const billStmt = db.prepare(
    'INSERT INTO bills (patientName, status, totalAmount, createdAt) VALUES (?, ?, ?, ?)'
  );
  
  const totalAmount = bill.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  const billResult = billStmt.run(
    bill.patientName,
    bill.status,
    totalAmount,
    bill.createdAt
  );

  const billId = billResult.lastInsertRowid;

  // Insert items for this bill
  const itemStmt = db.prepare(
    'INSERT INTO billItems (billId, medicineName, quantity, unit, hsn, price) VALUES (?, ?, ?, ?, ?, ?)'
  );

  bill.items.forEach(item => {
    itemStmt.run(
      billId,
      item.medicineName,
      item.quantity,
      item.unit,
      item.hsn,
      item.price
    );
    totalItems++;
  });
});

console.log('✅ Sample data seeded successfully!');
console.log(`📊 Total bills created: ${sampleBills.length}`);
console.log(`💊 Total medicine items: ${totalItems}`);

db.close();
