'use client';

import React from 'react';

export const InvoiceTemplate = React.forwardRef(({ bill }, ref) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  const invoiceNumber = `INV-${String(bill.id).padStart(5, '0')}`;

  return (
    <div ref={ref} style={{ padding: '30px', fontFamily: 'Arial, sans-serif', backgroundColor: '#fff' }}>
      {/* Header - Company Name */}
      <div style={{ textAlign: 'center', marginBottom: '10px', borderBottom: '3px solid #4a5cc4', paddingBottom: '15px' }}>
        <h1 style={{ margin: '0', fontSize: '28px', color: '#4a5cc4', fontWeight: 'bold' }}>
          MediCare Clinic
        </h1>
        <p style={{ margin: '5px 0', fontSize: '13px', color: '#333' }}>
          Nagadevanahalli, Bengaluru - 560056
        </p>
        <p style={{ margin: '3px 0', fontSize: '12px', color: '#666' }}>
          Phone no.: +91-80-4567-8901
        </p>
        <p style={{ margin: '3px 0', fontSize: '12px', color: '#666' }}>
          State: 29-Karnataka
        </p>
      </div>

      {/* Bill To & Invoice Details */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px', marginTop: '20px' }}>
        {/* Bill To */}
        <div>
          <div style={{ 
            backgroundColor: '#d4d9f0', 
            padding: '2px 8px', 
            fontWeight: 'bold', 
            fontSize: '13px',
            color: '#333',
            marginBottom: '10px'
          }}>
            Bill To
          </div>
          <div style={{ fontSize: '12px', lineHeight: '1.6' }}>
            <p style={{ margin: '5px 0', fontWeight: 'bold' }}>{bill.patientName}</p>
            <p style={{ margin: '3px 0', color: '#666' }}>MediCare Clinic</p>
            <p style={{ margin: '3px 0', color: '#666' }}>Nagadevanahalli, Bengaluru - 560056</p>
            <p style={{ margin: '3px 0', color: '#666' }}>Contact No.: +91-80-4567-8901</p>
            <p style={{ margin: '3px 0', color: '#666' }}>State: 29-Karnataka</p>
          </div>
        </div>

        {/* Invoice Details */}
        <div style={{ textAlign: 'right' }}>
          <div style={{ 
            backgroundColor: '#d4d9f0', 
            padding: '2px 8px', 
            fontWeight: 'bold', 
            fontSize: '13px',
            color: '#333',
            marginBottom: '10px',
            display: 'inline-block',
            width: '100%',
            textAlign: 'left'
          }}>
            Invoice Details
          </div>
          <div style={{ fontSize: '12px', textAlign: 'right', lineHeight: '1.8' }}>
            <div><strong>Invoice No. :</strong> {invoiceNumber}</div>
            <div><strong>Date :</strong> {formatDate(bill.createdAt)}</div>
            <div><strong>Place of supply:</strong> 29-Karnataka</div>
            <div style={{ marginTop: '5px' }}>
              <strong>Status :</strong> 
              <span style={{
                marginLeft: '5px',
                padding: '3px 10px',
                borderRadius: '3px',
                fontSize: '11px',
                fontWeight: 'bold',
                backgroundColor: bill.status === 'Paid' ? '#4caf50' : '#ff9800',
                color: 'white'
              }}>
                {bill.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '10px', marginTop: '15px' }}>
        <thead>
          <tr style={{ backgroundColor: '#d4d9f0', fontWeight: 'bold', fontSize: '12px' }}>
            <td style={{ border: '1px solid #bcc0de', padding: '8px', width: '5%' }}>#</td>
            <td style={{ border: '1px solid #bcc0de', padding: '8px' }}>Item name</td>
            <td style={{ border: '1px solid #bcc0de', padding: '8px', width: '12%', textAlign: 'center' }}>HSN/SAC</td>
            <td style={{ border: '1px solid #bcc0de', padding: '8px', width: '12%', textAlign: 'center' }}>Quantity</td>
            <td style={{ border: '1px solid #bcc0de', padding: '8px', width: '10%', textAlign: 'center' }}>Unit</td>
            <td style={{ border: '1px solid #bcc0de', padding: '8px', width: '15%', textAlign: 'right' }}>Price</td>
            <td style={{ border: '1px solid #bcc0de', padding: '8px', width: '18%', textAlign: 'right' }}>Amount</td>
          </tr>
        </thead>
        <tbody>
          {bill.items && bill.items.length > 0 ? (
            <>
              {bill.items.map((item, index) => (
                <tr key={index} style={{ fontSize: '12px' }}>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{index + 1}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px', fontWeight: '500' }}>{item.medicineName}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>{item.hsn || '-'}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>{item.quantity}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>{item.unit}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'right' }}>₹{(item.price || 0).toFixed(2)}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'right', fontWeight: 'bold' }}>
                    ₹{((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                  </td>
                </tr>
              ))}
            </>
          ) : (
            <tr style={{ fontSize: '12px' }}>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>1</td>
              <td style={{ border: '1px solid #ddd', padding: '8px', fontWeight: '500' }}>-</td>
              <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>-</td>
              <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>-</td>
              <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>-</td>
              <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'right' }}>₹0.00</td>
              <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'right', fontWeight: 'bold' }}>₹0.00</td>
            </tr>
          )}
          <tr style={{ fontSize: '12px', fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>
            <td colSpan="6" style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'right' }}>Total</td>
            <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'right' }}>₹{(bill.totalAmount || 0).toFixed(2)}</td>
          </tr>
        </tbody>
      </table>

      {/* Terms Section */}
      <div style={{ marginTop: '20px' }}>
        <div style={{ 
          backgroundColor: '#d4d9f0', 
          padding: '5px 8px', 
          fontWeight: 'bold', 
          fontSize: '13px',
          color: '#333',
          marginBottom: '10px'
        }}>
          Terms and Conditions
        </div>
        <p style={{ fontSize: '11px', color: '#666', margin: '8px 0', lineHeight: '1.5' }}>
          Thanks for doing business with us! All items are non-refundable unless damaged upon delivery. Payment should be made within 30 days of invoice date. Late payments may incur additional charges.
        </p>
      </div>

      {/* Signature Section */}
      <div style={{ marginTop: '30px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
        {/* Received By */}
        <div>
          <div style={{ 
            backgroundColor: '#d4d9f0', 
            padding: '5px 8px', 
            fontWeight: 'bold', 
            fontSize: '12px',
            color: '#333',
            marginBottom: '40px'
          }}>
            Received By
          </div>
          <div style={{ fontSize: '11px', borderTop: '1px solid #333', paddingTop: '5px', color: '#666' }}>
            <p style={{ margin: '3px 0' }}><strong>Name:</strong></p>
            <p style={{ margin: '3px 0' }}><strong>Comment:</strong></p>
            <p style={{ margin: '3px 0' }}><strong>Date:</strong></p>
            <p style={{ margin: '3px 0' }}><strong>Signature:</strong></p>
          </div>
        </div>

        {/* Delivered By */}
        <div>
          <div style={{ 
            backgroundColor: '#d4d9f0', 
            padding: '5px 8px', 
            fontWeight: 'bold', 
            fontSize: '12px',
            color: '#333',
            marginBottom: '40px'
          }}>
            Delivered By
          </div>
          <div style={{ fontSize: '11px', borderTop: '1px solid #333', paddingTop: '5px', color: '#666' }}>
            <p style={{ margin: '3px 0' }}><strong>Name:</strong></p>
            <p style={{ margin: '3px 0' }}><strong>Comment:</strong></p>
            <p style={{ margin: '3px 0' }}><strong>Date:</strong></p>
            <p style={{ margin: '3px 0' }}><strong>Signature:</strong></p>
          </div>
        </div>

        {/* Authorized Signatory */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ height: '50px' }}></div>
          <div style={{ borderTop: '1px solid #333', paddingTop: '5px', fontSize: '11px', fontWeight: 'bold', color: '#333' }}>
            Authorized Signatory
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '10px', color: '#999', borderTop: '1px solid #ddd', paddingTop: '10px' }}>
        <p style={{ margin: '5px 0' }}>For any queries, contact us at billing@medicare.com or +91-80-4567-8901</p>
        <p style={{ margin: '5px 0' }}>Generated on {new Date().toLocaleString('en-IN')}</p>
      </div>
    </div>
  );
});

InvoiceTemplate.displayName = 'InvoiceTemplate';
