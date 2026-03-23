"use client";

import React, { useState } from 'react';
import { 
  Bell, 
  Sprout, 
  AlertCircle, 
  PackageSearch, 
  Settings2,
  CheckCircle2,
  Trash2,
  Filter,
  MoreHorizontal
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const initialNotifications = [
  { id: '1', type: 'crop', title: 'Cosecha Lista', content: 'Lechuga Romana en Canal NFT A1 alcanzó su fecha de maduración optima.', date: 'Hoy, 10:30 AM', read: false },
  { id: '2', type: 'equipment', title: 'Falla Técnica detectada', content: 'El Sensor Humedad en Sector Norte reporta lecturas inconsistentes (Err: 404).', date: 'Hoy, 09:15 AM', read: false },
  { id: '3', type: 'inventory', title: 'Stock Crítico', content: 'Solución Nutritiva A por debajo del mínimo (Q: 15L). Programar compra.', date: 'Ayer, 06:45 PM', read: true },
  { id: '4', type: 'sale', title: 'Venta Mayor Registrada', content: 'Se confirmó el pago por 100 unidades de Lechuga Crespa.', date: 'Ayer, 02:20 PM', read: true },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'crop': return <Sprout className="w-5 h-5 text-green-500" />;
      case 'equipment': return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'inventory': return <PackageSearch className="w-5 h-5 text-orange-500" />;
      default: return <Bell className="w-5 h-5 text-blue-500" />;
    }
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
         <div>
            <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
               <Bell className="w-10 h-10 text-primary-500" />
               Notificaciones
            </h1>
            <p className="text-neutral-500 mt-2">Alertas automáticas de producción y mantenimiento.</p>
         </div>
         <button 
           onClick={markAllAsRead}
           className="text-sm font-bold text-primary-600 hover:text-primary-700 underline underline-offset-4"
         >
           Marcar todas como leídas
         </button>
      </div>

      <div className="flex gap-4 p-2 bg-neutral-100 dark:bg-neutral-900 rounded-2xl w-fit">
         {['Todas', 'Producción', 'Equipos', 'Sistema'].map(f => (
           <button key={f} className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${f === 'Todas' ? 'bg-white dark:bg-neutral-800 shadow-sm' : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'}`}>
             {f}
           </button>
         ))}
      </div>

      <div className="space-y-4">
         <AnimatePresence mode='popLayout'>
            {notifications.map((notif, i) => (
              <motion.div
                layout
                key={notif.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.05 }}
                className={`group p-6 rounded-3xl border transition-all duration-300 flex items-start gap-5 relative overflow-hidden backdrop-blur-sm
                  ${notif.read ? 'bg-white dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800 opacity-70' : 'bg-primary-50/20 dark:bg-primary-500/5 border-primary-200 dark:border-primary-500/20 shadow-xl shadow-primary-500/5'}
                `}
              >
                {!notif.read && (
                  <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-primary-500" />
                )}
                
                <div className="w-12 h-12 rounded-2xl bg-neutral-50 dark:bg-neutral-800 flex items-center justify-center shrink-0">
                   {getTypeIcon(notif.type)}
                </div>

                <div className="flex-1 space-y-1">
                   <div className="flex justify-between items-center">
                      <h4 className="font-bold text-lg">{notif.title}</h4>
                      <span className="text-[10px] font-black uppercase text-neutral-400">{notif.date}</span>
                   </div>
                   <p className="text-neutral-500 text-sm leading-relaxed">{notif.content}</p>
                </div>

                <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button 
                     onClick={() => deleteNotification(notif.id)}
                     className="p-3 bg-neutral-100 dark:bg-neutral-800 rounded-xl text-neutral-400 hover:text-red-500 transition-colors"
                     title="Eliminar notificación"
                     aria-label="Eliminar notificación"
                   >
                      <Trash2 className="w-4 h-4" />
                   </button>
                   <button 
                     className="p-3 bg-neutral-100 dark:bg-neutral-800 rounded-xl text-neutral-400 hover:text-primary-500 transition-colors"
                     title="Marcar como leída"
                     aria-label="Marcar como leída"
                   >
                      <CheckCircle2 className="w-4 h-4" />
                   </button>
                </div>
              </motion.div>
            ))}
         </AnimatePresence>

         {notifications.length === 0 && (
           <div className="py-20 text-center space-y-4 bg-neutral-50 dark:bg-neutral-900 rounded-[40px] border border-dashed border-neutral-300">
              <div className="w-20 h-20 bg-white dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto shadow-sm">
                 <Bell className="w-10 h-10 text-neutral-200" />
              </div>
              <p className="text-neutral-400 font-bold">No tienes notificaciones pendientes.</p>
           </div>
         )}
      </div>

      <div className="p-8 rounded-[40px] bg-neutral-900 text-white flex items-center justify-between">
         <div className="flex items-center gap-6">
            <div className="w-14 h-14 rounded-3xl bg-primary-600 flex items-center justify-center shadow-xl shadow-primary-500/20">
               <Settings2 className="w-7 h-7" />
            </div>
            <div>
               <h3 className="font-bold text-xl">Configuración de Canales</h3>
               <p className="opacity-50 text-sm">Gestiona alertas vía Email, WhatsApp o Push.</p>
            </div>
         </div>
         <button className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl font-black text-sm transition-all">
            Configurar
         </button>
      </div>
    </div>
  );
}
