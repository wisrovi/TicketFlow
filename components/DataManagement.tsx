import React, { useRef } from 'react';
import { AppData } from '../types';
import { Download, Upload, HardDrive, AlertTriangle } from 'lucide-react';

interface DataManagementProps {
  data: AppData;
  onImport: (data: AppData) => void;
}

export const DataManagement: React.FC<DataManagementProps> = ({ data, onImport }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `ticketflow_backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        // Validar estructura básica
        if (Array.isArray(json.tickets)) {
            // Migración suave: si no existen usuarios/subjects en el JSON (versión vieja), poner array vacío
            const cleanData: AppData = {
                tickets: json.tickets,
                users: Array.isArray(json.users) ? json.users : [],
                subjects: Array.isArray(json.subjects) ? json.subjects : []
            };
            onImport(cleanData);
        } else {
          alert('El archivo no tiene el formato correcto.');
        }
      } catch (error) {
        alert('Error al leer el archivo JSON.');
      }
    };
    reader.readAsText(file);
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-6 flex gap-4 items-start">
        <HardDrive className="text-blue-600 dark:text-blue-400 shrink-0 mt-1" size={24} />
        <div>
          <h3 className="font-bold text-blue-900 dark:text-blue-100 mb-1">Almacenamiento en Disco</h3>
          <p className="text-blue-800 dark:text-blue-200 text-sm leading-relaxed">
            Dado que esta es una aplicación web segura, no puede modificar automáticamente archivos en tu disco duro. 
            Utiliza las opciones siguientes para <strong>Guardar</strong> tu base de datos en un archivo local o <strong>Cargar</strong> un archivo existente.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Export Section */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col items-center text-center hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors">
          <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mb-4">
            <Download size={32} />
          </div>
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">Guardar Datos</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 flex-1">
            Descarga un archivo <code>.json</code> con todos los tickets, usuarios y asuntos actuales a tu computadora.
          </p>
          <button
            onClick={handleExport}
            title="Guardar copia de seguridad en tu equipo"
            className="w-full py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
          >
            <Download size={18} />
            Descargar Backup
          </button>
        </div>

        {/* Import Section */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col items-center text-center hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors">
          <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mb-4">
            <Upload size={32} />
          </div>
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">Cargar Datos</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 flex-1">
            Restaura el sistema seleccionando un archivo de backup previamente guardado.
          </p>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            title="Cargar copia de seguridad desde tu equipo"
            className="w-full py-3 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-xl font-medium hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center justify-center gap-2"
          >
            <Upload size={18} />
            Seleccionar Archivo
          </button>
        </div>
      </div>

       <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 flex gap-3 items-center">
        <AlertTriangle className="text-amber-600 dark:text-amber-500 shrink-0" size={20} />
        <p className="text-amber-800 dark:text-amber-200 text-xs">
          <strong>Nota:</strong> Al cargar un archivo, se reemplazarán todos los datos actuales. Asegúrate de guardar tu trabajo actual si es necesario.
        </p>
      </div>
    </div>
  );
};