import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, LayoutDashboard, Brain, HardDrive, ShieldCheck, Sun, Smartphone, Heart, Zap, X } from 'lucide-react';

interface PresentationProps {
  onExit?: () => void;
}

export const Presentation: React.FC<PresentationProps> = ({ onExit }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Bienvenido a wTicketFlow",
      desc: "La solución moderna, segura y eficiente para la gestión de tickets sin backend.",
      icon: LayoutDashboard,
      color: "bg-indigo-600",
      content: (
        <div className="space-y-4">
          <p>Gestione solicitudes, incidencias y tareas de su equipo con una interfaz fluida y moderna.</p>
          <ul className="text-left space-y-2 max-w-md mx-auto bg-white/10 p-4 rounded-xl">
            <li>✅ Sin instalación de servidor</li>
            <li>✅ Datos 100% privados</li>
            <li>✅ Interfaz Ultra-Rápida</li>
          </ul>
        </div>
      )
    },
    {
      title: "Potenciado por Gemini AI",
      desc: "Inteligencia Artificial integrada para categorización y soluciones.",
      icon: Brain,
      color: "bg-purple-600",
      content: (
        <div className="space-y-4">
          <p>No pierda tiempo clasificando. wTicketFlow detecta el tema automáticamente.</p>
          <div className="flex gap-4 justify-center text-sm">
            <span className="px-3 py-1 bg-white/20 rounded-full">Auto-Categorización</span>
            <span className="px-3 py-1 bg-white/20 rounded-full">Sugerencias de Solución</span>
          </div>
        </div>
      )
    },
    {
      title: "Persistencia Local",
      desc: "Sus datos nunca salen de su navegador sin su permiso.",
      icon: HardDrive,
      color: "bg-blue-600",
      content: (
        <p>Utilizamos LocalStorage avanzado para guardar todo al instante. Además, contamos con un sistema robusto de Backup (Importar/Exportar JSON) para que sus datos estén siempre seguros.</p>
      )
    },
    {
      title: "Roles Dinámicos",
      desc: "Modo Administrador y Modo Usuario en un click.",
      icon: ShieldCheck,
      color: "bg-emerald-600",
      content: (
        <p>Cambie instantáneamente entre la vista de gestión (Admin) y la vista de solicitud (Usuario) con el interruptor de roles. Ideal para equipos pequeños y demostraciones.</p>
      )
    },
    {
      title: "Modo Oscuro Nativo",
      desc: "Diseñado para descansar su vista.",
      icon: Sun,
      color: "bg-slate-800",
      content: (
        <p>Cada componente ha sido cuidadosamente diseñado para verse espectacular tanto en modo claro como en modo oscuro. El sistema detecta su preferencia automáticamente.</p>
      )
    },
    {
      title: "Diseño Responsivo",
      desc: "Funciona perfecto en Móvil, Tablet y Desktop.",
      icon: Smartphone,
      color: "bg-pink-600",
      content: (
        <p>Con un sidebar colapsable, menús adaptativos y tarjetas táctiles, wTicketFlow le acompaña donde vaya.</p>
      )
    },
    {
      title: "Rendimiento Extremo",
      desc: "Construido con React 19 y Vite.",
      icon: Zap,
      color: "bg-orange-600",
      content: (
        <p>Cargas instantáneas, transiciones suaves (60fps) y cero tiempos de espera. La eficiencia es nuestra prioridad.</p>
      )
    },
    {
      title: "Sobre el Autor",
      desc: "Desarrollado con ❤️ por Wisrovi Rodríguez.",
      icon: Heart,
      color: "bg-red-600",
      content: (
        <div>
          <p className="mb-4">Ingeniero Senior Full Stack apasionado por crear experiencias de usuario excepcionales.</p>
          <a href="https://es.linkedin.com/in/wisrovi-rodriguez" target="_blank" rel="noopener noreferrer" className="px-6 py-2 bg-white text-red-600 font-bold rounded-full hover:bg-gray-100 transition-colors">
            Contactar en LinkedIn
          </a>
        </div>
      )
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'Escape' && onExit) onExit();
  };

  return (
    <div 
        className="fixed inset-0 z-[100] bg-black text-white flex items-center justify-center overflow-hidden animate-in fade-in duration-500"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        autoFocus
    >
      {/* Exit Button */}
      {onExit && (
        <button 
          onClick={onExit}
          className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/30 rounded-full backdrop-blur-md transition-colors z-50 group"
          title="Salir de la presentación (Esc)"
        >
          <X size={24} className="group-hover:rotate-90 transition-transform" />
        </button>
      )}

      {/* Slide Content */}
      <div className={`absolute inset-0 transition-colors duration-700 ${slides[currentSlide].color}`}>
        <div className="absolute inset-0 bg-black/30 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-30"></div> {/* Texture Overlay */}
        
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center text-white p-4 md:p-12 max-w-6xl mx-auto">
          
          <div className="w-32 h-32 md:w-48 md:h-48 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center mb-8 shadow-2xl animate-bounce-slow border border-white/20">
            {React.createElement(slides[currentSlide].icon, { size: 64, className: "md:w-24 md:h-24" })}
          </div>
          
          <h2 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight drop-shadow-xl">
            {slides[currentSlide].title}
          </h2>
          
          <h3 className="text-2xl md:text-3xl font-light opacity-90 mb-12 max-w-3xl leading-relaxed">
            {slides[currentSlide].desc}
          </h3>
          
          <div className="text-xl md:text-2xl opacity-90 max-w-3xl leading-relaxed font-medium">
            {slides[currentSlide].content}
          </div>

        </div>
      </div>

      {/* Controls */}
      <button 
        onClick={prevSlide}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 p-4 bg-black/20 hover:bg-black/50 hover:scale-110 text-white rounded-full backdrop-blur-md transition-all z-20 border border-white/10"
      >
        <ChevronLeft size={40} />
      </button>

      <button 
        onClick={nextSlide}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 p-4 bg-black/20 hover:bg-black/50 hover:scale-110 text-white rounded-full backdrop-blur-md transition-all z-20 border border-white/10"
      >
        <ChevronRight size={40} />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-4 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-4 rounded-full transition-all duration-300 shadow-sm ${
              index === currentSlide ? 'bg-white w-12' : 'bg-white/30 hover:bg-white/60 w-4'
            }`}
          />
        ))}
      </div>
      
      <div className="absolute bottom-4 right-4 text-white/40 text-xs">
          Use las flechas del teclado para navegar | Esc para salir
      </div>
    </div>
  );
};