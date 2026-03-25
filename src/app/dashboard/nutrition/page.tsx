"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Leaf, Droplets, ArrowRight, Settings, Beaker } from 'lucide-react';

const INITIAL_DOSES = [
  { id: '1', name: 'Nitrato de Calcio', dose: 1.5, color: 'bg-white' },
  { id: '2', name: 'Sulfato de Magnesio', dose: 0.5, color: 'bg-green-400' },
  { id: '3', name: 'Nitrato de Potasio', dose: 1.0, color: 'bg-red-400' },
  { id: '4', name: 'Fosfato Monopotásico', dose: 0.3, color: 'bg-blue-400' },
  { id: '5', name: 'Micronutrientes', dose: 0.1, color: 'bg-purple-400' },
];

export default function NutritionPage() {
  const [liters, setLiters] = useState<number>(1000);
  const [plantsCount, setPlantsCount] = useState<number>(800);
  const [doses, setDoses] = useState(INITIAL_DOSES);

  const handleLitersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = parseInt(e.target.value);
    if (isNaN(val)) val = 0;
    setLiters(val);
  };

  const handleDoseChange = (id: string, newDose: number) => {
    setDoses(doses.map(d => d.id === id ? { ...d, dose: newDose } : d));
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 font-sans">
      
      {/* Encabezado Corporativo Premium 4K */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="relative overflow-hidden rounded-[40px] bg-gradient-to-br from-neutral-900 to-black border border-neutral-800 shadow-2xl p-10 flex flex-col md:flex-row items-center justify-between gap-10"
      >
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none" />
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent" />
        <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent" />

        <div className="relative z-10 flex flex-col items-center md:items-start text-center md:text-left">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-4 bg-green-500/10 backdrop-blur-xl rounded-3xl border border-green-500/20 shadow-[0_0_50px_rgba(34,197,94,0.15)]">
              <Beaker className="w-10 h-10 text-green-400" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-neutral-500 tracking-tighter">Panel Central</h1>
              <h2 className="text-emerald-400 font-bold uppercase tracking-[0.4em] text-xs mt-1">Calculadora de Mezclas</h2>
            </div>
          </div>
          <p className="text-neutral-400 max-w-lg font-medium text-sm leading-relaxed">Laboratorio de dosificación avanzada. Controla con precisión micrométrica la solución nutritiva de tu cultivo para un rendimiento óptimo.</p>
        </div>

        {/* Logo de la Lechuga Realista */}
        <div className="relative z-10 w-40 h-40 shrink-0 filter drop-shadow-[0_20px_50px_rgba(34,197,94,0.4)] transition-transform hover:scale-105 duration-700 cursor-pointer">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="/logo-jepelacio.png" 
            alt="HidroJepe Logo"
            className="w-full h-full object-contain drop-shadow-2xl" 
          />
        </div>
      </motion.div>

      {/* Grid Principal Bento */}
      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* Columna Izquierda: Tanque 3D y Plantas */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-5 flex flex-col gap-8"
        >
          {/* Tanque Cilíndrico Realista 3D */}
          <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-[40px] p-10 flex flex-col items-center justify-center relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />
            
            <h3 className="font-black text-lg text-neutral-800 dark:text-white uppercase tracking-widest mb-10 relative z-10 text-center">Tanque de Solución</h3>
            
            {/* Construcción del Tanque 3D */}
            <div className="relative w-56 h-[320px] mx-auto z-10 perspective-[1000px] drop-shadow-[0_40px_40px_rgba(6,182,212,0.2)]">
              {/* Cilindro Base */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-950 via-cyan-700 to-blue-950 rounded-[100px/25px] shadow-2xl overflow-hidden border border-cyan-400/20">
                {/* Nivel de Agua Animado */}
                <motion.div 
                  initial={{ height: "0%" }}
                  animate={{ height: "65%" }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                  className="absolute bottom-0 w-full bg-gradient-to-t from-blue-600 via-cyan-400 to-cyan-300 opacity-90"
                >
                  <div className="absolute top-0 inset-x-0 h-1 bg-white/40 blur-sm" />
                </motion.div>

                {/* Brillo de Cristal */}
                <div className="absolute inset-y-0 left-[15%] w-12 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-10deg] opacity-50" />
                <div className="absolute inset-y-0 right-[15%] w-8 bg-gradient-to-r from-transparent via-black/40 to-transparent skew-x-[-10deg] opacity-30" />
              </div>
              
              {/* Tapa Superior 3D */}
              <div className="absolute top-[-15px] w-full h-[30px] bg-gradient-to-b from-cyan-300 to-cyan-600 rounded-[50%] border-t border-white/60 shadow-[inset_0_-5px_15px_rgba(0,0,0,0.4)] z-20" />
              
              {/* Base Inferior 3D */}
              <div className="absolute bottom-[-15px] w-full h-[30px] bg-gradient-to-b from-blue-900 to-black rounded-[50%] shadow-[0_20px_30px_rgba(0,0,0,0.8)] z-0" />

              {/* Holograma de Datos Central del Tanque */}
              <div className="absolute inset-0 flex flex-col items-center justify-center z-30 pointer-events-auto mt-4">
                <div className="bg-black/50 backdrop-blur-xl border border-cyan-400/30 p-5 rounded-3xl shadow-[0_0_40px_rgba(34,211,238,0.4)] transition-all hover:border-cyan-400">
                  <label className="text-cyan-200 font-black uppercase tracking-[0.3em] text-[9px] mb-2 block text-center drop-shadow-md">Litros Reales</label>
                  <div className="flex items-center gap-1 border-b-2 border-cyan-400 pb-1">
                    <input 
                      type="number" 
                      value={liters || ""} 
                      onChange={handleLitersChange}
                      className="bg-transparent text-white font-black text-4xl text-center w-24 outline-none placeholder-neutral-600 focus:scale-105 transition-transform"
                      placeholder="0"
                    />
                    <span className="text-cyan-400 font-black text-xl">L</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="w-full flex items-center justify-between text-[10px] text-neutral-500 font-bold uppercase tracking-widest mt-12 px-6">
              <span>Capacidad Mín</span>
              <span>100% Llenado</span>
            </div>
          </div>

          {/* Indicador de Plantas (Widget) */}
          <div className="bg-emerald-500 text-white rounded-[32px] p-8 flex items-center justify-between shadow-[0_20px_50px_rgba(16,185,129,0.3)] relative overflow-hidden group hover:scale-[1.02] transition-transform duration-500">
            <div className="absolute -right-10 -top-10 text-emerald-400/30 group-hover:rotate-12 transition-transform duration-700">
              <Leaf className="w-48 h-48" />
            </div>
            
            <div className="relative z-10">
              <p className="text-emerald-100 font-black uppercase tracking-widest text-[10px] mb-1">Censo Botánico</p>
              <h3 className="text-3xl font-black">Plantas en Sistema</h3>
            </div>
            
            <div className="relative z-10 flex items-center gap-4 bg-black/20 p-4 rounded-3xl backdrop-blur-lg">
              <input 
                 type="number"
                 value={plantsCount}
                 onChange={(e) => setPlantsCount(Number(e.target.value))}
                 className="bg-transparent text-white font-black text-3xl w-20 text-center outline-none"
              />
            </div>
          </div>
        </motion.div>

        {/* Columna Derecha: Calculadora Tabla */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-7 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-[40px] shadow-2xl overflow-hidden flex flex-col relative"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-green-500/5 blur-[120px] rounded-full pointer-events-none" />
          
          <div className="p-8 md:p-10 border-b border-neutral-100 dark:border-neutral-800/50 flex justify-between items-center relative z-10">
            <h2 className="text-2xl font-black text-neutral-900 dark:text-white flex items-center gap-3">
              <Settings className="w-7 h-7 text-green-500 animate-spin-slow" />
              Dosis de Fertilizantes
            </h2>
            <div className="px-4 py-2 bg-neutral-100 dark:bg-neutral-800 rounded-xl text-neutral-500 font-bold text-[10px] uppercase tracking-widest">
              Automatizado
            </div>
          </div>

          <div className="flex-1 p-8 md:p-10 relative z-10">
            {/* Cabecera Tabla */}
            <div className="grid grid-cols-12 gap-4 pb-4 mb-4 border-b border-neutral-200 dark:border-neutral-800 text-xs font-black text-neutral-400 uppercase tracking-widest px-4">
              <div className="col-span-1"></div>
              <div className="col-span-5">Insumo Base</div>
              <div className="col-span-3 text-center">Tasa (g/L)</div>
              <div className="col-span-3 text-right">Añadir (Total)</div>
            </div>

            {/* Filas */}
            <div className="space-y-4">
              {doses.map((item) => {
                const totalGrams = (liters * item.dose).toFixed(1);
                const kg = (Number(totalGrams) / 1000).toFixed(2);
                
                return (
                  <motion.div 
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-12 gap-4 items-center bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-950/50 dark:hover:bg-neutral-800 p-4 rounded-2xl transition-colors border border-transparent hover:border-neutral-200 dark:hover:border-neutral-700"
                  >
                    <div className="col-span-1 flex justify-center">
                      <div className={`w-3 h-3 rounded-full ${item.color} shadow-[0_0_10px_currentColor]`} />
                    </div>
                    
                    <div className="col-span-5">
                      <p className="font-bold text-neutral-900 dark:text-neutral-100">{item.name}</p>
                      <p className="text-[9px] text-neutral-400 font-black uppercase tracking-widest mt-0.5">Solución A/B/C</p>
                    </div>
                    
                    <div className="col-span-3 flex justify-center">
                      <div className="flex items-center gap-1 bg-white dark:bg-neutral-900 px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700">
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          value={item.dose}
                          onChange={(e) => handleDoseChange(item.id, Number(e.target.value))}
                          className="w-12 text-center bg-transparent outline-none font-black text-blue-600 dark:text-blue-400"
                        />
                        <span className="text-[10px] text-neutral-400 font-bold">g/L</span>
                      </div>
                    </div>
                    
                    <div className="col-span-3 text-right flex flex-col items-end justify-center">
                      <div className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-4 py-2 rounded-xl font-black border border-emerald-500/20 shadow-inner">
                        {Number(totalGrams) >= 1000 ? `${kg} Kg` : `${totalGrams} g`}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
            
            {/* Aviso de Precisión */}
            <div className="mt-10 p-6 bg-blue-500/5 border border-blue-500/10 rounded-3xl flex gap-4 items-start">
              <Droplets className="w-6 h-6 text-blue-500 shrink-0 mt-1" />
              <div>
                <h4 className="font-black text-blue-600 dark:text-blue-400 mb-1">Concentración Ideal Asegurada</h4>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  Los cálculos presentados asumen agua base con conductividad (EC) menor a 0.5. Si utilizas agua de grifo pesada, ajusta las dosis para evitar precipitaciones de Calcio o excesos de salinidad final.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

    </div>
  );
}
