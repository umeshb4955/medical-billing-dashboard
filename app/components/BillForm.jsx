'use client';
import { useState, useEffect } from 'react';
import { TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Paper, CircularProgress } from '@mui/material';
import { Trash2, Plus } from 'lucide-react';

export function BillFormDialog({ open, onClose, onSave, editingBill, isLoading }) {
  const [patientName, setPatientName] = useState('');
  const [status, setStatus] = useState('Pending');
  const [items, setItems] = useState([]);
  const [formItem, setFormItem] = useState({ medicineName: '', quantity: 1, unit: 'Qty', hsn: '', price: 0 });

  // Reset form when dialog opens/closes or when editingBill changes
  useEffect(() => {
    if (open) {
      if (editingBill) {
        setPatientName(editingBill.patientName || '');
        setStatus(editingBill.status || 'Pending');
        setItems(editingBill.items || []);
      } else {
        setPatientName('');
        setStatus('Pending');
        setItems([]);
      }
      setFormItem({ medicineName: '', quantity: 1, unit: 'Qty', hsn: '', price: 0 });
    }
  }, [open, editingBill]);

  const handleAddItem = () => {
    if (formItem.medicineName && formItem.price > 0) {
      setItems([...items, { ...formItem, id: Date.now() }]);
      setFormItem({ medicineName: '', quantity: 1, unit: 'Qty', hsn: '', price: 0 });
    }
  };

  const handleRemoveItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (!patientName.trim()) {
      alert('Patient name is required');
      return;
    }
    if (items.length === 0) {
      alert('Add at least one medicine');
      return;
    }
    
    onSave({
      patientName: patientName.trim(),
      status,
      items
    });
  };

  const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { m: 1 } }}>
      <DialogTitle sx={{ color: '#e0e7ff', fontWeight: 700, backgroundColor: 'rgba(30, 27, 75, 0.95)', fontSize: { xs: '18px', sm: '20px' } }}>
        {editingBill ? 'Edit Bill' : 'Add New Bill'}
      </DialogTitle>
      <DialogContent sx={{ 
        pt: 3, 
        backgroundColor: 'rgba(30, 27, 75, 0.95)',
        backgroundImage: 'linear-gradient(135deg, rgba(30, 27, 75, 0.95) 0%, rgba(55, 48, 120, 0.95) 100%)',
        maxHeight: { xs: '70vh', sm: '80vh' },
        overflowY: 'auto',
        p: { xs: 1.5, sm: 3 }
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <TextField
            fullWidth
            label="Patient Name"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            disabled={isLoading}
            size="small"
            InputLabelProps={{ style: { color: '#c7d2fe', fontSize: '14px' } }}
            sx={{
              '& .MuiOutlinedInput-root': {
                color: '#e0e7ff',
                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
              },
              '& .MuiOutlinedInput-input': { fontSize: { xs: '14px', sm: '16px' } }
            }}
          />

          <TextField
            fullWidth
            select
            label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            disabled={isLoading}
            SelectProps={{ native: true }}
            size="small"
            InputLabelProps={{ style: { color: '#c7d2fe' } }}
            sx={{
              '& .MuiOutlinedInput-root': {
                color: '#e0e7ff',
                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
              },
              '& .MuiOutlinedInput-input': { fontSize: { xs: '14px', sm: '16px' } }
            }}
          >
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
          </TextField>

          {/* Medicines Form */}
          <div style={{ marginTop: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.2)', paddingTop: '15px' }}>
            <h3 style={{ color: '#c7d2fe', marginBottom: '15px', fontSize: '14px', margin: 0 }}>Add Medicines</h3>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
              gap: '8px',
              marginBottom: '15px', 
              marginTop: '10px' 
            }}>
              <TextField
                size="small"
                label="Medicine"
                value={formItem.medicineName}
                onChange={(e) => setFormItem({ ...formItem, medicineName: e.target.value })}
                disabled={isLoading}
                sx={{ gridColumn: 'span 2', sm: { gridColumn: 'span 1' } }}
                InputLabelProps={{ style: { color: '#c7d2fe', fontSize: '12px' } }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: '#e0e7ff',
                    fontSize: '12px',
                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                  },
                }}
              />
              
              <TextField
                size="small"
                label="Qty"
                type="number"
                value={formItem.quantity}
                onChange={(e) => setFormItem({ ...formItem, quantity: parseInt(e.target.value) || 1 })}
                disabled={isLoading}
                InputLabelProps={{ style: { color: '#c7d2fe', fontSize: '12px' } }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: '#e0e7ff',
                    fontSize: '12px',
                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                  },
                }}
              />
              
              <TextField
                size="small"
                label="Unit"
                value={formItem.unit}
                onChange={(e) => setFormItem({ ...formItem, unit: e.target.value })}
                disabled={isLoading}
                InputLabelProps={{ style: { color: '#c7d2fe', fontSize: '12px' } }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: '#e0e7ff',
                    fontSize: '12px',
                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                  },
                }}
              />
              
              <TextField
                size="small"
                label="Price"
                type="number"
                value={formItem.price}
                onChange={(e) => setFormItem({ ...formItem, price: parseFloat(e.target.value) || 0 })}
                disabled={isLoading}
                InputLabelProps={{ style: { color: '#c7d2fe', fontSize: '12px' } }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: '#e0e7ff',
                    fontSize: '12px',
                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                  },
                }}
              />
              
              <Button
                variant="contained"
                size="small"
                onClick={handleAddItem}
                disabled={isLoading}
                sx={{
                  background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                  fontSize: '12px',
                  padding: '8px',
                  minWidth: 'auto',
                }}
              >
                <Plus size={16} />
              </Button>
            </div>
          </div>

          {/* Items Table */}
          {items.length > 0 && (
            <Paper sx={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', overflowX: 'auto' }}>
              <Table size="small" sx={{ fontSize: { xs: '12px', sm: '14px' } }}>
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}>
                    <TableCell sx={{ color: '#c7d2fe', fontSize: '11px', fontWeight: 'bold', p: '8px' }}>Medicine</TableCell>
                    <TableCell sx={{ color: '#c7d2fe', fontSize: '11px', fontWeight: 'bold', textAlign: 'center', p: '8px' }}>Qty</TableCell>
                    <TableCell sx={{ color: '#c7d2fe', fontSize: '11px', fontWeight: 'bold', textAlign: 'center', p: '8px', display: { xs: 'none', sm: 'table-cell' } }}>Unit</TableCell>
                    <TableCell sx={{ color: '#c7d2fe', fontSize: '11px', fontWeight: 'bold', textAlign: 'right', p: '8px' }}>Price</TableCell>
                    <TableCell sx={{ color: '#c7d2fe', fontSize: '11px', fontWeight: 'bold', textAlign: 'right', p: '8px' }}>Amount</TableCell>
                    <TableCell sx={{ color: '#c7d2fe', fontSize: '11px', fontWeight: 'bold', textAlign: 'center', p: '8px' }}>X</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.map((item, idx) => (
                    <TableRow key={idx} sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                      <TableCell sx={{ color: '#e0e7ff', fontSize: '11px', p: '8px' }}>{item.medicineName}</TableCell>
                      <TableCell sx={{ color: '#e0e7ff', fontSize: '11px', textAlign: 'center', p: '8px' }}>{item.quantity}</TableCell>
                      <TableCell sx={{ color: '#e0e7ff', fontSize: '11px', textAlign: 'center', p: '8px', display: { xs: 'none', sm: 'table-cell' } }}>{item.unit}</TableCell>
                      <TableCell sx={{ color: '#e0e7ff', fontSize: '11px', textAlign: 'right', p: '8px' }}>₹{item.price.toFixed(2)}</TableCell>
                      <TableCell sx={{ color: '#e0e7ff', fontSize: '11px', fontWeight: 'bold', textAlign: 'right', p: '8px' }}>
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center', p: '8px' }}>
                        <IconButton
                          size="small"
                          onClick={() => handleRemoveItem(idx)}
                          disabled={isLoading}
                          sx={{ color: '#ef4444', p: '4px' }}
                        >
                          <Trash2 size={14} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow sx={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', fontWeight: 'bold' }}>
                    <TableCell colSpan="4" sx={{ color: '#c7d2fe', textAlign: 'right', fontSize: '11px', p: '8px' }}>Total: </TableCell>
                    <TableCell sx={{ color: '#3b82f6', fontSize: '12px', fontWeight: 'bold', textAlign: 'right', p: '8px' }}>
                      ₹{totalAmount.toFixed(2)}
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Paper>
          )}
        </div>
      </DialogContent>
      <DialogActions sx={{ backgroundColor: 'rgba(30, 27, 75, 0.95)', p: { xs: 1, sm: 2 }, gap: 1, flexDirection: { xs: 'column-reverse', sm: 'row' } }}>
        <Button onClick={onClose} disabled={isLoading} sx={{ color: '#c7d2fe', width: { xs: '100%', sm: 'auto' } }}>
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={isLoading}
          sx={{
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            color: 'white',
            fontWeight: 600,
            width: { xs: '100%', sm: 'auto' },
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          {isLoading && <CircularProgress size={18} sx={{ color: 'white' }} />}
          {isLoading ? 'Saving...' : 'Save Bill'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}