"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { MapPin, CalendarDays, FlaskConical, Loader2 } from 'lucide-react';

function LabelContent() {
  const searchParams = useSearchParams();
  const [logo, setLogo] = useState<string | null>(null);

  const plantName = searchParams?.get('plant') || 'LECHUGA ROMANA';
  const harvestDate = searchParams?.get('harvest') || 'HOY';
  const company = searchParams?.get('company') || 'HIDROJEPE';
  
  const dateObj = new Date(harvestDate);
  const formattedDay = isNaN(dateObj.getTime()) ? harvestDate : dateObj.getDate().toString();
  const formattedMonthYear = isNaN(dateObj.getTime()) ? '' : `${dateObj.toLocaleString('es-ES', { month: 'long' }).toUpperCase()} ${dateObj.getFullYear()}`;

  const days = searchParams?.get('days') || '45';
  const origin = searchParams?.get('origin') || 'Jepelacio Moyobamba';
  
  const originParts = origin.split(' ');
  const originLine1 = originParts[0] || 'Jepelacio';
  const originLine2 = originParts[1] || 'Moyobamba';

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLogo = localStorage.getItem('companyLogo');
      if (savedLogo) {
        setLogo(savedLogo);
      }
    }
  }, []);

  return (
    <div className="min-h-[100dvh] w-full flex items-center justify-center bg-[#000] font-sans selection:bg-emerald-500 selection:text-white p-2 sm:p-4 perspective-[1000px]">
      
      {/* Marco Exterior del Póster (estilo iPhone Aspect Ratio) */}
      <div className="w-full max-w-[550px] flex flex-col justify-between relative bg-gradient-to-b from-[#083626] to-[#041d14] rounded-[30px] sm:rounded-[40px] shadow-2xl overflow-hidden aspect-[9/16] p-4 sm:p-6 pb-8 border border-white/10">
        
        {/* Bordes Plateados Interiores Simulados */}
        <div className="absolute inset-0 m-2 sm:m-4 border-[4px] border-[#9baea4] rounded-[24px] pointer-events-none shadow-[0_0_15px_rgba(0,0,0,0.5)]" />
        <div className="absolute inset-0 m-[16px] sm:m-[24px] border-[1px] border-[#657d72] rounded-[20px] pointer-events-none" />

        {/* --- HEADER --- */}
        <div className="flex flex-col items-center mt-6 sm:mt-10 relative z-10 w-full px-6 text-center">
            {/* Logo de la Planta */}
            {logo ? (
              <img src={logo} alt="Company Logo" className="w-16 h-16 sm:w-24 sm:h-24 object-contain drop-shadow-[0_15px_15px_rgba(0,0,0,0.6)] mb-2" />
            ) : (
              <img 
                src="https://raw.githubusercontent.com/googlefonts/noto-emoji/main/png/512/emoji_u1f96c.png" 
                alt="Lettuce Logo"
                className="w-16 h-16 sm:w-24 sm:h-24 object-contain drop-shadow-[0_10px_15px_rgba(0,0,0,0.8)] mb-2" 
              />
            )}
            
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-[0.2em] sm:tracking-[0.25em] uppercase leading-none mt-2 drop-shadow-md">
              {company}
            </h1>
            <p className="text-[#65ce90] text-[8px] sm:text-xs font-bold uppercase tracking-[0.4em] mt-3">Cultivos Frescos</p>
        </div>

        {/* --- TITULO PRINCIPAL --- */}
        <div className="flex flex-col items-center mt-4 sm:mt-8 relative z-10 w-full text-center">
            <h2 className="text-4xl sm:text-6xl font-black text-white uppercase tracking-tight drop-shadow-lg leading-none mb-1 sm:mb-3">
              {plantName.replace(' Premium', '')}
            </h2>
            <p className="text-[#e2e8f0] text-lg sm:text-2xl italic font-serif tracking-widest drop-shadow-sm opacity-90">
               Premium Selection
            </p>
        </div>

        {/* --- MEDALLÓN CIRCULAR GIGANTE --- */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center my-4 sm:my-6 scale-[0.9] sm:scale-100">
           <div className="relative flex items-center justify-center w-[220px] h-[220px] sm:w-[320px] sm:h-[320px] rounded-full bg-gradient-to-br from-[#dfe4e1] to-[#99a7a0] shadow-[0_25px_40px_rgba(0,0,0,0.8)] border-[2px] border-white/30 p-[12px] sm:p-[16px]">
               {/* Centro del Medallón */}
               <div className="w-full h-full rounded-full bg-gradient-to-b from-[#2aa686] to-[#156a52] shadow-[inset_0_15px_25px_rgba(0,0,0,0.5)] border border-[#0d3629] flex flex-col items-center justify-center p-4">
                  
                  <span className="text-[#a7f3d0] text-[10px] sm:text-sm font-bold uppercase tracking-[0.3em] opacity-90 mb-0 sm:mb-1">Cosechada El</span>
                  
                  <span className="text-[100px] sm:text-[140px] font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-[#e2e8f0] to-[#b0b8c0] leading-[0.8] tracking-tighter drop-shadow-[0px_8px_12px_rgba(0,0,0,0.6)]">
                    {formattedDay}
                  </span>
                  
                  <span className="text-white text-[12px] sm:text-lg font-bold uppercase tracking-[0.2em] mt-2 sm:mt-4 drop-shadow-lg">{formattedMonthYear}</span>
                  
               </div>
           </div>
        </div>

        {/* --- FOOTER INFORMATIVO --- */}
        <div className="relative z-10 flex flex-col items-center w-full px-4 sm:px-10 mb-2 sm:mb-6">
            <hr className="w-[90%] border-t-[1.5px] border-[#657d72] mb-6 sm:mb-8 shadow-[0_2px_4px_rgba(0,0,0,0.3)] opacity-60" />
            
            <div className="grid grid-cols-3 gap-1 sm:gap-3 w-[95%] text-center">
               
               {/* Col 1 */}
               <div className="flex flex-col items-center px-1">
                 <div className="flex items-center gap-1 sm:gap-2 mb-2 sm:mb-3">
                   <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-[#86e2a9] opacity-80" strokeWidth={1.5} />
                   <span className="text-[#86e2a9] text-[8px] sm:text-[10px] font-bold tracking-widest leading-none">ORIGEN:</span>
                 </div>
                 <span className="text-white text-xs sm:text-[17px] leading-tight font-medium opacity-90">{originLine1}<br/>{originLine2}</span>
               </div>
               
               {/* Col 2 */}
               <div className="flex flex-col items-center px-1">
                 <div className="flex items-center gap-1 sm:gap-2 mb-2 sm:mb-3">
                   <CalendarDays className="w-4 h-4 sm:w-5 sm:h-5 text-[#86e2a9] opacity-80" strokeWidth={1.5} />
                   <span className="text-[#86e2a9] text-[8px] sm:text-[10px] font-bold tracking-widest leading-none">CULTIVO:</span>
                 </div>
                 <span className="text-white text-xs sm:text-[17px] leading-tight font-medium opacity-90">{days} días<br/>(FRESCA)</span>
               </div>

               {/* Col 3 */}
               <div className="flex flex-col items-center px-1">
                 <div className="flex items-center gap-1 sm:gap-2 mb-2 sm:mb-3">
                   <FlaskConical className="w-4 h-4 sm:w-5 sm:h-5 text-[#86e2a9] opacity-80" strokeWidth={1.5} />
                   <span className="text-[#86e2a9] text-[8px] sm:text-[10px] font-bold tracking-widest leading-none">NUTRICIÓN:</span>
                 </div>
                 <span className="text-white text-xs sm:text-[17px] leading-tight font-medium mt-1 sm:mt-2 opacity-90">100% Pura</span>
               </div>

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
