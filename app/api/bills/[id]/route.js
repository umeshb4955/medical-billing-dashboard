import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { dbPromise } from '../../../../lib/db';

export async function PUT(req, { params }) {
  try {
    const db = await dbPromise;
    const id = params.id;
    const body = await req.json();
    
    // Check if database initialized properly
    if (!db) {
      return NextResponse.json({
        error: 'Database not initialized',
        message: 'Please set DATABASE_URL environment variable in Vercel project settings',
        details: 'DATABASE_URL should be your MongoDB Atlas connection string'
      }, { status: 500 });
    }

    // Calculate total amount
    const totalAmount = body.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;

    // For MongoDB
    if (db.collection) {
      const billsCollection = db.collection('bills');
      const billItemsCollection = db.collection('billItems');
      
      const billIdObj = new ObjectId(id);
      
      // Update bill
      await billsCollection.updateOne(
        { _id: billIdObj },
        {
          $set: {
            patientName: body.patientName,
            status: body.status,
            totalAmount: totalAmount
          }
        }
      );
      
      // Delete old items
      await billItemsCollection.deleteMany({ billId: billIdObj });
      
      // Insert new items
      if (body.items && body.items.length > 0) {
        const items = body.items.map(item => ({
          billId: billIdObj,
          medicineName: item.medicineName,
          quantity: item.quantity,
          unit: item.unit || 'Qty',
          hsn: item.hsn || '',
          price: item.price
        }));
        
        await billItemsCollection.insertMany(items);
      }
      
      return NextResponse.json({ success: true });
    }

    // For SQLite (local)
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
    console.error('PUT /api/bills/[id] error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const db = await dbPromise;
    const id = params.id;
    
    // Check if database initialized properly
    if (!db) {
      return NextResponse.json({
        error: 'Database not initialized',
        message: 'Please set DATABASE_URL environment variable in Vercel project settings',
        details: 'DATABASE_URL should be your MongoDB Atlas connection string'
      }, { status: 500 });
    }
    
    // For MongoDB
    if (db.collection) {
      const billIdObj = new ObjectId(id);
      
      // Delete items first
      await db.collection('billItems').deleteMany({ billId: billIdObj });
      
      // Delete bill
      await db.collection('bills').deleteOne({ _id: billIdObj });
      
      return NextResponse.json({ success: true });
    }

    // For SQLite (local)
    // Delete items first (due to foreign key)
    db.prepare('DELETE FROM billItems WHERE billId = ?').run(id);
    
    // Delete bill
    const stmt = db.prepare('DELETE FROM bills WHERE id = ?');
    stmt.run(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/bills/[id] error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
