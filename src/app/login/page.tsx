"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Droplets, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const router = useRouter();
  const [welcomeImage, setWelcomeImage] = useState<string | null>(null);

  useEffect(() => {
    const savedSplash = localStorage.getItem('welcomeImage');
    if (savedSplash) {
      setWelcomeImage(savedSplash);
    } else {
      const savedLogo = localStorage.getItem('companyLogo');
      if (savedLogo) setWelcomeImage(savedLogo);
    }
  }, []);

  const handleEnter = () => {
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-6 relative overflow-hidden text-white">
      {/* Cinematic Hydroponics Background */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
         <div className="absolute inset-0 bg-black/60 z-10" />
         {/* eslint-disable-next-line @next/next/no-img-element */}
         <img 
           src="C:/Users/Bienvenido/.gemini/antigravity/brain/19013ede-9602-4b38-9705-f6ba377d51ee/hydroponic_splash_bg_1774224631245.png" 
           alt="Background" 
           className="w-full h-full object-cover scale-110 blur-sm opacity-40"
         />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="flex flex-col items-center z-10 w-full"
      >
        <div className="relative group w-full flex justify-center">
           {/* Floating Artistic Image Container - Filling most of the screen */}
           <motion.div 
             animate={{ 
               y: [0, -15, 0],
               rotate: [0, 1, 0, -1, 0]
             }}
             transition={{ 
               duration: 8, 
               repeat: Infinity, 
               ease: "easeInOut" 
             }}
             className="w-full max-w-5xl h-[50vh] md:h-[75vh] flex items-center justify-center relative scale-125"
           >
              {/* Blurred Mask Effect - Masking with radial gradient to avoid inline lint */}
              <div 
                className="absolute inset-0 z-10 pointer-events-none bg-[radial-gradient(circle,transparent_40%,#0a0a0a_90%)]"
              />
              
              {welcomeImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img 
                  src={welcomeImage} 
                  alt="Welcome" 
                  className="w-full h-full object-contain filter drop-shadow-[0_0_100px_rgba(34,197,94,0.3)]" 
                />
              ) : (
                <div className="flex flex-col items-center opacity-40">
                  <Droplets className="w-20 h-20 text-primary-500 mb-4" />
                  <p className="font-black text-lg tracking-[0.5em]">HIDROPONÍA</p>
                </div>
              )}
           </motion.div>
           
           {/* Ambient Light */}
           <div className="absolute -inset-20 bg-primary-500/20 blur-[180px] rounded-full opacity-60 z-0 animate-pulse" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="text-center mt-2 space-y-1"
        >
          <h1 className="text-2xl md:text-3xl font-black tracking-tighter shadow-2xl uppercase italic">SISTEMA HIDROPONICO</h1>
          <div className="h-0.5 w-16 bg-primary-500 mx-auto rounded-full mb-1 shadow-lg shadow-primary-500/50" />
          <p className="text-neutral-600 font-bold uppercase tracking-[0.4em] text-[7px] md:text-[9px]">Control de Producción Hidropónica</p>
        </motion.div>
      </motion.div>

      {/* Discrete Enter Button in Bottom Right */}
      <motion.button
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        onClick={handleEnter}
        className="fixed bottom-12 right-12 md:bottom-20 md:right-20 flex items-center gap-6 group cursor-pointer z-50"
        title="Ingresar al sistema"
      >
        <div className="text-right pointer-events-none">
           <p className="text-[9px] font-black uppercase tracking-[0.4em] text-neutral-500 group-hover:text-primary-500 transition-colors mb-1">Bienvenido</p>
           <p className="text-2xl font-black text-white italic tracking-tighter uppercase whitespace-nowrap">INGRESAR</p>
        </div>
        <div className="w-16 h-16 rounded-3xl bg-white text-black flex items-center justify-center shadow-[0_20px_60px_rgba(255,255,255,0.15)] group-hover:bg-primary-600 group-hover:text-white transition-all transform group-hover:scale-110 active:scale-95 shadow-2xl">
           <ArrowRight className="w-8 h-8" />
        </div>
      </motion.button>

      {/* Persistence Signature */}
      <div className="fixed bottom-12 left-12 md:bottom-20 md:left-20 opacity-20 pointer-events-none select-none">
        <p className="text-[8px] font-black uppercase tracking-[0.5em] text-neutral-500 italic">@Desarrollado por Yoar Maza • 2026</p>
      </div>
    </div>
  );
}
