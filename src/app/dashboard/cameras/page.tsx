"use client";

import React, { useState, useEffect } from 'react';
import { 
  Camera, 
  Plus, 
  Trash2, 
  Maximize2, 
  X, 
  Wifi,
  Video,
  Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CameraDevice {
  id: string;
  name: string;
  url: string;
  location: string;
}

export default function CamerasPage() {
  const [cameras, setCameras] = useState<CameraDevice[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fullscreenCam, setFullscreenCam] = useState<CameraDevice | null>(null);
  const [cameraForm, setCameraForm] = useState({ name: '', url: '', location: '' });

  useEffect(() => {
    const saved = localStorage.getItem('security_cameras');
    if (saved) setCameras(JSON.parse(saved));
  }, []);

  const saveCameras = (newCams: CameraDevice[]) => {
    setCameras(newCams);
    localStorage.setItem('security_cameras', JSON.stringify(newCams));
  };

  const handleAddCamera = (e: React.FormEvent) => {
    e.preventDefault();
    const newCam: CameraDevice = {
      id: Math.random().toString(36).substr(2, 9),
      name: cameraForm.name,
      url: cameraForm.url,
      location: cameraForm.location,
    };
    saveCameras([...cameras, newCam]);
    setCameraForm({ name: '', url: '', location: '' });
    setIsModalOpen(false);
  };

  const handleDeleteCamera = (id: string) => {
    if (confirm('¿Eliminar esta cámara del sistema?')) {
      saveCameras(cameras.filter(c => c.id !== id));
    }
  };

  // Las cámaras locales (192.168.x.x) no pueden pasar por el Proxy de Vercel porque Vercel está en la nube.
  // Por lo tanto, el navegador web del usuario debe conectarse directamente usando la URL.
  const getCameraUrl = (url: string) => {
    return url;
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      {/* Header Premium */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-red-500/10 dark:bg-red-500/20 rounded-2xl">
              <Video className="w-8 h-8 text-red-600 dark:text-red-500" />
            </div>
            <h1 className="text-4xl font-black tracking-tight text-neutral-900 dark:text-white">Centro de Monitoreo</h1>
          </motion.div>
          <p className="text-neutral-500 font-medium max-w-xl">Supervisa el estado de tus cultivos en tiempo real. Configura tus cámaras IP para vigilar la producción las 24 horas del día.</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsModalOpen(true)} 
          className="flex items-center justify-center gap-2 px-6 py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-bold shadow-xl shadow-red-600/30 transition-all border border-red-500/50"
        >
          <Plus className="w-5 h-5" />
          Conectar Cámara
        </motion.button>
      </div>

      {/* Grid de Cámaras - Estilo Bento Glassmorphism */}
      {cameras.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="p-16 rounded-[40px] bg-white/50 dark:bg-neutral-900/50 backdrop-blur-3xl border border-neutral-200 dark:border-neutral-800 text-center shadow-2xl flex flex-col items-center justify-center"
        >
          <div className="w-24 h-24 mb-6 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shadow-inner">
            <Camera className="w-10 h-10 text-neutral-400" />
          </div>
          <h3 className="text-2xl font-black text-neutral-800 dark:text-neutral-100 mb-2">Sin Cámaras</h3>
          <p className="text-neutral-500 max-w-sm mx-auto mb-8 font-medium">Aún no has conectado ninguna cámara. Agrega la primera introduciendo la URL de su transmisión en red.</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {cameras.map((cam, idx) => (
              <motion.div 
                key={cam.id} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: idx * 0.1 }}
                className="group relative bg-white dark:bg-neutral-900 rounded-[32px] overflow-hidden shadow-2xl shadow-neutral-200/50 dark:shadow-black/50 border border-neutral-200/50 dark:border-neutral-800 transition-all duration-500 hover:-translate-y-2 hover:shadow-red-500/10 flex flex-col"
              >
                {/* Contenedor de Video 16:9 Premium */}
                <div className="relative aspect-video bg-neutral-950 overflow-hidden shrink-0">
                  <img
                    src={getCameraUrl(cam.url)}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    alt={cam.name}
                    onError={(e) => {
                      e.currentTarget.src = "/apple-icon.png";
                      e.currentTarget.className = "w-1/2 h-1/2 object-contain absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-20 filter grayscale";
                    }}
                  />
                  
                  {/* Gradiente Oscuro Superpuesto para Texto */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/40 opacity-80 group-hover:opacity-60 transition-opacity duration-500 pointer-events-none" />

                  {/* Indicador EN VIVO (Top Left) */}
                  <div className="absolute top-4 left-4 z-10">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-red-600/90 backdrop-blur-md rounded-xl shadow-lg border border-red-500/50">
                      <div className="w-2 h-2 bg-white rounded-full animate-ping absolute" />
                      <div className="w-2 h-2 bg-white rounded-full relative" />
                      <span className="text-[10px] font-black tracking-widest text-white">LIVE</span>
                    </div>
                  </div>

                  {/* Botones Flotantes Ocultos (Top Right) */}
                  <div className="absolute top-4 right-4 flex gap-2 z-10 opacity-0 group-hover:opacity-100 translate-y-[-10px] group-hover:translate-y-0 transition-all duration-300">
                    <button 
                      onClick={() => setFullscreenCam(cam)}
                      className="p-2.5 bg-white/20 backdrop-blur-md hover:bg-white text-white hover:text-black rounded-xl transition-all shadow-lg"
                      title="Pantalla Completa"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteCamera(cam.id)}
                      className="p-2.5 bg-black/40 backdrop-blur-md hover:bg-red-600 text-white/70 hover:text-white rounded-xl transition-all shadow-lg"
                      title="Eliminar cámara"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Footer del Bento Grid Item */}
                <div className="p-5 flex items-center justify-between bg-white dark:bg-neutral-900 z-20 relative">
                  <div>
                    <h3 className="text-lg font-black text-neutral-900 dark:text-white leading-tight">{cam.name}</h3>
                    <div className="flex items-center gap-1.5 mt-1 text-neutral-500">
                      <Wifi className="w-3 h-3 text-red-500" />
                      <p className="text-[10px] tracking-widest font-bold uppercase">{cam.location}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setFullscreenCam(cam)}
                    className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-500/10 text-neutral-400 hover:text-red-500 transition-colors"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Pantalla Completa Modal */}
      <AnimatePresence>
        {fullscreenCam && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[120] flex flex-col bg-black/95 backdrop-blur-3xl"
          >
            <div className="p-6 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent absolute top-0 w-full z-10">
              <div className="flex items-center gap-4">
                <div className="px-3 py-1.5 bg-red-600 rounded-xl flex items-center gap-2">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  <span className="text-xs font-black text-white tracking-widest">LIVE</span>
                </div>
                <div>
                  <h2 className="text-white font-black text-xl">{fullscreenCam.name}</h2>
                  <p className="text-red-400 text-xs font-bold uppercase tracking-widest">{fullscreenCam.location}</p>
                </div>
              </div>
              <button 
                onClick={() => setFullscreenCam(null)} 
                className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/10 hover:bg-red-600 text-white transition-all backdrop-blur-md"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 flex items-center justify-center p-4 pt-24">
              <img
                src={getCameraUrl(fullscreenCam.url)}
                className="w-full h-full object-contain drop-shadow-2xl rounded-2xl"
                alt={fullscreenCam.name}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Agregar Cámara Premium */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-lg bg-white dark:bg-neutral-900 rounded-[40px] p-8 md:p-10 shadow-2xl border border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-5 mb-8">
                <div className="w-16 h-16 rounded-[24px] bg-red-100 dark:bg-red-500/10 flex items-center justify-center text-red-600 dark:text-red-500 shadow-inner">
                  <Video className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-neutral-900 dark:text-white">Conectar Cámara</h3>
                  <p className="text-sm text-neutral-500 mt-1 font-medium">Vincula una cámara IP al centro de monitoreo.</p>
                </div>
              </div>

              <form onSubmit={handleAddCamera} className="space-y-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-neutral-400 uppercase tracking-widest pl-2">Identificador</label>
                  <input required type="text" placeholder="Ej: Módulo Principal" className="w-full bg-neutral-100 dark:bg-neutral-800/50 p-4 rounded-2xl focus:ring-2 focus:ring-red-500 outline-none font-bold text-neutral-800 dark:text-neutral-100 border border-transparent focus:border-red-500/20 transition-all" value={cameraForm.name} onChange={(e) => setCameraForm({ ...cameraForm, name: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-neutral-400 uppercase tracking-widest pl-2">URL de Transmisión Web</label>
                  <input required type="url" placeholder="http://192.168.1.100:8080/video" className="w-full bg-neutral-100 dark:bg-neutral-800/50 p-4 rounded-2xl focus:ring-2 focus:ring-red-500 outline-none font-bold font-mono text-sm text-red-600 dark:text-red-400 border border-transparent focus:border-red-500/20 transition-all shadow-inner" value={cameraForm.url} onChange={(e) => setCameraForm({ ...cameraForm, url: e.target.value })} />
                  <p className="text-xs text-neutral-400 pl-2 leading-tight mt-2">Asegúrate de incluir <span className="font-mono text-neutral-500">/video</span> o la ruta final del stream MJPEG.</p>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-neutral-400 uppercase tracking-widest pl-2">Ubicación / Sector</label>
                  <input required type="text" placeholder="Ej: Zona Sur NFT" className="w-full bg-neutral-100 dark:bg-neutral-800/50 p-4 rounded-2xl focus:ring-2 focus:ring-red-500 outline-none font-bold text-neutral-800 dark:text-neutral-100 border border-transparent focus:border-red-500/20 transition-all" value={cameraForm.location} onChange={(e) => setCameraForm({ ...cameraForm, location: e.target.value })} />
                </div>
                
                <div className="pt-4 flex flex-col-reverse md:flex-row gap-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-4 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 hover:dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 rounded-2xl font-bold transition-all w-full md:w-auto">Cancelar</button>
                  <button type="submit" className="flex-1 py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black shadow-xl shadow-red-600/20 border border-red-500/50 transition-all w-full">Vincular Cámara</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
