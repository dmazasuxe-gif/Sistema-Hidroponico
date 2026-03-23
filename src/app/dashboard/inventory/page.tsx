"use client";

import React, { useState } from 'react';
import { 
  Package, 
  Search, 
  Filter, 
  Plus, 
  ChevronRight, 
  AlertCircle, 
  TrendingUp,
  PackageCheck,
  PackageX,
  PlusCircle,
  MinusCircle,
  Server,
  TrendingDown,
  Trash2,
  Edit2,
  Truck,
  X,
  Tag,
  DollarSign
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { InventoryItem, mockInventory } from '@/lib/data';

export default function InventoryPage() {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [search, setSearch] = useState('');
  
  // Modals state
  const [buyModalOpen, setBuyModalOpen] = useState(false);
  const [providersModalOpen, setProvidersModalOpen] = useState(false);
  
  // Edit State
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  const [buyForm, setBuyForm] = useState({
    name: '', category: 'Nutrientes', quantity: '' as any, price: '' as any, provider: '', unit: 'Unid'
  });

  // Persistence
  React.useEffect(() => {
    const saved = localStorage.getItem('inventory');
    if (saved) {
      setInventoryItems(JSON.parse(saved));
    }
  }, []);

  const saveInventory = (items: InventoryItem[]) => {
    setInventoryItems(items);
    localStorage.setItem('inventory', JSON.stringify(items));
  };

  const filteredItems = inventoryItems.filter(i => 
    i.name.toLowerCase().includes(search.toLowerCase()) || 
    i.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleUpdateStock = (id: string, amount: number) => {
    const nextItems = inventoryItems.map(item => {
      if (item.id === id) {
        return { ...item, quantity: Math.max(0, item.quantity + amount) };
      }
      return item;
    });
    saveInventory(nextItems);
  };

  const handleEditItem = (item: InventoryItem) => {
    setEditingItem(item);
    setBuyForm({
      name: item.name,
      category: item.category,
      quantity: item.quantity,
      unit: item.unit,
      price: item.price,
      provider: item.provider
    });
    setBuyModalOpen(true);
  };

  const handleDeleteItem = (id: string) => {
    if (confirm('¿Seguro que deseas eliminar este producto del inventario?')) {
      saveInventory(inventoryItems.filter(i => i.id !== id));
    }
  };

  const handleRegisterPurchase = (e: React.FormEvent) => {
    e.preventDefault();
    let nextItems: InventoryItem[] = [];
    
    if (editingItem) {
      nextItems = inventoryItems.map(i => i.id === editingItem.id ? ({ 
        ...i, 
        ...buyForm,
        category: buyForm.category as any,
        lastPurchase: new Date().toISOString().split('T')[0]
      } as InventoryItem) : i);
    } else {
      const newItem: InventoryItem = {
        id: Math.random().toString(),
        name: buyForm.name,
        category: buyForm.category as 'Semillas' | 'Nutrientes' | 'Accesorios',
        quantity: buyForm.quantity,
        price: buyForm.price,
        provider: buyForm.provider,
        minStock: 5,
        unit: buyForm.unit,
        lastPurchase: new Date().toISOString().split('T')[0]
      };
      nextItems = [newItem, ...inventoryItems];

      // AUTO-REGISTER AS EXPENSE
      const totalCost = buyForm.price * buyForm.quantity;
      const newExpense = {
        id: `exp-${Math.random().toString(36).substr(2, 9)}`,
        category: "Insumos y Compras",
        description: `Compra de ${buyForm.quantity} ${buyForm.unit} de ${buyForm.name}`,
        amount: totalCost,
        date: new Date().toISOString().split('T')[0]
      };

      const savedExpenses = localStorage.getItem('expenses');
      const expenses = savedExpenses ? JSON.parse(savedExpenses) : [];
      localStorage.setItem('expenses', JSON.stringify([newExpense, ...expenses]));
    }

    saveInventory(nextItems);
    setBuyModalOpen(false);
    setEditingItem(null);
    setBuyForm({ name: '', category: 'Nutrientes', quantity: '' as any, price: '' as any, provider: '', unit: 'Unid'});
  };

  const totalValue = inventoryItems.reduce((acc, current) => acc + (current.price * current.quantity), 0);
  const totalInvestment = inventoryItems.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);


  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-20 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
             <Package className="w-10 h-10 text-primary-500" />
             Compras de Insumos
          </h1>
          <p className="text-neutral-500 mt-2">Control de compras de suministros, insumos y pedidos del negocio.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setProvidersModalOpen(true)}
            className="flex items-center justify-center space-x-2 px-6 py-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl font-bold shadow-sm hover:bg-neutral-50 transition-all text-sm"
          >
            <Truck className="w-5 h-5 text-neutral-500" />
            <span>Proveedores</span>
          </button>
          <button 
            onClick={() => { setEditingItem(null); setBuyForm({ name: '', category: 'Nutrientes', quantity: 1, price: 0, provider: '', unit: 'Unid'}); setBuyModalOpen(true); }}
            className="flex items-center justify-center space-x-2 px-6 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-bold shadow-lg shadow-primary-500/20 transition-all"
          >
            <Plus className="w-5 h-5" />
            <span>Registrar Compra</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col justify-between">
           <p className="text-sm font-bold text-neutral-500">Valor Total</p>
           <h4 className="text-3xl font-black mt-2 leading-none">S/. {totalValue.toLocaleString()}</h4>
         </div>
         <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col justify-between">
           <p className="text-sm font-bold text-neutral-500">Items en Alerta</p>
           <h4 className="text-3xl font-black mt-2 leading-none text-orange-500">{inventoryItems.filter(i => i.quantity <= i.minStock).length}</h4>
         </div>

         <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col justify-between">
           <p className="text-sm font-bold text-neutral-500">Proveedores Activos</p>
           <h4 className="text-3xl font-black mt-2 leading-none">{Array.from(new Set(inventoryItems.map(i => i.provider))).length}</h4>
         </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 bg-white dark:bg-neutral-900 p-4 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <input 
            type="text" 
            placeholder="Filtrar suministros..."
            className="w-full bg-neutral-50 dark:bg-neutral-800 border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary-500 transition-all text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-[32px] overflow-hidden shadow-xl lg:col-span-2">
           <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-50 dark:bg-neutral-800/50">
                  <th className="px-8 py-6 text-xs font-black text-neutral-400 uppercase tracking-widest">Producto</th>
                  <th className="px-8 py-6 text-xs font-black text-neutral-400 uppercase tracking-widest">Stock Actual</th>
                  <th className="px-8 py-6 text-xs font-black text-neutral-400 uppercase tracking-widest">Precio Compra</th>
                  <th className="px-8 py-6 text-xs font-black text-neutral-400 uppercase tracking-widest">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {filteredItems.map(item => (
                  <tr key={item.id} className="group hover:bg-neutral-50/50 dark:hover:bg-neutral-800/20 transition-colors">
                    <td className="px-8 py-6">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-primary-600">
                             <PackageCheck className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="font-bold text-lg">{item.name}</p>
                            <p className="text-xs text-neutral-500 font-medium">Prov: {item.provider}</p>
                          </div>
                       </div>
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex items-baseline gap-1">
                          <span className={`text-xl font-black ${item.quantity <= item.minStock ? 'text-red-500' : ''}`}>{item.quantity}</span>
                          <span className="text-xs font-bold text-neutral-400">{item.unit}</span>
                       </div>
                    </td>
                    <td className="px-8 py-6 font-bold">S/. {item.price.toFixed(2)}</td>
                    <td className="px-8 py-6">
                       <div className="flex items-center gap-2">
                         <button 
                           onClick={() => handleUpdateStock(item.id, 1)}
                           className="p-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-500 hover:text-primary-600 transition-all"
                           title="Aumentar stock"
                           aria-label="Aumentar stock"
                         >
                            <PlusCircle className="w-5 h-5" />
                         </button>
                         <button 
                           onClick={() => handleUpdateStock(item.id, -1)}
                           className="p-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-500 hover:text-red-500 transition-all"
                           title="Disminuir stock"
                           aria-label="Disminuir stock"
                         >
                            <MinusCircle className="w-5 h-5" />
                         </button>
                         <button 
                           onClick={() => handleEditItem(item)}
                           className="p-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-500 hover:text-blue-500 transition-all"
                           title="Editar Insunto"
                         >
                            <Edit2 className="w-5 h-5" />
                         </button>
                         <button 
                           onClick={() => handleDeleteItem(item.id)}
                           className="p-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-500 hover:text-red-500 transition-all"
                           title="Eliminar Insumo"
                         >
                            <Trash2 className="w-5 h-5" />
                         </button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
           </table>
        </div>

          <div className="h-0" />
        </div>
      


      {/* Buy Modal */}
      <AnimatePresence>
        {buyModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => { setBuyModalOpen(false); setEditingItem(null); setBuyForm({ name: '', category: 'Nutrientes', quantity: '' as any, price: '' as any, provider: '', unit: 'Unid'}); }}
              className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-white dark:bg-neutral-900 rounded-[32px] p-8 shadow-2xl border border-neutral-200 dark:border-neutral-800"
            >
               <h3 className="text-2xl font-black mb-6 flex items-center gap-3">
                 <PackageCheck className="w-6 h-6 text-primary-500" />
                 {editingItem ? 'Editar Insumo' : 'Registrar Compra'}
               </h3>
              <form onSubmit={handleRegisterPurchase} className="space-y-4">
                <div>
                  <label htmlFor="inv-name" className="text-xs font-bold text-neutral-500">Nombre del Insumo</label>
                  <input id="inv-name" required type="text" className="w-full mt-1 bg-neutral-50 dark:bg-neutral-800 p-3 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                    value={buyForm.name} onChange={e => setBuyForm({...buyForm, name: e.target.value})} title="Nombre del insumo" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="inv-qty" className="text-xs font-bold text-neutral-500">Cantidad</label>
                    <input id="inv-qty" required type="number" min="1" className="w-full mt-1 bg-neutral-50 dark:bg-neutral-800 p-3 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                      value={buyForm.quantity} onChange={e => setBuyForm({...buyForm, quantity: parseInt(e.target.value) || 0})} title="Cantidad a comprar" />
                  </div>
                  <div>
                    <label htmlFor="inv-price" className="text-xs font-bold text-neutral-500">Precio (S/.)</label>
                    <input id="inv-price" required type="number" step="0.5" min="0" className="w-full mt-1 bg-neutral-50 dark:bg-neutral-800 p-3 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                      value={buyForm.price} onChange={e => setBuyForm({...buyForm, price: parseFloat(e.target.value) || 0})} title="Precio de compra" />
                  </div>
                </div>
                <div>
                  <label htmlFor="inv-provider" className="text-xs font-bold text-neutral-500">Proveedor</label>
                  <input id="inv-provider" required type="text" className="w-full mt-1 bg-neutral-50 dark:bg-neutral-800 p-3 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                    value={buyForm.provider} onChange={e => setBuyForm({...buyForm, provider: e.target.value})} title="Nombre del proveedor" />
                </div>
                <div className="pt-4 flex gap-3">
                  <button type="button" onClick={() => { setBuyModalOpen(false); setEditingItem(null); setBuyForm({ name: '', category: 'Nutrientes', quantity: '' as any, price: '' as any, provider: '', unit: 'Unid'}); }} className="flex-1 py-3 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 rounded-xl font-bold transition-all">Cancelar</button>
                  <button type="submit" className="flex-1 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold transition-all">Guardar</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {providersModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setProvidersModalOpen(false)}
              className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-white dark:bg-neutral-900 rounded-[32px] p-8 shadow-2xl border border-neutral-200 dark:border-neutral-800"
            >
              <h3 className="text-2xl font-black mb-6">Proveedores Activos</h3>
              <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                {Array.from(new Set(inventoryItems.map(i => i.provider))).map((p, idx) => (
                   <div key={idx} className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl flex items-center justify-between border border-neutral-100 dark:border-neutral-700">
                     <div className="font-bold">{p as string}</div>
                     <button className="text-sm font-bold text-red-500 hover:text-red-600">Eliminar</button>
                   </div>
                ))}
              </div>
              <button
                onClick={() => setProvidersModalOpen(false)}
                className="w-full mt-6 py-4 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 rounded-xl font-bold transition-all"
              >
                Cerrar
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
