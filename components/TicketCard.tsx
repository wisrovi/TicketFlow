
import React, { useState } from 'react';
import { Ticket, TicketStatus, TicketTopic } from '../types';
import { CheckCircle2, Clock, User, Sparkles, ChevronDown, ChevronUp, ExternalLink, RotateCcw, X, Check, Hash } from 'lucide-react';
import { getSolutionInsight } from '../services/geminiService';

interface TicketCardProps {
  ticket: Ticket;
  isAdmin: boolean;
  isHighlighted?: boolean;
  defaultExpanded?: boolean;
  onResolve: (id: string) => void;
  onReopen: (id: string) => void;
}

export const TicketCard: React.FC<TicketCardProps> = ({ ticket, isAdmin, isHighlighted, defaultExpanded = false, onResolve, onReopen }) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [aiInsight, setAiInsight] = useState<string | null>(ticket.aiSolution || null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [showResolveConfirm, setShowResolveConfirm] = useState(false);

  const handleGetInsight = async () => {
    if (aiInsight) return;
    setLoadingAi(true);
    const insight = await getSolutionInsight(ticket.title, ticket.description);
    setAiInsight(insight);
    setLoadingAi(false);
  };

  const isResolved = ticket.status === TicketStatus.RESOLVED;

  const topicColors = {
    [TicketTopic.GITHUB]: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    [TicketTopic.CONSULTA]: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
    [TicketTopic.BUG]: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
    [TicketTopic.ACCESO]: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300',
    [TicketTopic.OTRO]: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
  };

  // Helper function to detect URLs and convert them to links
  const renderDescriptionWithLinks = (text: string) => {
    if (!text) return null;
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.split(urlRegex).map((part, i) => {
      if (part.match(urlRegex)) {
        return (
          <a 
            key={i} 
            href={part} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium inline-flex items-center gap-0.5 break-all"
            onClick={(e) => e.stopPropagation()}
            title="Abrir enlace en una nueva pestaña"
          >
            {part} <ExternalLink size={12} className="shrink-0" />
          </a>
        );
      }
      return part;
    });
  };

  return (
    <div className={`relative rounded-2xl p-5 border transition-all duration-700 ease-in-out ${
      isHighlighted 
        ? 'bg-white dark:bg-gray-800 border-indigo-500 ring-2 ring-indigo-200 dark:ring-indigo-900 shadow-xl scale-[1.02] z-10' 
        : isResolved
          ? 'bg-gray-50/80 dark:bg-gray-800/60 border-green-200 dark:border-green-900/30 opacity-85 grayscale-[0.2] hover:grayscale-0 hover:opacity-100 hover:bg-white dark:hover:bg-gray-800 shadow-none'
          : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md'
    }`}>
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          {/* Header Badges */}
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="flex items-center gap-0.5 text-xs font-bold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded">
              <Hash size={10} />{ticket.number}
            </span>

            {isResolved ? (
               <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400 border border-green-200 dark:border-green-800 animate-in fade-in zoom-in duration-300">
                 <CheckCircle2 size={12} /> RESUELTO
               </span>
            ) : (
               <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold border bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-900">
                 PENDIENTE
               </span>
            )}

            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${topicColors[ticket.topic]}`}>
              {ticket.topic}
            </span>
            
            <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
              <Clock size={12} />
              {isResolved && ticket.resolvedAt 
                ? `Resuelto: ${new Date(ticket.resolvedAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}`
                : new Date(ticket.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
              }
            </span>

            {isHighlighted && (
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 animate-pulse bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded-full">
                ¡Nuevo!
              </span>
            )}
          </div>

          <h3 className={`text-lg font-bold transition-colors ${isResolved ? 'text-gray-600 dark:text-gray-400 decoration-gray-400' : 'text-gray-800 dark:text-white'}`}>
            {ticket.title}
          </h3>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 items-end">
          {isAdmin && !isResolved && (
            showResolveConfirm ? (
              <div className="flex items-center gap-1 animate-in fade-in slide-in-from-right-2 duration-200 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onResolve(ticket.id);
                    setShowResolveConfirm(false);
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white p-1.5 rounded-md transition-colors"
                  title="Confirmar: Marcar ticket como resuelto"
                >
                  <Check size={16} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowResolveConfirm(false);
                  }}
                  className="bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 p-1.5 rounded-md transition-colors"
                  title="Cancelar operación"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowResolveConfirm(true);
                }}
                className="shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-xl transition-all shadow-sm group flex items-center gap-2 hover:shadow-md"
                title="Marcar ticket como resuelto"
              >
                <CheckCircle2 size={20} className="group-hover:scale-110 transition-transform" />
                <span className="text-xs font-medium hidden sm:inline">Resolver</span>
              </button>
            )
          )}

          {isAdmin && isResolved && (
             <button
                onClick={(e) => {
                    e.stopPropagation();
                    onReopen(ticket.id);
                }}
                className="shrink-0 bg-amber-500 hover:bg-amber-600 text-white p-2 rounded-xl transition-all shadow-sm group flex items-center gap-2 hover:shadow-md"
                title="Reabrir ticket y marcar como pendiente"
             >
                <RotateCcw size={20} className="group-hover:-rotate-180 transition-transform duration-500" />
                <span className="text-xs font-medium hidden sm:inline">Reabrir</span>
             </button>
          )}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-gray-50 dark:bg-gray-700/50">
            <User size={14} />
            <span className="font-medium text-xs">{ticket.creatorName}</span>
          </div>
        </div>

        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center gap-1 font-medium transition-colors"
          title={isExpanded ? "Contraer detalles" : "Expandir detalles"}
        >
          {isExpanded ? 'Ocultar detalles' : 'Ver detalles'}
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      {/* Expanded Content */}
      <div className={`grid transition-all duration-300 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0 mt-0'}`}>
        <div className="overflow-hidden">
          <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4 text-sm">
            <p className="text-gray-700 dark:text-gray-200 font-semibold mb-2 flex items-center gap-2">
              Descripción:
            </p>
            <div className="text-gray-600 dark:text-gray-300 mb-6 whitespace-pre-wrap leading-relaxed">
              {ticket.description && ticket.description.trim() !== '' ? (
                renderDescriptionWithLinks(ticket.description)
              ) : (
                <span className="italic text-gray-400 dark:text-gray-500">Sin descripción detallada</span>
              )}
            </div>
            
            {/* Resolution Timestamp */}
            {isResolved && ticket.resolvedAt && (
               <div className="mb-4 flex items-center gap-2 text-green-700 dark:text-green-400 text-xs font-medium bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-100 dark:border-green-900/30 animate-in fade-in slide-in-from-left-2 duration-500">
                 <div className="p-1 bg-green-200 dark:bg-green-800 rounded-full">
                    <CheckCircle2 size={14} />
                 </div>
                 <div className="flex flex-col">
                    <span className="font-bold">Ticket Resuelto</span>
                    <span className="opacity-90">{new Date(ticket.resolvedAt).toLocaleString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                 </div>
               </div>
            )}

            {/* AI Insights (Admin Only) */}
            {isAdmin && !isResolved && (
              <div className="bg-white dark:bg-gray-800 border border-indigo-100 dark:border-indigo-900/30 rounded-lg p-3 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400 font-semibold text-xs uppercase tracking-wide">
                    <Sparkles size={14} /> AI Insight
                  </span>
                  {!aiInsight && !loadingAi && (
                    <button 
                      onClick={handleGetInsight}
                      className="text-xs bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 px-2 py-1 rounded transition-colors"
                      title="Generar posibles soluciones con IA"
                    >
                      Generar Sugerencias
                    </button>
                  )}
                </div>
                
                {loadingAi && (
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 py-2">
                    <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                    Generando respuesta...
                  </div>
                )}

                {aiInsight && (
                  <div className="prose prose-sm max-w-none text-gray-600 dark:text-gray-300">
                    <React.Fragment>
                       {aiInsight.split('\n').map((line, i) => <p key={i} className="my-1">{line}</p>)}
                    </React.Fragment>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
