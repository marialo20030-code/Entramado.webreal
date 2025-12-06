import { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, Trash2, Edit2, X, Check, MoreVertical, User, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface Aporte {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

interface UserProfile {
  id: string;
  username: string;
  email?: string;
  name?: string;
}

interface AportesSectionProps {
  postId: string;
  userProfiles: { [userId: string]: UserProfile };
  postColors?: string[];
  onExpandedChange?: (expanded: boolean) => void;
}

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export function AportesSection({ postId, userProfiles, postColors = [], onExpandedChange }: AportesSectionProps) {
  const { user } = useAuth();
  const [aportes, setAportes] = useState<Aporte[]>([]);
  const [loading, setLoading] = useState(true);
  const [newAporte, setNewAporte] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [expandedMenuId, setExpandedMenuId] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const editTextareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    loadAportes();
  }, [postId]);

  useEffect(() => {
    if (editingId && editTextareaRef.current) {
      editTextareaRef.current.focus();
      editTextareaRef.current.setSelectionRange(
        editTextareaRef.current.value.length,
        editTextareaRef.current.value.length
      );
    }
  }, [editingId]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 4000);
  };

  const loadAportes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('aportes')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading aportes:', error);
        // Detectar si la tabla no existe (varios posibles mensajes)
        const tableNotExists = 
          error.code === 'PGRST116' || 
          error.message?.toLowerCase().includes('does not exist') || 
          error.message?.toLowerCase().includes('relation "aportes" does not exist') ||
          error.message?.toLowerCase().includes('relation "public.aportes" does not exist') ||
          error.hint?.toLowerCase().includes('perhaps you meant') ||
          error.message?.toLowerCase().includes('could not find');
        
        if (tableNotExists) {
          // Tabla no existe, mostrar vacío sin error en consola
          console.warn('⚠️ La tabla aportes no existe. Ejecuta la migración SQL en Supabase.');
          setAportes([]);
          setLoading(false);
          return;
        }
        // Si es un error de permisos, intentar de todas formas
        if (error.message?.includes('permission') || error.message?.includes('policy') || error.message?.includes('RLS')) {
          console.warn('Permisos de aportes:', error.message);
          setAportes([]);
          setLoading(false);
          return;
        }
        throw error;
      }
      setAportes(data || []);
    } catch (err: any) {
      console.error('Error loading aportes:', err);
      // No mostrar toast de error al cargar, solo en consola
      setAportes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e?: React.FormEvent | React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!user || !newAporte.trim()) {
      if (!user) {
        showToast('Debes iniciar sesión para publicar un aporte.', 'error');
      } else {
        showToast('Escribe algo antes de publicar.', 'error');
      }
      return;
    }

    setSubmitting(true);
    try {
      // Verificar que el usuario esté autenticado
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session || !session.user) {
        showToast('No estás autenticado. Por favor, inicia sesión.', 'error');
        setSubmitting(false);
        return;
      }

      // Usar el user_id de la sesión para mayor seguridad
      const userId = session.user.id;

      const { data, error } = await supabase.from('aportes').insert({
        post_id: postId,
        user_id: userId,
        content: newAporte.trim(),
      }).select();

      if (error) {
        console.error('Error completo al crear aporte:', error);
        console.error('Código de error:', error.code);
        console.error('Mensaje:', error.message);
        console.error('Detalles:', error.details);
        console.error('Hint:', error.hint);
        console.error('User ID usado:', userId);
        console.error('Post ID usado:', postId);
        
        // Detectar si la tabla no existe (varios posibles mensajes de error)
        const tableNotExists = 
          error.code === 'PGRST116' || 
          error.message?.toLowerCase().includes('does not exist') || 
          error.message?.toLowerCase().includes('relation "aportes" does not exist') ||
          error.message?.toLowerCase().includes('relation "public.aportes" does not exist') ||
          error.hint?.toLowerCase().includes('perhaps you meant') ||
          error.message?.toLowerCase().includes('could not find') ||
          error.details?.toLowerCase().includes('aportes');
        
        if (tableNotExists) {
          showToast('⚠️ La tabla de aportes no existe en Supabase. Ejecuta la migración SQL 20250102000000_create_aportes_table.sql en el SQL Editor de Supabase. Ver EJECUTAR_MIGRACION_APORTES.md', 'error');
          setSubmitting(false);
          return;
        }
        
        if (error.code === '42501' || error.message?.includes('permission denied') || error.message?.includes('policy') || error.message?.includes('RLS')) {
          showToast('No tienes permiso para publicar. Verifica tu sesión y las políticas RLS.', 'error');
          setSubmitting(false);
          return;
        }
        
        if (error.code === '23503' || error.message?.includes('foreign key')) {
          showToast('Error: El post no existe o no tienes acceso.', 'error');
          setSubmitting(false);
          return;
        }
        
        if (error.code === '23505' || error.message?.includes('duplicate key')) {
          showToast('Este aporte ya existe. Intenta refrescar la página.', 'error');
          setSubmitting(false);
          return;
        }
        
        // Mostrar mensaje de error más detallado
        let errorMsg = 'Error al crear el aporte. ';
        if (error.hint) {
          errorMsg += error.hint;
        } else if (error.message) {
          errorMsg += error.message;
        } else {
          errorMsg += 'Verifica tu conexión e intenta de nuevo.';
        }
        showToast(errorMsg, 'error');
        setSubmitting(false);
        return;
      }

      setNewAporte('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
      showToast('Aporte publicado exitosamente', 'success');
      
      // Recargar aportes después de un pequeño delay
      setTimeout(() => {
        loadAportes();
      }, 300);
    } catch (err: any) {
      console.error('Error creating aporte (catch):', err);
      const errorMessage = err?.message || err?.error?.message || 'Error al crear el aporte. Intenta de nuevo.';
      showToast(errorMessage, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (aporteId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este aporte? Esta acción no se puede deshacer.')) return;

    try {
      const { error } = await supabase
        .from('aportes')
        .delete()
        .eq('id', aporteId);

      if (error) throw error;
      
      showToast('Aporte eliminado exitosamente', 'success');
      loadAportes();
    } catch (err: any) {
      console.error('Error deleting aporte:', err);
      showToast('Error al eliminar el aporte. Intenta de nuevo.', 'error');
    }
  };

  const handleStartEdit = (aporte: Aporte) => {
    setEditingId(aporte.id);
    setEditContent(aporte.content);
    setExpandedMenuId(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditContent('');
  };

  const handleSaveEdit = async (aporteId: string) => {
    if (!editContent.trim()) {
      showToast('El aporte no puede estar vacío', 'error');
      return;
    }

    try {
      const { error } = await supabase
        .from('aportes')
        .update({
          content: editContent.trim(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', aporteId);

      if (error) throw error;

      setEditingId(null);
      setEditContent('');
      showToast('Aporte actualizado exitosamente', 'success');
      loadAportes();
    } catch (err: any) {
      console.error('Error updating aporte:', err);
      showToast('Error al actualizar el aporte. Intenta de nuevo.', 'error');
    }
  };

  const getUserName = (userId: string) => {
    const profile = userProfiles[userId];
    return profile?.username || profile?.name || profile?.email || `Usuario ${userId.substring(0, 8)}`;
  };

  const getUserInitials = (userId: string) => {
    const name = getUserName(userId);
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Ahora mismo';
    if (diffMins < 60) return `Hace ${diffMins} ${diffMins === 1 ? 'minuto' : 'minutos'}`;
    if (diffHours < 24) return `Hace ${diffHours} ${diffHours === 1 ? 'hora' : 'horas'}`;
    if (diffDays < 7) return `Hace ${diffDays} ${diffDays === 1 ? 'día' : 'días'}`;
    if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `Hace ${weeks} ${weeks === 1 ? 'semana' : 'semanas'}`;
    }
    return date.toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'short',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const handleTextareaResize = (textarea: HTMLTextAreaElement) => {
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
  };

  // Usar colores de la publicación para los comentarios
  const primaryColor = postColors.length > 0 ? postColors[0] : '#f59e0b';
  const secondaryColor = postColors.length > 1 ? postColors[1] : postColors[0] || '#f59e0b';
  
  // Crear gradiente suave para fondos
  const commentGradient = postColors.length > 0
    ? `linear-gradient(135deg, ${primaryColor}15, ${secondaryColor}15)`
    : 'linear-gradient(135deg, #fef3c715, #fbbf2415)';
  
  const borderColor = postColors.length > 0 
    ? `${primaryColor}40`
    : '#f59e0b40';
  
  const accentColor = postColors.length > 0 
    ? primaryColor
    : '#f59e0b';

  // Mostrar solo los 2 más relevantes cuando no está expandido
  const visibleAportes = isExpanded ? aportes : aportes.slice(0, 2);
  const hasMoreAportes = aportes.length > 2;

  return (
    <div className="relative w-full">
      {/* Toast Notifications */}
      <div className="fixed bottom-6 right-6 z-50 space-y-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto animate-in slide-in-from-right-full fade-in duration-300 max-w-md rounded-lg shadow-lg p-4 flex items-start gap-3 ${
              toast.type === 'success'
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
                : toast.type === 'error'
                ? 'bg-red-50 border border-red-200 text-red-900'
                : 'bg-amber-50 border border-amber-200 text-amber-900'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            ) : toast.type === 'error' ? (
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            )}
            <p className="text-sm font-medium flex-1">{toast.message}</p>
            <button
              onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Header Section - Con botón expandir/colapsar */}
      <div className="mb-3 pb-2 border-b" style={{ borderColor: borderColor }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div 
              className="p-1.5 rounded border"
              style={{ 
                backgroundColor: `${primaryColor}15`,
                borderColor: `${primaryColor}30`
              }}
            >
              <MessageSquare className="w-3.5 h-3.5" style={{ color: accentColor }} />
            </div>
            <h3 className="text-base font-semibold text-gray-800 tracking-tight">
              Aportes
            </h3>
            {aportes.length > 0 && (
              <span className="text-xs font-medium text-gray-500">
                ({aportes.length})
              </span>
            )}
          </div>
          {aportes.length > 0 && (
            <button
              onClick={() => {
                const newExpanded = !isExpanded;
                setIsExpanded(newExpanded);
                if (onExpandedChange) {
                  onExpandedChange(newExpanded);
                }
              }}
              className="text-xs font-medium px-2 py-1 rounded hover:bg-gray-100 transition-colors"
              style={{ color: accentColor }}
            >
              {isExpanded ? 'Ver menos' : `Ver todos (${aportes.length})`}
            </button>
          )}
        </div>
      </div>

      {/* Aportes List - Con altura limitada cuando está colapsado, scroll interno cuando expandido */}
      <div className={`space-y-2 overflow-y-auto pr-2 custom-scrollbar mb-3 transition-all duration-300 ${
        isExpanded ? 'max-h-[600px]' : 'max-h-[120px]'
      }`}>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="relative">
              <div className="w-8 h-8 border-3 border-amber-200 border-t-amber-600 rounded-full animate-spin"></div>
            </div>
            <p className="mt-2 text-xs font-medium text-gray-500">Cargando...</p>
          </div>
        ) : aportes.length > 0 ? (
          visibleAportes.map((aporte, index) => {
            const isOwner = user && aporte.user_id === user.id;
            const isEditing = editingId === aporte.id;
            const userName = getUserName(aporte.user_id);
            const userInitials = getUserInitials(aporte.user_id);
            const isEdited = aporte.updated_at !== aporte.created_at;

            return (
              <div
                key={aporte.id}
                className="group rounded-lg p-2.5 shadow-sm border transition-all duration-200"
                style={{
                  animation: `fadeInUp 0.3s ease-out ${index * 0.05}s both`,
                  background: commentGradient,
                  borderColor: borderColor
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = accentColor;
                  e.currentTarget.style.boxShadow = `0 2px 8px ${primaryColor}20`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = borderColor;
                  e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)';
                }}
              >
                {/* User Header - Más compacto, siempre visible */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div className="relative flex-shrink-0">
                      <div 
                        className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-semibold shadow-sm ring-1"
                        style={{
                          background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                          ringColor: borderColor
                        }}
                      >
                        {userInitials}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-semibold text-gray-900 truncate">
                          {userName}
                        </p>
                        <span className="text-[10px] text-gray-400">•</span>
                        <div className="flex items-center gap-1 text-[10px] text-gray-500">
                          <Clock className="w-3 h-3" />
                          <span>{formatDate(aporte.created_at)}</span>
                        </div>
                        {isEdited && (
                          <>
                            <span className="text-[10px] text-gray-400">•</span>
                            <span className="text-[10px] text-gray-400 italic">editado</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {isOwner && !isEditing && (
                    <div className="relative flex-shrink-0">
                      <button
                        onClick={() => setExpandedMenuId(expandedMenuId === aporte.id ? null : aporte.id)}
                        className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors opacity-0 group-hover:opacity-100"
                        aria-label="Opciones"
                      >
                        <MoreVertical className="w-4 h-4 text-gray-500" />
                      </button>
                      
                      {expandedMenuId === aporte.id && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setExpandedMenuId(null)}
                          />
                          <div className="absolute right-0 top-8 z-20 w-40 bg-white rounded-xl shadow-lg border border-gray-200 py-1">
                          <button
                            onClick={() => {
                              handleStartEdit(aporte);
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 flex items-center gap-2 transition-colors"
                            style={{
                              hoverBackground: `${primaryColor}15`
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = `${primaryColor}15`;
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent';
                            }}
                          >
                            <Edit2 className="w-4 h-4" />
                            Editar
                          </button>
                          <button
                            onClick={() => {
                              setExpandedMenuId(null);
                              handleDelete(aporte.id);
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                          >
                              <Trash2 className="w-4 h-4" />
                              Eliminar
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Content */}
                {isEditing ? (
                      <div className="space-y-2">
                        <textarea
                          ref={editTextareaRef}
                          value={editContent}
                          onChange={(e) => {
                            setEditContent(e.target.value);
                            handleTextareaResize(e.target);
                          }}
                          className="w-full px-3 py-2 border rounded-lg outline-none resize-none bg-white text-gray-900 text-xs leading-relaxed"
                          style={{
                            borderColor: `${primaryColor}60`,
                            maxHeight: '100px'
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = accentColor;
                            e.target.style.boxShadow = `0 0 0 2px ${accentColor}30`;
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = `${primaryColor}60`;
                            e.target.style.boxShadow = 'none';
                          }}
                          rows={2}
                          placeholder="Escribe tu aporte..."
                        />
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={handleCancelEdit}
                            className="px-3 py-1.5 text-xs font-semibold bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-1.5"
                            style={{ color: '#1f2937', fontWeight: '600' }}
                          >
                            <X className="w-3 h-3" />
                            <span style={{ fontWeight: '600' }}>Cancelar</span>
                          </button>
                          <button
                            onClick={() => handleSaveEdit(aporte.id)}
                            disabled={!editContent.trim()}
                            className="px-3 py-1.5 text-xs font-semibold text-white rounded-lg hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-1.5"
                            style={{
                              background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                              fontWeight: '600'
                            }}
                          >
                            <Check className="w-3 h-3" />
                            <span style={{ fontWeight: '600' }}>Guardar</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="ml-9">
                        <p className="text-gray-800 whitespace-pre-wrap break-words leading-relaxed text-xs">
                          {aporte.content}
                        </p>
                      </div>
                    )}
              </div>
            );
          })
        ) : null}
      </div>

      {/* New Aporte Form - Después de la lista, siempre visible */}
      {user ? (
        <form onSubmit={handleSubmit} className="mt-2">
          <div 
            className="rounded-lg p-3 border shadow-sm"
            style={{
              background: commentGradient,
              borderColor: borderColor
            }}
          >
            <div className="flex items-start gap-2">
              <div 
                className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-semibold shadow-sm flex-shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`
                }}
              >
                {getUserInitials(user.id)}
              </div>
              <div className="flex-1">
                <textarea
                  ref={textareaRef}
                  value={newAporte}
                  onChange={(e) => {
                    setNewAporte(e.target.value);
                    handleTextareaResize(e.target);
                  }}
                  placeholder="Comparte tu pensamiento..."
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 outline-none resize-none bg-white text-gray-900 text-xs leading-relaxed placeholder:text-gray-400 transition-all"
                  style={{
                    borderColor: `${primaryColor}60`,
                    focusRingColor: `${primaryColor}30`,
                    maxHeight: '70px'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = accentColor;
                    e.target.style.boxShadow = `0 0 0 2px ${accentColor}30`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = `${primaryColor}60`;
                    e.target.style.boxShadow = 'none';
                  }}
                  rows={2}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                      e.preventDefault();
                      if (!submitting && newAporte.trim()) {
                        handleSubmit(e as any);
                      }
                    }
                  }}
                />
                <div className="flex items-center justify-end mt-2">
                  <button
                    type="submit"
                    disabled={submitting || !newAporte.trim()}
                    onClick={(e) => {
                      e.preventDefault();
                      handleSubmit(e as any);
                    }}
                    className="px-4 py-1.5 text-xs font-semibold text-white rounded-lg hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-1.5 disabled:hover:shadow-none"
                    style={{
                      background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                      fontWeight: '600'
                    }}
                  >
                    {submitting ? (
                      <>
                        <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span style={{ color: '#ffffff' }}>Enviando...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3 h-3" />
                        <span style={{ color: '#ffffff', fontWeight: '600' }}>Publicar</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="mt-3">
          <div className="text-center py-4 bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-lg border border-gray-200/60">
            <User className="w-6 h-6 text-gray-400 mx-auto mb-1" />
            <p className="text-xs font-medium text-gray-700">
              Inicia sesión para participar
            </p>
          </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>
      
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slide-in-from-right-full {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        
        .animate-in {
          animation-fill-mode: both;
        }
        
        .fade-in {
          animation: fadeIn 0.3s ease-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
