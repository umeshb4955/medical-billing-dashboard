import { NextResponse } from 'next/server';
import db from '../../../../lib/db';

export async function PUT(req, { params }) {
  try {
    const id = params.id;
    const body = await req.json();

    // Calculate total amount
    const totalAmount = body.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;

    // Update bill
    const stmt = db.prepare(
      'UPDATE bills SET patientName = ?, status = ?, totalAmount = ? WHERE id = ?'
    );
    
    stmt.run(
      body.patientName,
      body.status,
      totalAmount,
      id
    );

    // Delete old items
    db.prepare('DELETE FROM billItems WHERE billId = ?').run(id);

    // Insert new items
    if (body.items && body.items.length > 0) {
      const itemStmt = db.prepare(
        'INSERT INTO billItems (billId, medicineName, quantity, unit, hsn, price) VALUES (?, ?, ?, ?, ?, ?)'
      );
      
      body.items.forEach(item => {
        itemStmt.run(
          id,
          item.medicineName,
          item.quantity,
          item.unit || 'Qty',
          item.hsn || '',
          item.price
        );
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const id = params.id;
    
    // Delete items first (due to foreign key)
    db.prepare('DELETE FROM billItems WHERE billId = ?').run(id);
    
    // Delete bill
    const stmt = db.prepare('DELETE FROM bills WHERE id = ?');
    stmt.run(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
