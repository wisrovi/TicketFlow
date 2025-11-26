import React from 'react';
import { X, Linkedin, Github, Cpu, Globe, Heart } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative animate-in zoom-in-95 duration-300 border border-gray-200 dark:border-gray-700">
        
        {/* Background Header */}
        <div className="h-32 bg-gradient-to-r from-indigo-600 to-purple-600 relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full transition-colors backdrop-blur-md"
          >
            <X size={20} />
          </button>
        </div>

        {/* Profile Content */}
        <div className="px-8 pb-8 -mt-12 text-center">
          <div className="w-24 h-24 bg-white dark:bg-gray-800 rounded-full p-1.5 mx-auto shadow-lg relative z-10">
            <div className="w-full h-full bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center overflow-hidden">
               {/* Placeholder for Profile Image based on initials since we don't have the direct image file */}
               <span className="text-2xl font-bold text-gray-400 dark:text-gray-500">WR</span>
            </div>
            <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 border-4 border-white dark:border-gray-800 rounded-full" title="Available for work"></div>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mt-4">Wisrovi Rodríguez</h2>
          <p className="text-indigo-600 dark:text-indigo-400 font-medium text-sm mb-1">Senior Full Stack Engineer</p>
          <p className="text-gray-500 dark:text-gray-400 text-xs flex items-center justify-center gap-1">
            <Globe size={12} /> Madrid, España (Remoto)
          </p>

          {/* Bio / Description */}
          <div className="mt-6 space-y-3">
             <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 text-sm text-gray-600 dark:text-gray-300 leading-relaxed border border-gray-100 dark:border-gray-700">
               <p>
                 Especialista en desarrollo de aplicaciones web modernas de alto rendimiento e integración de Inteligencia Artificial.
               </p>
             </div>
          </div>

          {/* Stack Badges */}
          <div className="mt-6">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Tech Stack</p>
            <div className="flex flex-wrap justify-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800">React 19</span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300 border border-teal-200 dark:border-teal-800">Tailwind CSS</span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border border-purple-200 dark:border-purple-800">Gemini AI</span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 border border-orange-200 dark:border-orange-800">TypeScript</span>
            </div>
          </div>

          {/* Social Actions */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <a 
              href="https://es.linkedin.com/in/wisrovi-rodriguez" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 bg-[#0077b5] hover:bg-[#006396] text-white rounded-xl transition-all shadow-md hover:shadow-lg font-medium text-sm"
            >
              <Linkedin size={18} />
              LinkedIn
            </a>
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2.5 bg-gray-800 text-white rounded-xl hover:bg-gray-900 transition-all shadow-md"
              title="GitHub Profile"
            >
              <Github size={18} />
            </a>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700 flex flex-col items-center">
             <div className="flex items-center gap-2 text-xs text-gray-400 font-medium mb-1">
               wTicketFlow v1.2.0 <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span> 2024
             </div>
             <p className="text-[10px] text-gray-400 flex items-center gap-1">
               Made with <Heart size={10} className="text-red-500 fill-current" /> by Wisrovi
             </p>
          </div>

        </div>
      </div>
    </div>
  );
};
