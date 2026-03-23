"use client";

import React, { useState, useEffect } from 'react';
import { 
  Receipt,
  Plus, 
  Search,
  Wallet,
  TrendingDown,
  Calendar,
  Trash2,
  DollarSign,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Expense {
  id: string;
  category: string;
  description: string;
  amount: number;
  date: string;
}

const DEFAULT_CATEGORIES = [
  "Pago de luz", 
  "Pago de personal", 
  "Pago de flete", 
  "Pago a SUNAT", 
  "Pago al banco", 
  "Repartición de ganancias"
];

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);
  const [search, setSearch] = useState('');
  
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    category: '',
    description: '',
    amount: '' as any,
    date: new Date().toISOString().split('T')[0]
  });

  const [companyData, setCompanyData] = useState({
    businessName: 'Vivero San Juan',
    documentId: '10456123456',
    address: 'Av. Las Palmeras 123'
  });
  const [companyLogo, setCompanyLogo] = useState<string | null>(null);

  useEffect(() => {
    const savedCategories = localStorage.getItem('expenseCategories');
    if (savedCategories) {
      setCategories(JSON.parse(savedCategories));
    } else {
      localStorage.setItem('expenseCategories', JSON.stringify(DEFAULT_CATEGORIES));
    }

    const savedExpenses = localStorage.getItem('expenses');
    if (savedExpenses) {
      setExpenses(JSON.parse(savedExpenses));
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

  const saveExpenses = (newExpenses: Expense[]) => {
    setExpenses(newExpenses);
    localStorage.setItem('expenses', JSON.stringify(newExpenses));
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const ex: Expense = {
      id: Math.random().toString(),
      category: form.category || categories[0],
      description: form.description,
      amount: form.amount,
      date: form.date
    };
    saveExpenses([ex, ...expenses]);
    setShowModal(false);
    setForm({ category: categories[0] || '', description: '', amount: '' as any, date: new Date().toISOString().split('T')[0] });
  };

  const handleExportExpensesReport = () => {
    const doc = new jsPDF();
    let currentY = 20;

    if (companyLogo) {
      doc.addImage(companyLogo, 'PNG', 15, 10, 30, 30);
      currentY = 45;
    }

    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("REPORTE DE GASTOS", 105, 25, { align: "center" });

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(companyData.businessName, 105, 32, { align: "center" });
    doc.text(`RUC: ${companyData.documentId} | ${companyData.address}`, 105, 37, { align: "center" });
    
    currentY = Math.max(currentY, 45);
    doc.setLineWidth(0.5);
    doc.line(15, currentY, 195, currentY);
    currentY += 10;

    doc.setFillColor(240, 240, 240);
    doc.roundedRect(15, currentY, 180, 20, 3, 3, 'F');
    doc.setFont("helvetica", "bold");
    doc.text("RESUMEN DE EGRESOS", 20, currentY + 7);
    doc.setFont("helvetica", "normal");
    doc.text(`Total de Egresos: S/. ${totalExpenses.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, 20, currentY + 14);
    
    currentY += 30;

    autoTable(doc, {
      startY: currentY,
      head: [['Fecha', 'Categoría', 'Descripción', 'Monto']],
      body: expenses.map(e => [
        e.date,
        e.category,
        e.description,
        `S/. ${e.amount.toFixed(2)}`
      ]),
      theme: 'striped',
      headStyles: { fillColor: [239, 68, 68] }
    });

    doc.save(`Reporte_Gastos_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const handleDelete = (id: string) => {
    if (confirm("¿Eliminar este gasto?")) {
      saveExpenses(expenses.filter(e => e.id !== id));
    }
  };

  const filteredExpenses = expenses.filter(e => 
    e.category.toLowerCase().includes(search.toLowerCase()) || 
    e.description.toLowerCase().includes(search.toLowerCase())
  );

  const totalExpenses = expenses.reduce((acc, current) => acc + current.amount, 0);

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-20 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
             <Receipt className="w-10 h-10 text-primary-500" />
             Registro de Gastos
          </h1>
          <p className="text-neutral-500 mt-2">Controla tus egresos y mantén el flujo de caja.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={handleExportExpensesReport}
            className="flex items-center justify-center space-x-2 px-6 py-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl font-bold shadow-sm hover:bg-neutral-50 transition-all font-bold text-sm"
          >
            <FileText className="w-5 h-5 text-neutral-500" />
            <span>Generar Reporte</span>
          </button>
          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center justify-center space-x-2 px-6 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-bold shadow-lg shadow-primary-500/20 transition-all"
          >
            <Plus className="w-5 h-5" />
            <span>Añadir Gasto</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="p-8 rounded-[40px] bg-neutral-900 text-white shadow-2xl flex flex-col justify-between">
            <div>
              <p className="text-sm font-bold opacity-60 uppercase tracking-widest mb-4">Total Egresos</p>
              <h4 className="text-5xl font-black text-red-400">S/. {totalExpenses.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</h4>
            </div>
            <div className="mt-8 flex items-center gap-2 text-red-400 font-bold bg-white/10 px-4 py-2 rounded-full w-fit text-xs">
               <TrendingDown className="w-4 h-4" /> Salida de Capital
            </div>
         </motion.div>

         <div className="space-y-4">
            <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm flex items-center justify-between group">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-orange-500/10 text-orange-500 flex items-center justify-center">
                    <Wallet className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-black">Último Gasto</p>
                    <p className="text-xs text-neutral-500 font-medium">{expenses[0]?.description || 'Sin movimientos'}</p>
                  </div>
               </div>
               <span className="font-black">S/. {expenses[0]?.amount.toFixed(2) || '0.00'}</span>
            </div>
         </div>
      </div>

      <div className="p-8 rounded-[40px] bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-black">Historial de Operaciones</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input 
              type="text" 
              placeholder="Buscar gasto..."
              className="bg-neutral-50 dark:bg-neutral-800 border-none rounded-xl py-2 pl-10 pr-4 text-sm font-medium focus:ring-2 focus:ring-primary-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-4">
          <AnimatePresence>
            {filteredExpenses.map(ex => (
              <motion.div 
                key={ex.id}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                className="group p-5 rounded-3xl bg-neutral-50/50 dark:bg-neutral-800/30 border border-neutral-100 dark:border-neutral-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white transition-all hover:shadow-lg"
              >
                 <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-500 dark:bg-red-900/30 flex items-center justify-center font-black">
                       <Receipt className="w-5 h-5" />
                    </div>
                    <div>
                       <p className="font-bold text-lg">{ex.category}</p>
                       <p className="text-xs text-neutral-500 font-medium flex items-center gap-2">
                         <Calendar className="w-3 h-3" /> {ex.date} • {ex.description}
                       </p>
                    </div>
                 </div>
                 <div className="flex items-center gap-6 justify-between sm:justify-end">
                    <p className="text-xl font-black text-red-500">- S/. {ex.amount.toFixed(2)}</p>
                    <button 
                      onClick={() => handleDelete(ex.id)}
                      className="p-2 text-neutral-400 hover:text-red-500 transition-colors bg-red-50 dark:bg-red-900/10 rounded-xl opacity-100 sm:opacity-0 group-hover:opacity-100"
                      title="Eliminar gasto"
                      aria-label="Eliminar gasto"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                 </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {filteredExpenses.length === 0 && (
             <p className="text-center py-10 text-neutral-500">No hay gastos registrados para este filtro.</p>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-lg bg-white dark:bg-neutral-900 rounded-[32px] p-8 shadow-2xl">
              <h3 className="text-2xl font-black mb-6 flex items-center gap-3">
                <Receipt className="w-6 h-6 text-primary-500" />
                Registrar Gasto
              </h3>
              <form onSubmit={handleAddExpense} className="space-y-4">
                <div>
                  <label htmlFor="exp-category" className="text-xs font-bold text-neutral-500 uppercase">Categoría</label>
                  <select id="exp-category" required value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full mt-1 bg-neutral-50 dark:bg-neutral-800 p-3 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" title="Seleccionar categoría de gasto">
                    {categories.map((c, i) => <option key={i} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="exp-desc" className="text-xs font-bold text-neutral-500 uppercase">Descripción / Motivo</label>
                  <input id="exp-desc" required type="text" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full mt-1 bg-neutral-50 dark:bg-neutral-800 p-3 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" placeholder="Ej. Materiales de limpieza" title="Descripción del gasto" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="exp-amount" className="text-xs font-bold text-neutral-500 uppercase">Monto (S/.)</label>
                    <div className="relative mt-1">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                      <input id="exp-amount" required type="number" step="0.1" min="0" value={form.amount} onChange={e => setForm({...form, amount: parseFloat(e.target.value)})} className="w-full bg-neutral-50 dark:bg-neutral-800 p-3 pl-9 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" title="Monto del gasto" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="exp-date" className="text-xs font-bold text-neutral-500 uppercase">Fecha</label>
                    <input id="exp-date" required type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="w-full mt-1 bg-neutral-50 dark:bg-neutral-800 p-3 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" title="Fecha del gasto" />
                  </div>
                </div>
                <div className="pt-4 flex gap-3">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 rounded-2xl font-bold transition-all">Cancelar</button>
                  <button type="submit" className="flex-1 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-bold shadow-lg shadow-primary-500/20 transition-all">Guardar Gasto</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
