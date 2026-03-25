"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, Droplets, Settings, Beaker, Plus, X } from 'lucide-react';

const INITIAL_DOSES = [
  { id: '1', name: 'Nitrato de Calcio', symbol: 'Solución A', dose: 1.5, color: 'bg-white' },
  { id: '2', name: 'Sulfato de Magnesio', symbol: 'Solución B', dose: 0.5, color: 'bg-green-400' },
  { id: '3', name: 'Nitrato de Potasio', symbol: 'Solución C', dose: 1.0, color: 'bg-red-400' },
  { id: '4', name: 'Fosfato Monopotásico', symbol: 'Fósforo', dose: 0.3, color: 'bg-blue-400' },
  { id: '5', name: 'Micronutrientes', symbol: 'Micros', dose: 0.1, color: 'bg-purple-400' },
];

export default function NutritionPage() {
  const [liters, setLiters] = useState<number>(1000);
  const [maxCapacity, setMaxCapacity] = useState<number>(2500);
  const [plantsCount, setPlantsCount] = useState<number>(800);
  const [doses, setDoses] = useState(INITIAL_DOSES);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedLiters = localStorage.getItem('nutri_liters');
    if (savedLiters) setLiters(Number(savedLiters));

    const savedMax = localStorage.getItem('nutri_max');
    if (savedMax) setMaxCapacity(Number(savedMax));

    const savedPlants = localStorage.getItem('nutri_plants');
    if (savedPlants) setPlantsCount(Number(savedPlants));

    const savedDoses = localStorage.getItem('nutri_doses');
    if (savedDoses) setDoses(JSON.parse(savedDoses));
    
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem('nutri_liters', liters.toString());
    localStorage.setItem('nutri_max', maxCapacity.toString());
    localStorage.setItem('nutri_plants', plantsCount.toString());
    localStorage.setItem('nutri_doses', JSON.stringify(doses));
  }, [liters, maxCapacity, plantsCount, doses, isLoaded]);

  const handleLitersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = parseInt(e.target.value);
    if (isNaN(val)) val = 0;
    setLiters(val);
  };

  const handleAddInsumo = () => {
    const newId = Math.random().toString(36).substring(2);
    setDoses([...doses, { id: newId, name: 'Nuevo Insumo', symbol: 'Símbolo', dose: 1.0, color: 'bg-yellow-400' }]);
  };

  const handleDeleteInsumo = (id: string) => {
    setDoses(doses.filter(d => d.id !== id));
  };

  const handleUpdateInsumo = (id: string, field: string, value: string | number) => {
    setDoses(doses.map(d => d.id === id ? { ...d, [field]: value } : d));
  };

  const handleDoseChange = (id: string, newDose: number) => {
    setDoses(doses.map(d => d.id === id ? { ...d, dose: newDose } : d));
  };

  if (!isLoaded) return null; // Prevents hydration mismatch on initial render

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
          <p className="text-neutral-400 max-w-lg font-medium text-sm leading-relaxed">Laboratorio de dosificación interactiva. Ajusta el tanque, agrega nuevos químicos químicos y todos los cambios se guardarán solos.</p>
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
        
        {/* Columna Izquierda: Tanque Estilo Rotoplas */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-5 flex flex-col gap-8"
        >
          {/* Tanque Cilíndrico Azul Estilo Rotoplas */}
          <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-[40px] p-10 flex flex-col items-center justify-center relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />
            
            <h3 className="font-black text-lg text-neutral-800 dark:text-white uppercase tracking-widest mb-10 relative z-10 text-center">Contenedor Principal</h3>
            
            {/* Construcción del Tanque (Rotoplas-Style) */}
            <div className="relative mx-auto z-10 perspective-[1000px] drop-shadow-[0_40px_40px_rgba(37,99,235,0.3)]">
              {/* Cuello del Tanque */}
              <div className="w-24 h-12 bg-gradient-to-r from-blue-800 via-blue-500 to-blue-800 mx-auto rounded-t-2xl relative z-10 shadow-inner">
                {/* Tapa Negra */}
                <div className="absolute -top-3 -left-3 -right-3 h-6 bg-gradient-to-b from-neutral-800 to-black rounded-lg shadow-lg border-t border-neutral-700">
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-2 bg-neutral-700/50 rounded-full mt-1" />
                </div>
              </div>
              
              {/* Cuerpo del Tanque */}
              <div className="w-56 h-[300px] bg-gradient-to-r from-blue-900 via-blue-600 to-blue-900 mx-auto rounded-[30px/10px] relative shadow-[0_20px_50px_rgba(0,0,0,0.4)] overflow-hidden border border-blue-400/20">
                {/* Ventana Medidora Translúcida para Ver El Nivel de Agua */}
                <div className="absolute top-6 bottom-6 left-1/2 transform -translate-x-1/2 w-8 bg-black/60 rounded-full border-2 border-white/10 overflow-hidden shadow-[inset_0_0_10px_rgba(0,0,0,0.8)] backdrop-blur-sm z-10">
                  {/* Líquido (Nivel de Llenado) */}
                  <motion.div 
                    animate={{ height: `${Math.min(Math.max((liters / maxCapacity) * 100, 0), 100)}%` }}
                    transition={{ type: "spring", stiffness: 60, damping: 20 }}
                    className="absolute bottom-0 w-full bg-gradient-to-t from-cyan-400 via-cyan-300 to-cyan-200"
                  >
                    <div className="w-full h-1 bg-white shadow-[0_0_10px_white]" />
                  </motion.div>
                </div>
                
                {/* Texto grabado lateral en el tanque */}
                <div className="absolute top-1/2 left-2 transform -translate-y-1/2 text-white/40 font-black text-2xl rotate-[-90deg] tracking-[0.3em] uppercase opacity-70 pointer-events-none">
                  HIDRO-JEPE
                </div>
              </div>
            </div>
            
            {/* Holograma Frontend (Burbuja donde se ingresa la cantidad de Litros) */}
            <div className="relative mt-8 bg-blue-950/80 backdrop-blur-xl border border-blue-400/30 p-6 rounded-3xl shadow-[0_0_40px_rgba(37,99,235,0.4)] transition-all flex flex-col items-center">
              <label className="text-cyan-200 font-black uppercase tracking-[0.3em] text-[9px] mb-3 block text-center drop-shadow-md">Llenado Actual (Litros)</label>
              <div className="flex items-center gap-2 border-b-2 border-cyan-400 pb-1">
                <input 
                  type="number" 
                  aria-label="Llenado Actual (Litros)"
                  title="Llenado Actual en Litros"
                  value={liters || ""} 
                  onChange={handleLitersChange}
                  className="bg-transparent text-white font-black text-5xl text-center w-32 outline-none placeholder-blue-900/50 focus:text-cyan-300 transition-colors"
                  placeholder="0"
                />
                <span className="text-cyan-400 font-black text-2xl">L</span>
              </div>
              
              {/* Ajuste de Capacidad Total de su tanque */}
              <div className="mt-4 pt-4 border-t border-white/10 w-full flex items-center justify-between text-xs text-blue-300/80 font-bold uppercase tracking-wider">
                <span>Capacidad Total del Tanque:</span>
                <div className="flex items-center border-b border-blue-400/50 hover:border-cyan-300 transition-colors group">
                  <input 
                    type="number" 
                    aria-label="Capacidad Total del Tanque"
                    title="Capacidad Total"
                    placeholder="Capacidad Max"
                    value={maxCapacity || ""} 
                    onChange={(e) => setMaxCapacity(parseInt(e.target.value) || 0)} 
                    className="bg-transparent text-right w-16 outline-none text-white focus:text-cyan-300" 
                  />
                  <span className="ml-1 text-cyan-400">L</span>
                </div>
              </div>
            </div>
          </div>

          {/* Indicador de Plantas (Widget Mágico) */}
          <div className="bg-emerald-500 text-white rounded-[32px] p-8 flex items-center justify-between shadow-[0_20px_50px_rgba(16,185,129,0.3)] relative overflow-hidden group transition-transform duration-500">
            <div className="absolute -right-10 -top-10 text-emerald-400/30 group-hover:rotate-12 transition-transform duration-700 pointer-events-none">
              <Leaf className="w-48 h-48" />
            </div>
            
            <div className="relative z-10 w-full">
              <p className="text-emerald-100 font-black uppercase tracking-widest text-[10px] mb-1">Censo Botánico (Editable)</p>
              <h3 className="text-3xl font-black mb-4">Plantas Actuales</h3>
              
              <div className="flex items-center gap-4 bg-black/20 p-4 rounded-3xl backdrop-blur-lg w-full">
                <input 
                   type="number"
                   aria-label="Plantas Actuales"
                   title="Plantas Actuales"
                   placeholder="Cantidad de plantas"
                   value={plantsCount || ""}
                   onChange={(e) => setPlantsCount(Number(e.target.value))}
                   className="bg-transparent text-white font-black text-4xl w-full text-center outline-none focus:text-emerald-200 transition-colors"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Columna Derecha: Calculadora Tabla Editable */}
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
              Fertilizantes
            </h2>
            <div className="px-4 py-2 bg-green-500/10 dark:bg-green-500/20 text-green-600 dark:text-green-400 rounded-xl font-bold text-[10px] uppercase tracking-widest">
              Autoguardado Activo
            </div>
          </div>

          <div className="flex-1 p-8 md:p-10 relative z-10">
            {/* Cabecera Tabla */}
            <div className="grid grid-cols-12 gap-4 pb-4 mb-4 border-b border-neutral-200 dark:border-neutral-800 text-xs font-black text-neutral-400 uppercase tracking-widest px-4">
              <div className="col-span-1"></div>
              <div className="col-span-5">Insumo (Nombres Editables)</div>
              <div className="col-span-3 text-center">Tasa (g/L)</div>
              <div className="col-span-3 text-right">Cantidad Final</div>
            </div>

            {/* Filas */}
            <div className="space-y-4">
              <AnimatePresence>
                {doses.map((item) => {
                  const totalGrams = (liters * item.dose).toFixed(1);
                  const kg = (Number(totalGrams) / 1000).toFixed(2);
                  
                  return (
                    <motion.div 
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, height: 0 }}
                      className="group grid grid-cols-12 gap-4 items-center bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-950/50 dark:hover:bg-neutral-800 p-2 sm:p-4 rounded-2xl transition-colors border border-transparent hover:border-neutral-200 dark:hover:border-neutral-700 relative overflow-hidden"
                    >
                      {/* Botón Eliminar invisible que aparece en Hover */}
                      <button 
                        onClick={() => handleDeleteInsumo(item.id)} 
                        title="Eliminar Insumo"
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 text-red-500 hover:text-white bg-red-100 hover:bg-red-600 dark:bg-red-900/40 dark:hover:bg-red-600 p-1.5 rounded-lg transition-all shadow-md z-20"
                      >
                        <X className="w-3 h-3" />
                      </button>

                      {/* Puntito de color indicativo */}
                      <div className="col-span-1 flex justify-center ml-2 sm:ml-4 group-hover:opacity-0 transition-opacity">
                        <div className={`w-3 h-3 rounded-full ${item.color} shadow-[0_0_10px_currentColor] border border-white/20`} />
                      </div>
                      
                      {/* Cajas Editables para Nombres */}
                      <div className="col-span-5 flex flex-col gap-1 relative z-10">
                        <input 
                          type="text" 
                          value={item.name} 
                          title="Nombre del Insumo"
                          onChange={(e) => handleUpdateInsumo(item.id, 'name', e.target.value)} 
                          className="font-bold text-neutral-900 dark:text-neutral-100 bg-transparent outline-none w-full border-b border-transparent focus:border-blue-500/30 transition-colors truncate"
                          placeholder="Nombre Químico"
                        />
                        <input 
                          type="text" 
                          value={item.symbol} 
                          title="Simbología"
                          onChange={(e) => handleUpdateInsumo(item.id, 'symbol', e.target.value)} 
                          className="text-[9px] text-neutral-400 font-black uppercase tracking-widest bg-transparent outline-none w-full border-b border-transparent focus:border-blue-500/30 transition-colors truncate"
                          placeholder="Símbolo"
                        />
                      </div>
                      
                      {/* Dosis Manual */}
                      <div className="col-span-3 flex justify-center z-10 w-full">
                        <div className="flex items-center justify-center gap-1 bg-white dark:bg-neutral-900 px-1 py-1.5 sm:px-3 sm:py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 w-full hover:border-cyan-400 transition-colors shadow-sm">
                          <input
                            type="number"
                            step="0.1"
                            min="0"
                            value={item.dose}
                            title="Dosis en gramos por litro"
                            onChange={(e) => handleDoseChange(item.id, Number(e.target.value))}
                            className="w-10 sm:w-12 text-center bg-transparent outline-none font-black text-blue-600 dark:text-blue-400 focus:scale-110 transition-transform"
                          />
                          <span className="text-[9px] sm:text-[10px] text-neutral-400 font-bold hidden sm:inline">g/L</span>
                        </div>
                      </div>
                      
                      {/* Suma en vivo */}
                      <div className="col-span-3 text-right flex flex-col items-end justify-center z-10">
                        <div className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-3 py-2 sm:px-5 sm:py-3 rounded-xl font-black border border-emerald-500/20 shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] flex items-center justify-center text-xs sm:text-base min-w-[70px]">
                          {Number(totalGrams) >= 1000 ? `${kg} Kg` : `${totalGrams} g`}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
            
            {/* Botón Añadir Insusmo */}
            <motion.button 
              onClick={handleAddInsumo}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-6 w-full py-4 rounded-2xl border-2 border-dashed border-neutral-300 dark:border-neutral-700 text-neutral-500 hover:text-green-600 dark:hover:text-green-400 hover:border-green-500 transition-colors flex items-center justify-center gap-3 font-bold"
            >
              <Plus className="w-5 h-5" /> Añadir Nuevo Insumo
            </motion.button>

            {/* Aviso de Confianza Auto-guardado */}
            <div className="mt-10 p-6 bg-blue-500/5 border border-blue-500/10 rounded-3xl flex gap-4 items-start shadow-inner">
              <Droplets className="w-6 h-6 text-blue-500 shrink-0 mt-1" />
              <div>
                <h4 className="font-black text-blue-600 dark:text-blue-400 mb-1">Cálculos Seguros y Autónomos</h4>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  Todos los números y nombres de químicos que modifiques en esta pantalla se han guardado automáticamente en tu dispositivo local. Puedes cerrar la app y los datos seguirán aquí intactos la próxima vez.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

    </div>
  );
}
