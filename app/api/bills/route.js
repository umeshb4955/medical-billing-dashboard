
import { NextResponse } from 'next/server';
import { dbPromise } from '../../../lib/db';

export async function GET() {
  try {
    const db = await dbPromise;
    const bills = db.prepare('SELECT * FROM bills ORDER BY id DESC').all();
    
    // Fetch items for each bill
    const billsWithItems = bills.map(bill => {
      const items = db.prepare('SELECT * FROM billItems WHERE billId = ?').all(bill.id);
      return { ...bill, items };
    });
    
    return NextResponse.json(billsWithItems);
  } catch (error) {
    console.error('GET /api/bills error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const db = await dbPromise;
    const body = await req.json();
    
    // Calculate total amount
    const totalAmount = body.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;
    
    // Insert bill
    const billStmt = db.prepare(
      'INSERT INTO bills (patientName, status, totalAmount, createdAt) VALUES (?, ?, ?, ?)'
    );
    const billResult = billStmt.run(
      body.patientName,
      body.status || 'Pending',
      totalAmount,
      new Date().toISOString()
    );
    
    const billId = billResult.lastInsertRowid || billResult.lastID || 1;
    
    // Insert items
    if (body.items && body.items.length > 0) {
      const itemStmt = db.prepare(
        'INSERT INTO billItems (billId, medicineName, quantity, unit, hsn, price) VALUES (?, ?, ?, ?, ?, ?)'
      );
      
      body.items.forEach(item => {
        itemStmt.run(
          billId,
          item.medicineName,
          item.quantity,
          item.unit || 'Qty',
          item.hsn || '',
          item.price
        );
      });
    }
    
    return NextResponse.json({ success: true, billId });
  } catch (error) {
    console.error('POST /api/bills error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
