// Seed script for production database (MongoDB Atlas)
// Run locally: node seed-prod.js

import fetch from 'node-fetch';

// Your deployed app URL
const API_URL = process.env.API_URL || 'https://your-app.vercel.app';

// Default auth token (if using basic auth)
const AUTH_TOKEN = process.env.AUTH_TOKEN || 'your-auth-token';

// Test data bills
const testBills = [
  {
    patientName: 'John Doe',
    status: 'Pending',
    items: [
      { medicineName: 'Aspirin', quantity: 2, unit: 'Tablets', hsn: '30021011', price: 50 },
      { medicineName: 'Vitamin C', quantity: 1, unit: 'Bottle', hsn: '30019090', price: 200 }
    ]
  },
  {
    patientName: 'Jane Smith',
    status: 'Paid',
    items: [
      { medicineName: 'Paracetamol', quantity: 3, unit: 'Tablets', hsn: '29392090', price: 75 },
      { medicineName: 'Cough Syrup', quantity: 1, unit: 'Bottle', hsn: '30021019', price: 180 }
    ]
  },
  {
    patientName: 'Michael Johnson',
    status: 'Pending',
    items: [
      { medicineName: 'Amoxicillin', quantity: 1, unit: 'Box', hsn: '30049090', price: 450 },
      { medicineName: 'Bandage', quantity: 5, unit: 'Pack', hsn: '30067000', price: 100 }
    ]
  },
  {
    patientName: 'Sarah Williams',
    status: 'Paid',
    items: [
      { medicineName: 'Insulin', quantity: 1, unit: 'Vial', hsn: '30021090', price: 800 }
    ]
  },
  {
    patientName: 'Robert Brown',
    status: 'Pending',
    items: [
      { medicineName: 'Ibuprofen', quantity: 2, unit: 'Box', hsn: '29269090', price: 120 },
      { medicineName: 'Antacid', quantity: 1, unit: 'Bottle', hsn: '30049019', price: 250 }
    ]
  },
  {
    patientName: 'Emily Davis',
    status: 'Paid',
    items: [
      { medicineName: 'Multivitamin', quantity: 1, unit: 'Bottle', hsn: '29381090', price: 350 },
      { medicineName: 'Calcium Tablet', quantity: 2, unit: 'Box', hsn: '29319090', price: 180 }
    ]
  },
  {
    patientName: 'David Miller',
    status: 'Pending',
    items: [
      { medicineName: 'Antibiotic Cream', quantity: 1, unit: 'Tube', hsn: '30049090', price: 250 },
      { medicineName: 'Steroid Injection', quantity: 1, unit: 'Vial', hsn: '30021090', price: 600 }
    ]
  },
  {
    patientName: 'Lisa Anderson',
    status: 'Paid',
    items: [
      { medicineName: 'Blood Pressure Monitor', quantity: 1, unit: 'Unit', hsn: '90258090', price: 2000 }
    ]
  },
  {
    patientName: 'James Taylor',
    status: 'Pending',
    items: [
      { medicineName: 'Decongestant', quantity: 1, unit: 'Bottle', hsn: '30049019', price: 180 },
      { medicineName: 'Throat Lozenges', quantity: 2, unit: 'Box', hsn: '17049090', price: 100 }
    ]
  },
  {
    patientName: 'Patricia Thomas',
    status: 'Paid',
    items: [
      { medicineName: 'Sleeping Pills', quantity: 1, unit: 'Box', hsn: '29379090', price: 450 },
      { medicineName: 'Anti-anxiety', quantity: 1, unit: 'Box', hsn: '29379090', price: 350 }
    ]
  }
];

async function addTestData() {
  console.log('🌱 Starting to seed test data...');
  console.log(`📍 API URL: ${API_URL}`);
  console.log(`📊 Bills to add: ${testBills.length}`);
  console.log('');

  let successCount = 0;
  let errorCount = 0;

  for (const bill of testBills) {
    try {
      console.log(`📝 Adding bill for: ${bill.patientName}...`);

      const response = await fetch(`${API_URL}/api/bills`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AUTH_TOKEN}`
        },
        body: JSON.stringify(bill)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log(`   ✅ Success (ID: ${data.id})`);
      successCount++;
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
      errorCount++;
    }
  }

  console.log('');
  console.log('🎉 Seeding Complete!');
  console.log(`✅ Successfully added: ${successCount} bills`);
  console.log(`❌ Failed: ${errorCount} bills`);
  console.log('');
  console.log(`📍 Check your app: ${API_URL}`);
}

addTestData().catch(console.error);
