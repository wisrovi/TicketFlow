import React from 'react';
import { Linkedin, Github, Globe, Mail, Code, Server, Layout, Database } from 'lucide-react';

export const AboutView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      
      {/* Hero Profile */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
        <div className="h-48 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"></div>
        <div className="px-8 pb-8 relative">
          <div className="flex flex-col md:flex-row items-center md:items-end -mt-16 mb-6 gap-6">
            <div className="w-32 h-32 bg-white dark:bg-gray-800 p-1.5 rounded-full shadow-xl">
               <div className="w-full h-full bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-3xl font-bold text-gray-400">WR</div>
            </div>
            <div className="text-center md:text-left flex-1">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Wisrovi Rodríguez</h1>
              <p className="text-indigo-600 dark:text-indigo-400 font-medium text-lg">Senior Full Stack Engineer & UI/UX Enthusiast</p>
              <div className="flex items-center justify-center md:justify-start gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1"><Globe size={14} /> Madrid, España</span>
                <span className="flex items-center gap-1"><Mail size={14} /> contact@wisrovi.com</span>
              </div>
            </div>
            <div className="flex gap-3">
               <a href="https://es.linkedin.com/in/wisrovi-rodriguez" target="_blank" className="p-3 bg-[#0077b5] text-white rounded-xl hover:bg-[#006396] transition-all shadow-md">
                 <Linkedin size={20} />
               </a>
               <a href="https://github.com" target="_blank" className="p-3 bg-gray-900 text-white rounded-xl hover:bg-black transition-all shadow-md">
                 <Github size={20} />
               </a>
            </div>
          </div>

          <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 leading-relaxed">
            <p>
              Hola, soy Wisrovi. Me especializo en construir aplicaciones web modernas, escalables y visualmente impactantes. 
              <strong>wTicketFlow</strong> es un ejemplo de cómo la tecnología moderna (React 19, Tailwind) y la Inteligencia Artificial (Google Gemini) 
              pueden unirse para resolver problemas reales sin la complejidad de infraestructuras pesadas.
            </p>
          </div>
        </div>
      </div>

      {/* Tech Grid */}
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 px-2">Tecnología Detrás de wTicketFlow</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <TechCard 
          icon={Code} 
          title="React 19" 
          desc="Última versión con Hooks avanzados y gestión de estado optimizada." 
          color="text-blue-500 bg-blue-50 dark:bg-blue-900/20"
        />
        <TechCard 
          icon={Layout} 
          title="Tailwind CSS" 
          desc="Diseño atómico, modo oscuro nativo y animaciones fluidas." 
          color="text-teal-500 bg-teal-50 dark:bg-teal-900/20"
        />
        <TechCard 
          icon={Server} 
          title="Google Gemini" 
          desc="IA Generativa para categorización y asistencia técnica." 
          color="text-purple-500 bg-purple-50 dark:bg-purple-900/20"
        />
        <TechCard 
          icon={Database} 
          title="Local First" 
          desc="Arquitectura sin servidor. Datos persistentes en navegador." 
          color="text-orange-500 bg-orange-50 dark:bg-orange-900/20"
        />
      </div>

      {/* Philosophy */}
      <div className="bg-indigo-900 text-white rounded-3xl p-8 relative overflow-hidden">
        <div className="relative z-10">
           <h2 className="text-2xl font-bold mb-4">Filosofía de Desarrollo</h2>
           <blockquote className="text-xl font-light italic opacity-90 border-l-4 border-indigo-400 pl-4 mb-6">
             "El software no solo debe funcionar, debe deleitar. La estética y la funcionalidad no son opuestos, son multiplicadores."
           </blockquote>
           <div className="flex gap-2">
             <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-bold">CLEAN CODE</span>
             <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-bold">UX DRIVEN</span>
             <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-bold">PERFORMANCE</span>
           </div>
        </div>
        
        {/* Decorative Circles */}
        <div className="absolute -top-10 -right-10 w-64 h-64 bg-indigo-500/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-purple-500/30 rounded-full blur-3xl"></div>
      </div>

    </div>
  );
};

const TechCard = ({ icon: Icon, title, desc, color }: any) => (
  <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all">
    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${color}`}>
      <Icon size={20} />
    </div>
    <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-1">{title}</h3>
    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
  </div>
);