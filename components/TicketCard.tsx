import React, { useState, useEffect, useRef } from 'react';
import { Ticket, TicketStatus, TicketTopic, TicketPriority } from '../types';
import { CheckCircle2, Clock, User, Sparkles, ChevronDown, ChevronUp, ExternalLink, RotateCcw, Check, Hash, AlertCircle, FileText, MessageSquare, Send, ShieldCheck, Bold, Italic, List, EyeOff, Wand2 } from 'lucide-react';
import { getSolutionInsight, generateSmartReply } from '../services/geminiService';

interface TicketCardProps {
  ticket: Ticket;
  isAdmin: boolean;
  currentUser?: string;
  isHighlighted?: boolean;
  defaultExpanded?: boolean;
  isAiEnabled?: boolean;
  onResolve: (id: string, note?: string) => void;
  onReopen: (id: string) => void;
  onAddComment: (ticketId: string, text: string) => void;
}

export const TicketCard: React.FC<TicketCardProps> = ({ 
  ticket, 
  isAdmin, 
  currentUser,
  isHighlighted, 
  defaultExpanded = false, 
  isAiEnabled = false,
  onResolve, 
  onReopen,
  onAddComment 
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [aiInsight, setAiInsight] = useState<string | null>(ticket.aiSolution || null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [loadingSmartReply, setLoadingSmartReply] = useState(false);
  const [showResolveConfirm, setShowResolveConfirm] = useState(false);
  const [resolutionNote, setResolutionNote] = useState('');
  
  // Comment state
  const [newComment, setNewComment] = useState('');
  const commentsEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isExpanded) {
      scrollToBottom();
      const timer = setTimeout(() => {
        scrollToBottom();
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [ticket.comments, isExpanded]);

  const handleGetInsight = async () => {
    if (aiInsight || !isAiEnabled) return;
    setLoadingAi(true);
    const insight = await getSolutionInsight(ticket.title, ticket.description);
    setAiInsight(insight);
    setLoadingAi(false);
  };

  const handleGenerateSmartReply = async () => {
    if (!isAiEnabled) return;
    setLoadingSmartReply(true);
    const historyText = ticket.comments?.map(c => `${c.authorName}: ${c.text}`).join('\n') || "";
    const reply = await generateSmartReply(ticket.title, ticket.description, historyText);
    setNewComment(reply);
    setLoadingSmartReply(false);
  };

  const handleSendComment = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newComment.trim()) return;
    onAddComment(ticket.id, newComment);
    setNewComment('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendComment();
    }
  };

  // --- Markdown Logic ---
  const insertFormat = (prefix: string, suffix: string) => {
    if (!textareaRef.current) return;
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const text = textareaRef.current.value;
    const before = text.substring(0, start);
    const selection = text.substring(start, end);
    const after = text.substring(end);
    const newText = before + prefix + selection + suffix + after;
    setNewComment(newText);
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(start + prefix.length, end + prefix.length);
      }
    }, 0);
  };

  const renderMarkdown = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, lineIndex) => {
      if (line.trim().startsWith('- ')) {
        return <li key={lineIndex} className="ml-4 list-disc pl-1">{parseInlineStyles(line.trim().substring(2))}</li>;
      }
      if (line.trim() === '') return <br key={lineIndex} />;
      return <div key={lineIndex} className="min-h-[1.2em]">{parseInlineStyles(line)}</div>;
    });
  };

  const parseInlineStyles = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|https?:\/\/[^\s]+)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) return <strong key={i}>{part.slice(2, -2)}</strong>;
      if (part.startsWith('*') && part.endsWith('*')) return <em key={i}>{part.slice(1, -1)}</em>;
      if (part.match(/^https?:\/\//)) {
         return <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-indigo-200 hover:text-white underline decoration-indigo-300/50 underline-offset-2 break-all" onClick={(e) => e.stopPropagation()}>{part} <ExternalLink size={10} className="inline ml-0.5" /></a>;
      }
      return part;
    });
  };

  const isResolved = ticket.status === TicketStatus.RESOLVED;
  const commentCount = ticket.comments?.length || 0;
  
  const topicColors = {
    [TicketTopic.GITHUB]: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    [TicketTopic.CONSULTA]: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
    [TicketTopic.BUG]: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
    [TicketTopic.ACCESO]: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300',
    [TicketTopic.OTRO]: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
  };
  const priorityConfig = {
    [TicketPriority.LOW]: { color: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20', icon: CheckCircle2 },
    [TicketPriority.NORMAL]: { color: 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700', icon: CheckCircle2 },
    [TicketPriority.HIGH]: { color: 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20', icon: AlertCircle },
    [TicketPriority.URGENT]: { color: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900', icon: AlertCircle },
  };
  const pConfig = priorityConfig[ticket.priority] || priorityConfig[TicketPriority.NORMAL];

  const renderDescriptionWithLinks = (text: string) => {
    if (!text) return null;
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.split(urlRegex).map((part, i) => {
      if (part.match(urlRegex)) {
        return <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium inline-flex items-center gap-0.5 break-all" onClick={(e) => e.stopPropagation()} title="Abrir enlace en una nueva pestaña">{part} <ExternalLink size={12} className="shrink-0" /></a>;
      }
      return part;
    });
  };

  return (
    <div className={`relative rounded-2xl p-5 border transition-all duration-700 ease-in-out ${isHighlighted ? 'bg-white dark:bg-gray-800 border-indigo-500 ring-2 ring-indigo-200 dark:ring-indigo-900 shadow-xl scale-[1.02] z-10' : isResolved ? 'bg-gray-50/80 dark:bg-gray-800/60 border-green-200 dark:border-green-900/30 opacity-85 grayscale-[0.2] hover:grayscale-0 hover:opacity-100 hover:bg-white dark:hover:bg-gray-800 shadow-none' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md'}`}>
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="flex items-center gap-0.5 text-xs font-bold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded"><Hash size={10} />{ticket.number}</span>
            {isResolved ? <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400 border border-green-200 dark:border-green-800 animate-in fade-in zoom-in duration-300"><CheckCircle2 size={12} /> RESUELTO</span> : <span className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${pConfig.color}`}>{ticket.priority.toUpperCase()}</span>}
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${topicColors[ticket.topic]}`}>{ticket.topic}</span>
            <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1"><Clock size={12} />{isResolved && ticket.resolvedAt ? `Resuelto: ${new Date(ticket.resolvedAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}` : new Date(ticket.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          <h3 className={`text-lg font-bold transition-colors ${isResolved ? 'text-gray-600 dark:text-gray-400 decoration-gray-400' : 'text-gray-800 dark:text-white'}`}>{ticket.title}</h3>
        </div>
        <div className="flex flex-col gap-2 items-end">
          {isAdmin && !isResolved && (
            showResolveConfirm ? (
              <div className="absolute right-4 top-4 z-20 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded-xl shadow-xl w-72 animate-in fade-in slide-in-from-right-2 duration-200">
                <h4 className="text-sm font-bold text-gray-800 dark:text-white mb-2">Finalizar Ticket</h4>
                <textarea className="w-full text-sm p-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 dark:text-white" placeholder="Bitácora: ¿Qué solución se aplicó?" rows={3} value={resolutionNote} onChange={(e) => setResolutionNote(e.target.value)} autoFocus />
                <div className="flex gap-2 justify-end">
                    <button onClick={(e) => { e.stopPropagation(); setShowResolveConfirm(false); setResolutionNote(''); }} className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 px-3 py-1.5" title="Cancelar resolución">Cancelar</button>
                    <button onClick={(e) => { e.stopPropagation(); onResolve(ticket.id, resolutionNote); setShowResolveConfirm(false); setResolutionNote(''); }} className="text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg font-medium flex items-center gap-1" title="Confirmar resolución del ticket"><Check size={14} /> Confirmar</button>
                </div>
              </div>
            ) : (
              <button onClick={(e) => { e.stopPropagation(); setShowResolveConfirm(true); }} className="shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-xl transition-all shadow-sm group flex items-center gap-2 hover:shadow-md" title="Marcar ticket como resuelto y añadir nota"><CheckCircle2 size={20} className="group-hover:scale-110 transition-transform" /><span className="text-xs font-medium hidden sm:inline">Resolver</span></button>
            )
          )}
          {isAdmin && isResolved && (
             <div className="flex gap-2">
                 <button onClick={(e) => { e.stopPropagation(); onReopen(ticket.id); }} className="shrink-0 bg-blue-100 hover:bg-blue-200 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50 p-2 rounded-xl transition-all shadow-sm group flex items-center gap-2" title="Marcar ticket como No Leído / Pendiente de Revisión"><EyeOff size={20} className="transition-transform" /><span className="text-xs font-medium hidden sm:inline">No Leído</span></button>
                 <button onClick={(e) => { e.stopPropagation(); onReopen(ticket.id); }} className="shrink-0 bg-amber-500 hover:bg-amber-600 text-white p-2 rounded-xl transition-all shadow-sm group flex items-center gap-2 hover:shadow-md" title="Reabrir ticket por recurrencia"><RotateCcw size={20} className="group-hover:-rotate-180 transition-transform duration-500" /><span className="text-xs font-medium hidden sm:inline">Reabrir</span></button>
             </div>
          )}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-gray-50 dark:bg-gray-700/50"><User size={14} /><span className="font-medium text-xs">{ticket.creatorName}</span></div>
          <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md transition-all ${commentCount > 0 ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 font-semibold' : 'text-gray-400 dark:text-gray-500'}`} title={`${commentCount} comentarios`}><MessageSquare size={14} className={commentCount > 0 ? "fill-current" : ""} /><span className="text-xs">{commentCount > 0 ? `${commentCount} msgs` : '0'}</span></div>
        </div>
        <button onClick={() => setIsExpanded(!isExpanded)} className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center gap-1 font-medium transition-colors" title={isExpanded ? "Contraer detalles" : "Expandir detalles"}>{isExpanded ? 'Ocultar detalles' : 'Ver detalles'} {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</button>
      </div>

      <div className={`grid transition-all duration-300 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0 mt-0'}`}>
        <div className="overflow-hidden">
          <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4 text-sm">
            <p className="text-gray-700 dark:text-gray-200 font-semibold mb-2 flex items-center gap-2">Descripción:</p>
            <div className="text-gray-600 dark:text-gray-300 mb-6 whitespace-pre-wrap leading-relaxed">{ticket.description && ticket.description.trim() !== '' ? renderDescriptionWithLinks(ticket.description) : <span className="italic text-gray-400 dark:text-gray-500">Sin descripción detallada</span>}</div>
            {isResolved && ticket.resolvedAt && (
               <div className="mb-6 text-green-700 dark:text-green-400 text-xs font-medium bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-100 dark:border-green-900/30">
                 <div className="flex items-center gap-2 mb-2"><div className="p-1 bg-green-200 dark:bg-green-800 rounded-full"><CheckCircle2 size={14} /></div><div><span className="font-bold">Ticket Resuelto</span><span className="opacity-90 ml-2">{new Date(ticket.resolvedAt).toLocaleString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span></div></div>
                 {ticket.resolutionNote && <div className="mt-2 pl-8 border-l-2 border-green-200 dark:border-green-800"><p className="font-semibold text-green-800 dark:text-green-300 flex items-center gap-1 mb-1"><FileText size={12} /> Nota de Resolución:</p><p className="text-green-700 dark:text-green-400 italic">"{ticket.resolutionNote}"</p></div>}
               </div>
            )}
            
            {/* AI Insights - Only show if AI is Enabled */}
            {isAdmin && !isResolved && isAiEnabled && (
              <div className="mb-6 border-b border-gray-200 dark:border-gray-600 pb-4">
                <div className="bg-white dark:bg-gray-800 border border-purple-100 dark:border-purple-900/30 rounded-lg p-3 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="flex items-center gap-2 text-purple-700 dark:text-purple-400 font-semibold text-xs uppercase tracking-wide"><Sparkles size={14} /> AI Insight</span>
                    {!aiInsight && !loadingAi && <button onClick={handleGetInsight} className="text-xs bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/40 text-purple-600 dark:text-purple-400 px-2 py-1 rounded transition-colors" title="Generar posibles soluciones con IA">Generar Sugerencias</button>}
                  </div>
                  {loadingAi && <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 py-2"><div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>Generando respuesta...</div>}
                  {aiInsight && <div className="prose prose-sm max-w-none text-gray-600 dark:text-gray-300"><React.Fragment>{aiInsight.split('\n').map((line, i) => <p key={i} className="my-1">{line}</p>)}</React.Fragment></div>}
                </div>
              </div>
            )}

            <div className="pt-2">
              <h4 className="font-bold text-gray-700 dark:text-gray-200 mb-3 flex items-center gap-2"><MessageSquare size={16} /> Chat del Ticket</h4>
              <div className="bg-gray-100 dark:bg-gray-800/50 rounded-xl p-3 mb-3 border border-gray-200 dark:border-gray-700 min-h-[100px] max-h-[400px] overflow-y-auto custom-scrollbar flex flex-col gap-3">
                {(!ticket.comments || ticket.comments.length === 0) && <div className="flex flex-col items-center justify-center h-full py-8 opacity-50"><MessageSquare size={32} className="mb-2 text-gray-400" /><p className="text-xs italic text-gray-500">No hay mensajes. Inicia la conversación.</p></div>}
                {ticket.comments?.map((comment) => {
                  const isMe = isAdmin ? comment.isAdmin : !comment.isAdmin;
                  return (
                    <div key={comment.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-full`}>
                       <div className={`max-w-[90%] rounded-2xl px-4 py-3 text-sm shadow-sm relative group ${isMe ? 'bg-indigo-600 text-white rounded-br-none' : comment.isAdmin ? 'bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-100 rounded-bl-none border border-amber-200 dark:border-amber-800' : 'bg-white text-gray-800 dark:bg-gray-700 dark:text-gray-100 rounded-bl-none border border-gray-200 dark:border-gray-600'}`}>
                         <div className={`text-[10px] font-bold mb-1 opacity-80 flex items-center gap-1 ${isMe ? 'justify-end' : 'justify-start'}`}>{comment.isAdmin && <ShieldCheck size={10} />}{comment.authorName}</div>
                         <div className="leading-relaxed break-words">{renderMarkdown(comment.text)}</div>
                         <span className={`text-[9px] block mt-1.5 opacity-70 ${isMe ? 'text-right' : 'text-left'}`}>{new Date(comment.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                       </div>
                    </div>
                  );
                })}
                <div ref={commentsEndRef} />
              </div>

              {!isResolved && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-300 dark:border-gray-600 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent transition-all overflow-hidden">
                  <div className="flex items-center gap-1 px-2 py-1.5 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                    <button type="button" onClick={() => insertFormat('**', '**')} className="p-1.5 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors" title="Negrita"><Bold size={14} /></button>
                    <button type="button" onClick={() => insertFormat('*', '*')} className="p-1.5 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors" title="Cursiva"><Italic size={14} /></button>
                    <button type="button" onClick={() => insertFormat('- ', '')} className="p-1.5 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors" title="Lista"><List size={14} /></button>
                    <div className="flex-1"></div>
                    
                    {/* AI Smart Reply Button */}
                    {isAiEnabled && (
                      <button 
                        type="button"
                        onClick={handleGenerateSmartReply}
                        disabled={loadingSmartReply}
                        className="flex items-center gap-1 text-[10px] px-2 py-1 bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/30 dark:hover:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded-md transition-colors mr-2 font-medium"
                      >
                         <Wand2 size={10} /> {loadingSmartReply ? 'Generando...' : 'Respuesta Mágica'}
                      </button>
                    )}
                    <span className="text-[10px] text-gray-400 mr-2 hidden sm:block">Markdown</span>
                  </div>
                  <form onSubmit={handleSendComment} className="relative flex items-end">
                      <textarea ref={textareaRef} value={newComment} onChange={(e) => setNewComment(e.target.value)} onKeyDown={handleKeyDown} placeholder="Escribe un mensaje... (Shift+Enter para nueva línea)" rows={2} className="w-full pl-4 pr-12 py-3 bg-transparent text-gray-900 dark:text-gray-100 outline-none resize-y min-h-[50px] max-h-[150px]" />
                      <button type="submit" disabled={!newComment.trim()} className="absolute right-2 bottom-2 p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:bg-gray-400 transition-all flex items-center justify-center shadow-md" title="Enviar mensaje"><Send size={16} /></button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};