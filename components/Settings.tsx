import React from 'react';
import { Moon, Sun, Bell, Shield, Trash2, Sparkles, ToggleLeft, ToggleRight, Wand2, MessageSquare, Tag } from 'lucide-react';

interface SettingsProps {
  isDarkMode: boolean;
  onToggleTheme: () => void;
  isAiEnabled: boolean;
  onToggleAi: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ isDarkMode, onToggleTheme, isAiEnabled, onToggleAi }) => {
  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Configuración</h2>
        <p className="text-gray-500 dark:text-gray-400">Personaliza tu experiencia en wTicketFlow</p>
      </div>

      {/* IA Settings */}
      <div className={`rounded-2xl border transition-all duration-300 overflow-hidden ${isAiEnabled ? 'bg-purple-50 dark:bg-purple-900/10 border-purple-200 dark:border-purple-800' : 'bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-800 border-gray-200 dark:border-gray-700'}`}>
        <div className="p-6">
          <h3 className="font-bold text-purple-900 dark:text-purple-200 mb-4 flex items-center gap-2">
            <Sparkles size={20} className="text-purple-600 dark:text-purple-400" /> Inteligencia Artificial
          </h3>
          <div className="flex items-center justify-between">
            <div className="pr-4">
              <p className="font-medium text-gray-800 dark:text-gray-200">Funcionalidades Smart con Gemini</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                Activa funciones como auto-categorización de tickets, mejora de redacción y sugerencia de respuestas inteligentes. 
                <br/><span className="italic opacity-70">(Requiere API Key configurada internamente)</span>
              </p>
            </div>
            <button 
              onClick={onToggleAi}
              className={`shrink-0 text-4xl transition-colors ${isAiEnabled ? 'text-purple-600 dark:text-purple-400' : 'text-gray-300 dark:text-gray-600'}`}
              title={isAiEnabled ? 'Desactivar IA' : 'Activar IA'}
            >
              {isAiEnabled ? <ToggleRight size={48} /> : <ToggleLeft size={48} />}
            </button>
          </div>
        </div>
        
        {/* Helper Guide appearing when AI is enabled */}
        {isAiEnabled && (
          <div className="px-6 pb-6 pt-0 animate-in slide-in-from-top-4 fade-in duration-500">
             <div className="bg-white/60 dark:bg-gray-900/40 rounded-xl p-4 text-sm border border-purple-100 dark:border-purple-900/30">
               <h4 className="font-bold text-purple-800 dark:text-purple-300 mb-2 text-xs uppercase tracking-wide">Cómo usar las nuevas funciones:</h4>
               <ul className="space-y-3">
                 <li className="flex gap-3">
                   <div className="p-1.5 bg-purple-100 dark:bg-purple-900/50 rounded-lg text-purple-600 dark:text-purple-400 h-fit"><Tag size={14} /></div>
                   <div>
                     <strong className="text-gray-700 dark:text-gray-300">Auto-categorización:</strong>
                     <p className="text-gray-500 dark:text-gray-400 text-xs">Al crear un ticket, escribe la descripción y espera unos segundos. La IA detectará la <strong>Prioridad</strong> y la <strong>Categoría</strong> automáticamente.</p>
                   </div>
                 </li>
                 <li className="flex gap-3">
                   <div className="p-1.5 bg-purple-100 dark:bg-purple-900/50 rounded-lg text-purple-600 dark:text-purple-400 h-fit"><Wand2 size={14} /></div>
                   <div>
                     <strong className="text-gray-700 dark:text-gray-300">Mejora de Texto:</strong>
                     <p className="text-gray-500 dark:text-gray-400 text-xs">En el formulario de creación, usa el botón "Mejorar Redacción" para que la IA reescriba tu problema de forma profesional.</p>
                   </div>
                 </li>
                 <li className="flex gap-3">
                   <div className="p-1.5 bg-purple-100 dark:bg-purple-900/50 rounded-lg text-purple-600 dark:text-purple-400 h-fit"><MessageSquare size={14} /></div>
                   <div>
                     <strong className="text-gray-700 dark:text-gray-300">Respuestas Inteligentes:</strong>
                     <p className="text-gray-500 dark:text-gray-400 text-xs">Al responder un ticket, usa el botón "Respuesta Mágica" para generar una respuesta empática basada en el historial.</p>
                   </div>
                 </li>
               </ul>
             </div>
          </div>
        )}
      </div>

      {/* Apariencia */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
        <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
          <Sun size={20} className="text-orange-500" /> Apariencia
        </h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-700 dark:text-gray-300">Modo Oscuro</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Cambia entre temas claro y oscuro</p>
          </div>
          <button 
            onClick={onToggleTheme}
            className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 flex items-center ${isDarkMode ? 'bg-indigo-600 justify-end' : 'bg-gray-300 justify-start'}`}
            title={isDarkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
          >
            <div className="w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center">
              {isDarkMode ? <Moon size={14} className="text-indigo-600" /> : <Sun size={14} className="text-yellow-500" />}
            </div>
          </button>
        </div>
      </div>

      {/* Notificaciones (Simulated) */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm opacity-80">
        <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
          <Bell size={20} className="text-indigo-500" /> Notificaciones (Demo)
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-700 dark:text-gray-300">Sonidos del sistema</p>
            </div>
            <div className="w-10 h-5 bg-gray-300 dark:bg-gray-600 rounded-full relative cursor-not-allowed">
               <div className="w-5 h-5 bg-white rounded-full shadow absolute left-0"></div>
            </div>
          </div>
           <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-700 dark:text-gray-300">Alertas por Email</p>
            </div>
             <div className="w-10 h-5 bg-indigo-600 rounded-full relative cursor-not-allowed opacity-50">
               <div className="w-5 h-5 bg-white rounded-full shadow absolute right-0"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Zona de Peligro */}
      <div className="bg-red-50 dark:bg-red-900/10 rounded-2xl p-6 border border-red-200 dark:border-red-900/50 shadow-sm">
        <h3 className="font-bold text-red-800 dark:text-red-400 mb-4 flex items-center gap-2">
          <Shield size={20} /> Zona de Peligro
        </h3>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-red-800 dark:text-red-300">Restablecer Aplicación</p>
            <p className="text-xs text-red-600 dark:text-red-400">Borra todos los datos locales (Tickets, Usuarios, Configuración).</p>
          </div>
          <button 
            onClick={() => {
              if(confirm('¿Estás SEGURO? Esto borrará todos tus tickets y usuarios. No se puede deshacer.')) {
                localStorage.clear();
                window.location.reload();
              }
            }}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-lg transition-colors flex items-center gap-2"
            title="Borrar todos los datos y reiniciar la aplicación"
          >
            <Trash2 size={16} /> Resetear Todo
          </button>
        </div>
      </div>

      <div className="text-center text-xs text-gray-400 mt-8">
        wTicketFlow Build 2024.10.25 - <span className="font-mono">v1.2.0</span>
      </div>

    </div>
  );
};