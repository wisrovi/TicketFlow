import React from 'react';
import { X, UserPlus, Tag, PlusCircle, CheckCircle2, ShieldCheck, User } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const steps = [
    {
      title: "1. Configuración Inicial (Solo Admin)",
      icon: ShieldCheck,
      color: "text-purple-600 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400",
      desc: "Antes de empezar, el administrador debe ir a la pestaña 'Usuarios' para registrar al personal y a 'Asuntos' para definir los temas de los tickets."
    },
    {
      title: "2. Creación de Tickets",
      icon: PlusCircle,
      color: "text-indigo-600 bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400",
      desc: "Cualquier usuario puede ir a 'Nuevo Ticket', seleccionar su nombre, el asunto y describir el problema. La IA categorizará automáticamente la solicitud."
    },
    {
      title: "3. Seguimiento (Modo Usuario)",
      icon: User,
      color: "text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400",
      desc: "En la pestaña 'Mis Tickets', los usuarios pueden ver el estado de sus solicitudes e interactuar mediante el chat integrado en cada ticket."
    },
    {
      title: "4. Resolución (Modo Admin)",
      icon: CheckCircle2,
      color: "text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400",
      desc: "El administrador revisa el Dashboard, usa las sugerencias de la IA y marca los tickets como 'Resueltos' añadiendo una nota de solución."
    }
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden relative animate-in zoom-in-95 duration-300 border border-gray-200 dark:border-gray-700">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">?</span>
            Centro de Ayuda wTicketFlow
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors bg-gray-100 dark:bg-gray-700 p-1 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm">
            Bienvenido a <strong>wTicketFlow</strong>. Esta aplicación permite gestionar solicitudes de soporte de manera eficiente sin necesidad de servidores externos. Aquí tienes una guía rápida:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {steps.map((step, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-indigo-100 dark:hover:border-indigo-900/50 transition-colors bg-gray-50/50 dark:bg-gray-700/20">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${step.color}`}>
                  <step.icon size={20} />
                </div>
                <h3 className="font-bold text-gray-800 dark:text-gray-100 text-sm mb-1">{step.title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/30 rounded-lg p-4 text-sm text-amber-800 dark:text-amber-200">
            <strong>Nota Importante:</strong> Todos los datos se guardan en el navegador. Para evitar pérdida de datos, utiliza la opción <strong>"Datos / Backup"</strong> (Solo Admin) para descargar una copia de seguridad periódicamente.
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-right">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};