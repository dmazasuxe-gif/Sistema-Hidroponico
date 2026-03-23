"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Droplets, 
  TrendingUp, 
  Cpu, 
  Zap, 
  ChevronRight, 
  ArrowRight,
  Monitor,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  Menu,
  X
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="bg-white text-neutral-900 font-sans selection:bg-primary-100 selection:text-primary-600">
      {/* Navbar */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/70 backdrop-blur-3xl border-b border-neutral-100 dark:bg-neutral-950/70 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
             <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center text-white shadow-xl shadow-primary-500/20">
                <Droplets className="w-6 h-6" />
             </div>
             <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-green-400">
                HydroSmart
             </span>
          </div>

          <div className="hidden md:flex items-center space-x-10 text-sm font-bold text-neutral-500">
             <a href="#features" className="hover:text-primary-600 transition-colors">Características</a>
             <a href="#hardware" className="hover:text-primary-600 transition-colors">IoT Ready</a>
             <a href="#pricing" className="hover:text-primary-600 transition-colors">Planes SaaS</a>
          </div>

          <div className="hidden md:flex items-center space-x-4">
             <Link href="/login" className="px-6 py-2.5 text-sm font-bold text-neutral-600 hover:text-neutral-900 transition-colors">
                Iniciar sesión
             </Link>
             <Link href="/dashboard" className="px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl text-sm font-black shadow-xl shadow-primary-500/20 transition-all hover:scale-105 active:scale-95">
                Acceso al Demo
             </Link>
          </div>

          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
             {isMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-48 pb-32 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-40 opacity-30 pointer-events-none translate-x-1/2 -translate-y-1/2">
           <div className="w-[600px] h-[600px] bg-primary-400 rounded-full blur-[160px] animate-pulse-slow" />
        </div>

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
           <motion.div
             initial={{ opacity: 0, x: -50 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ duration: 0.8 }}
             className="relative z-10"
           >
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-50 text-primary-600 rounded-full text-xs font-black uppercase tracking-widest mb-8 border border-primary-100">
                 <Zap className="w-3.5 h-3.5 fill-current" />
                 <span>Nueva Arquitectura SaaS v2.0</span>
              </div>
              <h1 className="text-7xl lg:text-8xl font-black leading-tight tracking-tighter mb-8">
                 Agricultura del <span className="text-primary-600">Futuro</span>, Hoy.
              </h1>
              <p className="text-xl text-neutral-500 leading-relaxed max-w-lg mb-12">
                 La plataforma definitiva para la gestión de sistemas hidropónicos automáticos. Optimiza recursos, maximiza el rendimiento y escala tu producción a nivel profesional.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-5">
                 <Link href="/dashboard" className="flex items-center justify-center space-x-3 px-12 py-6 bg-neutral-900 hover:bg-black text-white rounded-3xl text-lg font-black shadow-2xl transition-all group">
                    <span>Empezar Gratis</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                 </Link>
                 <button className="flex items-center justify-center space-x-2 px-10 py-6 bg-white border-2 border-neutral-100 hover:border-neutral-200 text-neutral-600 rounded-3xl text-lg font-bold transition-all">
                    <span>Ver Video Demo</span>
                 </button>
              </div>

              <div className="mt-16 flex items-center space-x-8 opacity-60">
                 <div className="flex -space-x-3">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-neutral-200" />
                    ))}
                 </div>
                 <p className="text-sm font-bold text-neutral-500">+1.2k Agricultores ya lo usan</p>
              </div>
           </motion.div>

           <motion.div
             initial={{ opacity: 0, scale: 0.8, y: 50 }}
             animate={{ opacity: 1, scale: 1, y: 0 }}
             transition={{ duration: 1, delay: 0.2 }}
             className="relative"
           >
              <div className="relative rounded-[48px] bg-neutral-100 p-3 shadow-[0_0_100px_rgba(0,0,0,0.1)] overflow-hidden">
                 <div className="bg-white rounded-[40px] aspect-[4/3] flex items-center justify-center p-8 relative overflow-hidden group">
                    <img 
                      src="/images/hero.png" 
                      alt="HydroSmart Hero" 
                      className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-[2000ms] ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/40 via-transparent to-transparent" />
                    <div className="relative z-10 w-full max-w-md bg-white/80 backdrop-blur-2xl rounded-3xl p-6 shadow-2xl border border-white/40">
                       <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                             <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
                             <span className="text-[10px] font-black uppercase text-neutral-400">Live Telemetry</span>
                          </div>
                          <span className="text-xs font-black text-primary-600">Optimal</span>
                       </div>
                       <div className="space-y-3">
                          <div className="h-2 bg-neutral-200 rounded-full w-full overflow-hidden">
                             <div className="h-full bg-primary-500 w-[85%] animate-pulse" />
                          </div>
                          <div className="flex justify-between text-xl font-black">
                             <span>PH Nivel</span>
                             <span>6.2</span>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
              
              {/* Floating badges */}
              <div className="absolute -top-10 -left-10 p-6 bg-white rounded-3xl shadow-xl border border-neutral-100 animate-float">
                 <TrendingUp className="w-8 h-8 text-green-500 mb-2" />
                 <p className="text-xs font-bold text-neutral-400">Rendimiento</p>
                 <p className="text-2xl font-black">+42%</p>
              </div>

              <div className="absolute -bottom-10 -right-10 p-6 bg-white rounded-3xl shadow-xl border border-neutral-100 animate-float" style={{ animationDelay: '1s' }}>
                 <Cpu className="w-8 h-8 text-blue-500 mb-2" />
                 <p className="text-xs font-bold text-neutral-400">Sensores</p>
                 <p className="text-2xl font-black">Online</p>
              </div>
           </motion.div>
        </div>
      </section>

      {/* Features Bento */}
      <section id="features" className="py-32 bg-neutral-50">
         <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-20">
               <h2 className="text-5xl font-black tracking-tight mb-6">Potencia tu Vivero con Inteligencia.</h2>
               <p className="text-lg text-neutral-500">Módulos integrados diseñados para la escalabilidad comercial.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {[
                 { title: 'Gestión de Cultivos', desc: 'Seguimiento preciso de cada semilla hasta su cosecha automática.', icon: SproutIcon },
                 { title: 'IoT & Telemetría', desc: 'Lecturas en tiempo real de pH, temperatura y humedad con alertas.', icon: Cpu },
                 { title: 'Control de Ventas', desc: 'Panel financiero avanzado para maximizar tu rentabilidad SaaS.', icon: DollarSignIcon },
               ].map((feature, i) => (
                 <div key={i} className="p-10 bg-white rounded-[40px] border border-neutral-100 shadow-sm hover:shadow-2xl hover:border-primary-500/10 transition-all group">
                    <div className="w-16 h-16 rounded-[24px] bg-neutral-50 group-hover:bg-primary-600 group-hover:text-white flex items-center justify-center mb-8 transition-colors duration-500">
                       <feature.icon className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                    <p className="text-neutral-500 leading-relaxed mb-8">{feature.desc}</p>
                    <button className="flex items-center gap-2 text-sm font-black text-primary-600 opacity-0 group-hover:opacity-100 transition-all translate-x-3 group-hover:translate-x-0">
                       Saber más <ChevronRight className="w-4 h-4" />
                    </button>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 border-y border-neutral-100 overflow-hidden">
         <div className="flex whitespace-nowrap gap-20 items-center opacity-30 select-none pointer-events-none translate-x-[10%] animate-in fade-in slide-in-from-right duration-[10s]">
            {Array.from({length: 10}).map((_, i) => (
              <span key={i} className="text-3xl font-black uppercase tracking-[20px]">
                 Scalable • Automation • Smart • IoT • SaaS • Pro
              </span>
            ))}
         </div>
      </section>

      {/* CTA Section */}
      <section className="py-40">
         <div className="max-w-5xl mx-auto px-6 text-center">
            <div className="p-20 bg-neutral-900 rounded-[56px] text-white overflow-hidden relative shadow-[0_40px_100px_rgba(0,0,0,0.3)]">
               <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary-600/30 via-transparent to-transparent" />
               <div className="relative z-10">
                  <h2 className="text-6xl font-black mb-8 leading-tight">¿Listo para transformar tu producción?</h2>
                  <p className="text-xl opacity-60 max-w-2xl mx-auto mb-12 font-medium">Únete hoy a la plataforma líder de hidroponía profesional y empieza a cosechar datos inteligentes.</p>
                  <Link href="/dashboard" className="px-16 py-6 bg-white text-neutral-900 rounded-3xl text-xl font-black shadow-2xl transition-all hover:scale-105 active:scale-95">
                     Crear Cuenta Gratis
                  </Link>
                  <p className="mt-8 text-sm font-bold opacity-40">Sin tarjeta de crédito requerida.</p>
               </div>
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="py-20 bg-neutral-50">
         <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="flex items-center space-x-3 grayscale opacity-50">
               <Droplets className="w-6 h-6" />
               <span className="text-xl font-black">HydroSmart</span>
            </div>
            <div className="flex space-x-10 text-sm font-bold text-neutral-400">
               <a href="#">Términos</a>
               <a href="#">Privacidad</a>
               <a href="#">Contacto</a>
            </div>
            <p className="text-sm font-bold text-neutral-400">© 2026 HydroSmart Team. Senior Product Engineer sandbox.</p>
         </div>
      </footer>
    </div>
  );
}

const SproutIcon = ({ className }: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M7 20h10" />
    <path d="M10 20c5.5-2.5 8-6.4 8-10.7" />
    <path d="M14 20c-5.5-2.5-8-6.4-8-10.7" />
    <path d="M12 10V4" />
    <path d="m12 4 3 3" />
    <path d="m12 4-3 3" />
  </svg>
);

const DollarSignIcon = ({ className }: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);
