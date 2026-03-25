"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { MapPin, CalendarDays, FlaskConical, Sprout, PlayCircle, Loader2 } from 'lucide-react';

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
  const videoUrl = searchParams?.get('video') || '';

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
    <div className="min-h-[100dvh] w-full bg-white sm:bg-neutral-100 flex items-center justify-center sm:p-4 antialiased selection:bg-emerald-500 selection:text-white relative">
      {/* Dynamic blurred background to look like a premium app (only obvious on wider screens) */}
      <div className="hidden sm:block absolute inset-0 z-0 bg-cover bg-center opacity-30 blur-2xl transform scale-125 bg-[url('https://images.unsplash.com/photo-1628157588553-5eeea00af15c?q=80&w=1000&auto=format&fit=crop')]" />
      <div className="hidden sm:block absolute inset-0 z-0 bg-gradient-to-t from-white via-white/80 to-transparent" />

      {/* Main Label Card (Fullscreen on mobile, card on desktop) */}
      <div className="relative z-10 w-full min-h-[100dvh] sm:min-h-0 sm:max-w-sm bg-white sm:rounded-[40px] shadow-none sm:shadow-[0_30px_60px_rgba(0,0,0,0.15)] pb-8 pt-0 sm:pt-24 px-4 sm:px-6 text-center border-b-[8px] border-emerald-500 flex flex-col items-center justify-start overflow-y-auto custom-scrollbar">
        
        {/* Metallic Hanging Plaque for Logo */}
        <div className="relative sm:absolute top-0 sm:-top-12 sm:left-1/2 sm:-translate-x-1/2 w-full sm:w-[85%] bg-gradient-to-b from-neutral-200 via-neutral-100 to-neutral-300 sm:rounded-xl shadow-md sm:shadow-[0_15px_30px_rgba(0,0,0,0.1)] border-b-4 sm:border-2 border-neutral-300 sm:border-white p-4 flex flex-col items-center justify-center min-h-[120px] rounded-b-[40px] sm:rounded-b-3xl shrink-0 z-20 mb-6 sm:mb-0">
          {/* Rivets */}
          <div className="absolute top-3 left-3 w-2.5 h-2.5 rounded-full bg-gradient-to-br from-neutral-300 to-neutral-500 shadow-inner" />
          <div className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-gradient-to-br from-neutral-300 to-neutral-500 shadow-inner" />
          <div className="absolute bottom-3 left-3 w-2.5 h-2.5 rounded-full bg-gradient-to-br from-neutral-300 to-neutral-500 shadow-inner" />
          <div className="absolute bottom-3 right-3 w-2.5 h-2.5 rounded-full bg-gradient-to-br from-neutral-300 to-neutral-500 shadow-inner" />
          
          {logo ? (
            <img src={logo} alt="Company Logo" className="max-w-[150px] max-h-[80px] object-contain drop-shadow-md" />
          ) : (
             <div className="flex flex-col items-center mt-2">
               <span className="text-4xl filter drop-shadow-md">🥬</span>
               <h1 className="text-2xl font-black text-emerald-800 tracking-tighter drop-shadow-sm leading-tight mt-1">HidroJepe</h1>
               <p className="text-[8px] uppercase tracking-widest text-emerald-600/80 font-bold">Cultivos Hidropónicos</p>
             </div>
          )}
        </div>

        {/* Product Title */}
        <h2 className="text-4xl font-black text-emerald-900 mt-4 sm:mt-10 leading-[1.1] tracking-tight [font-family:Georgia,serif]">
          {plantName.replace(' Premium', '')} <br/> <span className="text-emerald-700 font-bold italic">Premium</span>
        </h2>

        {/* Huge Emerald Badge Context */}
        <div className="relative mt-8 mb-6 group cursor-default">
           <div className="absolute inset-0 bg-emerald-500 rounded-full blur-xl opacity-40 group-hover:opacity-60 transition-opacity" />
           <div className="relative w-36 h-36 mx-auto bg-gradient-to-b from-emerald-400 to-emerald-600 shadow-[0_15px_25px_rgba(16,185,129,0.5)] border-[4px] border-white flex flex-col items-center justify-center text-white transform rotate-3 hover:scale-105 transition-transform [border-radius:40%_60%_70%_30%_/_40%_50%_60%_50%]">
              <span className="text-[10px] font-black uppercase tracking-widest opacity-90">Cosechada</span>
              <span className="text-4xl font-black leading-none drop-shadow-md my-1">{formattedDay}</span>
              <span className="text-[11px] font-black tracking-widest opacity-90">{formattedMonthYear}</span>
           </div>
        </div>

        {/* Data Columns */}
        <div className="w-full flex justify-between items-start gap-2 pt-6 pb-8 border-t border-dashed border-neutral-300 mt-2 px-2">
           {/* Origen */}
           <div className="flex-1 flex flex-col items-center text-center">
             <div className="w-10 h-10 mb-2 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
               <MapPin className="w-5 h-5" />
             </div>
             <p className="text-[11px] font-bold text-neutral-800 leading-tight">Origen: <br/><span className="font-medium text-neutral-500">{origin}</span></p>
           </div>
           
           {/* Dias */}
           <div className="flex-1 flex flex-col items-center text-center border-x border-neutral-100 px-2">
             <div className="w-10 h-10 mb-2 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
               <CalendarDays className="w-5 h-5" />
             </div>
             <p className="text-[11px] font-bold text-neutral-800 leading-tight">Cultivo: <br/><span className="font-medium text-neutral-500">{days} días</span></p>
           </div>

           {/* Nutricion */}
           <div className="flex-1 flex flex-col items-center text-center">
             <div className="w-10 h-10 mb-2 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
               <FlaskConical className="w-5 h-5" />
             </div>
             <p className="text-[11px] font-bold text-neutral-800 leading-tight">Nutrición: <br/><span className="font-medium text-neutral-500">100% Pura</span></p>
           </div>
        </div>

        {/* Call to Action Button */}
        {videoUrl && (
          <a 
            href={videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full mt-auto py-4 bg-[#0a66c2] hover:bg-[#004182] text-white rounded-2xl font-black shadow-lg shadow-blue-500/30 flex flex-col items-center justify-center gap-1 transition-all hover:scale-[1.02] active:scale-95"
          >
             <span className="text-[9px] uppercase tracking-widest opacity-90 mx-auto">¿Quieres ver cómo la cultivamos?</span>
             <span className="flex items-center gap-2 text-base">VER VIDEO DEL VIVERO <PlayCircle className="w-5 h-5 fill-white text-[#0a66c2]" /></span>
          </a>
        )}
      </div>

    </div>
  );
}

export default function LabelPreviewPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-neutral-100 text-neutral-400"><Loader2 className="w-8 h-8 animate-spin" /></div>}>
      <LabelContent />
    </Suspense>
  );
}
