'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DollarSign, FileText, Clock, CheckCircle, TrendingUp, Trash2, Edit2, Plus, Download, Printer, Eye, X, LogOut } from 'lucide-react';
import { DataGrid, GridActionsCellItem, GridToolbar } from '@mui/x-data-grid';
import { Box, Chip, Dialog, DialogTitle, DialogContent, DialogActions, Button, Table, TableBody, TableCell, TableHead, TableRow, Paper, Skeleton, CircularProgress } from '@mui/material';
import { InvoiceTemplate } from './components/InvoiceTemplate';
import { BillFormDialog } from './components/BillForm';

export default function Dashboard() {
  const router = useRouter();
  const [bills, setBills] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pdfUtils, setPdfUtils] = useState(null);
  const [stats, setStats] = useState({ total: 0, totalAmount: 0, pending: 0, paid: 0 });
  const [openDialog, setOpenDialog] = useState(false);
  const [editingBill, setEditingBill] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const invoiceRef = useRef(null);
  const [selectedBillForInvoice, setSelectedBillForInvoice] = useState(null);
  const [medicineModalOpen, setMedicineModalOpen] = useState(false);
  const [selectedBillMedicines, setSelectedBillMedicines] = useState(null);

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  const loadBills = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/bills');
      if (!res.ok) {
        console.error('Failed to fetch bills:', res.status, res.statusText);
        return;
      }
      const data = await res.json();
      setBills(Array.isArray(data) ? data : []);
      const billsArray = Array.isArray(data) ? data : [];
      const totalAmount = billsArray.reduce((sum, bill) => sum + (bill.totalAmount || 0), 0);
      const pending = billsArray.filter(bill => bill.status === 'Pending').length;
      const paid = billsArray.filter(bill => bill.status === 'Paid').length;
      setStats({ total: billsArray.length, totalAmount, pending, paid });
    } catch (error) {
      console.error('Error loading bills:', error);
      setBills([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadBills(); }, []);

  useEffect(() => {
    import('../lib/pdfGenerator').then(module => {
      setPdfUtils(module);
    });
  }, []);

  const handleAddClick = () => {
    setEditingBill(null);
    setOpenDialog(true);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      localStorage.removeItem('authToken');
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout anyway
      localStorage.removeItem('authToken');
      router.push('/login');
    }
  };

  const handleEditClick = (bill) => {
    setEditingBill(bill);
    setOpenDialog(true);
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm('Delete this bill?')) {
      const res = await fetch(`/api/bills/${id}`, { method: 'DELETE' });
      if (res.ok) loadBills();
    }
  };

  const handleViewMedicines = (bill) => {
    setSelectedBillMedicines(bill);
    setMedicineModalOpen(true);
  };

  const handleDownloadPDF = (bill) => {
    setSelectedBillForInvoice(bill);
    setTimeout(() => {
      if (invoiceRef.current && pdfUtils?.generateInvoicePDF) {
        pdfUtils.generateInvoicePDF(invoiceRef.current, bill);
      }
    }, 100);
  };

  const handlePrintInvoice = (bill) => {
    setSelectedBillForInvoice(bill);
    setTimeout(() => {
      if (invoiceRef.current && pdfUtils?.generateInvoicePrint) {
        pdfUtils.generateInvoicePrint(invoiceRef.current);
      }
    }, 100);
  };

  const handleFormSave = async (formData) => {
    try {
      setIsSaving(true);
      const method = editingBill ? 'PUT' : 'POST';
      const url = editingBill ? `/api/bills/${editingBill.id}` : '/api/bills';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        // Wait for bills to load before closing dialog
        await loadBills();
        setOpenDialog(false);
        setEditingBill(null);
      } else {
        alert('Error saving bill');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error saving bill: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 70, sortable: false },
    { field: 'patientName', headerName: 'Patient Name', width: 160 },
    { 
      field: 'items', 
      headerName: 'Medicines', 
      width: 180, 
      sortable: false,
      renderCell: (p) => (
        <Button
          variant="contained"
          size="small"
          onClick={() => handleViewMedicines(p.row)}
          sx={{
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            color: 'white',
            fontSize: '12px',
            fontWeight: 600,
            textTransform: 'none',
            padding: '6px 12px',
          }}
        >
          <Eye size={14} style={{ marginRight: '6px' }} />
          View ({p.row.items?.length || 0})
        </Button>
      )
    },
    { field: 'totalAmount', headerName: 'Total Amount', width: 140, renderCell: (p) => `₹${(p.value || 0).toFixed(2)}` },
    { field: 'status', headerName: 'Status', width: 130, renderCell: (p) => <Chip label={p.value} color={p.value === 'Paid' ? 'success' : 'warning'} variant="outlined" size="small" /> },
    { field: 'createdAt', headerName: 'Date', width: 150, renderCell: (p) => new Date(p.value).toLocaleDateString() },
    { field: 'actions', type: 'actions', headerName: 'Actions', width: 180, getActions: (p) => [
      <GridActionsCellItem key="pdf" icon={<Download size={18} />} label="PDF" onClick={() => handleDownloadPDF(p.row)} style={{ color: '#10b981' }} />,
      <GridActionsCellItem key="print" icon={<Printer size={18} />} label="Print" onClick={() => handlePrintInvoice(p.row)} style={{ color: '#8b5cf6' }} />,
      <GridActionsCellItem key="edit" icon={<Edit2 size={18} />} label="Edit" onClick={() => handleEditClick(p.row)} style={{ color: '#3b82f6' }} />,
      <GridActionsCellItem key="del" icon={<Trash2 size={18} />} label="Delete" onClick={() => handleDeleteClick(p.id)} style={{ color: '#ef4444' }} />,
    ]}
  ];

  const StatCard = ({ icon: Icon, label, value, color, bgColor }) => (
    <div className={`${bgColor} rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium mb-1">{label}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
        </div>
        <div className={`${color} p-3 rounded-lg`}>
          <Icon size={28} className="text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
      </div>

      <div className="relative z-10">
        <div className="pt-6 sm:pt-8 lg:pt-12 px-3 sm:px-4 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8 sm:mb-12 animate-fade-in">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
                <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                  <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg sm:rounded-xl">
                    <FileText className="text-white" size={24} sm:size={32} />
                  </div>
                  <div className="min-w-0">
                    <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent truncate">
                      Medical Billing
                    </h1>
                    <p className="text-xs sm:text-sm text-purple-200 hidden sm:block">Manage your healthcare finances</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                  <button
                    onClick={handleAddClick}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1 sm:gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 sm:px-6 py-2 sm:py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold text-xs sm:text-sm whitespace-nowrap"
                  >
                    <Plus size={16} className="sm:hidden" />
                    <Plus size={20} className="hidden sm:inline" /> 
                    <span className="hidden xs:inline">Add Bill</span>
                    <span className="sm:hidden">Add</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1 sm:gap-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-3 sm:px-6 py-2 sm:py-3 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold text-xs sm:text-sm whitespace-nowrap"
                  >
                    <LogOut size={16} className="sm:hidden" />
                    <LogOut size={20} className="hidden sm:inline" /> 
                    <span className="hidden xs:inline">Logout</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-8 sm:mb-12">
              {isLoading ? (
                <>
                  <Skeleton variant="rectangular" height={120} sx={{ borderRadius: '12px', backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
                  <Skeleton variant="rectangular" height={120} sx={{ borderRadius: '12px', backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
                  <Skeleton variant="rectangular" height={120} sx={{ borderRadius: '12px', backgroundColor: 'rgba(255, 255, 255, 0.1)', display: { xs: 'none', lg: 'block' } }} />
                  <Skeleton variant="rectangular" height={120} sx={{ borderRadius: '12px', backgroundColor: 'rgba(255, 255, 255, 0.1)', display: { xs: 'none', lg: 'block' } }} />
                </>
              ) : (
                <>
                  <StatCard icon={FileText} label="Total Bills" value={stats.total} color="bg-blue-500" bgColor="bg-white/10 backdrop-blur-xl border border-white/20" />
                  <StatCard icon={DollarSign} label="Total Revenue" value={`₹${stats.totalAmount.toFixed(0)}`} color="bg-green-500" bgColor="bg-white/10 backdrop-blur-xl border border-white/20" />
                  <StatCard icon={Clock} label="Pending" value={stats.pending} color="bg-yellow-500" bgColor="bg-white/10 backdrop-blur-xl border border-white/20" />
                  <StatCard icon={CheckCircle} label="Completed" value={stats.paid} color="bg-green-500" bgColor="bg-white/10 backdrop-blur-xl border border-white/20" />
                </>
              )}
            </div>

            <div className="bg-white/10 backdrop-blur-xl rounded-lg sm:rounded-2xl shadow-2xl border border-white/20 p-0 mb-8 sm:mb-12 animate-fade-in overflow-hidden">
              <div className="px-4 sm:px-8 py-4 sm:py-6 border-b border-white/10 bg-gradient-to-r from-blue-500/20 to-purple-500/20">
                <div className="flex items-center gap-2 sm:gap-3">
                  <TrendingUp className="text-blue-400 flex-shrink-0" size={20} sm:size={28} />
                  <h2 className="text-lg sm:text-2xl font-bold text-white truncate">Bills Management</h2>
                </div>
              </div>

              {isLoading ? (
                <Box sx={{ height: 300, width: '100%', p: 1.5, sm: { p: 2 }, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 2 }}>
                  <CircularProgress size={50} sx={{ color: '#3b82f6' }} />
                  <p style={{ color: '#c7d2fe', fontSize: '14px', fontWeight: '500' }}>Loading bills...</p>
                </Box>
              ) : bills.length === 0 ? (
                <Box sx={{ p: 3, textAlign: 'center', color: '#c7d2fe' }}>
                  <p style={{ fontSize: '16px', marginBottom: '8px' }}>No bills yet</p>
                  <p style={{ fontSize: '14px', color: '#a5b4fc' }}>Click "Add Bill" to create your first bill</p>
                </Box>
              ) : (
                <Box sx={{ 
                  width: '100%', 
                  p: 1,
                  sm: { p: 2 },
                  overflowX: 'auto',
                  height: 'auto',
                  maxHeight: '600px'
                }}>
                  <DataGrid
                    rows={bills}
                    columns={columns}
                    pageSizeOptions={[5, 10, 25]}
                    initialState={{ pagination: { paginationModel: { pageSize: 5 } } }}
                    slots={{ toolbar: GridToolbar }}
                    slotProps={{ toolbar: { showQuickFilter: true } }}
                    disableSelectionOnClick
                    density="compact"
                    sx={{
                      backgroundColor: 'transparent',
                      color: '#e0e7ff',
                      fontSize: '12px',
                      sm: { fontSize: '14px' },
                      '& .MuiDataGrid-columnHeader': {
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        color: '#c7d2fe',
                        fontWeight: 700,
                        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                        fontSize: '11px',
                        sm: { fontSize: '13px' },
                      },
                      '& .MuiDataGrid-row': {
                        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                        '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
                      },
                      '& .MuiDataGrid-cell': { borderRight: '1px solid rgba(255, 255, 255, 0.05)', p: '8px 4px', sm: { p: '8px' } },
                      '& .MuiTablePagination-root': { color: '#e0e7ff', fontSize: '12px', sm: { fontSize: '14px' } },
                      '& .MuiIconButton-root': { color: '#e0e7ff', p: '4px' },
                    }}
                  />
                </Box>
              )}
            </div>
          </div>
        </div>

        <BillFormDialog 
          open={openDialog} 
          onClose={() => {
            if (!isSaving) setOpenDialog(false);
          }}
          onSave={handleFormSave}
          editingBill={editingBill}
          isLoading={isSaving}
        />

        {/* Medicine Details Modal */}
        <Dialog open={medicineModalOpen} onClose={() => setMedicineModalOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ color: '#e0e7ff', fontWeight: 700, backgroundColor: 'rgba(30, 27, 75, 0.95)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Eye size={20} style={{ color: '#3b82f6' }} />
              Medicine Details - {selectedBillMedicines?.patientName}
            </div>
            <button 
              onClick={() => setMedicineModalOpen(false)}
              style={{ background: 'none', border: 'none', color: '#c7d2fe', cursor: 'pointer', fontSize: '20px' }}
            >
              ×
            </button>
          </DialogTitle>
          <DialogContent sx={{ 
            backgroundColor: 'rgba(30, 27, 75, 0.95)',
            backgroundImage: 'linear-gradient(135deg, rgba(30, 27, 75, 0.95) 0%, rgba(55, 48, 120, 0.95) 100%)',
            pt: 2
          }}>
            {selectedBillMedicines && (
              <>
                {/* Bill Details Header */}
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 1fr', 
                  gap: '16px', 
                  marginBottom: '20px',
                  padding: '16px',
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  borderRadius: '8px',
                  border: '1px solid rgba(59, 130, 246, 0.2)'
                }}>
                  <div>
                    <p style={{ color: '#c7d2fe', fontSize: '11px', margin: '0 0 4px 0', fontWeight: 600, textTransform: 'uppercase' }}>Patient Name</p>
                    <p style={{ color: '#e0e7ff', fontSize: '16px', margin: 0, fontWeight: 700 }}>{selectedBillMedicines?.patientName}</p>
                  </div>
                  <div>
                    <p style={{ color: '#c7d2fe', fontSize: '11px', margin: '0 0 4px 0', fontWeight: 600, textTransform: 'uppercase' }}>Bill Date</p>
                    <p style={{ color: '#e0e7ff', fontSize: '16px', margin: 0, fontWeight: 700 }}>{new Date(selectedBillMedicines?.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p style={{ color: '#c7d2fe', fontSize: '11px', margin: '0 0 4px 0', fontWeight: 600, textTransform: 'uppercase' }}>Total Amount</p>
                    <p style={{ color: '#10b981', fontSize: '18px', margin: 0, fontWeight: 700 }}>₹{selectedBillMedicines?.totalAmount?.toFixed(2) || '0.00'}</p>
                  </div>
                  <div>
                    <p style={{ color: '#c7d2fe', fontSize: '11px', margin: '0 0 4px 0', fontWeight: 600, textTransform: 'uppercase' }}>Status</p>
                    <span style={{
                      display: 'inline-block',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: 700,
                      backgroundColor: selectedBillMedicines?.status === 'Paid' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(251, 191, 36, 0.2)',
                      color: selectedBillMedicines?.status === 'Paid' ? '#10b981' : '#fbbf24',
                      border: `2px solid ${selectedBillMedicines?.status === 'Paid' ? '#10b981' : '#fbbf24'}`
                    }}>
                      {selectedBillMedicines?.status}
                    </span>
                  </div>
                </div>

                {/* Medicines Table */}
                {selectedBillMedicines?.items && selectedBillMedicines.items.length > 0 ? (
              <Paper sx={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}>
                      <TableCell sx={{ color: '#c7d2fe', fontSize: '12px', fontWeight: 'bold' }}>Medicine Name</TableCell>
                      <TableCell sx={{ color: '#c7d2fe', fontSize: '12px', fontWeight: 'bold', textAlign: 'center' }}>Qty</TableCell>
                      <TableCell sx={{ color: '#c7d2fe', fontSize: '12px', fontWeight: 'bold', textAlign: 'center' }}>Unit</TableCell>
                      <TableCell sx={{ color: '#c7d2fe', fontSize: '12px', fontWeight: 'bold', textAlign: 'right' }}>Price</TableCell>
                      <TableCell sx={{ color: '#c7d2fe', fontSize: '12px', fontWeight: 'bold', textAlign: 'right' }}>Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedBillMedicines.items.map((item, idx) => (
                      <TableRow key={idx} sx={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                        <TableCell sx={{ color: '#e0e7ff', fontSize: '12px' }}>{item.medicineName}</TableCell>
                        <TableCell sx={{ color: '#e0e7ff', fontSize: '12px', textAlign: 'center' }}>{item.quantity}</TableCell>
                        <TableCell sx={{ color: '#e0e7ff', fontSize: '12px', textAlign: 'center' }}>{item.unit}</TableCell>
                        <TableCell sx={{ color: '#e0e7ff', fontSize: '12px', textAlign: 'right' }}>₹{(item.price || 0).toFixed(2)}</TableCell>
                        <TableCell sx={{ color: '#3b82f6', fontSize: '12px', fontWeight: 'bold', textAlign: 'right' }}>
                          ₹{((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow sx={{ backgroundColor: 'rgba(59, 130, 246, 0.2)' }}>
                      <TableCell colSpan="4" sx={{ color: '#c7d2fe', textAlign: 'right', fontSize: '12px', fontWeight: 'bold' }}>
                        Total Amount:
                      </TableCell>
                      <TableCell sx={{ color: '#10b981', fontSize: '13px', fontWeight: 'bold', textAlign: 'right' }}>
                        ₹{selectedBillMedicines.totalAmount?.toFixed(2) || '0.00'}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Paper>
            ) : (
              <div style={{ color: '#ef4444', textAlign: 'center', padding: '20px' }}>
                No medicines found
              </div>
            )}
              </>
            )}
          </DialogContent>
          <DialogActions sx={{ backgroundColor: 'rgba(30, 27, 75, 0.95)', p: 2 }}>
            <Button 
              onClick={() => setMedicineModalOpen(false)}
              variant="contained"
              sx={{
                background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
                color: 'white',
                fontWeight: 600,
              }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* Hidden invoice template for PDF generation */}
        <div style={{ display: 'none' }}>
          {selectedBillForInvoice && <InvoiceTemplate ref={invoiceRef} bill={selectedBillForInvoice} />}
        </div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { font-family: 'Inter', sans-serif; }
        @keyframes blob { 
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animate-fade-in { animation: fade-in 0.8s ease-out; }
      `}</style>
    </div>
  );
}
