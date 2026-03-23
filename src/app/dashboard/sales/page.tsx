"use client";

import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  Plus, 
  Search,
  FileText,
  Printer,
  X,
  CreditCard,
  Edit,
  Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Sale } from '@/lib/data';

export default function SalesPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [companyData, setCompanyData] = useState({
    businessName: 'Vivero San Juan',
    ownerName: '',
    documentId: '10456123456',
    address: 'Av. Las Palmeras 123',
    phone: '+51 987 654 321',
    email: '',
    estimatedProfitMargin: 45
  });
  const [companyLogo, setCompanyLogo] = useState<string | null>(null);
  const [batches, setBatches] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('sales');
    if (saved) {
      setSales(JSON.parse(saved));
    }

    const savedBatches = localStorage.getItem('lettuce_batches');
    if (savedBatches) {
      setBatches(JSON.parse(savedBatches));
    }

    const savedCompany = localStorage.getItem('companyData');
    if (savedCompany) {
      setCompanyData(JSON.parse(savedCompany));
    }

    const savedLogo = localStorage.getItem('companyLogo');
    if (savedLogo) {
      setCompanyLogo(savedLogo);
    }
  }, []);

  const saveSales = (newSales: Sale[]) => {
    setSales(newSales);
    localStorage.setItem('sales', JSON.stringify(newSales));
  };

  const [search, setSearch] = useState('');

  // Modals state
  const [showNewSaleModal, setShowNewSaleModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingSale, setEditingSale] = useState<Sale | null>(null);
  
  const [newSale, setNewSale] = useState({
    product: '', quantity: '' as any, price: '' as any, customer: ''
  });

  const totalSales = sales.reduce((acc, current) => acc + current.total, 0);
  const monthlyProfit = totalSales * (companyData.estimatedProfitMargin / 100);

  // Stock logic
  const stockByProduct = Array.from(new Set([
    ...batches.filter(b => b.status === 'Cosechado').map(b => b.plantName),
    ...sales.map(s => s.product)
  ])).map(name => {
    const harvested = batches
      .filter(b => b.plantName === name && b.status === 'Cosechado')
      .reduce((sum, b) => sum + (b.goodCondition || 0), 0);
    const sold = sales
      .filter(s => s.product === name)
      .reduce((sum, s) => sum + s.quantity, 0);
    return { name, available: harvested - sold };
  }).filter(p => p.name);

  const filteredSales = sales.filter(s => 
    s.product.toLowerCase().includes(search.toLowerCase()) || 
    (s.customer && s.customer.toLowerCase().includes(search.toLowerCase()))
  );

  const handlePrintTicket = (sale: Sale) => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [80, 200]
    });

    let currentY = 5;

    if (companyLogo) {
      try {
        doc.addImage(companyLogo, 'PNG', 20, currentY, 40, 40);
        currentY += 45;
      } catch (e) {
        console.error("Error adding logo to PDF", e);
      }
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text(companyData.businessName, 40, currentY, { align: "center" });
    currentY += 5;
    
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(`RUC: ${companyData.documentId}`, 40, currentY, { align: "center" });
    currentY += 4;
    doc.text(companyData.address, 40, currentY, { align: "center" });
    currentY += 4;
    doc.text(`Cel: ${companyData.phone}`, 40, currentY, { align: "center" });
    currentY += 6;
    
    doc.setLineWidth(0.3);
    doc.line(5, currentY, 75, currentY);
    currentY += 6;
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("BOLETA ELECTRÓNICA", 40, currentY, { align: "center" });
    currentY += 6;
    
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(`Fecha: ${sale.date}`, 5, currentY);
    currentY += 4;
    doc.text(`Cliente: ${sale.customer || 'Público General'}`.substring(0, 35), 5, currentY); 
    currentY += 4;
    doc.text(`TKT: #${sale.id.toUpperCase()}`, 5, currentY);
    currentY += 4;
    
    autoTable(doc, {
      startY: currentY,
      head: [['Cant', 'Producto', 'Total']],
      body: [
        [`${sale.quantity}u`, sale.product, `S/. ${sale.total.toFixed(2)}`]
      ],
      theme: 'plain', 
      styles: { fontSize: 8, cellPadding: 1 },
      headStyles: { fontStyle: 'bold', lineColor: [0,0,0], lineWidth: { bottom: 0.3 } }
    });
    
    const finalY = (doc as any).lastAutoTable.finalY || 70;
    
    doc.setLineWidth(0.3);
    doc.line(5, finalY + 2, 75, finalY + 2);

    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(`TOTAL: S/. ${sale.total.toFixed(2)}`, 75, finalY + 8, { align: "right" });
    
    doc.setFontSize(8);
    doc.setFont("helvetica", "italic");
    doc.text("¡Gracias por su compra!", 40, finalY + 18, { align: "center" });
    doc.text("Conserve este ticket.", 40, finalY + 22, { align: "center" });
    
    doc.save(`Boleta_${sale.id}_${sale.product}.pdf`);
  };

  const handleExportSalesReport = () => {
    const doc = new jsPDF();
    let currentY = 20;

    if (companyLogo) {
      doc.addImage(companyLogo, 'PNG', 15, 10, 30, 30);
      currentY = 45;
    }

    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("REPORTE DE VENTAS", 105, 25, { align: "center" });

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(companyData.businessName, 105, 32, { align: "center" });
    doc.text(`RUC: ${companyData.documentId} | ${companyData.address}`, 105, 37, { align: "center" });
    
    currentY = Math.max(currentY, 45);
    doc.setLineWidth(0.5);
    doc.line(15, currentY, 195, currentY);
    currentY += 10;

    doc.setFillColor(240, 240, 240);
    doc.roundedRect(15, currentY, 180, 25, 3, 3, 'F');
    doc.setFont("helvetica", "bold");
    doc.text("RESUMEN GENERAL", 20, currentY + 7);
    doc.setFont("helvetica", "normal");
    doc.text(`Ventas Totales: S/. ${totalSales.toFixed(2)}`, 20, currentY + 15);
    doc.text(`Ganancia Est. (${companyData.estimatedProfitMargin}%): S/. ${monthlyProfit.toFixed(2)}`, 20, currentY + 20);
    
    currentY += 35;

    autoTable(doc, {
      startY: currentY,
      head: [['Fecha', 'Producto', 'Cliente', 'Cant', 'Precio', 'Total']],
      body: sales.map(s => [
        s.date,
        s.product,
        s.customer || 'P. General',
        s.quantity,
        `S/. ${s.price.toFixed(2)}`,
        `S/. ${s.total.toFixed(2)}`
      ]),
      theme: 'striped',
      headStyles: { fillColor: [34, 197, 94] }
    });

    doc.save(`Reporte_Ventas_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const handeRegisterSale = (e: React.FormEvent) => {
    e.preventDefault();
    
    const currentStock = stockByProduct.find(p => p.name === newSale.product)?.available || 0;
    if (newSale.quantity > currentStock) {
      alert(`No tienes suficiente stock de ${newSale.product}. Stock disponible: ${currentStock}`);
      return;
    }

    const item: Sale = {
      id: Math.random().toString(36).substr(2, 5).toUpperCase(),
      date: new Date().toISOString().split('T')[0],
      product: newSale.product,
      quantity: newSale.quantity,
      price: newSale.price,
      total: newSale.quantity * newSale.price,
      customer: newSale.customer
    };
    saveSales([item, ...sales]);
    setShowNewSaleModal(false);
    setNewSale({ product: '', quantity: '' as any, price: '' as any, customer: '' });
  };

  const handleDeleteSale = (id: string) => {
    if (confirm("¿Estás seguro que deseas eliminar este registro de venta?")) {
      saveSales(sales.filter(s => s.id !== id));
    }
  };

  const handleOpenEdit = (sale: Sale) => {
    setEditingSale({...sale});
    setShowEditModal(true);
  };

  const handleUpdateSale = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSale) return;

    const updatedSale = {
      ...editingSale,
      total: editingSale.quantity * editingSale.price
    };

    saveSales(sales.map(s => s.id === editingSale.id ? updatedSale : s));
    setShowEditModal(false);
    setEditingSale(null);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-20 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
             <DollarSign className="w-10 h-10 text-primary-500" />
             Ventas de Verduras
          </h1>
          <p className="text-neutral-500 mt-2">Gestión de ventas y emisión de boletas.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={handleExportSalesReport}
            className="flex items-center justify-center space-x-2 px-6 py-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl font-bold shadow-sm hover:bg-neutral-50 transition-all text-sm"
          >
            <FileText className="w-5 h-5 text-neutral-500" />
            <span>Generar Reporte</span>
          </button>
          <button 
            onClick={() => setShowNewSaleModal(true)}
            className="flex items-center justify-center space-x-2 px-6 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-bold shadow-lg shadow-primary-500/20 transition-all"
          >
            <Plus className="w-5 h-5" />
            <span>Nueva Venta</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="p-8 rounded-[40px] bg-neutral-900 text-white shadow-2xl flex flex-col justify-between">
            <div>
              <p className="text-sm font-bold opacity-60 uppercase tracking-widest mb-4">Ingresos Brutos</p>
              <h4 className="text-5xl font-black">S/. {totalSales.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</h4>
            </div>
            <div className="mt-8 flex items-center gap-2 text-green-400 font-bold">
               <TrendingUp className="w-5 h-5" />
               <span>Operativo</span>
            </div>
         </motion.div>

         <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="p-8 rounded-[40px] bg-primary-500 text-white shadow-2xl flex flex-col justify-between">
            <div>
              <p className="text-sm font-bold opacity-60 uppercase tracking-widest mb-4">Ganancia Estimada ({companyData.estimatedProfitMargin}%)</p>
              <h4 className="text-5xl font-black">S/. {monthlyProfit.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</h4>
            </div>
            <div className="mt-8 flex items-center gap-2 text-white/80 font-bold bg-white/10 px-4 py-2 rounded-full w-fit text-xs">
               Basado en margen configurado
            </div>
         </motion.div>

         <div className="p-8 rounded-[40px] bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
               <h3 className="text-xl font-black flex items-center gap-2">Stock Actual</h3>
               <span className="px-2 py-0.5 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-lg text-[10px] font-bold uppercase tracking-wider">Cosechado</span>
            </div>
            <div className="space-y-3 max-h-[160px] overflow-y-auto pr-2 custom-scrollbar">
               {stockByProduct.length > 0 ? stockByProduct.map(item => (
                 <div key={item.name} className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-2 last:border-0 last:pb-0">
                    <div>
                       <p className="text-sm font-bold text-neutral-700 dark:text-neutral-200">{item.name}</p>
                       <p className="text-[10px] text-neutral-400 font-medium">En venta</p>
                    </div>
                    <span className={`text-xl font-black ${item.available <= 10 ? 'text-red-500 animate-pulse' : 'text-primary-500'}`}>{item.available}</span>
                 </div>
               )) : (
                 <div className="py-6 text-center text-neutral-400 italic text-xs">Sin stock disponible</div>
               )}
            </div>
         </div>
      </div>

      <div className="p-8 rounded-[40px] bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm">
         <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-black">Historial de Transacciones</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input type="text" placeholder="Buscar venta..." className="bg-neutral-50 dark:bg-neutral-800 border-none rounded-xl py-2 pl-10 pr-4 text-sm font-medium focus:ring-2 focus:ring-primary-500" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
         </div>
         <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
            <AnimatePresence>
              {filteredSales.map(sale => (
                <motion.div key={sale.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="group p-5 rounded-3xl bg-neutral-50/50 dark:bg-neutral-800/30 border border-neutral-100 dark:border-neutral-700/50 flex items-center justify-between hover:bg-neutral-100/50 transition-all">
                   <div className="flex items-center gap-5">
                      <div className="w-12 h-12 rounded-2xl bg-white dark:bg-neutral-900 flex items-center justify-center font-black text-primary-600 shadow-sm uppercase">
                         {sale.product[0]}
                      </div>
                      <div>
                         <p className="font-bold text-lg">{sale.product}</p>
                         <p className="text-xs text-neutral-500 font-medium">{sale.date} • {sale.quantity} unidades {sale.customer ? `• ${sale.customer}` : ''}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-xl font-black">S/. {sale.total.toFixed(2)}</p>
                        <p className="text-[10px] font-black uppercase text-neutral-400 tracking-wider">#{sale.id}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => handlePrintTicket(sale)} className="p-3 bg-white dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 hover:text-primary-600 rounded-2xl transition-all shadow-sm" title="Imprimir Boleta"><Printer className="w-5 h-5" /></button>
                        <button onClick={() => handleOpenEdit(sale)} className="p-3 bg-white dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 hover:text-blue-500 rounded-2xl transition-all shadow-sm" title="Editar Venta"><Edit className="w-5 h-5" /></button>
                        <button onClick={() => handleDeleteSale(sale.id)} className="p-3 bg-white dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 hover:text-red-500 rounded-2xl transition-all shadow-sm" title="Eliminar Venta"><Trash2 className="w-5 h-5" /></button>
                      </div>
                   </div>
                </motion.div>
              ))}
            </AnimatePresence>
         </div>
      </div>

      <AnimatePresence>
        {showNewSaleModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowNewSaleModal(false)} className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-lg bg-white dark:bg-neutral-900 rounded-[32px] p-8 shadow-2xl border border-neutral-200 dark:border-neutral-800">
              <h3 className="text-2xl font-black mb-6 flex items-center gap-3"><CreditCard className="w-6 h-6 text-primary-500" /> Registrar Venta</h3>
              <form onSubmit={handeRegisterSale} className="space-y-4">
                <div>
                  <label htmlFor="sale-product" className="text-xs font-bold text-neutral-500 mb-1 block">Producto</label>
                  <select id="sale-product" required className="w-full bg-neutral-50 dark:bg-neutral-800 p-3 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" value={newSale.product} onChange={e => setNewSale({...newSale, product: e.target.value})} title="Producto">
                    <option value="">Selecciona un producto...</option>
                    {stockByProduct.map(item => <option key={item.name} value={item.name} disabled={item.available <= 0}>{item.name} ({item.available} dispon.)</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="sale-customer" className="text-xs font-bold text-neutral-500 mb-1 block">Cliente</label>
                  <input id="sale-customer" type="text" className="w-full bg-neutral-50 dark:bg-neutral-800 p-3 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" value={newSale.customer} onChange={e => setNewSale({...newSale, customer: e.target.value})} placeholder="Nombre del cliente (opcional)" title="Cliente" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="sale-quantity" className="text-xs font-bold text-neutral-500 mb-1 block">Cantidad</label>
                    <input id="sale-quantity" required type="number" min="1" className="w-full bg-neutral-50 dark:bg-neutral-800 p-3 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" value={newSale.quantity} onChange={e => setNewSale({...newSale, quantity: parseInt(e.target.value) || 0})} title="Cantidad" />
                  </div>
                  <div>
                    <label htmlFor="sale-price" className="text-xs font-bold text-neutral-500 mb-1 block">Precio Unit.</label>
                    <input id="sale-price" required type="number" step="0.5" min="0" className="w-full bg-neutral-50 dark:bg-neutral-800 p-3 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" value={newSale.price} onChange={e => setNewSale({...newSale, price: parseFloat(e.target.value) || 0})} title="Precio" />
                  </div>
                </div>
                <div className="p-4 bg-primary-100/50 dark:bg-primary-900/20 rounded-2xl flex items-center justify-between">
                   <span className="font-bold text-primary-600">Total:</span>
                   <span className="text-2xl font-black text-primary-600">S/. {(newSale.price * newSale.quantity).toFixed(2)}</span>
                </div>
                <div className="pt-4 flex gap-3">
                  <button type="button" onClick={() => setShowNewSaleModal(false)} className="flex-1 py-4 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 rounded-2xl font-bold transition-all">Cancelar</button>
                  <button type="submit" className="flex-1 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-bold shadow-lg shadow-primary-500/20">Registrar</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showEditModal && editingSale && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowEditModal(false)} className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-lg bg-white dark:bg-neutral-900 rounded-[32px] p-8 shadow-2xl border border-neutral-200 dark:border-neutral-800">
              <h3 className="text-2xl font-black mb-6 flex items-center gap-3"><Edit className="w-6 h-6 text-blue-500" /> Editar Venta</h3>
              <form onSubmit={handleUpdateSale} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-neutral-500 uppercase mb-1 block">Producto</label>
                  <input readOnly value={editingSale.product} className="w-full bg-neutral-50 dark:bg-neutral-800 p-3 rounded-xl opacity-60 outline-none" title="Producto" />
                </div>
                <div>
                  <label htmlFor="edit-customer" className="text-xs font-bold text-neutral-500 uppercase mb-1 block">Cliente</label>
                  <input id="edit-customer" type="text" className="w-full bg-neutral-50 dark:bg-neutral-800 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" value={editingSale.customer || ''} onChange={e => setEditingSale({...editingSale, customer: e.target.value})} title="Cliente" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="edit-quantity" className="text-xs font-bold text-neutral-500 uppercase mb-1 block">Cantidad</label>
                    <input id="edit-quantity" required type="number" min="1" className="w-full bg-neutral-50 dark:bg-neutral-800 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" value={editingSale.quantity} onChange={e => setEditingSale({...editingSale, quantity: parseInt(e.target.value) || 0})} title="Cantidad" />
                  </div>
                  <div>
                    <label htmlFor="edit-price" className="text-xs font-bold text-neutral-500 uppercase mb-1 block">Precio</label>
                    <input id="edit-price" required type="number" step="0.5" min="0" className="w-full bg-neutral-50 dark:bg-neutral-800 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" value={editingSale.price} onChange={e => setEditingSale({...editingSale, price: parseFloat(e.target.value) || 0})} title="Precio" />
                  </div>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-2xl flex justify-between items-center"><span className="font-bold text-blue-600">Total:</span><span className="text-2xl font-black text-blue-600 font-black">S/. {(editingSale.price * editingSale.quantity).toFixed(2)}</span></div>
                <div className="pt-4 flex gap-3"><button type="button" onClick={() => setShowEditModal(false)} className="flex-1 py-4 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 rounded-2xl font-bold transition-all">Cancelar</button><button type="submit" className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-blue-500/20">Guardar</button></div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
