"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { MapPin, CalendarDays, FlaskConical, Loader2 } from 'lucide-react';

function LabelContent() {
  const searchParams = useSearchParams();
  const [logo, setLogo] = useState<string | null>(null);

  const plantName = searchParams?.get('plant') || 'Lechuga Premium';
  const harvestDate = searchParams?.get('harvest') || 'HOY';
  // Attempt to parse out '15 MAY 2026' from the format '2026-05-15'
  const dateObj = new Date(harvestDate);
  const formattedDay = isNaN(dateObj.getTime()) ? harvestDate : dateObj.getDate();
  const formattedMonthYear = isNaN(dateObj.getTime()) ? '' : `${dateObj.toLocaleString('es-ES', { month: 'long' }).toUpperCase()} ${dateObj.getFullYear()}`;

  const days = searchParams?.get('days') || '45';
  const origin = searchParams?.get('origin') || 'Granja Local';

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLogo = localStorage.getItem('companyLogo');
      if (savedLogo) {
        setLogo(savedLogo);
      }
    }
  }, []);

  return (
    <div className="min-h-[100dvh] w-full flex flex-col antialiased selection:bg-emerald-500 selection:text-white relative bg-emerald-950 font-sans">
      
      {/* Fondo de Verduras Reales (Alta Resolución) */}
      <div className="absolute inset-0 z-0 bg-cover bg-center bg-[url('https://images.unsplash.com/photo-1629828551600-47b2c9397637?q=80&w=1600&auto=format&fit=crop')]" />
      {/* Degrado Verde premium con Blur sutil */}
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-emerald-950 via-emerald-900/50 to-emerald-900/90 backdrop-blur-[4px]" />

      {/* Banner de Empresa o Logotipo (Superior) -> Letra Grande, Espaciado Masivo */}
      <div className="w-full flex flex-col items-center justify-center pt-16 pb-8 relative z-20">
        {logo ? (
          <img src={logo} alt="Company Logo" className="max-w-[280px] max-h-[140px] md:max-w-[350px] object-contain drop-shadow-[0_15px_15px_rgba(0,0,0,0.6)]" />
        ) : (
           <div className="flex flex-col items-center">
             <span className="text-7xl filter drop-shadow-2xl">🥬</span>
             <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight drop-shadow-lg leading-none mt-2">HidroJepe</h1>
             <p className="text-sm md:text-base uppercase tracking-[0.3em] text-emerald-300 font-bold mt-2 drop-shadow-md">Cultivos Frescos</p>
           </div>
        )}
      </div>

      {/* Contenido Principal Ocupando Todo el Medio */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 relative z-20 pb-16">
        
        <h2 className="text-6xl sm:text-7xl md:text-8xl text-center font-black text-white leading-[1] tracking-tighter drop-shadow-2xl mb-8 [font-family:Georgia,serif]">
          {plantName}
        </h2>

        {/* Insignia Magnífica de Cosecha */}
        <div className="relative my-8 sm:my-12">
           <div className="absolute inset-0 bg-emerald-400 rounded-full blur-[40px] opacity-40 animate-pulse" />
           <div className="relative w-56 h-56 sm:w-64 sm:h-64 mx-auto bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-600 shadow-[0_25px_50px_rgba(0,0,0,0.6)] border-[8px] border-emerald-100 flex flex-col items-center justify-center text-white transform rotate-2 [border-radius:40%_60%_70%_30%_/_40%_50%_60%_50%] backdrop-blur-md">
              <span className="text-sm sm:text-base font-black uppercase tracking-widest opacity-95 drop-shadow-md">Cosechada El</span>
              <span className="text-7xl sm:text-8xl font-black leading-none drop-shadow-xl my-1">{formattedDay}</span>
              <span className="text-lg sm:text-xl font-black tracking-widest opacity-95 drop-shadow-md">{formattedMonthYear}</span>
           </div>
        </div>

        {/* Cajas de Datos GIGANTES Ocupando el Ancho Abajo */}
        <div className="w-full max-w-2xl grid grid-cols-3 gap-3 md:gap-6 mt-6 pb-6">
           
           {/* Origen */}
           <div className="flex flex-col items-center text-center bg-black/30 backdrop-blur-md border border-white/10 rounded-[30px] p-6 shadow-xl">
             <div className="w-14 h-14 mb-4 rounded-2xl bg-white/10 text-emerald-300 flex items-center justify-center shadow-inner">
               <MapPin className="w-8 h-8" />
             </div>
             <p className="text-xs sm:text-sm font-bold text-white/70 uppercase tracking-widest leading-relaxed mb-1">Origen</p>
             <p className="text-lg sm:text-xl font-black text-white">{origin}</p>
           </div>
           
           {/* Dias */}
           <div className="flex flex-col items-center text-center bg-black/30 backdrop-blur-md border border-white/10 rounded-[30px] p-6 shadow-xl">
             <div className="w-14 h-14 mb-4 rounded-2xl bg-white/10 text-emerald-300 flex items-center justify-center shadow-inner">
               <CalendarDays className="w-8 h-8" />
             </div>
             <p className="text-xs sm:text-sm font-bold text-white/70 uppercase tracking-widest leading-relaxed mb-1">Cultivo</p>
             <p className="text-lg sm:text-xl font-black text-white">{days} días</p>
           </div>

           {/* Nutricion */}
           <div className="flex flex-col items-center text-center bg-black/30 backdrop-blur-md border border-white/10 rounded-[30px] p-6 shadow-xl">
             <div className="w-14 h-14 mb-4 rounded-2xl bg-white/10 text-emerald-300 flex items-center justify-center shadow-inner">
               <FlaskConical className="w-8 h-8" />
             </div>
             <p className="text-xs sm:text-sm font-bold text-white/70 uppercase tracking-widest leading-relaxed mb-1">Nutrición</p>
             <p className="text-lg sm:text-xl font-black text-white">100% Pura</p>
           </div>
           
        </div>
      </div>
    </div>
  );
}

export default function LabelPreviewPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-emerald-950 text-emerald-500"><Loader2 className="w-12 h-12 animate-spin" /></div>}>
      <LabelContent />
    </Suspense>
  );
}
