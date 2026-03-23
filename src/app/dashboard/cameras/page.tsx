"use client";

import React, { useState, useEffect } from 'react';
import { 
  Camera, 
  Plus, 
  Trash2, 
  Maximize2, 
  Minimize2, 
  X, 
  Wifi, 
  WifiOff,
  Settings2,
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

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
            <Camera className="w-10 h-10 text-red-500" />
            Cámaras de Seguridad
          </h1>
          <p className="text-neutral-500 mt-2 font-medium">Monitorea tu vivero hidropónico en tiempo real desde cualquier dispositivo.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center space-x-2 px-6 py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-bold shadow-lg shadow-red-500/20 transition-all"
        >
          <Plus className="w-5 h-5" />
          <span>Agregar Cámara</span>
        </button>
      </div>

      {/* Info Banner */}
      <div className="p-6 rounded-[32px] bg-neutral-900 text-white border border-neutral-800 flex flex-col md:flex-row md:items-center gap-6">
        <div className="w-12 h-12 rounded-2xl bg-red-500/20 flex items-center justify-center shrink-0">
          <Video className="w-6 h-6 text-red-400" />
        </div>
        <div className="flex-1">
          <p className="font-black text-sm mb-1">¿Cómo conectar tus cámaras IP?</p>
          <p className="text-xs text-neutral-400 leading-relaxed max-w-2xl">
            Ingresa la <strong className="text-white">URL de acceso web</strong> de tu cámara IP. 
            La mayoría de cámaras tienen una dirección como <code className="bg-neutral-800 px-2 py-0.5 rounded text-red-400">http://192.168.1.XX:puerto</code> o un enlace de nube del fabricante. 
            Consulta el manual de tu cámara para obtener la URL de streaming (MJPEG/HTTP).
          </p>
        </div>
      </div>

      {/* Camera Grid */}
      {cameras.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          <AnimatePresence>
            {cameras.map((cam) => (
              <motion.div
                key={cam.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="rounded-[40px] bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-sm hover:shadow-2xl transition-all group"
              >
                {/* Camera Feed */}
                <div className="relative aspect-video bg-neutral-950 overflow-hidden">
                  <iframe
                    src={cam.url}
                    className="w-full h-full border-0"
                    title={`Cámara: ${cam.name}`}
                    allow="autoplay; fullscreen"
                    sandbox="allow-same-origin allow-scripts"
                  />
                  
                  {/* Overlay Controls */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {/* Top Bar */}
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-red-600 rounded-xl">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                        <span className="text-[10px] font-black uppercase text-white tracking-widest">EN VIVO</span>
                      </div>
                      <button
                        onClick={() => handleDeleteCamera(cam.id)}
                        className="p-2 bg-black/40 hover:bg-red-600 text-white rounded-xl transition-all"
                        title="Eliminar cámara"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Bottom Bar */}
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                      <div>
                        <p className="text-white font-black text-sm">{cam.name}</p>
                        <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">{cam.location}</p>
                      </div>
                      <button
                        onClick={() => setFullscreenCam(cam)}
                        className="p-3 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white rounded-2xl transition-all"
                        title="Pantalla completa"
                      >
                        <Maximize2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Camera Info */}
                <div className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
                      <Wifi className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                      <p className="font-black text-sm">{cam.name}</p>
                      <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{cam.location}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setFullscreenCam(cam)}
                    className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition-all"
                    title="Ver en pantalla completa"
                  >
                    <Eye className="w-5 h-5 text-neutral-400" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="p-20 rounded-[56px] bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-center">
          <div className="w-20 h-20 rounded-[28px] bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mx-auto mb-6">
            <Camera className="w-10 h-10 text-neutral-300" />
          </div>
          <h3 className="text-2xl font-black mb-2">Sin cámaras configuradas</h3>
          <p className="text-neutral-500 text-sm max-w-md mx-auto mb-8">
            Agrega tus cámaras IP para monitorear tu vivero hidropónico en tiempo real. 
            Necesitarás la URL de acceso web de cada cámara.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-bold shadow-lg shadow-red-500/20 transition-all"
          >
            Configurar Primera Cámara
          </button>
        </div>
      )}

      {/* Add Camera Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-neutral-900/80 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 30 }} className="relative w-full max-w-md bg-white dark:bg-neutral-900 rounded-[40px] p-10 shadow-2xl">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                  <Camera className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <h3 className="text-2xl font-black">Nueva Cámara</h3>
                  <p className="text-xs text-neutral-500 font-bold">Configura una cámara IP de tu vivero</p>
                </div>
              </div>

              <form onSubmit={handleAddCamera} className="space-y-5">
                <div>
                  <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-2 block">Nombre de la Cámara</label>
                  <input
                    required
                    type="text"
                    placeholder="Ej: Entrada Principal"
                    title="Nombre de la cámara"
                    className="w-full bg-neutral-50 dark:bg-neutral-800 p-4 rounded-2xl focus:ring-2 focus:ring-red-500 outline-none font-bold"
                    value={cameraForm.name}
                    onChange={(e) => setCameraForm({ ...cameraForm, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-2 block">URL de la Cámara (Stream)</label>
                  <input
                    required
                    type="url"
                    placeholder="http://192.168.1.100:8080/video"
                    title="URL del stream de la cámara"
                    className="w-full bg-neutral-50 dark:bg-neutral-800 p-4 rounded-2xl focus:ring-2 focus:ring-red-500 outline-none font-bold font-mono text-sm text-red-600 dark:text-red-400"
                    value={cameraForm.url}
                    onChange={(e) => setCameraForm({ ...cameraForm, url: e.target.value })}
                  />
                  <p className="text-[10px] text-neutral-400 mt-2 pl-2">Ingresa la URL completa de acceso web de tu cámara IP (HTTP o HTTPS).</p>
                </div>
                <div>
                  <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-2 block">Ubicación / Zona</label>
                  <input
                    required
                    type="text"
                    placeholder="Ej: Zona de cultivo NFT"
                    title="Ubicación de la cámara"
                    className="w-full bg-neutral-50 dark:bg-neutral-800 p-4 rounded-2xl focus:ring-2 focus:ring-red-500 outline-none font-bold"
                    value={cameraForm.location}
                    onChange={(e) => setCameraForm({ ...cameraForm, location: e.target.value })}
                  />
                </div>
                <div className="pt-4 flex gap-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 bg-neutral-100 dark:bg-neutral-800 rounded-2xl font-bold">Cancelar</button>
                  <button type="submit" className="flex-1 py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-bold shadow-lg shadow-red-500/20 transition-all">Guardar Cámara</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Fullscreen Camera Modal */}
      <AnimatePresence>
        {fullscreenCam && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full h-full flex flex-col">
              {/* Fullscreen Header */}
              <div className="absolute top-0 inset-x-0 z-50 p-6 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-red-600 rounded-xl">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    <span className="text-[10px] font-black uppercase text-white tracking-widest">EN VIVO</span>
                  </div>
                  <div>
                    <p className="text-white font-black">{fullscreenCam.name}</p>
                    <p className="text-white/50 text-[10px] font-bold uppercase tracking-widest">{fullscreenCam.location}</p>
                  </div>
                </div>
                <button
                  onClick={() => setFullscreenCam(null)}
                  className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-2xl transition-all"
                  title="Cerrar pantalla completa"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Fullscreen Feed */}
              <iframe
                src={fullscreenCam.url}
                className="w-full h-full border-0"
                title={`Cámara Completa: ${fullscreenCam.name}`}
                allow="autoplay; fullscreen"
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
