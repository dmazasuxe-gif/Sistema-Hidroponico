"use client";

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  MapPin, 
  PhoneCall, 
  Plus, 
  Search,
  User,
  MoreVertical,
  MessageCircle,
  Truck,
  Edit2,
  Trash2,
  X,
  Heart
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Client {
  id: string;
  fullName: string;
  deliveryLocation: string;
  phone: string;
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState('');

  // Modals state
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [clientForm, setClientForm] = useState({ fullName: '', deliveryLocation: '', phone: '' });

  // Dropdown states using client ID
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('clients');
    if (saved) {
      setClients(JSON.parse(saved));
    }
  }, []);

  const saveClients = (newClients: Client[]) => {
    setClients(newClients);
    localStorage.setItem('clients', JSON.stringify(newClients));
  };

  const filteredClients = clients.filter(c => 
    c.fullName.toLowerCase().includes(search.toLowerCase()) || 
    c.deliveryLocation.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenModal = (client?: Client) => {
    if (client) {
      setEditingClient(client);
      setClientForm({ fullName: client.fullName, deliveryLocation: client.deliveryLocation, phone: client.phone });
    } else {
      setEditingClient(null);
      setClientForm({ fullName: '', deliveryLocation: '', phone: '' });
    }
    setOpenDropdownId(null);
    setIsClientModalOpen(true);
  };

  const handleSaveClient = (e: React.FormEvent) => {
    e.preventDefault();
    let newClients = [...clients];
    if (editingClient) {
      newClients = clients.map(c => 
        c.id === editingClient.id ? { ...c, ...clientForm } : c
      );
    } else {
      newClients = [{ id: Math.random().toString(36).substr(2, 9), ...clientForm }, ...clients];
    }
    saveClients(newClients);
    setIsClientModalOpen(false);
  };

  const handleDeleteClient = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (confirm("¿Estás seguro de eliminar este cliente?")) {
      saveClients(clients.filter(c => c.id !== id));
      setOpenDropdownId(null);
    }
  };

  const toggleDropdown = (id: string) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  const generateWaLink = (phone: string, text: string) => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-20 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
             <Users className="w-10 h-10 text-primary-500" />
             Directorio de Clientes
          </h1>
          <p className="text-neutral-500 mt-2">Gestiona compradores y fideliza tu base de clientes.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center space-x-2 px-6 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-bold shadow-lg shadow-primary-500/20 transition-all font-bold"
        >
          <Plus className="w-5 h-5" />
          <span>Nuevo Cliente</span>
        </button>
      </div>

      <div className="p-8 rounded-[40px] bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm relative">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-black flex items-center gap-2">
            <User className="w-6 h-6 text-primary-500" />
            Agenda de Negocios
          </h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input 
              type="text" 
              placeholder="Buscar cliente..."
              className="bg-neutral-50 dark:bg-neutral-800 border-none rounded-xl py-2 pl-10 pr-4 text-sm font-medium focus:ring-2 focus:ring-primary-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredClients.map(client => (
              <motion.div 
                key={client.id}
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                className="relative p-6 px-7 rounded-3xl bg-neutral-50/50 dark:bg-neutral-800/30 border border-neutral-100 dark:border-neutral-700/50 hover:bg-white dark:hover:bg-neutral-900 transition-all group flex flex-col justify-between shadow-sm hover:shadow-xl"
              >
                 <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary-100 text-primary-600 dark:bg-primary-900/30 flex items-center justify-center font-black text-xl">
                      {client.fullName.charAt(0).toUpperCase()}
                    </div>
                    
                    <div className="relative">
                      <button 
                        onClick={() => toggleDropdown(client.id)}
                        className="text-neutral-400 hover:text-primary-500 transition-colors p-2"
                        title="Opciones"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>
                      
                      {openDropdownId === client.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-neutral-800 rounded-2xl shadow-xl border border-neutral-200 dark:border-neutral-700 z-10 overflow-hidden py-1">
                          <button 
                            onClick={() => handleOpenModal(client)}
                            className="w-full text-left px-4 py-3 text-sm font-bold hover:bg-neutral-50 dark:hover:bg-neutral-700 flex items-center gap-2"
                          >
                            <Edit2 className="w-4 h-4 text-neutral-500" /> Editar Datos
                          </button>
                          <button 
                            onClick={(e) => handleDeleteClient(client.id, e)}
                            className="w-full text-left px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 flex items-center gap-2"
                          >
                            <Trash2 className="w-4 h-4" /> Eliminar Cliente
                          </button>
                        </div>
                      )}
                    </div>
                 </div>
                 
                 <div>
                   <h4 className="text-lg font-black mb-1 leading-tight uppercase tracking-tight">{client.fullName}</h4>
                   
                   <div className="space-y-3 mt-4">
                     <div className="flex items-start gap-3 text-sm text-neutral-500">
                       <MapPin className="w-4 h-4 mt-0.5 text-neutral-400 shrink-0" />
                       <span className="leading-tight">{client.deliveryLocation}</span>
                     </div>
                     <div className="flex items-center gap-3 text-sm text-neutral-500">
                       <PhoneCall className="w-4 h-4 text-neutral-400 shrink-0" />
                       <span className="font-bold text-primary-600 dark:text-primary-400">{client.phone}</span>
                     </div>
                   </div>
                 </div>
 
                 <div className="mt-6 pt-4 border-t border-neutral-200 dark:border-neutral-800 grid grid-cols-2 gap-2">
                    <a 
                      href={generateWaLink(client.phone, `¡Hola ${client.fullName}! Tu pedido de verduras hidropónicas ya está en camino.`)}
                      target="_blank" rel="noopener noreferrer"
                      className="px-3 py-3 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 text-blue-600 rounded-xl text-xs font-black transition-colors flex items-center justify-center gap-1.5"
                    >
                       <Truck className="w-4 h-4" /> Avisar
                    </a>
                    <a 
                      href={generateWaLink(client.phone, `Gracias por tu compra 🌱. Nos alegra llevar frescura hasta ti. ¡Te esperamos pronto!`)}
                      target="_blank" rel="noopener noreferrer"
                      className="px-3 py-3 bg-green-50 hover:bg-green-100 dark:bg-green-900/20 text-green-600 rounded-xl text-xs font-black transition-colors flex items-center justify-center gap-1.5"
                    >
                       <Heart className="w-4 h-4" /> Agradecer
                    </a>
                 </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {isClientModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsClientModalOpen(false)} className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-md bg-white dark:bg-neutral-900 rounded-[32px] p-8 shadow-2xl">
              <h3 className="text-2xl font-black mb-6"> {editingClient ? 'Editar Cliente' : 'Nuevo Cliente'}</h3>
              <form onSubmit={handleSaveClient} className="space-y-4">
                <div>
                   <label htmlFor="client-name" className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Nombre del Cliente</label>
                   <input id="client-name" required type="text" className="w-full mt-1 bg-neutral-50 dark:bg-neutral-800 p-3 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none font-bold" value={clientForm.fullName} onChange={e => setClientForm({...clientForm, fullName: e.target.value})} title="Nombre" placeholder="Puebla Juarez" />
                </div>
                <div>
                   <label htmlFor="client-address" className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Ubicación / Ruta</label>
                   <input id="client-address" required type="text" className="w-full mt-1 bg-neutral-50 dark:bg-neutral-800 p-3 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none font-bold" value={clientForm.deliveryLocation} onChange={e => setClientForm({...clientForm, deliveryLocation: e.target.value})} title="Dirección" placeholder="Mercado Central / Delivery" />
                </div>
                <div>
                   <label htmlFor="client-wa" className="text-xs font-bold text-neutral-500 uppercase tracking-widest">WhatsApp de Contacto</label>
                   <input id="client-wa" required type="tel" className="w-full mt-1 bg-neutral-50 dark:bg-neutral-800 p-3 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none font-bold" value={clientForm.phone} onChange={e => setClientForm({...clientForm, phone: e.target.value})} title="WhatsApp" placeholder="+51 987..." />
                </div>
                <div className="pt-4 flex gap-3">
                   <button type="button" onClick={() => setIsClientModalOpen(false)} className="flex-1 py-4 bg-neutral-100 dark:bg-neutral-800 rounded-2xl font-bold transition-all">Cancelar</button>
                   <button type="submit" className="flex-1 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-primary-500/20">Guardar</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
