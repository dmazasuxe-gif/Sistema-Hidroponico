"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera, Plus, Trash2, Maximize2, X, Download, Share2, Image as ImageIcon 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Voucher {
  id: string;
  name: string;
  image: string; // Base64
  date: string;
}

export default function VouchersPage() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fullscreenVoucher, setFullscreenVoucher] = useState<Voucher | null>(null);
  const [voucherName, setVoucherName] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('payment_vouchers');
    if (saved) setVouchers(JSON.parse(saved));
  }, []);

  const saveVouchers = (newVouchers: Voucher[]) => {
    setVouchers(newVouchers);
    localStorage.setItem('payment_vouchers', JSON.stringify(newVouchers));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Compresión automática de imágenes usando Canvas para evitar error QuotaExceededError en localStorage
        const img = new window.Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;
          
          // Escalar si es muy grande (máx 1000px ancho)
          const MAX_WIDTH = 1000;
          if (width > MAX_WIDTH) {
            height = height * (MAX_WIDTH / width);
            width = MAX_WIDTH;
          }
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Comprime a JPEG del 70% de calidad, reduciendo ~10MB a ~120KB
          const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.7);
          setPreviewImage(compressedDataUrl);
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!previewImage) return;

    const newVoucher: Voucher = {
      id: Math.random().toString(36).substring(2, 9),
      name: voucherName,
      image: previewImage,
      date: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    };

    saveVouchers([newVoucher, ...vouchers]);
    setVoucherName('');
    setPreviewImage(null);
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Eliminar este boucher permanentemente?')) {
      saveVouchers(vouchers.filter(v => v.id !== id));
    }
  };

  const handleShareWhatsApp = async (voucher: Voucher) => {
    try {
      const response = await fetch(voucher.image);
      const blob = await response.blob();
      const file = new File([blob], `Boucher-${voucher.name.replace(/ /g, '_')}.jpg`, { type: 'image/jpeg' });
      
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'Comprobante de Pago',
          text: `Te comparto el comprobante de pago emitido por: ${voucher.name}`,
          files: [file]
        });
      } else {
        alert("Tu dispositivo actual no soporta compartir imágenes directamente. Por favor, usa el botón de descarga primero.");
      }
    } catch (error) {
      console.error("Error compartiendo:", error);
      alert("Hubo un error al intentar abrir WhatsApp con la imagen.");
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      {/* Header Premium */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-blue-500/10 dark:bg-blue-500/20 rounded-2xl">
              <Camera className="w-8 h-8 text-blue-600 dark:text-blue-500" />
            </div>
            <h1 className="text-4xl font-black tracking-tight text-neutral-900 dark:text-white">Bouchers de Pago</h1>
          </motion.div>
          <p className="text-neutral-500 font-medium max-w-xl">Escanea, captura o sube fotos de tus comprobantes de pago. Adjúntalos al nombre del cliente o proveedor para llevar un historial visual ordenado.</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsModalOpen(true)} 
          className="flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold shadow-xl shadow-blue-600/30 transition-all border border-blue-500/50"
        >
          <Plus className="w-5 h-5" />
          Subir Boucher
        </motion.button>
      </div>

      {/* Grid Bento Glassmorphism */}
      {vouchers.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="p-16 rounded-[40px] bg-white/50 dark:bg-neutral-900/50 backdrop-blur-3xl border border-neutral-200 dark:border-neutral-800 text-center shadow-2xl flex flex-col items-center justify-center"
        >
          <div className="w-24 h-24 mb-6 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shadow-inner">
            <ImageIcon className="w-10 h-10 text-neutral-400" />
          </div>
          <h3 className="text-2xl font-black text-neutral-800 dark:text-neutral-100 mb-2">Caja Fuerte Vacía</h3>
          <p className="text-neutral-500 max-w-sm mx-auto mb-8 font-medium">Aún no hay comprobantes. Usa el botón superior para tomar la primera foto a un boucher de pago.</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {vouchers.map((voucher, idx) => (
              <motion.div 
                key={voucher.id} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: idx * 0.05 }}
                className="group relative bg-white dark:bg-neutral-900 rounded-[32px] overflow-hidden shadow-2xl shadow-neutral-200/50 dark:shadow-black/50 border border-neutral-200/50 dark:border-neutral-800 transition-all duration-300 hover:-translate-y-2 hover:shadow-blue-500/10 flex flex-col"
              >
                {/* Imagen del Boucher */}
                <div className="relative aspect-[3/4] bg-neutral-100 dark:bg-neutral-950 overflow-hidden shrink-0">
                  <img
                    src={voucher.image}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    alt={voucher.name}
                  />
                  
                  {/* Gradiente Oscuro Superpuesto */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 opacity-70 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none" />

                  {/* Acciones Hover (Descargar, Share, Borrar) */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2 z-10 opacity-0 group-hover:opacity-100 translate-x-[10px] group-hover:translate-x-0 transition-all duration-300">
                    <a 
                      href={voucher.image} download={`boucher-${voucher.name.replace(/ /g, '-')}.jpg`}
                      className="p-2.5 bg-white/20 backdrop-blur-md hover:bg-blue-600 text-white hover:text-white rounded-xl transition-all shadow-lg flex items-center justify-center"
                      title="Descargar"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                    <button 
                      onClick={() => handleShareWhatsApp(voucher)}
                      className="p-2.5 bg-green-500/80 backdrop-blur-md hover:bg-green-500 text-white rounded-xl transition-all shadow-lg flex items-center justify-center"
                      title="Enviar por WhatsApp"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(voucher.id)}
                      className="p-2.5 bg-black/40 backdrop-blur-md hover:bg-red-600 text-white/70 hover:text-white rounded-xl transition-all shadow-lg flex items-center justify-center"
                      title="Eliminar Boucher"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Icono Ojo (Previsualizar) Centrado */}
                  <button
                    onClick={() => setFullscreenVoucher(voucher)}
                    title="Previsualizar Boucher"
                    className="absolute inset-0 m-auto w-14 h-14 bg-white/20 backdrop-blur-md hover:bg-white text-white hover:text-black rounded-full transition-all shadow-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 z-10"
                  >
                    <Maximize2 className="w-6 h-6" />
                  </button>
                </div>

                {/* Footer Info */}
                <div className="p-5 bg-white dark:bg-neutral-900 z-20 relative">
                  <h3 className="text-lg font-black text-neutral-900 dark:text-white leading-tight truncate" title={voucher.name}>{voucher.name}</h3>
                  <p className="text-[10px] font-bold text-neutral-400 mt-1 uppercase tracking-widest">{voucher.date}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Pantalla Completa Modal */}
      <AnimatePresence>
        {fullscreenVoucher && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[120] flex flex-col bg-black/95 backdrop-blur-3xl"
          >
            <div className="p-6 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent absolute top-0 w-full z-10">
              <div className="flex flex-col">
                <h2 className="text-white font-black text-2xl drop-shadow-lg">{fullscreenVoucher.name}</h2>
                <span className="text-blue-400 text-xs font-bold">{fullscreenVoucher.date}</span>
              </div>
              <button 
                onClick={() => setFullscreenVoucher(null)} 
                title="Cerrar pantalla completa"
                className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/10 hover:bg-blue-600 text-white transition-all backdrop-blur-md"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 flex items-center justify-center p-4 pt-24 overflow-hidden">
              <img
                src={fullscreenVoucher.image}
                className="w-full h-full object-contain drop-shadow-2xl rounded-2xl"
                alt={fullscreenVoucher.name}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Agregar Boucher */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-lg bg-white dark:bg-neutral-900 rounded-[40px] p-8 md:p-10 shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
              <div className="flex items-center gap-5 mb-8">
                <div className="w-16 h-16 rounded-[24px] bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-500 shadow-inner shrink-0">
                  <Camera className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-neutral-900 dark:text-white">Nuevo Boucher</h3>
                  <p className="text-sm text-neutral-500 mt-1 font-medium leading-tight">Sube una imagen de tu galería o toma una foto del ticket al instante.</p>
                </div>
              </div>

              <form onSubmit={handleAddVoucher} className="space-y-6">
                
                {/* Uploader Image Component */}
                <div className="w-full">
                  <input 
                    type="file" 
                    accept="image/*" 
                    ref={fileInputRef} 
                    title="Subir archivo boucher"
                    onChange={handleFileChange} 
                    className="hidden" 
                    required={!previewImage}
                  />
                  
                  {previewImage ? (
                    <div className="relative w-full h-48 bg-neutral-100 dark:bg-neutral-800 rounded-3xl overflow-hidden group shadow-inner">
                      <img src={previewImage} alt="Preview" className="w-full h-full object-contain bg-black/5" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <button type="button" onClick={() => fileInputRef.current?.click()} className="px-5 py-3 bg-white hover:bg-gray-100 text-black rounded-xl font-black flex items-center gap-2 transition-colors transform active:scale-95">
                          <ImageIcon className="w-4 h-4" /> Cambiar Imagen
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button 
                      type="button" 
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full h-48 border-2 border-dashed border-neutral-300 dark:border-neutral-700 hover:border-blue-500 dark:hover:border-blue-500 rounded-3xl flex flex-col items-center justify-center gap-3 transition-colors text-neutral-400 hover:text-blue-500 bg-neutral-50 dark:bg-neutral-800/50"
                    >
                      <Camera className="w-10 h-10 mb-2" />
                      <span className="font-black text-sm uppercase tracking-wider">Tomar Foto o Subir Archivo</span>
                    </button>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black text-neutral-400 uppercase tracking-widest pl-2">¿De quién es el pago?</label>
                  <input 
                    required 
                    type="text" 
                    placeholder="Ej: Cliente Juan Pérez - Factura #023" 
                    className="w-full bg-neutral-100 dark:bg-neutral-800/50 p-4 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-neutral-800 dark:text-neutral-100 border border-transparent focus:border-blue-500/20 transition-all shadow-inner" 
                    value={voucherName} 
                    onChange={(e) => setVoucherName(e.target.value)} 
                  />
                </div>
                
                <div className="pt-4 flex flex-col-reverse md:flex-row gap-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-4 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 hover:dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 rounded-2xl font-bold transition-all w-full md:w-auto">Cancelar</button>
                  <button type="submit" disabled={!previewImage} className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl font-black shadow-xl shadow-blue-600/20 border border-blue-500/50 transition-all w-full">Guardar Boucher</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
