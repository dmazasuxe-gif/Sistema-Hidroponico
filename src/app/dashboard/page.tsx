"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Sprout,
  TrendingUp,
  Check,
  Package,
  ClipboardList,
  ArrowUpRight,
  TrendingDown,
  BarChart3,
  QrCode,
  X
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

interface DashboardTask {
  name: string;
  completed: boolean;
}

interface HarvestData {
  name: string;
  sanas: number;
  mermas: number;
}

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [netProfit, setNetProfit] = useState(0);
  const [dailyTasks, setDailyTasks] = useState<DashboardTask[]>([]);
  const [harvestHistory, setHarvestHistory] = useState<HarvestData[]>([]);

  // QR Payment States
  const [yapeQr, setYapeQr] = useState<string | null>(null);
  const [plinQr, setPlinQr] = useState<string | null>(null);
  const [activeQr, setActiveQr] = useState<'yape' | 'plin' | null>(null);

  useEffect(() => {
    setMounted(true);

    // Load Tasks
    const savedTasks = localStorage.getItem('dailyTasks');
    if (savedTasks) {
      setDailyTasks(JSON.parse(savedTasks));
    }

    // Load QRs
    setYapeQr(localStorage.getItem('yapeQr'));
    setPlinQr(localStorage.getItem('plinQr'));

    // Load Financials
    const savedSales = localStorage.getItem('sales');
    const salesArr = savedSales ? JSON.parse(savedSales) : [];
    const totalS = salesArr.reduce((acc: number, curr: any) => acc + (curr.total || 0), 0);
    setTotalSales(totalS);

    const savedExpenses = localStorage.getItem('expenses');
    const expensesArr = savedExpenses ? JSON.parse(savedExpenses) : [];
    const totalE = expensesArr.reduce((acc: number, curr: any) => acc + (curr.amount || 0), 0);
    setTotalExpenses(totalE);

    setNetProfit(totalS - totalE);

    // Load Harvest Data for the chart
    const savedBatches = localStorage.getItem('lettuce_batches');
    if (savedBatches) {
      const batches = JSON.parse(savedBatches);
      const harvested = batches.filter((b: any) => b.status === 'Cosechado');

      const chartData = harvested.map((b: any) => ({
        name: b.plantName.length > 10 ? b.plantName.substring(0, 10) + '...' : b.plantName,
        sanas: b.goodCondition,
        mermas: b.badCondition
      }));

      setHarvestHistory(chartData);
    }
  }, []);

  const totalHealthyHarv = harvestHistory.reduce((acc, curr) => acc + curr.sanas, 0);
  const totalMermaHarv = harvestHistory.reduce((acc, curr) => acc + curr.mermas, 0);
  const successRate = totalHealthyHarv + totalMermaHarv > 0
    ? ((totalHealthyHarv / (totalHealthyHarv + totalMermaHarv)) * 100).toFixed(1)
    : '0';

  const toggleTask = (index: number) => {
    const newTasks = [...dailyTasks];
    newTasks[index].completed = !newTasks[index].completed;
    setDailyTasks(newTasks);
    localStorage.setItem('dailyTasks', JSON.stringify(newTasks));
  };

  if (!mounted) return null;

  const statsCards = [
    {
      title: 'Inversión Total',
      value: `S/. ${totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      icon: Package,
      color: 'text-orange-500',
      bg: 'bg-orange-50 dark:bg-orange-500/10'
    },
    {
      title: 'Ventas Totales',
      value: `S/. ${totalSales.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      icon: TrendingUp,
      color: 'text-green-500',
      bg: 'bg-green-50 dark:bg-green-500/10'
    },
    {
      title: 'Beneficio Neto',
      value: `S/. ${netProfit.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      icon: Check,
      color: 'text-blue-500',
      bg: 'bg-blue-50 dark:bg-blue-500/10'
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight">Vivero Inteligente</h1>
          <p className="text-neutral-500 mt-2 font-medium">Control unificado de producción y finanzas.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white/50 dark:bg-neutral-900/50 backdrop-blur-xl p-2 rounded-[24px] border border-neutral-200 dark:border-neutral-800 flex items-center gap-2 shadow-sm">
            <span className="text-[10px] font-black uppercase text-neutral-400 px-3 tracking-widest">Pagos Rápidos:</span>
            <button
              onClick={() => setActiveQr('yape')}
              className="px-4 py-2 bg-[#6b21a8] text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-purple-500/30 hover:scale-105 transition-all"
            >
              Yape
            </button>
            <button
              onClick={() => setActiveQr('plin')}
              className="px-4 py-2 bg-[#0ea5e9] text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/30 hover:scale-105 transition-all"
            >
              Plin
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statsCards.map((card, i) => (
          <div key={i} className="p-8 rounded-[48px] bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm transition-all hover:shadow-xl group">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-4 rounded-[24px] ${card.bg} ${card.color} transition-transform group-hover:scale-110`}>
                <card.icon className="w-6 h-6" />
              </div>
              <BarChart3 className="w-5 h-5 text-neutral-200 dark:text-neutral-800" />
            </div>
            <p className="text-xs font-black uppercase text-neutral-400 tracking-widest mb-1">{card.title}</p>
            <h3 className="text-3xl font-black text-neutral-900 dark:text-white">{card.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 p-10 rounded-[56px] bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-black flex items-center gap-2 font-black">
                  <TrendingUp className="w-6 h-6 text-primary-500" />
                  Rendimiento de Cosecha
                </h3>
                <p className="text-sm text-neutral-500 mt-1">Comparativa histórica de plantas sanas vs mermas por lote.</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-primary-600 tracking-tight">{successRate}%</p>
                <p className="text-[10px] font-black uppercase text-neutral-400 tracking-widest">Éxito General</p>
              </div>
            </div>

            <div className="h-[350px] w-full mt-6">
              {harvestHistory.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={harvestHistory}>
                    <defs>
                      <linearGradient id="colorSanas" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorMermas" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb33" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#888', fontSize: 10, fontWeight: 'bold' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#888', fontSize: 10 }} />
                    <Tooltip
                      contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.5)', background: '#171717', color: '#fff' }}
                      itemStyle={{ fontWeight: 'bold' }}
                    />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontWeight: 'bold', fontSize: '12px' }} />
                    <Area
                      type="monotone"
                      dataKey="sanas"
                      stroke="#10b981"
                      strokeWidth={4}
                      fillOpacity={1}
                      fill="url(#colorSanas)"
                      name="Plantas Sanas"
                    />
                    <Area
                      type="monotone"
                      dataKey="mermas"
                      stroke="#ef4444"
                      strokeWidth={4}
                      fillOpacity={1}
                      fill="url(#colorMermas)"
                      name="Mermas/Pérdidas"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center bg-neutral-50 dark:bg-neutral-800/20 rounded-[32px] border-2 border-dashed border-neutral-200 dark:border-neutral-800 p-8 text-center">
                  <Sprout className="w-12 h-12 text-neutral-300 mb-4" />
                  <h4 className="font-black text-neutral-400">Sin datos de cosecha</h4>
                  <p className="text-xs text-neutral-400 mt-1 max-w-[200px]">Cosecha tu primer lote para ver las estadísticas de rendimiento aquí.</p>
                </div>
              )}
            </div>

            {harvestHistory.length > 0 && (
              <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-neutral-100 dark:border-neutral-800">
                <div className="p-4 bg-green-50 dark:bg-green-500/10 rounded-2xl">
                  <p className="text-[10px] font-black uppercase text-green-600 tracking-widest">Total Sanas</p>
                  <p className="text-2xl font-black">{totalHealthyHarv}</p>
                </div>
                <div className="p-4 bg-red-50 dark:bg-red-500/10 rounded-2xl">
                  <p className="text-[10px] font-black uppercase text-red-600 tracking-widest">Total Mermas</p>
                  <p className="text-2xl font-black">{totalMermaHarv}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-8">
          <div className="p-8 rounded-[40px] bg-neutral-900 border border-neutral-800 text-white shadow-2xl">
            <h3 className="text-xl font-black mb-6 flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-primary-400" />
              Agenda de Hoy
            </h3>
            <div className="space-y-5">
              {dailyTasks.map((task, i) => (
                <div key={i} onClick={() => toggleTask(i)} className="flex items-center space-x-3 group cursor-pointer group">
                  <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${task.completed ? 'bg-primary-500 border-primary-500' : 'border-neutral-700 group-hover:border-primary-500'}`}>
                    {task.completed && <Check className="w-4 h-4 text-white" />}
                  </div>
                  <span className={`text-sm font-bold transition-all ${task.completed ? 'text-neutral-500 line-through' : 'text-neutral-200'}`}>
                    {task.name}
                  </span>
                </div>
              ))}
              {dailyTasks.length === 0 && (
                <p className="text-sm text-neutral-500 italic">Sin pendientes para hoy.</p>
              )}
            </div>
            <Link href="/dashboard/lettuces" className="block pt-10">
              <button className="w-full py-4 bg-white/10 hover:bg-white/20 dark:bg-white/5 rounded-2xl font-black text-xs transition-all flex items-center justify-center gap-2 border border-white/10">
                Sistemas Activos
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* QR MODAL */}
      <AnimatePresence>
        {activeQr && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveQr(null)}
              className="absolute inset-0 bg-neutral-900/90 backdrop-blur-xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              className="relative w-full max-w-sm bg-white dark:bg-neutral-900 rounded-[56px] p-10 shadow-2xl overflow-hidden border border-white/10"
            >
              <div className="flex justify-between items-center mb-8">
                <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-white ${activeQr === 'yape' ? 'bg-[#6b21a8]' : 'bg-[#0ea5e9]'}`}>
                  QR {activeQr}
                </div>
                <button onClick={() => setActiveQr(null)} className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-all">
                  <X className="w-5 h-5 text-neutral-400" />
                </button>
              </div>

              <div className="aspect-square bg-neutral-50 dark:bg-neutral-800/50 rounded-[40px] flex items-center justify-center overflow-hidden border border-neutral-100 dark:border-neutral-800 shadow-inner">
                {(activeQr === 'yape' ? yapeQr : plinQr) ? (
                  <img src={activeQr === 'yape' ? yapeQr! : plinQr!} alt={`QR ${activeQr}`} className="w-full h-full object-contain p-4" />
                ) : (
                  <div className="text-center p-8">
                    <QrCode className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                    <p className="text-xs font-bold text-neutral-400">No se ha subido el QR de {activeQr} en el menú Empresa.</p>
                  </div>
                )}
              </div>

              <div className="mt-8 text-center pt-4 border-t border-neutral-100 dark:border-neutral-800">
                <p className="text-xs font-black text-neutral-400 tracking-widest uppercase">Escanear para pago</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
