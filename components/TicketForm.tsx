import React, { useState, useEffect } from 'react';
import { TicketTopic, TicketPriority, User, Subject } from '../types';
import { categorizeTicket, improveDescription, analyzePriority } from '../services/geminiService';
import { Send, Sparkles, Loader2, UserPlus, Tag, Wand2 } from 'lucide-react';

interface TicketFormProps {
  users: User[];
  subjects: Subject[];
  isAiEnabled: boolean;
  onSubmit: (data: { title: string; description: string; creatorName: string; creatorId: string; topic: TicketTopic; priority: TicketPriority }) => void;
  onCancel: () => void;
  onNavigateToUsers: () => void;
  onNavigateToSubjects: () => void;
}

export const TicketForm: React.FC<TicketFormProps> = ({ 
  users, 
  subjects,
  isAiEnabled,
  onSubmit, 
  onCancel, 
  onNavigateToUsers,
  onNavigateToSubjects
}) => {
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [description, setDescription] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [topic, setTopic] = useState<TicketTopic>(TicketTopic.OTRO);
  const [priority, setPriority] = useState<TicketPriority>(TicketPriority.NORMAL);
  const [isAutoCategorizing, setIsAutoCategorizing] = useState(false);
  const [isImprovingText, setIsImprovingText] = useState(false);

  // Auto-categorize & Auto-priority Logic (only if AI enabled)
  useEffect(() => {
    if (!isAiEnabled) return;

    const timer = setTimeout(async () => {
      if (description.length > 10) {
        setIsAutoCategorizing(true);
        // Run both in parallel for speed
        const [suggestedTopic, suggestedPriority] = await Promise.all([
            categorizeTicket(description),
            analyzePriority(description)
        ]);
        
        setTopic(suggestedTopic);
        setPriority(suggestedPriority);
        setIsAutoCategorizing(false);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [description, isAiEnabled]);

  const handleImproveText = async () => {
    if (!description.trim() || !isAiEnabled) return;
    setIsImprovingText(true);
    const improved = await improveDescription(description);
    setDescription(improved);
    setIsImprovingText(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubjectId || !description || !selectedUserId) return;

    const user = users.find(u => u.id === selectedUserId);
    const subject = subjects.find(s => s.id === selectedSubjectId);
    
    if (!user || !subject) return;

    onSubmit({ 
      title: subject.title, 
      description, 
      creatorName: user.name, 
      creatorId: user.id, 
      topic,
      priority
    });
  };

  if (users.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 max-w-2xl mx-auto text-center transition-colors">
        <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-600 dark:text-indigo-400">
          <UserPlus size={32} />
        </div>
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">No hay usuarios registrados</h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6">Para crear un ticket, primero debes registrar al menos un usuario en el sistema.</p>
        <button onClick={onNavigateToUsers} className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors">Ir a Registro de Usuarios</button>
      </div>
    );
  }

  if (subjects.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 max-w-2xl mx-auto text-center transition-colors">
        <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600 dark:text-emerald-400">
          <Tag size={32} />
        </div>
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">No hay asuntos registrados</h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6">Para crear un ticket, debes definir primero los asuntos disponibles.</p>
        <button onClick={onNavigateToSubjects} className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors">Ir a Registro de Asuntos</button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 md:p-8 max-w-2xl mx-auto transition-colors">
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Crear Solicitud</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Describe tu problema y se notificará al administrador.</p>
        </div>
        {isAiEnabled && (
           <span className="px-3 py-1 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 rounded-full text-xs font-bold flex items-center gap-1 border border-purple-200 dark:border-purple-800">
             <Sparkles size={12} /> AI Activada
           </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Usuario Solicitante</label>
            <select required className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:bg-white dark:focus:bg-gray-600 focus:border-indigo-500 outline-none transition-all cursor-pointer" value={selectedUserId} onChange={(e) => setSelectedUserId(e.target.value)}>
              <option value="" disabled>Seleccionar un usuario...</option>
              {users.map((user) => (<option key={user.id} value={user.id}>{user.name}</option>))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex justify-between">
              Prioridad
              {isAutoCategorizing && <span className="text-purple-500 text-xs animate-pulse">Auto-detectando...</span>}
            </label>
            <select required className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:bg-white dark:focus:bg-gray-600 focus:border-indigo-500 outline-none transition-all cursor-pointer" value={priority} onChange={(e) => setPriority(e.target.value as TicketPriority)}>
              <option value={TicketPriority.LOW}>Baja (Informativo)</option>
              <option value={TicketPriority.NORMAL}>Normal</option>
              <option value={TicketPriority.HIGH}>Alta (Impide trabajar)</option>
              <option value={TicketPriority.URGENT}>URGENTE (Crítico)</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Asunto</label>
          <select required className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:bg-white dark:focus:bg-gray-600 focus:border-indigo-500 outline-none transition-all cursor-pointer" value={selectedSubjectId} onChange={(e) => setSelectedSubjectId(e.target.value)}>
            <option value="" disabled>Seleccionar un asunto...</option>
            {subjects.map((sub) => (<option key={sub.id} value={sub.id}>{sub.title}</option>))}
          </select>
        </div>

        <div className="space-y-2 relative">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              Descripción Detallada
              {isAutoCategorizing && (
                <span className="text-indigo-500 dark:text-indigo-400 flex items-center gap-1 text-xs animate-pulse">
                  <Sparkles size={12} /> Analizando...
                </span>
              )}
            </label>
            {isAiEnabled && description.length > 5 && (
              <button 
                type="button" 
                onClick={handleImproveText}
                disabled={isImprovingText}
                className="text-xs flex items-center gap-1 text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 transition-colors bg-purple-50 dark:bg-purple-900/20 px-2 py-1 rounded-md border border-purple-100 dark:border-purple-800"
              >
                {isImprovingText ? <Loader2 size={12} className="animate-spin"/> : <Wand2 size={12} />}
                {isImprovingText ? 'Mejorando...' : 'Mejorar Redacción'}
              </button>
            )}
          </div>
          <textarea
            required
            rows={5}
            className={`w-full px-4 py-3 rounded-lg border bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 outline-none transition-all resize-none ${isImprovingText ? 'opacity-50' : ''} ${isAiEnabled ? 'border-gray-200 dark:border-gray-600 focus:border-purple-500 focus:ring-purple-100 dark:focus:ring-purple-900' : 'border-gray-200 dark:border-gray-600 focus:border-indigo-500 focus:ring-indigo-100 dark:focus:ring-indigo-900'}`}
            placeholder="Describe qué pasó, cuándo ocurrió, etc..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Categoría {isAiEnabled ? '(Auto-detectada)' : ''}</label>
          <div className="relative">
            <select value={topic} onChange={(e) => setTopic(e.target.value as TicketTopic)} className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:bg-white dark:focus:bg-gray-600 focus:border-indigo-500 outline-none transition-all appearance-none cursor-pointer">
              {Object.values(TicketTopic).map((t) => (<option key={t} value={t}>{t}</option>))}
            </select>
            {isAutoCategorizing ? (
               <div className="absolute right-3 top-3.5 text-indigo-500 dark:text-indigo-400"><Loader2 size={18} className="animate-spin" /></div>
            ) : isAiEnabled ? (
              <div className="absolute right-3 top-3.5 pointer-events-none text-gray-400 dark:text-gray-500">
                <Sparkles size={18} className={description.length > 10 ? "text-purple-500" : "text-gray-300 dark:text-gray-600"} />
              </div>
            ) : null}
          </div>
        </div>

        <div className="pt-4 flex gap-4">
          <button type="button" onClick={onCancel} className="flex-1 px-6 py-3 rounded-xl border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">Cancelar</button>
          <button type="submit" className="flex-1 px-6 py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 shadow-md shadow-indigo-200 dark:shadow-none transition-all flex justify-center items-center gap-2">
            <Send size={18} /> Enviar Ticket
          </button>
        </div>
      </form>
    </div>
  );
};