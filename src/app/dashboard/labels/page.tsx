"use client";

import React, { useState, useEffect } from 'react';
import { 
  QrCode, 
  Search, 
  Tag, 
  CalendarDays, 
  Leaf, 
  MapPin, 
  Settings,
  Link as LinkIcon,
  X,
  ExternalLink,
  Download,
  Printer
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import QRCode from 'react-qr-code';

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

export default function LabelsAndQRPage() {
  const [harvestedBatches, setHarvestedBatches] = useState<LettuceBatch[]>([]);
  const [search, setSearch] = useState('');
  const [selectedBatch, setSelectedBatch] = useState<LettuceBatch | null>(null);
  
  // Customization Form for QR
  const [qrConfig, setQrConfig] = useState({
    plantName: '',
    harvestDate: '',
    days: '',
    origin: 'Granja Local, Ciudad',
    videoUrl: '',
    company: ''
  });

  useEffect(() => {
    const savedBatches = localStorage.getItem('lettuce_batches');
    if (savedBatches) {
      const all: LettuceBatch[] = JSON.parse(savedBatches);
      const harvested = all.filter(b => b.status === 'Cosechado');
      setHarvestedBatches(harvested.reverse()); // Show newest first
    }
    
    // Grabbing the dynamic business name
    if (typeof window !== 'undefined') {
       const bName = localStorage.getItem('businessName');
       if (bName) {
         setQrConfig(prev => ({ ...prev, company: bName }));
       }
    }
  }, []);

  const openQrConfig = (batch: LettuceBatch) => {
    // Calculo días de cultivo
    let daysDiff = '45';
    if (batch.sowingDate && batch.harvestDate) {
       const start = new Date(batch.sowingDate);
       const end = new Date(batch.harvestDate);
       const diffTime = Math.abs(end.getTime() - start.getTime());
       daysDiff = Math.ceil(diffTime / (1000 * 60 * 60 * 24)).toString();
    }

    setQrConfig(prev => ({
      ...prev,
      plantName: `${batch.plantName} Premium`,
      harvestDate: batch.harvestDate || new Date().toISOString().split('T')[0],
      days: daysDiff
    }));

    setSelectedBatch(batch);
  };

  const getPublicUrl = () => {
    if (typeof window === 'undefined') return '';
    const baseUrl = window.location.origin;
    const params = new URLSearchParams({
      plant: qrConfig.plantName,
      harvest: qrConfig.harvestDate,
      days: qrConfig.days,
      origin: qrConfig.origin,
      video: qrConfig.videoUrl
    });
    return `${baseUrl}/etiqueta?${params.toString()}`;
  };

  const filteredBatches = harvestedBatches.filter(b => b.plantName.toLowerCase().includes(search.toLowerCase()));

  const downloadQR = () => {
    const svg = document.getElementById("QRCodeImage");
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = 380;
      canvas.height = 500;
      if(ctx) {
        // Draw Background
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw Company Name
        ctx.fillStyle = "#065f46";
        ctx.font = "bold 28px Inter, Arial, sans-serif";
        ctx.textAlign = "center";
        const companyName = qrConfig.plantName || "HidroJepe";
        ctx.fillText(companyName.toUpperCase(), canvas.width/2, 60);

        // Draw QR
        const qrSize = 250;
        ctx.drawImage(img, (canvas.width - qrSize)/2, 100, qrSize, qrSize);

        // Draw Escaneame
        ctx.fillStyle = "#10b981";
        ctx.font = "italic bold 45px Georgia, serif";
        ctx.fillText("¡Escanéame!", canvas.width/2, canvas.height - 50);

        const pngFile = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.download = `QR_${selectedBatch?.plantName.replace(/\s+/g, '_')}_${selectedBatch?.harvestDate}.png`;
        downloadLink.href = `${pngFile}`;
        downloadLink.click();
      }
    };
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
             <QrCode className="w-10 h-10 text-emerald-500" />
             Etiquetado y QR de Cosecha
          </h1>
          <p className="text-neutral-500 mt-2">Genera etiquetas inteligentes y códigos QR escaneables por tus clientes.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-900 rounded-[40px] p-8 border border-neutral-200 dark:border-neutral-800 shadow-sm">
         <div className="flex items-center justify-between mb-8">
           <h3 className="text-2xl font-black flex items-center gap-2 text-neutral-800 dark:text-neutral-100"><Leaf className="w-6 h-6 text-emerald-500" /> Lotes Cosechados</h3>
           <div className="relative">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
             <input type="text" placeholder="Buscar lote..." className="bg-neutral-50 dark:bg-neutral-800 border-none rounded-2xl py-3 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-emerald-500 w-64 outline-none" value={search} onChange={(e) => setSearch(e.target.value)} />
           </div>
         </div>

         {harvestedBatches.length === 0 ? (
           <div className="text-center py-20 px-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-3xl border border-neutral-100 dark:border-neutral-800">
              <div className="w-20 h-20 bg-neutral-200 dark:bg-neutral-700 rounded-full flex items-center justify-center mx-auto mb-6 text-neutral-400">
                <Leaf className="w-10 h-10 opacity-50" />
              </div>
              <p className="text-xl font-black text-neutral-600 dark:text-neutral-300">Aún no hay cosechas registradas.</p>
              <p className="text-neutral-500 font-medium mt-2 max-w-md mx-auto">Dirígete a <b>Control Vegetales</b> y marca un lote activo como "Cosechar" para generar sus etiquetas inteligentes.</p>
           </div>
         ) : (
           <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
             {filteredBatches.map(batch => (
                <div key={batch.id} className="bg-neutral-50 dark:bg-neutral-800/50 rounded-3xl p-6 border border-neutral-200 dark:border-neutral-700 hover:shadow-xl hover:border-emerald-500/50 transition-all group flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 bg-white dark:bg-neutral-900 rounded-2xl flex items-center justify-center shadow-sm text-emerald-500 border border-neutral-100 dark:border-neutral-800 group-hover:scale-110 transition-transform">
                        <Tag className="w-6 h-6" />
                      </div>
                      <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest rounded-lg">Cosechado</span>
                    </div>
                    <h4 className="text-xl font-black text-neutral-800 dark:text-neutral-100">{batch.plantName}</h4>
                    <p className="text-sm text-neutral-500 font-medium flex items-center gap-2 mt-2"><CalendarDays className="w-4 h-4" /> Recolectado: {batch.harvestDate}</p>
                    <p className="text-sm text-neutral-500 font-medium flex items-center gap-2 mt-1"><Leaf className="w-4 h-4" /> Prod: {batch.goodCondition} unidades</p>
                  </div>
                  <button 
                    onClick={() => openQrConfig(batch)}
                    className="w-full py-4 mt-6 bg-white dark:bg-neutral-900 hover:bg-emerald-500 dark:hover:bg-emerald-500 text-neutral-700 dark:text-neutral-300 hover:text-white rounded-2xl font-bold shadow-sm transition-colors border border-neutral-200 dark:border-neutral-700 flex justify-center items-center gap-2"
                  >
                    <QrCode className="w-5 h-5" /> Generar Código QR
                  </button>
                </div>
             ))}
           </div>
         )}
      </div>

      {/* QR Config Modal */}
      <AnimatePresence>
        {selectedBatch && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedBatch(null)} className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm" />
            
            <motion.div initial={{ opacity: 0, y: 50, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }} className="relative w-full max-w-5xl bg-white dark:bg-neutral-950 rounded-[40px] shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden flex flex-col lg:flex-row h-[90vh] lg:h-auto max-h-[90vh]">
              
              <button aria-label="Cerrar modal" title="Cerrar modal" onClick={() => setSelectedBatch(null)} className="absolute top-6 right-6 p-2 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-full z-[60] transition-colors"><X className="w-5 h-5" /></button>

               {/* Panel de Configuración e Información (Izquierda) */}
              <div className="w-full lg:w-1/2 p-8 lg:p-10 overflow-y-auto custom-scrollbar border-b lg:border-b-0 lg:border-r border-neutral-200 dark:border-neutral-800">
                 <h3 className="text-3xl font-black flex items-center gap-3 mb-2 text-neutral-800 dark:text-neutral-100"><Settings className="w-8 h-8 text-emerald-500" /> Configurar Etiqueta</h3>
                 <p className="text-neutral-500 font-medium text-sm mb-8">Los clientes al escanear el QR verán lo que construyas aquí.</p>

                 <div className="space-y-6">
                    <div>
                      <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2 block">Nombre Atractivo del Producto</label>
                      <input type="text" aria-label="Nombre del Producto" title="Nombre del Producto" value={qrConfig.plantName} onChange={(e) => setQrConfig({...qrConfig, plantName: e.target.value})} className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-2xl py-4 px-4 text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2 block">Fecha Cosecha</label>
                        <input type="date" aria-label="Fecha Cosecha" title="Fecha Cosecha" value={qrConfig.harvestDate} onChange={(e) => setQrConfig({...qrConfig, harvestDate: e.target.value})} className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-2xl py-4 px-4 text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none" />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2 block">Días de Cultivo</label>
                        <input type="number" aria-label="Días de Cultivo" title="Días de Cultivo" value={qrConfig.days} onChange={(e) => setQrConfig({...qrConfig, days: e.target.value})} className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-2xl py-4 px-4 text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2 block flex items-center gap-2"><MapPin className="w-4 h-4"/> Origen de la Finca</label>
                      <input type="text" aria-label="Origen de la Finca" title="Origen de la Finca" value={qrConfig.origin} onChange={(e) => setQrConfig({...qrConfig, origin: e.target.value})} className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-2xl py-4 px-4 text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none" />
                    </div>
                    {/* Removed video section */}
                 </div>

                 {/* Resultado QR Box */}
                 <div className="mt-10 p-6 bg-emerald-50 dark:bg-emerald-900/10 rounded-3xl border border-emerald-100 dark:border-emerald-900/30 flex flex-col items-center justify-center text-center">
                    <p className="text-sm font-black uppercase text-emerald-600 dark:text-emerald-400 mb-6 tracking-widest">Tu Código QR de Cosecha</p>
                    
                    {/* El Contenedor Imprimible UI */}
                    <div className="bg-white p-6 sm:p-8 rounded-[40px] shadow-xl border-4 border-white flex flex-col items-center justify-center w-full max-w-[320px]">
                      <h4 className="text-2xl font-black text-emerald-900 mb-6 text-center uppercase tracking-widest leading-tight w-full truncate">{qrConfig.plantName || "HidroJepe"}</h4>
                      <QRCode id="QRCodeImage" value={getPublicUrl()} size={200} fgColor="#065f46" />
                      <p className="mt-6 text-4xl font-bold text-emerald-500 [font-family:Georgia,cursive] italic">¡Escanéame!</p>
                    </div>

                    <div className="mt-8 flex flex-col w-full gap-3">
                      <button aria-label="Descargar QR" title="Descargar QR" onClick={downloadQR} className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black shadow-lg shadow-emerald-500/30 transition-all flex justify-center items-center gap-2">
                        <Download className="w-5 h-5"/> Descargar QR (.PNG)
                      </button>
                      <button aria-label="Imprimir QR" title="Imprimir QR" onClick={() => {
                        const w = window.open();
                        if(w) {
                           const companyName = qrConfig.plantName || "HidroJepe";
                           w.document.write(`
                             <html>
                               <head>
                                 <title>Imprimir QR</title>
                                 <meta charset="utf-8">
                                 <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Inter:wght@900&display=swap" rel="stylesheet">
                               </head>
                               <body style="display:flex; flex-direction:column; justify-content:center; align-items:center; height:100vh; margin:0; font-family: 'Inter', sans-serif;">
                                 <h1 style="font-size:36px; font-weight:900; margin-bottom:25px; text-transform:uppercase; color:#065f46; text-align:center; letter-spacing:0.1em;">${companyName}</h1>
                                 <img src="data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(new XMLSerializer().serializeToString(document.getElementById('QRCodeImage')!))))}" style="width:300px; height:300px;" />
                                 <h2 style="font-family: 'Dancing Script', cursive; font-size:55px; margin-top:25px; color:#10b981; margin-bottom:0;">¡Escanéame!</h2>
                                 <script>setTimeout(() => { window.print(); window.close(); }, 800);</script>
                               </body>
                             </html>
                           `);
                           w.document.close();
                        }
                      }} className="w-full py-4 bg-emerald-50 dark:bg-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-800/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 rounded-2xl font-black shadow-sm transition-all flex justify-center items-center gap-2">
                        <Printer className="w-5 h-5"/> Imprimir QR Directo
                      </button>
                      <a href={getPublicUrl()} target="_blank" rel="noopener noreferrer" className="w-full py-4 bg-white dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/50 rounded-2xl font-bold transition-all flex justify-center items-center gap-2">
                        <ExternalLink className="w-5 h-5"/> Abrir Link del Cliente
                      </a>
                    </div>
                 </div>
              </div>

              {/* Live Preview (Derecha) */}
              <div className="w-full lg:w-1/2 bg-neutral-200 dark:bg-black p-4 flex flex-col items-center justify-center relative shadow-inner">
                 <div className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 bg-black/40 backdrop-blur-md rounded-full text-white text-xs font-bold uppercase tracking-widest z-10">
                   <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> Vista Previa en Vivo
                 </div>
                 {/* Iframe o simulación del telefono */}
                 <div className="w-full max-w-[375px] h-[700px] bg-white rounded-[50px] overflow-hidden shadow-2xl border-[12px] border-neutral-900/10 dark:border-neutral-800 relative">
                   {/* Notch */}
                   <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-neutral-900/10 dark:bg-neutral-800 rounded-b-3xl z-20 backdrop-blur-md" />
                   
                   <iframe src={getPublicUrl()} className="w-full h-full border-none bg-neutral-50" title="Vista Previa de Etiqueta Inteligente" />
                 </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
