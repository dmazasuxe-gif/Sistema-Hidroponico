"use client";

import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail,
  Save,
  Image as ImageIcon,
  Trash2, 
  List,
  Plus,
  AlertTriangle,
  RefreshCcw,
  Download,
  Upload,
  TrendingUp,
  ClipboardList
} from 'lucide-react';

const DEFAULT_CATEGORIES = [
  "Pago de luz", 
  "Pago de personal", 
  "Pago de flete", 
  "Pago a SUNAT", 
  "Pago al banco", 
  "Repartición de ganancias"
];

export default function CompanySettingsPage() {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [welcomeImageUrl, setWelcomeImageUrl] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    businessName: '',
    ownerName: '',
    documentId: '',
    address: '',
    phone: '',
    email: '',
    estimatedProfitMargin: 45 // Default 45%
  });

  const [yapeQr, setYapeQr] = useState<string | null>(null);
  const [plinQr, setPlinQr] = useState<string | null>(null);

  const [categories, setCategories] = useState<string[]>([]);
  const [newCat, setNewCat] = useState('');

  const [dailyTasks, setDailyTasks] = useState<string[]>([]);
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('expenseCategories');
    if (saved) {
      setCategories(JSON.parse(saved));
    } else {
      setCategories(DEFAULT_CATEGORIES);
    }

    const savedCompany = localStorage.getItem('companyData');
    if (savedCompany) {
      setFormData(JSON.parse(savedCompany));
    }

    const savedLogo = localStorage.getItem('companyLogo');
    if (savedLogo) {
      setLogoUrl(savedLogo);
    }

    const savedWelcome = localStorage.getItem('welcomeImage');
    if (savedWelcome) {
      setWelcomeImageUrl(savedWelcome);
    }

    const savedYape = localStorage.getItem('yapeQr');
    if (savedYape) setYapeQr(savedYape);

    const savedPlin = localStorage.getItem('plinQr');
    if (savedPlin) setPlinQr(savedPlin);

    const savedTasks = localStorage.getItem('dailyTasks');
    if (savedTasks) {
      const tasksObj = JSON.parse(savedTasks);
      setDailyTasks(tasksObj.map((t: any) => t.name));
    } else {
      setDailyTasks([
        'Mantenimiento general',
        'Revisar niveles de humedad',
        'Revisar niveles de nutrientes',
        'Revisar niveles de pH',
        'Registrar ventas del día'
      ]);
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('companyData', JSON.stringify(formData));
    
    // Process and save tasks in the format the dashboard expects
    const tasksToSave = dailyTasks.map(name => ({ name, completed: false }));
    localStorage.setItem('dailyTasks', JSON.stringify(tasksToSave));

    if (logoUrl) {
      localStorage.setItem('companyLogo', logoUrl);
    }

    if (yapeQr) localStorage.setItem('yapeQr', yapeQr);
    if (plinQr) localStorage.setItem('plinQr', plinQr);

    alert("✅ Cambios guardados exitosamente");
  };

  const handleAddTask = () => {
    if (newTask.trim() && !dailyTasks.includes(newTask.trim())) {
      setDailyTasks([...dailyTasks, newTask.trim()]);
      setNewTask('');
    }
  };

  const handleDeleteTask = (task: string) => {
    setDailyTasks(dailyTasks.filter(t => t !== task));
  };

  const handleAddCategory = () => {
    if (newCat.trim() && !categories.includes(newCat.trim())) {
      const updated = [...categories, newCat.trim()];
      setCategories(updated);
      localStorage.setItem('expenseCategories', JSON.stringify(updated));
      setNewCat('');
    }
  };

  const handleDeleteCategory = (cat: string) => {
    const updated = categories.filter(c => c !== cat);
    setCategories(updated);
    localStorage.setItem('expenseCategories', JSON.stringify(updated));
  };

  const handleResetSystem = () => {
    if (confirm("⚠️ ¿ESTÁS SEGURO? Esta acción borrará ABSOLUTAMENTE TODO: clientes, ventas, gastos, inventario, logo e imágenes. No podrás recuperar los datos.")) {
      const secondConfirmed = confirm("🚨 ÚLTIMA ADVERTENCIA: ¿Completamente seguro de iniciar el sistema desde cero?");
      if (secondConfirmed) {
        localStorage.clear();
        alert("Sistema reiniciado correctamente. El sistema iniciará en blanco.");
        window.location.href = '/login';
      }
    }
  };

  const handleExportData = () => {
    const data: Record<string, string | null> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) data[key] = localStorage.getItem(key);
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `respaldo_vivero_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

   const handleWelcomeFileChange = (e: any) => {
    if (e.target.files && e.target.files[0]) {
       const file = e.target.files[0];
       const reader = new FileReader();
       reader.onloadend = () => {
         const base64String = reader.result as string;
         setWelcomeImageUrl(base64String);
         localStorage.setItem('welcomeImage', base64String);
       };
       reader.readAsDataURL(file);
    }
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (confirm("⚠️ ¿IMPORTAR DATOS? Esto reemplazará TODA la información actual. No podrás deshacer este cambio.")) {
          localStorage.clear();
          Object.entries(data).forEach(([key, value]) => {
            if (value) localStorage.setItem(key, value as string);
          });
          alert("✅ Datos importados con éxito. El sistema se reiniciará.");
          window.location.reload();
        }
      } catch (err) {
        alert("❌ Error al leer el archivo. Asegúrate de que sea un archivo de respaldo válido.");
      }
    };
    reader.readAsText(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
       const file = e.target.files[0];
       const reader = new FileReader();
       reader.onloadend = () => {
         const base64String = reader.result as string;
         setLogoUrl(base64String);
         localStorage.setItem('companyLogo', base64String);
       };
       reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
             <Building2 className="w-10 h-10 text-primary-500" />
             Configuración de la Empresa
          </h1>
          <p className="text-neutral-500 mt-2">Los datos ingresados aparecerán en tus boletas de venta.</p>
        </div>
        <button 
          onClick={handleSave}
          className="flex items-center justify-center space-x-2 px-6 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-bold shadow-lg shadow-primary-500/20 transition-all"
        >
          <Save className="w-5 h-5" />
          <span>Guardar Cambios</span>
        </button>
      </div>

      <div className="p-8 rounded-[40px] bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm">
        <h3 className="text-2xl font-black mb-8 border-b border-neutral-200 dark:border-neutral-800 pb-4">
          Logo Oficial
        </h3>
        
        <div className="flex items-center gap-8 mb-8">
           <label className="w-32 h-32 shrink-0 rounded-3xl bg-neutral-100 dark:bg-neutral-800 border-2 border-dashed border-neutral-300 dark:border-neutral-700 flex items-center justify-center cursor-pointer hover:border-primary-500 transition-all group overflow-hidden relative">
              <input type="file" accept="image/png, image/jpeg" className="hidden" onChange={handleFileChange} />
              {logoUrl ? (
                 // eslint-disable-next-line @next/next/no-img-element
                 <img src={logoUrl} alt="Logo Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center text-neutral-400 group-hover:text-primary-500">
                  <ImageIcon className="w-8 h-8 mb-2" />
                  <span className="text-xs font-bold text-center px-4">Subir<br/>Logo</span>
                </div>
              )}
           </label>
           <div>
              <p className="text-lg font-bold mb-1">Logotipo de la Empresa</p>
              <p className="text-sm text-neutral-500 max-w-sm mb-4">Haz clic en el cuadro de la izquierda para seleccionar una imagen cuadrada en formato PNG o JPG con fondo transparente para un mejor resultado.</p>
           </div>
        </div>

        <h3 className="text-2xl font-black mb-8 border-b border-neutral-200 dark:border-neutral-800 pb-4 mt-12">
          Imagen para Pantalla de Inicio (Splash)
        </h3>
        <p className="text-sm text-neutral-500 mb-6">
          Esta imagen decorativa aparecerá de forma elegante al iniciar el sistema. Se visualizará sin bordes y con un efecto difuminado.
        </p>

        <div className="flex items-center gap-8 mb-8">
           <label className="w-48 h-48 shrink-0 rounded-[48px] bg-neutral-100 dark:bg-neutral-800 border-2 border-dashed border-neutral-300 dark:border-neutral-700 flex items-center justify-center cursor-pointer hover:border-primary-500 transition-all group overflow-hidden relative">
              <input type="file" accept="image/png, image/jpeg" className="hidden" onChange={handleWelcomeFileChange} />
              {welcomeImageUrl ? (
                 // eslint-disable-next-line @next/next/no-img-element
                 <img src={welcomeImageUrl} alt="Splash Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center text-neutral-400 group-hover:text-primary-500 text-center">
                  <ImageIcon className="w-10 h-10 mb-2" />
                  <span className="text-xs font-bold uppercase tracking-widest px-4">Subir Imagen Cine</span>
                </div>
              )}
           </label>
           <div className="flex-1">
              <p className="text-lg font-bold mb-1">Imagen de Bienvenida Profesional</p>
              <p className="text-sm text-neutral-500 max-w-sm">Se recomienda una imagen de alta calidad de tus plantas o logo artístico. El sistema aplicará efectos de difuminado automático.</p>
           </div>
        </div>

        <h3 className="text-2xl font-black mb-8 border-b border-neutral-200 dark:border-neutral-800 pb-4 mt-12">
          Métodos de Pago Digital (QR)
        </h3>
        <p className="text-sm text-neutral-500 mb-8">
           Sube tus códigos QR de Yape y Plin para que aparezcan en los botones rápidos del Dashboard.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
           {/* YAPE QR */}
           <div className="flex flex-col items-center p-8 rounded-[40px] bg-neutral-50 dark:bg-neutral-800/30 border border-neutral-100 dark:border-neutral-800">
              <div className="w-12 h-12 bg-[#6b21a8] rounded-2xl flex items-center justify-center text-white font-black text-xs mb-4">YAPE</div>
              <label className="w-full aspect-square rounded-[32px] bg-white dark:bg-neutral-800 border-2 border-dashed border-neutral-200 dark:border-neutral-700 flex items-center justify-center cursor-pointer hover:border-purple-500 transition-all group overflow-hidden relative">
                 <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                       const reader = new FileReader();
                       reader.onloadend = () => setYapeQr(reader.result as string);
                       reader.readAsDataURL(file);
                    }
                 }} />
                 {yapeQr ? (
                    <img src={yapeQr} alt="Yape QR" className="w-full h-full object-cover" />
                 ) : (
                    <div className="flex flex-col items-center text-neutral-400 group-hover:text-purple-500">
                       <Upload className="w-8 h-8 mb-2" />
                       <span className="text-[10px] font-black uppercase">Subir QR Yape</span>
                    </div>
                 )}
              </label>
              {yapeQr && <button onClick={() => setYapeQr(null)} className="mt-4 text-[10px] font-black uppercase text-red-500 hover:text-red-600 transition-colors">Eliminar</button>}
           </div>

           {/* PLIN QR */}
           <div className="flex flex-col items-center p-8 rounded-[40px] bg-neutral-50 dark:bg-neutral-800/30 border border-neutral-100 dark:border-neutral-800">
              <div className="w-12 h-12 bg-[#0ea5e9] rounded-2xl flex items-center justify-center text-white font-black text-xs mb-4">PLIN</div>
              <label className="w-full aspect-square rounded-[32px] bg-white dark:bg-neutral-800 border-2 border-dashed border-neutral-200 dark:border-neutral-700 flex items-center justify-center cursor-pointer hover:border-blue-500 transition-all group overflow-hidden relative">
                 <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                       const reader = new FileReader();
                       reader.onloadend = () => setPlinQr(reader.result as string);
                       reader.readAsDataURL(file);
                    }
                 }} />
                 {plinQr ? (
                    <img src={plinQr} alt="Plin QR" className="w-full h-full object-cover" />
                 ) : (
                    <div className="flex flex-col items-center text-neutral-400 group-hover:text-blue-500">
                       <Upload className="w-8 h-8 mb-2" />
                       <span className="text-[10px] font-black uppercase">Subir QR Plin</span>
                    </div>
                 )}
              </label>
              {plinQr && <button onClick={() => setPlinQr(null)} className="mt-4 text-[10px] font-black uppercase text-red-500 hover:text-red-600 transition-colors">Eliminar</button>}
           </div>
        </div>

        <h3 className="text-2xl font-black mb-8 border-b border-neutral-200 dark:border-neutral-800 pb-4">
          Información Fiscal y de Contacto
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="businessName" className="text-sm font-bold text-neutral-600 dark:text-neutral-400">Nombre del Negocio (Razón Social)</label>
            <div className="relative">
              <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input 
                id="businessName"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                className="w-full bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-2xl py-3 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-primary-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="ownerName" className="text-sm font-bold text-neutral-600 dark:text-neutral-400">Nombre del Propietario</label>
            <div className="relative">
              <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input 
                id="ownerName"
                name="ownerName"
                value={formData.ownerName}
                onChange={handleChange}
                className="w-full bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-2xl py-3 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-primary-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-2 md:col-span-2">
            <label htmlFor="documentId" className="text-sm font-bold text-neutral-600 dark:text-neutral-400">RUC / DNI del propietario</label>
            <div className="relative">
              <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input 
                id="documentId"
                name="documentId"
                value={formData.documentId}
                onChange={handleChange}
                className="w-full bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-2xl py-3 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-primary-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-2 md:col-span-2">
            <label htmlFor="address" className="text-sm font-bold text-neutral-600 dark:text-neutral-400">Dirección del Vivero / Oficina</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input 
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-2xl py-3 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-primary-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-bold text-neutral-600 dark:text-neutral-400">Teléfono (WhatsApp)</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input 
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-2xl py-3 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-primary-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-bold text-neutral-600 dark:text-neutral-400">Correo Electrónico (Opcional)</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input 
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-2xl py-3 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-primary-500 outline-none transition-all"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="estimatedProfitMargin" className="text-sm font-bold text-neutral-600 dark:text-neutral-400">Margen de Ganancia Estimada (%)</label>
            <div className="relative">
              <TrendingUp className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input 
                id="estimatedProfitMargin"
                name="estimatedProfitMargin"
                type="number"
                value={formData.estimatedProfitMargin}
                onChange={e => setFormData({...formData, estimatedProfitMargin: parseInt(e.target.value) || 0})}
                className="w-full bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-2xl py-3 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-primary-500 outline-none transition-all"
              />
            </div>
            <p className="text-[10px] text-neutral-500 mt-1 pl-2">Este porcentaje se usará para calcular la ganancia en el menú de Ventas.</p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-neutral-200 dark:border-neutral-800">
           <h3 className="text-2xl font-black mb-6 flex items-center gap-2 text-primary-600 dark:text-primary-400">
             <ClipboardList className="w-6 h-6" />
             Gestión de Tareas Diarias
           </h3>
           <p className="text-sm text-neutral-500 mb-6 max-w-lg">
             Configura las tareas que aparecerán cada día en el panel principal (Dashboard).
           </p>

           <div className="flex gap-4 mb-6">
              <input 
                value={newTask} 
                onChange={e => setNewTask(e.target.value)}
                placeholder="Nueva tarea (ej. Limpiar filtros)"
                className="flex-1 bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-2xl py-3 px-4 text-sm font-medium focus:ring-2 focus:ring-primary-500 outline-none"
              />
              <button 
                onClick={handleAddTask}
                className="px-6 py-3 bg-primary-100 dark:bg-primary-900/30 text-primary-600 hover:bg-primary-200 dark:hover:bg-primary-900/50 rounded-2xl font-bold flex items-center gap-2 transition-all shrink-0"
              >
                 <Plus className="w-4 h-4" /> Añadir
              </button>
           </div>

           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {dailyTasks.map((t, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-700">
                   <span className="font-bold text-sm text-neutral-700 dark:text-neutral-300 truncate pr-2">{t}</span>
                   <button 
                     onClick={() => handleDeleteTask(t)}
                     className="p-1.5 text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors shrink-0"
                     title={`Eliminar tarea ${t}`}
                   >
                     <Trash2 className="w-4 h-4" />
                   </button>
                </div>
              ))}
           </div>
        </div>

        <div className="mt-12 pt-8 border-t border-neutral-200 dark:border-neutral-800">
           <h3 className="text-2xl font-black mb-6 flex items-center gap-2">
             <List className="w-6 h-6 text-primary-500" />
             Categorías de Gastos
           </h3>
           <p className="text-sm text-neutral-500 mb-6 max-w-lg">
             Añade o elimina los tipos de gastos recurrentes de tu vivero. Estarán disponibles automáticamente en el módulo de Registro de Gastos.
           </p>

           <div className="flex gap-4 mb-6">
              <input 
                value={newCat} 
                onChange={e => setNewCat(e.target.value)}
                placeholder="Ej. Compra de semillas extra"
                className="flex-1 bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-2xl py-3 px-4 text-sm font-medium focus:ring-2 focus:ring-primary-500 outline-none"
              />
              <button 
                onClick={handleAddCategory}
                className="px-6 py-3 bg-primary-100 dark:bg-primary-900/30 text-primary-600 hover:bg-primary-200 dark:hover:bg-primary-900/50 rounded-2xl font-bold flex items-center gap-2 transition-all shrink-0"
              >
                 <Plus className="w-4 h-4" /> Añadir
              </button>
           </div>

           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((c, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-700">
                   <span className="font-bold text-sm text-neutral-700 dark:text-neutral-300 truncate pr-2">{c}</span>
                   <button 
                     onClick={() => handleDeleteCategory(c)}
                     className="p-1.5 text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors shrink-0"
                     title={`Eliminar categoría ${c}`}
                     aria-label={`Eliminar categoría ${c}`}
                   >
                     <Trash2 className="w-4 h-4" />
                   </button>
                </div>
              ))}
              {categories.length === 0 && (
                <p className="col-span-full py-4 text-sm text-neutral-500">No hay categorías configuradas.</p>
              )}
           </div>
          </div>

         <div className="mt-12 pt-8 border-t border-neutral-200 dark:border-neutral-800">
            <h3 className="text-2xl font-black mb-6 flex items-center gap-2">
              <RefreshCcw className="w-6 h-6 text-primary-500" />
              Sincronización Manual (Backup)
            </h3>
            <p className="text-sm text-neutral-500 mb-8 max-w-lg">
              Descarga toda tu información en un archivo para pasarla a otro dispositivo o para tener un respaldo de seguridad.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <button 
                 onClick={handleExportData}
                 className="flex items-center justify-center gap-3 p-6 rounded-3xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-all font-bold"
                 title="Descargar todos los datos"
               >
                 <Download className="w-5 h-5" />
                 Descargar Respaldo (PC/Tablet)
               </button>
               
               <label className="flex items-center justify-center gap-3 p-6 rounded-3xl border-2 border-dashed border-neutral-300 dark:border-neutral-700 hover:border-primary-500 hover:text-primary-500 transition-all font-bold cursor-pointer" title="Subir archivo de respaldo">
                 <Upload className="w-5 h-5" />
                 Subir Respaldo
                 <input type="file" accept=".json" className="hidden" onChange={handleImportData} />
               </label>
            </div>
         </div>
        
        <div className="mt-12 pt-8 border-t border-red-200 dark:border-red-900/30">
           <h3 className="text-2xl font-black mb-6 flex items-center gap-2 text-red-600 dark:text-red-400">
             <AlertTriangle className="w-6 h-6" />
             Zona de Peligro
           </h3>
           <div className="p-8 rounded-[32px] bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="max-w-md">
                   <p className="font-bold text-red-900 dark:text-red-200 text-lg mb-1">Reiniciar todo el sistema</p>
                   <p className="text-sm text-red-700 dark:text-red-400">Esta acción es irreversible. Se borrarán todos tus clientes, registros de ventas, gastos, inventario y camas de cultivo.</p>
                </div>
                <button 
                  onClick={handleResetSystem}
                  className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-bold shadow-lg shadow-red-500/20 transition-all flex items-center gap-2 shrink-0"
                >
                  <RefreshCcw className="w-5 h-5" />
                  Reiniciar Sistema
                </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
