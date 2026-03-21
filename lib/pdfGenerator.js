'use client';

const loadHtml2Pdf = async () => {
  if (typeof window !== 'undefined' && !window.html2pdf) {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
      script.onload = () => resolve(window.html2pdf);
      document.head.appendChild(script);
    });
  }
  return window?.html2pdf;
};

export const generateInvoicePDF = async (invoiceElement, bill) => {
  if (typeof window === 'undefined') return;
  
  try {
    const html2pdf = await loadHtml2Pdf();
    if (!html2pdf) return;

    const options = {
      margin: 10,
      filename: `invoice-${bill.id}-${bill.patientName.replace(/\s+/g, '-')}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(options).from(invoiceElement).save();
  } catch (error) {
    console.error('Error generating PDF:', error);
  }
};

export const generateInvoicePrint = (invoiceElement) => {
  if (typeof window === 'undefined') return;
  
  const printWindow = window.open('', '', 'height=600,width=900');
  if (printWindow) {
    printWindow.document.write(invoiceElement.innerHTML);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 250);
  }
};
