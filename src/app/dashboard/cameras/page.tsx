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

      <div className="flex justify-between">
        <h1 className="text-3xl font-black flex items-center gap-2">
          <Camera /> Cámaras
        </h1>
        <button onClick={() => setIsModalOpen(true)} className="bg-red-600 text-white px-4 py-2 rounded-xl">
          <Plus /> Agregar
        </button>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {cameras.map((cam) => (
          <div key={cam.id} className="bg-black rounded-2xl overflow-hidden relative">

            {/* ✅ VIDEO CORRECTO */}
            <img
              src={getCameraUrl(cam.url)}
              className="w-full h-60 object-cover"
              alt={cam.name}
              onError={(e) => {
                e.currentTarget.src = "/no-signal.png";
              }}
            />

            <div className="absolute top-2 left-2 bg-red-600 px-2 py-1 text-xs text-white rounded">
              EN VIVO
            </div>

            <div className="p-4 bg-white">
              <h3 className="font-bold">{cam.name}</h3>
              <p className="text-xs text-gray-500">{cam.location}</p>

              <div className="flex justify-between mt-2">
                <button onClick={() => setFullscreenCam(cam)}>
                  <Eye />
                </button>
                <button onClick={() => handleDeleteCamera(cam.id)}>
                  <Trash2 />
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* MODAL FULLSCREEN */}
      {fullscreenCam && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
          <button onClick={() => setFullscreenCam(null)} className="text-white p-4">
            <X />
          </button>

          <img
            src={getCameraUrl(fullscreenCam.url)}
            className="w-full h-full object-contain"
          />
        </div>
      )}
    {/* MODAL AGREGAR CÁMARA */}
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
                  <p className="text-xs text-neutral-500 font-bold">Añade la URL de video web</p>
                </div>
              </div>

              <form onSubmit={handleAddCamera} className="space-y-5">
                <div>
                  <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-2 block">Nombre de la Cámara</label>
                  <input
                    required
                    type="text"
                    placeholder="Ej: Invernadero 1"
                    className="w-full bg-neutral-50 dark:bg-neutral-800 p-4 rounded-2xl focus:ring-2 focus:ring-red-500 outline-none font-bold"
                    value={cameraForm.name}
                    onChange={(e) => setCameraForm({ ...cameraForm, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-2 block">URL (Stream)</label>
                  <input
                    required
                    type="url"
                    placeholder="http://192.168.1.100:8080/video"
                    className="w-full bg-neutral-50 dark:bg-neutral-800 p-4 rounded-2xl focus:ring-2 focus:ring-red-500 outline-none font-bold font-mono text-sm text-red-600 dark:text-red-400"
                    value={cameraForm.url}
                    onChange={(e) => setCameraForm({ ...cameraForm, url: e.target.value })}
                  />
                  <p className="text-[10px] text-neutral-400 mt-2 pl-2">Ingresa la URL completa o ruta en red (HTTP o HTTPS).</p>
                </div>
                <div>
                  <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-2 block">Ubicación / Sector</label>
                  <input
                    required
                    type="text"
                    placeholder="Ej: Cultivos DWC"
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

    </div>
  );
}
