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
  const formattedMonthYear = isNaN(dateObj.getTime()) ? '' : `${dateObj.toLocaleString('es-ES', { month: 'short' }).toUpperCase()} ${dateObj.getFullYear()}`;

  const days = searchParams?.get('days') || '45';
  const origin = searchParams?.get('origin') || 'Granja Local';

  useEffect(() => {
    // Attempt to grab local logo if scanned on owner's device
    if (typeof window !== 'undefined') {
      const savedLogo = localStorage.getItem('companyLogo');
      if (savedLogo) {
        setLogo(savedLogo);
      }
    }
  }, []);

  return (
    <div className="min-h-[100dvh] w-full bg-white flex flex-col antialiased selection:bg-emerald-500 selection:text-white relative">
      
      {/* Banner Superior Metálico (100% Ancho) */}
      <div className="w-full bg-gradient-to-b from-neutral-200 via-neutral-100 to-neutral-300 shadow-md border-b-4 border-emerald-500 py-6 px-4 flex flex-col items-center justify-center min-h-[140px] relative z-20">
        {logo ? (
          <img src={logo} alt="Company Logo" className="max-w-[200px] max-h-[100px] object-contain drop-shadow-md" />
        ) : (
           <div className="flex flex-col items-center">
             <span className="text-5xl filter drop-shadow-md">🥬</span>
             <h1 className="text-3xl font-black text-emerald-800 tracking-tighter drop-shadow-sm leading-tight mt-1">HidroJepe</h1>
             <p className="text-[10px] uppercase tracking-widest text-emerald-600/80 font-bold">Cultivos Hidropónicos</p>
           </div>
        )}
      </div>

      <div className="flex-1 flex flex-col items-center justify-start pt-10 px-6 pb-12 overflow-y-auto">
        {/* Product Title */}
        <h2 className="text-5xl sm:text-6xl text-center font-black text-emerald-900 leading-[1.1] tracking-tight [font-family:Georgia,serif]">
          {plantName.replace(' Premium', '')} <br/> <span className="text-emerald-700 font-bold italic">Premium</span>
        </h2>

        {/* Huge Emerald Badge Context */}
        <div className="relative mt-12 mb-10 cursor-default">
           <div className="absolute inset-0 bg-emerald-500 rounded-full blur-2xl opacity-30" />
           <div className="relative w-48 h-48 mx-auto bg-gradient-to-b from-emerald-400 to-emerald-600 shadow-[0_20px_40px_rgba(16,185,129,0.4)] border-[6px] border-white flex flex-col items-center justify-center text-white transform rotate-3 hover:scale-105 transition-transform [border-radius:40%_60%_70%_30%_/_40%_50%_60%_50%]">
              <span className="text-xs font-black uppercase tracking-widest opacity-90 drop-shadow-md">Cosechada</span>
              <span className="text-5xl sm:text-6xl font-black leading-none drop-shadow-lg my-1">{formattedDay}</span>
              <span className="text-sm font-black tracking-widest opacity-90 drop-shadow-md">{formattedMonthYear}</span>
           </div>
        </div>

        {/* Data Columns */}
        <div className="w-full max-w-lg flex justify-between items-start gap-2 pt-8 mt-4 border-t-2 border-dashed border-emerald-200">
           {/* Origen */}
           <div className="flex-1 flex flex-col items-center text-center px-2">
             <div className="w-12 h-12 mb-3 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shadow-sm">
               <MapPin className="w-6 h-6" />
             </div>
             <p className="text-xs font-bold text-neutral-800 leading-tight">Origen <br/><span className="font-medium text-emerald-700">{origin}</span></p>
           </div>
           
           {/* Dias */}
           <div className="flex-1 flex flex-col items-center text-center border-x-2 border-emerald-50 px-2">
             <div className="w-12 h-12 mb-3 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shadow-sm">
               <CalendarDays className="w-6 h-6" />
             </div>
             <p className="text-xs font-bold text-neutral-800 leading-tight">Cultivo <br/><span className="font-medium text-emerald-700">{days} días</span></p>
           </div>

           {/* Nutricion */}
           <div className="flex-1 flex flex-col items-center text-center px-2">
             <div className="w-12 h-12 mb-3 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shadow-sm">
               <FlaskConical className="w-6 h-6" />
             </div>
             <p className="text-xs font-bold text-neutral-800 leading-tight">Nutrición <br/><span className="font-medium text-emerald-700">100% Pura</span></p>
           </div>
        </div>
      </div>
    </div>
  );
}

export default function LabelPreviewPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-white text-emerald-500"><Loader2 className="w-10 h-10 animate-spin" /></div>}>
      <LabelContent />
    </Suspense>
  );
}
