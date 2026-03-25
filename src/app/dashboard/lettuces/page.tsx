"use client";

import React, { useState, useEffect } from 'react';
import { 
  Sprout, 
  Search,
  Droplets,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Leaf,
  Calendar as CalendarIcon,
  Tag,
  X,
  Target,
  CalendarDays,
  HelpCircle,
  Trash2,
  Edit,
  Plus,
  Minus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LettuceBatch {
  id: string;
  plantName: string;
  sowingDate: string;
  systemLocation: string;
  totalPlanted: number;
  goodCondition: number;
  badCondition: number;
  status: 'Creciendo' | 'Para Cosecha' | 'Cosechado';
  transferDate?: string;
  harvestDate?: string;
  estimatedHarvestDate?: string;
}

const mockBatches: LettuceBatch[] = [
  { id: '1', plantName: 'Lechuga Romana', sowingDate: '2026-03-01', systemLocation: 'Tubo NFT A-1', totalPlanted: 100, goodCondition: 98, badCondition: 2, status: 'Creciendo' },
  { id: '2', plantName: 'Espinaca Baby', sowingDate: '2026-02-15', systemLocation: 'Tubo NFT B-2', totalPlanted: 150, goodCondition: 140, badCondition: 10, status: 'Para Cosecha' },
];

export default function LettucesControlPage() {
  const [batches, setBatches] = useState<LettuceBatch[]>([]);
  const [search, setSearch] = useState('');
  
  // Modal States
  const [mermaModalOpen, setMermaModalOpen] = useState(false);
  const [activeBatch, setActiveBatch] = useState<LettuceBatch | null>(null);
  
  // Merma Form State
  const [mermaForm, setMermaForm] = useState({
    plantName: '',
    quantity: '' as any,
    date: new Date().toISOString().split('T')[0]
  });

  // New Batch Form State
  const [newBatchModalOpen, setNewBatchModalOpen] = useState(false);
  const [fullscreenBedIndex, setFullscreenBedIndex] = useState<number | null>(null);
  const [newBatchForm, setNewBatchForm] = useState({
    plantName: '',
    sowingDate: new Date().toISOString().split('T')[0],
    transferDate: '',
    estimatedHarvestDate: '',
    totalPlanted: '' as any,
    systemLocation: ''
  });

  // Modals state
  const [editingBatch, setEditingBatch] = useState<LettuceBatch | null>(null);
  const [nftModalOpen, setNftModalOpen] = useState(false);
  const [harvestSuccess, setHarvestSuccess] = useState<string | null>(null);

  const [totalBeds, setTotalBeds] = useState(4);
  useEffect(() => {
    const s = localStorage.getItem('nftBedsCount');
    if (s) setTotalBeds(parseInt(s));

    const savedBatches = localStorage.getItem('lettuce_batches');
    if (savedBatches) {
      setBatches(JSON.parse(savedBatches));
    }
  }, []);

  const saveBatches = (newBatches: LettuceBatch[]) => {
    setBatches(newBatches);
    localStorage.setItem('lettuce_batches', JSON.stringify(newBatches));
  };

  const updateBeds = (d: number) => {
    const n = Math.max(1, totalBeds + d);
    setTotalBeds(n);
    localStorage.setItem('nftBedsCount', n.toString());
  };

  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);
  
  const activeBedsCount = Array.from(new Set(batches.filter(b => b.status !== 'Cosechado').map(b => b.systemLocation))).length;
  const inactiveBedsCount = Math.max(0, totalBeds - activeBedsCount);

  const totalGrowing = batches.filter(b => b.status !== 'Cosechado').reduce((acc, curr) => acc + curr.goodCondition, 0);
  const totalLost = batches.reduce((acc, curr) => acc + curr.badCondition, 0);
  
  // Dynamic Harvest Alert Calculation
  const readyToHarvestBatch = batches.find(b => {
    if (!b.estimatedHarvestDate || b.status === 'Cosechado' || dismissedAlerts.includes(b.id)) return false;
    const harvestDay = new Date(b.estimatedHarvestDate + 'T00:00:00');
    const today = new Date();
    today.setHours(0,0,0,0);
    return harvestDay <= today;
  });

  const showHarvestAlert = !!readyToHarvestBatch;

  const openMermaModal = (batch: LettuceBatch) => {
    setActiveBatch(batch);
    setMermaForm({
      plantName: batch.plantName,
      quantity: '' as any,
      date: new Date().toISOString().split('T')[0]
    });
    setMermaModalOpen(true);
  };

  const handleMermaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBatch) return;

    saveBatches(batches.map(b => {
      if (b.id === activeBatch.id) {
        return {
          ...b,
          plantName: mermaForm.plantName,
          goodCondition: Math.max(0, b.goodCondition - mermaForm.quantity),
          badCondition: b.badCondition + mermaForm.quantity
        };
      }
      return b;
    }));
    setMermaModalOpen(false);
  };

  const handleNewBatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const diff = editingBatch ? newBatchForm.totalPlanted - editingBatch.totalPlanted : 0;
    const newGoodCondition = editingBatch ? Math.max(0, editingBatch.goodCondition + diff) : newBatchForm.totalPlanted;

    const newBatch: LettuceBatch = {
      id: editingBatch ? editingBatch.id : Math.random().toString(),
      plantName: newBatchForm.plantName,
      sowingDate: newBatchForm.sowingDate,
      transferDate: newBatchForm.transferDate,
      estimatedHarvestDate: newBatchForm.estimatedHarvestDate,
      systemLocation: newBatchForm.systemLocation,
      totalPlanted: newBatchForm.totalPlanted,
      goodCondition: newGoodCondition,
      badCondition: editingBatch ? editingBatch.badCondition : 0,
      status: 'Creciendo'
    };

    if (editingBatch) {
      saveBatches(batches.map(b => b.id === editingBatch.id ? newBatch : b));
    } else {
      saveBatches([...batches, newBatch]);
    }

    setNewBatchModalOpen(false);
    setEditingBatch(null);
    setNewBatchForm({
      plantName: '',
      sowingDate: new Date().toISOString().split('T')[0],
      transferDate: '',
      estimatedHarvestDate: '',
      totalPlanted: '' as any,
      systemLocation: ''
    });
  };

  const handleEditBatch = (batch: LettuceBatch) => {
    setEditingBatch(batch);
    setNewBatchForm({
      plantName: batch.plantName,
      sowingDate: batch.sowingDate,
      transferDate: batch.transferDate || '',
      estimatedHarvestDate: batch.estimatedHarvestDate || '',
      totalPlanted: batch.totalPlanted,
      systemLocation: batch.systemLocation
    });
    setNewBatchModalOpen(true);
  };

  const handleDeleteBatch = (id: string) => {
    if (confirm("¿Estás seguro que deseas eliminar este lote? Todos sus datos se perderán.")) {
      saveBatches(batches.filter(b => b.id !== id));
    }
  };

  const handleHarvest = (batchId: string) => {
    // Show success animation
    setHarvestSuccess(batchId);
    
    setTimeout(() => {
      saveBatches(batches.map(b => 
        b.id === batchId ? { ...b, status: 'Cosechado', harvestDate: new Date().toISOString().split('T')[0] } : b
      ));
      if (typeof window !== 'undefined') {
        localStorage.removeItem('dailyTasks');
      }
      setHarvestSuccess(null);
    }, 2000);
  };

  const activeBatchesList = batches.filter(b => b.status !== 'Cosechado');

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-20 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
             <Sprout className="w-10 h-10 text-primary-500" />
             Control de Vegetales NFT
          </h1>
          <p className="text-neutral-500 mt-2">Monitorea el estado, registra mermas y cosecha tus lotes.</p>
        </div>
        <button 
          onClick={() => setNewBatchModalOpen(true)}
          className="flex items-center justify-center space-x-2 px-6 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-bold shadow-lg shadow-primary-500/20 transition-all"
        >
          <Plus className="w-5 h-5" />
          <span>Nueva Siembra</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
         <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="p-8 rounded-[40px] bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm"
         >
            <div className="w-14 h-14 rounded-2xl bg-green-50 text-green-500 flex items-center justify-center mb-6">
              <Leaf className="w-7 h-7" />
            </div>
            <h4 className="text-4xl font-black">{totalGrowing}</h4>
            <p className="text-neutral-500 font-medium">Plantas Sanas (En curso)</p>
         </motion.div>

         <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.1 }}
           className="p-8 rounded-[40px] bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-900/30 shadow-sm"
         >
            <div className="w-14 h-14 rounded-2xl bg-red-100 dark:bg-red-900/50 text-red-500 flex items-center justify-center mb-6">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <h4 className="text-4xl font-black text-red-600 dark:text-red-400">{totalLost}</h4>
            <p className="text-red-500/80 font-medium">Plantas Mermadas</p>
         </motion.div>

         <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.2 }}
           onClick={() => setNftModalOpen(true)}
           className="p-8 rounded-[40px] bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-900/30 shadow-sm cursor-pointer hover:shadow-lg transition-all"
         >
            <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-900/50 text-blue-500 flex items-center justify-center mb-6">
              <Droplets className="w-7 h-7" />
            </div>
            <h4 className="text-4xl font-black text-blue-600 dark:text-blue-400">NFT</h4>
            <p className="text-blue-500/80 font-medium">Sistema Activo (Ver Detalle)</p>
         </motion.div>
      </div>

      <div className="p-8 rounded-[40px] bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-black">Lotes de Siembra Activos</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input 
              type="text" 
              placeholder="Buscar lote..."
              className="bg-neutral-50 dark:bg-neutral-800 border-none rounded-xl py-2 pl-10 pr-4 text-sm font-medium focus:ring-2 focus:ring-primary-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-4">
          <AnimatePresence>
            {activeBatchesList.map(batch => (
              <motion.div 
                key={batch.id} 
                layout
                initial={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, height: 0 }}
                className="relative overflow-hidden p-6 rounded-3xl bg-neutral-50/50 dark:bg-neutral-800/30 border border-neutral-100 dark:border-neutral-700/50 flex flex-col md:flex-row md:items-center justify-between gap-4 group"
              >
                 {harvestSuccess === batch.id && (
                   <motion.div 
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     className="absolute inset-0 bg-green-500 z-10 flex items-center justify-center text-white rounded-3xl"
                   >
                      <motion.div 
                        initial={{ scale: 0 }} 
                        animate={{ scale: 1 }}
                        className="flex items-center gap-3 font-black text-2xl"
                      >
                         <CheckCircle className="w-8 h-8" />
                         ¡Cosecha Exitosa!
                      </motion.div>
                   </motion.div>
                 )}

                 <div>
                    <h4 className="font-black text-lg flex items-center gap-2">
                       {batch.systemLocation}
                       <span className="text-xs px-2 py-1 bg-white dark:bg-neutral-900 rounded-md text-primary-600 border border-primary-500/20">{batch.plantName}</span>
                    </h4>
                    <p className="text-sm text-neutral-500 mt-1">Sembrado: {batch.sowingDate} • Total Inicial: {batch.totalPlanted} u.</p>
                 </div>
                 
                 <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-2xl font-black text-green-500">{batch.goodCondition}</p>
                      <p className="text-[10px] uppercase font-bold text-neutral-400">Sanas</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-black text-red-500">{batch.badCondition}</p>                       <p className="text-[10px] uppercase font-bold text-neutral-400">Mermas</p>
                    </div>
                 </div>

                 <div className="flex flex-col sm:flex-row items-center gap-2 mt-4 md:mt-0">
                    <button 
                      onClick={() => openMermaModal(batch)}
                      className="w-full sm:w-auto px-4 py-2 bg-neutral-100 hover:bg-red-50 text-neutral-600 hover:text-red-500 dark:bg-neutral-800 dark:hover:bg-red-900/30 rounded-xl text-sm font-bold transition-colors"
                    >
                      Registrar Merma
                    </button>
                    {(() => {
                      const harvestDay = batch.estimatedHarvestDate ? new Date(batch.estimatedHarvestDate + 'T00:00:00') : null;
                      const today = new Date();
                      today.setHours(0,0,0,0);
                      const isReady = harvestDay && harvestDay <= today;

                      return isReady ? (
                        <button 
                          onClick={() => handleHarvest(batch.id)}
                          className="w-full sm:w-auto px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-green-500/20 transition-all"
                        >
                          Cosechar
                        </button>
                      ) : (
                        <button 
                          disabled
                          className="w-full sm:w-auto px-4 py-2 bg-neutral-100 text-neutral-400 dark:bg-neutral-800 rounded-xl text-sm font-bold cursor-not-allowed"
                        >
                          Creciendo...
                        </button>
                      );
                    })()}
                    {/* Action Drops */}
                    <button 
                      onClick={() => handleEditBatch(batch)}
                      className="p-2 bg-neutral-100 hover:bg-blue-50 text-neutral-500 hover:text-blue-500 dark:bg-neutral-800 rounded-xl transition-colors"
                      title="Editar"
                      aria-label="Editar lote"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteBatch(batch.id)}
                      className="p-2 bg-neutral-100 hover:bg-red-50 text-neutral-500 hover:text-red-500 dark:bg-neutral-800 rounded-xl transition-colors"
                      title="Eliminar"
                      aria-label="Eliminar lote"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                 </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {activeBatchesList.length === 0 && (
             <p className="text-center text-neutral-500 font-medium py-10">No hay lotes activos para mostrar.</p>
          )}
        </div>
      </div>

      {/* Tarjetas Visores de Camas NFT */}
      <div className="p-8 rounded-[40px] bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm mt-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-6 relative z-10">
          <div>
            <h3 className="text-2xl md:text-3xl font-black flex items-center gap-3">
              <Sprout className="w-8 h-8 text-emerald-500" />
              Granja NFT (Vista 3D)
            </h3>
            <p className="text-neutral-500 font-medium text-sm mt-2 max-w-lg">
              Selecciona una cama física para entrar al simulador y visualizar tus lechugas sanas y mermas en 3D volumétrico real.
            </p>
          </div>
          
          {/* Controles para Añadir/Quitar Camas Rápidamente */}
          <div className="flex items-center gap-2 bg-neutral-50 dark:bg-neutral-800/80 p-2 rounded-[24px] border border-neutral-200 dark:border-neutral-700 shadow-inner shrink-0">
            <button onClick={() => updateBeds(-1)} className="p-4 bg-white dark:bg-neutral-900 rounded-[18px] hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 transition-colors shadow-sm hover:shadow-md transform active:scale-95" title="Remover cama" aria-label="Remover cama"><Minus className="w-5 h-5" /></button>
            <div className="flex flex-col items-center px-6">
              <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400 leading-none">{totalBeds}</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mt-1">Camas Instaladas</span>
            </div>
            <button onClick={() => updateBeds(1)} className="p-4 bg-white dark:bg-neutral-900 rounded-[18px] hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 transition-colors shadow-sm hover:shadow-md transform active:scale-95" title="Sumar cama" aria-label="Sumar cama"><Plus className="w-5 h-5" /></button>
          </div>
        </div>

        {/* Listado de Camas (Botones Minis) */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 lg:gap-6 relative z-10">
          {Array.from({ length: totalBeds }).map((_, i) => {
             const batch = activeBatchesList[i];
             return (
               <motion.button 
                 key={i} 
                 whileHover={{ scale: 1.05 }}
                 whileTap={{ scale: 0.95 }}
                 onClick={() => setFullscreenBedIndex(i)}
                 className="flex flex-col items-center bg-neutral-50 dark:bg-neutral-950/40 border border-neutral-200 dark:border-neutral-800 p-6 rounded-3xl shadow-sm hover:shadow-2xl hover:border-emerald-500/50 transition-all aspect-square justify-center relative overflow-hidden group outline-none focus:ring-4 focus:ring-emerald-500/30"
               >
                 <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white transition-all shadow-inner">
                   <Droplets className="w-7 h-7" />
                 </div>
                 <h4 className="font-black text-xl text-neutral-800 dark:text-neutral-100 mt-2">Cama {i + 1}</h4>
                 <p className="text-[10px] uppercase font-bold text-neutral-400 text-center mt-2 w-full truncate px-2">
                   {batch ? batch.plantName : 'Sistema Libre'}
                 </p>
                 {batch && (
                   <div className="absolute top-4 right-4 w-3.5 h-3.5 bg-emerald-500 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.8)] animate-pulse border-2 border-white dark:border-neutral-900" title="Activo" />
                 )}
               </motion.button>
             );
          })}
        </div>
      </div>

      {/* Fullscreen Interactive Bed Modal */}
      <AnimatePresence>
        {fullscreenBedIndex !== null && (
          <div className="fixed inset-0 z-[9999] flex flex-col bg-neutral-100 dark:bg-neutral-950 overflow-hidden">
            {(() => {
               const i = fullscreenBedIndex;
               const batch = activeBatchesList[i];
               const maxCapacity = 600;
               const good = batch ? batch.goodCondition : 0;
               const bad = batch ? batch.badCondition : 0;
               
               const slots: string[] = [];
               for (let s = 0; s < maxCapacity; s++) {
                 // Insertar mermas (bad) PRIMERO para que aparezcan arriba del tubo
                 if (s < bad) slots.push('bad');
                 else if (s < good + bad) slots.push('good');
                 else slots.push('empty');
               }

               return (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 flex flex-col">
                   {/* Navbar Modal */}
                   <div className="flex items-center justify-between p-6 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 shadow-md relative z-20 shrink-0">
                     <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg">
                         <Droplets className="w-6 h-6" />
                       </div>
                       <div>
                         <h2 className="text-2xl font-black flex items-center gap-3">
                           Cama NFT #{i + 1} 
                           {batch && <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[10px] uppercase tracking-widest rounded-lg">{batch.plantName}</span>}
                         </h2>
                         <p className="text-sm font-medium text-neutral-500">
                           {batch ? `Mostrando lote sembrado el ${batch.sowingDate}` : 'Esta cama está actualmente sin sembrar y lista para uso.'}
                         </p>
                       </div>
                     </div>
                     <div className="flex items-center gap-6">
                       {batch && (
                         <div className="hidden md:flex gap-6 mr-6 pr-6 border-r border-neutral-200 dark:border-neutral-800">
                           <div className="text-center">
                             <p className="text-2xl font-black text-emerald-500">{good}</p>
                             <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Sanas</p>
                           </div>
                           <div className="text-center">
                             <p className="text-2xl font-black text-yellow-500">{bad}</p>
                             <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Mermas</p>
                           </div>
                         </div>
                       )}
                       <button onClick={() => setFullscreenBedIndex(null)} className="p-3 bg-red-50 hover:bg-red-500 text-red-500 hover:text-white dark:bg-red-900/30 dark:hover:bg-red-500 rounded-xl transition-colors shadow-sm" title="Cerrar Simulador" aria-label="Cerrar Simulador">
                          <X className="w-6 h-6" />
                       </button>
                     </div>
                   </div>

                   {/* Canvas 3D de Tubos NFT Verticales */}
                   <div className="flex-1 overflow-auto p-12 bg-gradient-to-br from-neutral-200 to-neutral-300 dark:from-neutral-900 dark:to-black relative perspective-[1200px] custom-scrollbar">
                     {/* Estructura Base Simulada (Fondo) */}
                     <div className="absolute inset-x-20 top-1/2 transform -translate-y-1/2 h-[80%] border-[10px] border-emerald-900/10 rounded-[100px] pointer-events-none skew-x-12" />

                     {/* Contenedor Flex en Fila para los tubos verticales */}
                     <div className="flex flex-row gap-8 w-max mx-auto bg-white/40 dark:bg-neutral-900/40 p-12 rounded-[60px] border border-white/50 dark:border-neutral-800 shadow-[0_40px_100px_rgba(0,0,0,0.2)] backdrop-blur-3xl pb-20">
                       
                       {/* 10 Tubos Verticales de 60 huecos */}
                       {Array.from({ length: 10 }).map((_, pipeIdx) => {
                         const pipeSlots = slots.slice(pipeIdx * 60, (pipeIdx + 1) * 60); // 60 plantas verticales por tubo
                         return (
                           <div key={pipeIdx} className="flex flex-col items-center bg-gradient-to-r from-white via-neutral-100 to-neutral-300 dark:from-neutral-800 dark:via-neutral-900 dark:to-black w-24 py-8 rounded-full shadow-[0_20px_40px_rgba(0,0,0,0.5)] border border-white/50 dark:border-neutral-700 relative group overflow-visible gap-4 flex-nowrap shrink-0 hover:-translate-y-2 transition-transform duration-500">
                             
                             {/* Agujeros con plantas (60 en columna, de arriba a abajo) */}
                             {pipeSlots.map((slot, idx) => (
                               <div key={idx} className="relative z-10 flex-shrink-0 w-14 h-14 flex items-center justify-center perspective-[800px]">
                                 {/* Agujero Negro del Tubo */}
                                 <div className="absolute w-10 h-6 bg-black/90 rounded-[50%] shadow-[inset_0_8px_15px_black] transform translate-y-3 z-0" />
                                 
                                 {/* La Lechuga 3D (Emoji Render) */}
                                 {slot !== 'empty' && (
                                   <div 
                                     className={`relative z-10 text-[3.2rem] leading-none select-none transition-transform duration-500 hover:scale-[1.4] hover:-translate-y-4 cursor-crosshair transform rotate-x-[-20deg] ${
                                       slot === 'bad' ? 'filter hue-rotate-[-45deg] saturate-200 brightness-90 animate-pulse drop-shadow-[0_15px_15px_rgba(250,204,21,0.6)]' : 'drop-shadow-[0_15px_25px_rgba(0,0,0,0.6)]'
                                     }`}
                                     title={slot === 'good' ? 'Lechuga Viva y Sana' : 'Merma Detectada'}
                                   >
                                     🥬
                                   </div>
                                 )}
                               </div>
                             ))}

                             {/* Efecto de Agua lateral y motor en la parte Infeiror del tubo */}
                             <div className="absolute inset-x-0 bottom-[-2px] h-16 bg-cyan-400/30 rounded-b-full border-b-[4px] border-cyan-400 z-0 overflow-hidden">
                               <div className="absolute inset-0 bg-gradient-to-t from-cyan-400 via-transparent to-transparent opacity-80 animate-pulse" />
                             </div>
                           </div>
                         );
                       })}
                     </div>
                   </div>
                 </motion.div>
               );
            })()}
          </div>
        )}
      </AnimatePresence>

      {/* Merma Modal */}
      <AnimatePresence>
        {mermaModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMermaModalOpen(false)}
              className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white dark:bg-neutral-900 rounded-[32px] p-8 shadow-2xl border border-neutral-200 dark:border-neutral-800"
            >
              <button 
                onClick={() => setMermaModalOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                aria-label="Cerrar modal"
                title="Cerrar modal"
              >
                <X className="w-5 h-5 text-neutral-500" />
              </button>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-500">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-black">Registrar Merma</h3>
                  <p className="text-sm text-neutral-500">Deducir plantas por pérdida o enfermedad.</p>
                </div>
              </div>

              <form onSubmit={handleMermaSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label htmlFor="plantName" className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Nombre de la Planta</label>
                  <div className="relative">
                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                    <input 
                      id="plantName"
                      required
                      type="text" 
                      value={mermaForm.plantName}
                      onChange={(e) => setMermaForm({...mermaForm, plantName: e.target.value})}
                      className="w-full bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-2xl py-3 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-red-500 outline-none transition-all"
                      placeholder="Ej. Lechuga Romana"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="merma-qty" className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Cantidad a retirar</label>
                    <div className="relative">
                      <AlertTriangle className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                      <input 
                        id="merma-qty"
                        required
                        type="number" 
                        min="1"
                        max={activeBatch?.goodCondition || 1}
                        value={mermaForm.quantity}
                        onChange={(e) => setMermaForm({...mermaForm, quantity: parseInt(e.target.value) || 0})}
                        className="w-full bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-2xl py-3 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-red-500 outline-none transition-all"
                        title="Cantidad de plantas a retirar"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="merma-date" className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Fecha del Registro</label>
                    <div className="relative">
                      <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                      <input 
                        id="merma-date"
                        required
                        type="date" 
                        value={mermaForm.date}
                        onChange={(e) => setMermaForm({...mermaForm, date: e.target.value})}
                        className="w-full bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-2xl py-3 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-red-500 outline-none transition-all"
                        title="Fecha del registro de merma"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setMermaModalOpen(false)}
                    className="flex-1 px-6 py-4 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 rounded-2xl font-bold transition-all"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 px-6 py-4 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-bold shadow-lg shadow-red-500/20 transition-all flex items-center justify-center gap-2"
                  >
                    Confirmar Merma
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* New Batch Modal */}
        {newBatchModalOpen && (
           <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => { setNewBatchModalOpen(false); setEditingBatch(null); }} className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm" />
             <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-2xl bg-white dark:bg-neutral-900 rounded-[32px] p-10 shadow-2xl border border-neutral-200 dark:border-neutral-800">
               <button onClick={() => { setNewBatchModalOpen(false); setEditingBatch(null); }} className="absolute top-6 right-6 p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors" title="Cerrar modal" aria-label="Cerrar modal">
                 <X className="w-5 h-5 text-neutral-500" />
               </button>
               <h3 className="text-3xl font-black mb-8 flex items-center gap-3">
                 <Sprout className="w-8 h-8 text-primary-500" />
                 {editingBatch ? 'Editar Siembra' : 'Registrar Nueva Siembra'}
               </h3>
               <form onSubmit={handleNewBatchSubmit} className="space-y-6">
                  <div>
                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2 block">Nombre de la Planta</label>
                    <div className="relative">
                      <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                      <input required type="text" value={newBatchForm.plantName} onChange={e => setNewBatchForm({...newBatchForm, plantName: e.target.value})} className="w-full bg-neutral-50 dark:bg-neutral-800 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-primary-500" placeholder="Ej. Lechuga Romana" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label htmlFor="sowingDate" className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2 block">Germinación</label>
                      <div className="relative">
                        <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                        <input id="sowingDate" required type="date" value={newBatchForm.sowingDate} onChange={e => setNewBatchForm({...newBatchForm, sowingDate: e.target.value})} className="w-full bg-neutral-50 dark:bg-neutral-800 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-primary-500" title="Fecha de germinación" />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="transferDate" className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2 block">A NFT</label>
                      <div className="relative">
                        <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                        <input id="transferDate" required type="date" value={newBatchForm.transferDate} onChange={e => setNewBatchForm({...newBatchForm, transferDate: e.target.value})} className="w-full bg-neutral-50 dark:bg-neutral-800 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-primary-500" title="Fecha de transferencia a NFT" />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="estimatedHarvestDate" className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2 block">Cosecha Aprox.</label>
                      <div className="relative">
                        <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                        <input id="estimatedHarvestDate" required type="date" value={newBatchForm.estimatedHarvestDate} onChange={e => setNewBatchForm({...newBatchForm, estimatedHarvestDate: e.target.value})} className="w-full bg-neutral-50 dark:bg-neutral-800 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-primary-500" title="Fecha estimada de cosecha" />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="totalPlanted" className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2 block">Cantidad Sembrada</label>
                      <div className="relative">
                        <Target className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                        <input id="totalPlanted" required type="number" min="1" value={newBatchForm.totalPlanted} onChange={e => setNewBatchForm({...newBatchForm, totalPlanted: parseInt(e.target.value) || 0})} className="w-full bg-neutral-50 dark:bg-neutral-800 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-primary-500" title="Cantidad sembrada" />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="systemLocation" className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2 block">Ubicación / Cama</label>
                      <div className="relative">
                        <Sprout className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                        <input id="systemLocation" required type="text" value={newBatchForm.systemLocation} onChange={e => setNewBatchForm({...newBatchForm, systemLocation: e.target.value})} className="w-full bg-neutral-50 dark:bg-neutral-800 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-primary-500" placeholder="Ej. Cama 2" />
                      </div>
                    </div>
                  </div>
                  <div className="pt-6 flex gap-4">
                    <button type="button" onClick={() => { setNewBatchModalOpen(false); setEditingBatch(null); }} className="flex-1 px-8 py-4 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-2xl font-bold transition-all text-neutral-600 dark:text-neutral-300">Cancelar</button>
                    <button type="submit" className="flex-1 px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-bold shadow-xl shadow-primary-500/20 transition-all flex items-center justify-center gap-2">
                       {editingBatch ? 'Guardar Cambios' : 'Registrar Siembra'}
                    </button>
                  </div>
               </form>
             </motion.div>
           </div>
        )}

        {/* NFT System Beds Modal */}
        {nftModalOpen && (
           <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setNftModalOpen(false)} className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm" />
             <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-lg bg-white dark:bg-neutral-900 rounded-[32px] p-10 shadow-2xl border border-neutral-200 dark:border-neutral-800">
                <button onClick={() => setNftModalOpen(false)} className="absolute top-6 right-6 p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors" title="Cerrar modal" aria-label="Cerrar modal">
                  <X className="w-5 h-5 text-neutral-500" />
                </button>
                <div className="w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-900/50 text-blue-500 flex items-center justify-center mb-6">
                  <Droplets className="w-8 h-8" />
                </div>
                <h3 className="text-3xl font-black mb-2">Estado de Camas NFT</h3>
                <p className="text-neutral-500 font-medium mb-8">Resumen de la capacidad de tu sistema.</p>

                <div className="space-y-4">
                   <div className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl flex justify-between items-center border border-neutral-100 dark:border-neutral-700">
                      <span className="font-bold text-neutral-600 dark:text-neutral-300">Total de Camas (Instaladas)</span>
                      <div className="flex items-center gap-4">
                        <button onClick={() => updateBeds(-1)} className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-neutral-600 dark:text-neutral-300 hover:bg-neutral-300" title="Quitar cama" aria-label="Quitar cama"><Minus className="w-4 h-4" /></button>
                        <span className="text-2xl font-black">{totalBeds}</span>
                        <button onClick={() => updateBeds(1)} className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-neutral-600 dark:text-neutral-300 hover:bg-neutral-300" title="Añadir cama" aria-label="Añadir cama"><Plus className="w-4 h-4" /></button>
                      </div>
                   </div>
                   <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-2xl flex justify-between items-center border border-blue-100 dark:border-blue-900/30">
                      <span className="font-bold text-blue-600 dark:text-blue-400">Camas Activas (En uso)</span>
                      <span className="text-2xl font-black text-blue-500">{activeBedsCount}</span>
                   </div>
                   <div className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl flex justify-between items-center border border-neutral-100 dark:border-neutral-700">
                      <span className="font-bold text-neutral-500">Camas Inactivas / Disponibles</span>
                      <span className="text-2xl font-black text-neutral-400">{inactiveBedsCount}</span>
                   </div>
                </div>

                <div className="mt-8">
                  <button onClick={() => setNftModalOpen(false)} className="w-full px-6 py-4 bg-blue-100 hover:bg-blue-200 text-blue-600 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 dark:text-blue-400 rounded-2xl font-bold transition-all">
                     Cerrar
                  </button>
                </div>
             </motion.div>
           </div>
        )}

        {/* Global Harvest Alert Overlay */}
        {showHarvestAlert && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-emerald-600/90 backdrop-blur-xl">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, y: 50 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.8 }}
              className="relative w-full max-w-lg bg-white dark:bg-neutral-900 rounded-[40px] p-12 text-center shadow-2xl overflow-hidden"
            >
               <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 via-emerald-600 to-emerald-400" />
               
               <div className="w-24 h-24 mx-auto bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 rounded-[32px] flex items-center justify-center mb-8">
                 <Leaf className="w-12 h-12" />
               </div>
               
               <h2 className="text-4xl font-black mb-4 tracking-tight text-neutral-800 dark:text-neutral-100 italic">¡Ciclo de Cosecha Listo!</h2>
               <p className="text-lg text-neutral-500 mb-10 font-medium leading-relaxed">
                  Tus plantas en <strong className="text-emerald-600">{readyToHarvestBatch?.systemLocation}</strong> han alcanzado su máximo potencial. 
                  <br />
                  <span className="text-sm opacity-70 italic font-normal text-neutral-400 block mt-2">¿Preparado para recolectar el éxito de tu siembra?</span>
               </p>

               <button 
                  onClick={() => {
                    if (readyToHarvestBatch) {
                      setDismissedAlerts(prev => [...prev, (readyToHarvestBatch as any).id]);
                    }
                  }}
                  className="w-full px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-[24px] font-black text-lg transition-all shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-3 group"
               >
                 <span>Entendido, lo tengo</span>
                 <CheckCircle className="w-6 h-6 group-hover:scale-125 transition-transform" />
               </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
