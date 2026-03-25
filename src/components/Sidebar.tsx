"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Sprout, 
  Settings2, 
  Package, 
  DollarSign, 
  User, 
  Droplets,
  LogOut,
  Sun,
  Moon,
  Receipt,
  Zap,
  Activity,
  Cpu,
  Clock,
  Camera,
  QrCode
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Control Vegetales', href: '/dashboard/lettuces', icon: Sprout },
  { name: 'Insumos (Compras)', href: '/dashboard/inventory', icon: Package },
  { name: 'Ventas', href: '/dashboard/sales', icon: DollarSign },
  { name: 'Bouchers', href: '/dashboard/vouchers', icon: Camera },
  { name: 'Clientes', href: '/dashboard/clients', icon: User },
  { name: 'Gastos', href: '/dashboard/expenses', icon: Receipt },
  { name: 'Automatización', href: '/dashboard/automation', icon: Zap },
  { name: 'Nutrición', href: '/dashboard/nutrition', icon: Droplets },
  { name: 'Etiquetado QR', href: '/dashboard/labels', icon: QrCode },
  { name: 'Empresa', href: '/dashboard/company', icon: Settings2 },
];

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
}

export function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const pathname = usePathname();
  const [isDarkMode, setIsDarkMode] = useState(false);

  const [businessName, setBusinessName] = useState('');
  const [logo, setLogo] = useState<string | null>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }

    const savedCompany = localStorage.getItem('companyData');
    if (savedCompany) {
      const data = JSON.parse(savedCompany);
      if (data.businessName) setBusinessName(data.businessName);
    }

    const savedLogo = localStorage.getItem('companyLogo');
    if (savedLogo) setLogo(savedLogo);
  }, []);

  const toggleDarkMode = () => {
    const newVal = !isDarkMode;
    setIsDarkMode(newVal);
    if (newVal) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <motion.aside
      initial={{ x: -288 }}
      animate={{ x: isOpen ? 0 : -288 }}
      transition={{ 
        type: "spring", 
        stiffness: 400, 
        damping: 40,
        mass: 1
      }}
      className={cn(
        "fixed top-0 left-0 h-screen z-50 w-72 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 flex flex-col shadow-2xl",
        !isOpen && "shadow-none pointer-events-none"
      )}
    >
      <div className="pointer-events-auto flex flex-col h-full bg-white dark:bg-neutral-900">
        {/* Logo Section */}
        <div className="p-8 pb-4 flex flex-col items-start space-y-4">
          {logo ? (
             // eslint-disable-next-line @next/next/no-img-element
             <img src={logo} alt="Logo" className="h-20 md:h-24 w-auto max-w-[200px] object-contain shrink-0 drop-shadow-xl transform transition-transform duration-300 hover:scale-105" />
          ) : (
             <div className="w-16 h-16 rounded-2xl bg-primary-500 flex items-center justify-center text-white shadow-xl shadow-primary-500/20 shrink-0">
               <Droplets className="w-10 h-10" />
             </div>
          )}
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400 dark:text-neutral-500 mb-0.5">Vivero Profesional</span>
            <span className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-br from-primary-600 to-green-500 dark:from-primary-400 dark:to-green-400 leading-none">
              {businessName || 'Sistema'}
            </span>
          </div>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.name} 
                href={item.href}
                onClick={() => {
                   if (window.innerWidth < 1024) setIsOpen(false);
                }}
                className={cn(
                  "flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group",
                  isActive 
                    ? "bg-primary-500 text-white shadow-lg shadow-primary-500/20" 
                    : "text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-primary-600 dark:hover:text-primary-400 font-bold"
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "group-hover:scale-110 transition-transform")} />
                <span className="font-bold">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer Section */}
        <div className="p-6 border-t border-neutral-200 dark:border-neutral-800 space-y-3">
          <button 
            onClick={toggleDarkMode}
            className="w-full flex items-center space-x-3 px-4 py-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all font-bold"
            title={isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          >
            {isDarkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-blue-500" />}
            <span className="text-sm">{isDarkMode ? 'Modo Claro' : 'Modo Oscuro'}</span>
          </button>

          <Link href="/login" className="block">
            <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 text-white flex items-center space-x-3 hover:bg-black transition-all cursor-pointer group shadow-xl">
              <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center shadow-lg shadow-primary-500/20">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-black truncate">ADMIN</p>
                <p className="text-[10px] text-neutral-400 font-bold tracking-widest uppercase truncate font-black">Sistema Local</p>
              </div>
              <LogOut className="w-4 h-4 text-neutral-500 group-hover:text-red-500 transition-colors" />
            </div>
          </Link>
        </div>
      </div>
    </motion.aside>
  );
}
