"use client";

import React, { useState, useEffect } from 'react';
import {
   Zap,
   Clock,
   Activity,
   Plus,
   Trash2,
   CheckCircle,
   TrendingUp,
   Droplets,
   Thermometer,
   Compass,
   Gauge,
   ArrowRight,
   Info,
   Calendar,
   FlaskConical,
   Beaker,
   ShieldCheck,
   Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
   BarChart,
   Bar,
   XAxis,
   YAxis,
   CartesianGrid,
   Tooltip,
   ResponsiveContainer,
   Cell
} from 'recharts';

interface PumpCycle {
   onTime: string;
   offTime: string;
}

interface AutomationSnapshot {
   id: string;
   date: string;
   time: string;
   cycles: PumpCycle[];
   ph: number;
   ec: number;
   tds: number;
   temp: number;
   nutrients: string;
}

export default function AutomationPage() {
   const [snapshots, setSnapshots] = useState<AutomationSnapshot[]>([]);
   const [currentCycles, setCurrentCycles] = useState<PumpCycle[]>([]);

   // Modals and UI State
   const [showCycleModal, setShowCycleModal] = useState(false);
   const [showSnapshotModal, setShowSnapshotModal] = useState(false);
   const [selectedPattern, setSelectedPattern] = useState<string | null>(null);

   const [cycleForm, setCycleForm] = useState({ onTime: '06:00', offTime: '07:00' });
   const [waterForm, setWaterForm] = useState({
      ph: '' as any, ec: '' as any, tds: '' as any, temp: '' as any, nutrients: ''
   });

   useEffect(() => {
      const savedSnapshots = localStorage.getItem('automation_snapshots');
      if (savedSnapshots) setSnapshots(JSON.parse(savedSnapshots));

      const savedCurrentCycles = localStorage.getItem('current_pump_cycles');
      if (savedCurrentCycles) setCurrentCycles(JSON.parse(savedCurrentCycles));
   }, []);

   const saveSnapshots = (newSnapshots: AutomationSnapshot[]) => {
      setSnapshots(newSnapshots);
      localStorage.setItem('automation_snapshots', JSON.stringify(newSnapshots));
   };

   const saveCurrentCycles = (newCycles: PumpCycle[]) => {
      setCurrentCycles(newCycles);
      localStorage.setItem('current_pump_cycles', JSON.stringify(newCycles));
   };

   const handleAddCycle = (e: React.FormEvent) => {
      e.preventDefault();
      saveCurrentCycles([...currentCycles, { ...cycleForm }]);
      setShowCycleModal(false);
   };

   const handleAddSnapshot = (e: React.FormEvent) => {
      e.preventDefault();
      if (currentCycles.length === 0) {
         alert("Define al menos un ciclo para registrar mediciones.");
         return;
      }
      const newSnapshot: AutomationSnapshot = {
         id: Math.random().toString(36).substr(2, 9),
         date: new Date().toISOString().split('T')[0],
         time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
         cycles: [...currentCycles],
         ...waterForm
      };
      saveSnapshots([newSnapshot, ...snapshots]);
      setShowSnapshotModal(false);
      setWaterForm({ ph: '', ec: '', tds: '', temp: '', nutrients: '' });
   };

   const deleteCycle = (index: number) => {
      const nc = currentCycles.filter((_, i) => i !== index);
      saveCurrentCycles(nc);
   };

   const deleteSnapshot = (id: string) => saveSnapshots(snapshots.filter(s => s.id !== id));

   // Pattern Analysis: Group snapshots by "Cycle Signature"
   const getSignature = (cycles: PumpCycle[]) =>
      cycles.map(c => `${c.onTime}-${c.offTime}`).sort().join(' | ');

   const groupedPatterns = snapshots.reduce((acc: any, curr) => {
      const signature = getSignature(curr.cycles);
      if (!acc[signature]) {
         acc[signature] = {
            signature,
            count: 0,
            avgPh: 0,
            avgEc: 0,
            avgTds: 0,
            avgTemp: 0,
            nutrients: new Set(),
            items: []
         };
      }
      acc[signature].count += 1;
      acc[signature].avgPh += curr.ph;
      acc[signature].avgEc += curr.ec;
      acc[signature].avgTds += curr.tds;
      acc[signature].avgTemp += curr.temp;
      acc[signature].nutrients.add(curr.nutrients);
      acc[signature].items.push(curr);
      return acc;
   }, {});

   const patterns = Object.values(groupedPatterns).map((p: any) => ({
      ...p,
      avgPh: (p.avgPh / p.count).toFixed(1),
      avgEc: (p.avgEc / p.count).toFixed(2),
      avgTds: Math.round(p.avgTds / p.count),
      avgTemp: (p.avgTemp / p.count).toFixed(1)
   })).sort((a: any, b: any) => b.count - a.count);

   const bestPattern = patterns[0] as any;
   const drillDown = selectedPattern ? patterns.find((p: any) => p.signature === selectedPattern) : null;

   // Stability Scoring: Check if parameters are in range
   const isStable = (s: AutomationSnapshot) => {
      const isPhOk = s.ph >= 5.5 && s.ph <= 6.5;
      const isEcOk = s.ec >= 1.2 && s.ec <= 2.5;
      return isPhOk && isEcOk;
   };

   return (
      <div className="space-y-8 max-w-6xl mx-auto pb-20">
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
               <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
                  <FlaskConical className="w-10 h-10 text-primary-500" />
                  Laboratorio de Automatización
               </h1>
               <p className="text-neutral-500 mt-2">Control químico y experimental de ciclos hidropónicos.</p>
            </div>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Step 1: Current Configuration */}
            <div className="p-8 rounded-[40px] bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-6">
               <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-black flex items-center gap-2">
                     <Clock className="w-5 h-5 text-blue-500" />
                     Ciclo Actual
                  </h3>
                  <button onClick={() => setShowCycleModal(true)} className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl hover:bg-blue-100 transition-all font-black text-[10px] uppercase">
                     + Ciclo
                  </button>
               </div>

               <div className="space-y-3">
                  {currentCycles.map((cycle, i) => (
                     <div key={i} className="p-4 rounded-3xl bg-neutral-50 dark:bg-neutral-800/50 flex items-center justify-between border border-neutral-100 dark:border-neutral-800 group">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-xl bg-blue-500 text-white flex items-center justify-center font-black text-[10px]">
                              {i + 1}
                           </div>
                           <p className="text-sm font-bold font-mono">{cycle.onTime} - {cycle.offTime}</p>
                        </div>
                        <button onClick={() => deleteCycle(i)} title="Eliminar ciclo" className="p-2 text-neutral-300 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100">
                           <Trash2 className="w-4 h-4" />
                        </button>
                     </div>
                  ))}
                  {currentCycles.length === 0 && <p className="text-center text-xs text-neutral-400 italic py-8">Define los ciclos para iniciar.</p>}
               </div>

               {currentCycles.length > 0 && (
                  <button onClick={() => setShowSnapshotModal(true)} className="w-full py-5 bg-primary-600 hover:bg-primary-700 text-white rounded-3xl font-black shadow-xl shadow-primary-500/20 flex items-center justify-center gap-2 transition-all">
                     <Beaker className="w-5 h-5" /> Iniciar Medición
                  </button>
               )}
            </div>

            {/* Analytics Hub */}
            <div className="lg:col-span-3 p-10 rounded-[56px] bg-neutral-900 text-white shadow-2xl space-y-8 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-12 opacity-5">
                  <TrendingUp className="w-64 h-64" />
               </div>

               <div className="flex items-center justify-between relative z-10">
                  <div>
                     <h3 className="text-2xl font-black flex items-center gap-2">
                        <ShieldCheck className="w-6 h-6 text-primary-400" />
                        Firmas de Producción Estables
                     </h3>
                     <p className="text-neutral-400 text-sm mt-1">Comparando configuraciones de bomba con éxito químico.</p>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
                  {patterns.map((pattern, idx) => (
                     <motion.div
                        key={pattern.signature}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => setSelectedPattern(pattern.signature)}
                        className={`cursor-pointer p-6 rounded-[34px] border transition-all ${idx === 0 ? 'bg-primary-500/10 border-primary-500/30' : 'bg-white/5 border-white/10'}`}
                     >
                        <div className="flex justify-between items-start mb-4">
                           <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full">
                              <Activity className="w-3 h-3 text-orange-400" />
                              <span className="text-[10px] font-black uppercase text-neutral-300">{pattern.count} Registros</span>
                           </div>
                           {idx === 0 && <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />}
                        </div>

                        <h4 className="text-sm font-mono font-bold truncate mb-6 text-neutral-400 border-b border-white/5 pb-2">
                           {pattern.signature}
                        </h4>

                        <div className="grid grid-cols-2 gap-3">
                           <div className="p-3 bg-black/30 rounded-2xl">
                              <p className="text-[10px] text-neutral-500 font-black uppercase">pH Prom</p>
                              <p className="text-xl font-black text-green-400 font-mono">{pattern.avgPh}</p>
                           </div>
                           <div className="p-3 bg-black/30 rounded-2xl">
                              <p className="text-[10px] text-neutral-500 font-black uppercase">EC Prom</p>
                              <p className="text-xl font-black text-blue-400 font-mono">{pattern.avgEc}</p>
                           </div>
                        </div>
                     </motion.div>
                  ))}
                  {patterns.length === 0 && (
                     <div className="col-span-full py-16 text-center border-2 border-dashed border-white/10 rounded-[34px] text-neutral-600 font-black italic">
                        La inteligencia del sistema aparecerá cuando inicies tus registros de laboratorio.
                     </div>
                  )}
               </div>
            </div>
         </div>

         {/* Bitácora Química Profesional */}
         <div className="p-10 rounded-[56px] bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-8">
            <div className="flex items-center justify-between">
               <div>
                  <h3 className="text-3xl font-black flex items-center gap-2">
                     <FlaskConical className="w-8 h-8 text-primary-500" />
                     Bitácora de Mediciones Completas
                  </h3>
                  <p className="text-neutral-500 mt-1">Registro cronológico de alta fidelidad para control de variables.</p>
               </div>
            </div>

            <div className="space-y-4">
               <div className="hidden lg:grid grid-cols-8 gap-4 px-8 py-4 bg-neutral-100 dark:bg-neutral-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-neutral-400">
                  <div className="col-span-1 text-center">Fecha / Hora</div>
                  <div className="col-span-2">Firma de Ciclos</div>
                  <div className="text-center">pH</div>
                  <div className="text-center">EC (mS)</div>
                  <div className="text-center">TDS (ppm)</div>
                  <div className="text-center">Temp</div>
                  <div className="text-center">Estado</div>
               </div>

               <AnimatePresence>
                  {snapshots.map(s => {
                     const stable = isStable(s);
                     return (
                        <motion.div
                           key={s.id}
                           initial={{ opacity: 0, x: -20 }}
                           animate={{ opacity: 1, x: 0 }}
                           className="grid grid-cols-1 lg:grid-cols-8 gap-4 px-8 py-6 bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-[32px] items-center hover:shadow-xl transition-all group"
                        >
                           <div className="col-span-1 text-center lg:text-left">
                              <p className="text-xs font-black">{s.date}</p>
                              <p className="text-[10px] font-bold text-neutral-400">{s.time}</p>
                           </div>
                           <div className="col-span-1 lg:col-span-2 flex items-center gap-3">
                              <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-900/10 text-blue-500 flex items-center justify-center">
                                 <Zap className="w-4 h-4" />
                              </div>
                              <p className="text-xs font-mono font-bold truncate text-neutral-500">{getSignature(s.cycles)}</p>
                           </div>
                           <div className="text-center">
                              <span className={`text-lg font-black font-mono ${s.ph >= 5.5 && s.ph <= 6.5 ? 'text-green-500' : 'text-orange-500'}`}>{s.ph.toFixed(1)}</span>
                           </div>
                           <div className="text-center">
                              <span className="text-lg font-black font-mono text-blue-500">{s.ec.toFixed(2)}</span>
                           </div>
                           <div className="text-center">
                              <span className="text-lg font-black font-mono text-neutral-700 dark:text-neutral-200">{s.tds}</span>
                           </div>
                           <div className="text-center">
                              <span className="text-lg font-black font-mono text-red-500">{s.temp}°</span>
                           </div>
                           <div className="flex flex-col items-center justify-center">
                              {stable ? (
                                 <div className="flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-500/10 text-green-600 rounded-full">
                                    <ShieldCheck className="w-4 h-4" />
                                    <span className="text-[10px] font-black uppercase">Excelente</span>
                                 </div>
                              ) : (
                                 <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 dark:bg-orange-500/10 text-orange-600 rounded-full">
                                    <Info className="w-4 h-4" />
                                    <span className="text-[10px] font-black uppercase">Ajustable</span>
                                 </div>
                              )}
                              <button onClick={() => deleteSnapshot(s.id)} title="Borrar registro" className="mt-2 text-neutral-300 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100">
                                 <Trash2 className="w-3.5 h-3.5" />
                              </button>
                           </div>
                        </motion.div>
                     );
                  })}
               </AnimatePresence>
               {snapshots.length === 0 && (
                  <div className="py-24 text-center border-2 border-dashed border-neutral-100 dark:border-neutral-800 rounded-[40px] text-neutral-400 font-bold italic">
                     No hay datos en la bitácora química. Inicia una medición para ver los registros aquí.
                  </div>
               )}
            </div>
         </div>

         {/* Drill-down Pattern Detail */}
         <AnimatePresence>
            {drillDown && (
               <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedPattern(null)} className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm" />
                  <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative bg-white dark:bg-neutral-900 rounded-[56px] p-12 w-full max-w-4xl shadow-2xl overflow-hidden border border-primary-500/20">
                     <button onClick={() => setSelectedPattern(null)} title="Cerrar detalle" className="absolute top-10 right-10 p-4 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-all">
                        <Trash2 className="w-6 h-6 text-neutral-400" />
                     </button>

                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div className="space-y-8">
                           <div>
                              <h3 className="text-4xl font-black text-primary-600 italic">Resumen Químico</h3>
                              <p className="text-neutral-500 mt-2 font-mono text-sm">{drillDown.signature}</p>
                           </div>

                           <div className="grid grid-cols-2 gap-4">
                              <div className="p-6 bg-green-50 dark:bg-green-500/5 rounded-[32px] border border-green-100 dark:border-green-500/20">
                                 <Compass className="w-6 h-6 text-green-500 mb-2" />
                                 <p className="text-xs font-black uppercase text-neutral-400">pH Óptimo</p>
                                 <p className="text-4xl font-black font-mono">{drillDown.avgPh}</p>
                              </div>
                              <div className="p-6 bg-blue-50 dark:bg-blue-500/5 rounded-[32px] border border-blue-100 dark:border-blue-500/20">
                                 <Activity className="w-6 h-6 text-blue-500 mb-2" />
                                 <p className="text-xs font-black uppercase text-neutral-400">EC Estable</p>
                                 <p className="text-4xl font-black font-mono">{drillDown.avgEc}</p>
                              </div>
                           </div>

                           <div className="p-8 bg-neutral-900 text-white rounded-[40px] shadow-xl relative overflow-hidden">
                              <div className="absolute top-0 right-0 p-8 opacity-10">
                                 <TrendingUp className="w-20 h-20" />
                              </div>
                              <h4 className="font-black text-lg mb-4">Conclusión Técnica</h4>
                              <p className="text-sm text-neutral-400 leading-relaxed italic">
                                 Esta firma de ciclos es la que ha demostrado mayor estabilidad en tu cultivo. Con {drillDown.count} registros exitosos, se recomienda mantener este patrón para maximizar el crecimiento de tus vegetales.
                              </p>
                           </div>
                        </div>

                        <div className="space-y-6">
                           <h4 className="text-xl font-black flex items-center gap-2">
                              <Calendar className="w-5 h-5 text-neutral-400" />
                              Historial de Mediciones
                           </h4>
                           <div className="space-y-3 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
                              {drillDown.items.map((item: any) => (
                                 <div key={item.id} className="p-5 rounded-3xl bg-neutral-50 dark:bg-neutral-800/30 border border-neutral-100 dark:border-neutral-800 flex justify-between items-center group">
                                    <div>
                                       <p className="text-xs font-black">{item.date} • {item.time}</p>
                                       <p className="text-[10px] text-neutral-400 uppercase font-bold mt-1">{item.nutrients}</p>
                                    </div>
                                    <div className="text-right">
                                       <p className="text-sm font-black text-primary-500 font-mono">pH {item.ph.toFixed(1)}</p>
                                       <p className="text-[10px] font-bold text-neutral-400 font-mono">{item.ec.toFixed(2)} EC</p>
                                    </div>
                                 </div>
                              ))}
                           </div>
                        </div>
                     </div>
                  </motion.div>
               </div>
            )}
         </AnimatePresence>

         {/* Forms (Modals) */}
         <AnimatePresence>
            {showCycleModal && (
               <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowCycleModal(false)} className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm" />
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-white dark:bg-neutral-900 rounded-[40px] p-10 w-full max-w-sm shadow-2xl">
                     <h4 className="text-2xl font-black mb-8">Programar Bomba</h4>
                     <form onSubmit={handleAddCycle} className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                           <div>
                              <label className="text-[10px] font-black uppercase text-neutral-500 mb-2 block">Encendido</label>
                              <input type="time" value={cycleForm.onTime} onChange={e => setCycleForm({ ...cycleForm, onTime: e.target.value })} className="w-full bg-neutral-50 dark:bg-neutral-800 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-mono font-bold" />
                           </div>
                           <div>
                              <label className="text-[10px] font-black uppercase text-neutral-500 mb-2 block">Apagado</label>
                              <input type="time" value={cycleForm.offTime} onChange={e => setCycleForm({ ...cycleForm, offTime: e.target.value })} className="w-full bg-neutral-50 dark:bg-neutral-800 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-mono font-bold" />
                           </div>
                        </div>
                        <button type="submit" className="w-full py-5 bg-blue-600 text-white rounded-[24px] font-black shadow-xl shadow-blue-500/20">Registrar Ciclo</button>
                     </form>
                  </motion.div>
               </div>
            )}

            {showSnapshotModal && (
               <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowSnapshotModal(false)} className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm" />
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-white dark:bg-neutral-900 rounded-[48px] p-12 w-full max-w-2xl shadow-2xl">
                     <div className="flex items-center gap-4 mb-2">
                        <div className="w-12 h-12 rounded-2xl bg-primary-100 dark:bg-primary-900/20 text-primary-500 flex items-center justify-center">
                           <Beaker className="w-6 h-6" />
                        </div>
                        <h3 className="text-3xl font-black">Registro Químico</h3>
                     </div>
                     <p className="text-neutral-500 mb-10 text-sm">Esta medición se vinculará a la firma de ciclos actual.</p>
                     <form onSubmit={handleAddSnapshot} className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                           <input required type="number" step="0.1" value={waterForm.ph} onChange={e => setWaterForm({ ...waterForm, ph: parseFloat(e.target.value) })} className="bg-neutral-50 dark:bg-neutral-800 p-5 rounded-3xl outline-none focus:ring-2 focus:ring-primary-500 font-mono" placeholder="pH (ej. 6.0)" title="pH" />
                           <input required type="number" step="0.01" value={waterForm.ec} onChange={e => setWaterForm({ ...waterForm, ec: parseFloat(e.target.value) })} className="bg-neutral-50 dark:bg-neutral-800 p-5 rounded-3xl outline-none focus:ring-2 focus:ring-primary-500 font-mono" placeholder="EC (ej. 1.80)" title="EC" />
                           <input required type="number" value={waterForm.tds} onChange={e => setWaterForm({ ...waterForm, tds: parseInt(e.target.value) })} className="bg-neutral-50 dark:bg-neutral-800 p-5 rounded-3xl outline-none focus:ring-2 focus:ring-primary-500 font-mono" placeholder="TDS (ppm)" title="TDS" />
                           <input required type="number" step="0.1" value={waterForm.temp} onChange={e => setWaterForm({ ...waterForm, temp: parseFloat(e.target.value) })} className="bg-neutral-50 dark:bg-neutral-800 p-5 rounded-3xl outline-none focus:ring-2 focus:ring-primary-500 font-mono" placeholder="Temp (°C)" title="Temp" />
                        </div>
                        <input type="text" value={waterForm.nutrients} onChange={e => setWaterForm({ ...waterForm, nutrients: e.target.value })} className="w-full bg-neutral-50 dark:bg-neutral-800 p-5 rounded-3xl outline-none focus:ring-2 focus:ring-primary-500" placeholder="Nutrientes / Mezcla aplicada..." title="Nutrientes" />
                        <div className="pt-6 flex gap-4">
                           <button type="button" onClick={() => setShowSnapshotModal(false)} className="flex-1 py-5 bg-neutral-100 dark:bg-neutral-800 rounded-[28px] font-bold">Cancelar</button>
                           <button type="submit" className="flex-1 py-5 bg-primary-600 text-white rounded-[28px] font-black shadow-2xl shadow-primary-500/20">Sincronizar y Sellar</button>
                        </div>
                     </form>
                  </motion.div>
               </div>
            )}
         </AnimatePresence>
      </div>
   );
}
