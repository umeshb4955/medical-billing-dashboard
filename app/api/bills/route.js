
import { NextResponse } from 'next/server';
import { dbPromise } from '../../../lib/db';

export async function GET() {
  try {
    const db = await dbPromise;
    
    // For MongoDB
    if (db.collection) {
      const bills = await db.collection('bills').find({}).toArray();
      // Fetch items for each bill
      const billsWithItems = await Promise.all(
        bills.map(async (bill) => {
          const items = await db.collection('billItems').find({ billId: bill._id }).toArray();
          return { ...bill, id: bill._id, items };
        })
      );
      return NextResponse.json(billsWithItems);
    }
    
    // For SQLite (local)
    const bills = db.prepare('SELECT * FROM bills ORDER BY id DESC').all();
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

    // For MongoDB
    if (db.collection) {
      const billsCollection = db.collection('bills');
      const billItemsCollection = db.collection('billItems');
      
      const billData = {
        patientName: body.patientName,
        status: body.status || 'Pending',
        totalAmount: totalAmount,
        createdAt: new Date().toISOString()
      };
      
      const billResult = await billsCollection.insertOne(billData);
      const billId = billResult.insertedId;
      
      // Insert items
      if (body.items && body.items.length > 0) {
        const items = body.items.map(item => ({
          billId: billId,
          medicineName: item.medicineName,
          quantity: item.quantity,
          unit: item.unit || 'Qty',
          hsn: item.hsn || '',
          price: item.price
        }));
        
        await billItemsCollection.insertMany(items);
      }
      
      return NextResponse.json({ success: true, billId });
    }
    
    // For SQLite (local)
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
    }
    
    return NextResponse.json({ success: true, billId });
  } catch (error) {
    console.error('POST /api/bills error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
