import { useState, useEffect } from 'react';
import { X, Trash2, Calendar, Lock, ChevronLeft, ChevronRight, Music, Play, FolderPlus, Folder } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { extractColorsFromImage } from '../lib/colorUtils';
import { AportesSection } from './AportesSection';

interface Post {
  id: string;
  title: string;
  description: string;
  image_url: string;
  images: string[];
  folder_id: string | null;
  created_at: string;
  created_by: string;
  is_private: boolean;
  published_at: string | null;
  media_type: string;
  media_url: string | null;
  aspect_ratio: number;
}

interface Folder {
  id: string;
  name: string;
  color: string;
}

interface UserProfile {
  id: string;
  name: string;
  username?: string;
  email?: string;
}

interface PostDetailModalProps {
  post: Post | null;
  onClose: () => void;
  onDelete: () => void;
  onMoveToFolder?: (post: Post, folderId: string | null) => Promise<void> | void;
  onPostClick?: (post: Post) => void;
  currentUserId?: string;
  folders?: Folder[];
  userProfiles?: { [userId: string]: UserProfile };
}

export function PostDetailModal({ post, onClose, onDelete, onMoveToFolder, onPostClick, currentUserId, folders = [], userProfiles = {} }: PostDetailModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [bgColors, setBgColors] = useState<string[]>([]);
  const [showFolderMenu, setShowFolderMenu] = useState(false);
  const [referencedPosts, setReferencedPosts] = useState<Post[]>([]);
  const [processedDescription, setProcessedDescription] = useState<string>('');
  const [aportesExpanded, setAportesExpanded] = useState(false);

  const canDelete = currentUserId === post?.created_by;
  const canEdit = currentUserId === post?.created_by;
  const images = post?.images && post.images.length > 0 ? post.images : [post?.image_url || ''];
  const currentImage = images[currentImageIndex];

  useEffect(() => {
    // Reset image index when post changes
    setCurrentImageIndex(0);
  }, [post?.id]);

  // Función para extraer IDs de posts de las referencias en el HTML
  const extractPostReferences = (html: string): string[] => {
    const postIds: string[] = [];
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Buscar enlaces con data-post-id
    const linksWithPostId = doc.querySelectorAll('a[data-post-id]');
    linksWithPostId.forEach((link) => {
      const postId = link.getAttribute('data-post-id');
      if (postId) {
        postIds.push(postId);
      }
    });
    
    // Buscar enlaces con href que contenga post ID (formato: /post/{id} o #post-{id})
    const links = doc.querySelectorAll('a[href]');
    links.forEach((link) => {
      const href = link.getAttribute('href') || '';
      // Detectar patrones como /post/{uuid} o #post-{uuid} o post/{uuid}
      const postIdMatch = href.match(/post[s]?[\/\-]?([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})/i);
      if (postIdMatch && postIdMatch[1]) {
        const postId = postIdMatch[1];
        if (!postIds.includes(postId)) {
          postIds.push(postId);
        }
      }
    });
    
    return postIds;
  };

  // Cargar posts referenciados
  useEffect(() => {
    if (!post?.description) {
      setReferencedPosts([]);
      setProcessedDescription(post?.description || '');
      return;
    }

    const postIds = extractPostReferences(post.description);
    
    if (postIds.length === 0) {
      setReferencedPosts([]);
      setProcessedDescription(post.description);
      return;
    }

    // Cargar los posts referenciados
    const loadReferencedPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .in('id', postIds);

        if (error) throw error;
        
        // Ordenar según el orden de aparición en el HTML
        const orderedPosts = postIds
          .map(id => data?.find(p => p.id === id))
          .filter((p): p is Post => p !== undefined);
        
        setReferencedPosts(orderedPosts);
        
        // Procesar el HTML para ocultar las referencias
        const parser = new DOMParser();
        const doc = parser.parseFromString(post.description, 'text/html');
        
        // Ocultar enlaces que son referencias a posts
        doc.querySelectorAll('a[data-post-id]').forEach((link) => {
          // Reemplazar el enlace por su texto sin el enlace
          const textNode = doc.createTextNode(link.textContent || '');
          link.parentNode?.replaceChild(textNode, link);
        });
        
        doc.querySelectorAll('a[href]').forEach((link) => {
          const href = link.getAttribute('href') || '';
          const postIdMatch = href.match(/post[s]?[\/\-]?([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})/i);
          if (postIdMatch) {
            // Reemplazar el enlace por su texto sin el enlace
            const textNode = doc.createTextNode(link.textContent || '');
            link.parentNode?.replaceChild(textNode, link);
          }
        });
        
        setProcessedDescription(doc.body.innerHTML);
      } catch (err) {
        console.error('Error loading referenced posts:', err);
        setReferencedPosts([]);
        setProcessedDescription(post.description);
      }
    };

    loadReferencedPosts();
  }, [post?.description, post?.id]);

  useEffect(() => {
    if (!post || !currentImage) return;
    
    const loadColors = async () => {
      try {
        const colors = await extractColorsFromImage(currentImage);
        setBgColors(colors);
      } catch (err) {
        setBgColors(['#f8f5f1', '#f5e6d3']);
      }
    };
    
    loadColors();
  }, [currentImage, post]);

  if (!post) return null;

  const handleDelete = async () => {
    if (!canDelete) return;

    const confirmDelete = window.confirm('¿Eliminar esta publicación?');
    if (!confirmDelete) return;

    try {
      const { error } = await supabase.from('posts').delete().eq('id', post.id);
      if (error) throw error;
      onDelete();
      onClose();
    } catch (err) {
      console.error('Error deleting post:', err);
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getUserName = (userId: string): string => {
    return userProfiles[userId]?.name || 'Usuario';
  };

  const backgroundGradient = bgColors.length > 0
    ? `linear-gradient(135deg, ${bgColors[0]}33, ${bgColors[1] || bgColors[0]}33)`
    : 'linear-gradient(135deg, #f8f5f133, #f5e6d333)';

  // Fondo del modal igual al feed principal
  const modalBackground = bgColors.length > 0
    ? {
        background: `linear-gradient(135deg, ${bgColors.slice(0, 8).map((color, i) => {
          const position = (i / Math.max(bgColors.length - 1, 1)) * 100;
          return `${color} ${position}%`;
        }).join(', ')})`,
      }
    : {
        background: 'linear-gradient(135deg, #f8f9fa 0%, #f0f4f8 50%, #e9f0f7 100%)',
      };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="w-full h-full overflow-hidden flex flex-col transition-all duration-1000 ease-in-out" style={modalBackground}>
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center gap-2 text-sm text-gray-500 flex-wrap">
            <span className="font-medium text-gray-700">{getUserName(post.created_by)}</span>
            <span className="text-gray-300">•</span>
            <Calendar size={16} />
            {formatDate(post.created_at)}
            {post.is_private && (
              <>
                <span className="text-gray-300">•</span>
                <Lock size={16} />
                <span>Privado</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            {canEdit && onMoveToFolder && (
              <div className="relative">
                <button
                  onClick={() => setShowFolderMenu(!showFolderMenu)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  title="Mover a carpeta"
                >
                  <FolderPlus size={20} className="text-gray-600" />
                </button>
                {showFolderMenu && post && (
                  <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[200px] max-h-64 overflow-y-auto">
                    <div className="p-2">
                      <button
                        onClick={() => {
                          onMoveToFolder(post, null);
                          setShowFolderMenu(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-100 transition-colors flex items-center gap-2 ${
                          !post.folder_id ? 'bg-gray-50 font-medium' : ''
                        }`}
                      >
                        <Folder size={16} className="text-gray-400" />
                        <span>Sin carpeta</span>
                        {!post.folder_id && (
                          <span className="ml-auto text-xs text-gray-500">✓</span>
                        )}
                      </button>
                      {folders.map((folder) => (
                        <button
                          key={folder.id}
                          onClick={() => {
                            onMoveToFolder(post, folder.id);
                            setShowFolderMenu(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-100 transition-colors flex items-center gap-2 ${
                            post.folder_id === folder.id
                              ? 'bg-gray-50 font-medium'
                              : ''
                          }`}
                        >
                          <div
                            className="w-4 h-4 rounded-full flex-shrink-0"
                            style={{ backgroundColor: folder.color }}
                          />
                          <span className="truncate">{folder.name}</span>
                          {post.folder_id === folder.id && (
                            <span className="ml-auto text-xs text-gray-500">✓</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            {canDelete && (
              <button
                onClick={handleDelete}
                className="p-2 hover:bg-red-50 text-red-500 rounded-full transition-colors"
                title="Eliminar"
              >
                <Trash2 size={20} />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="grid md:grid-cols-2 gap-0 h-full">
            <div
              className="flex items-center justify-center p-4 md:p-8 relative h-full min-h-[50vh] md:min-h-full"
              style={{ background: backgroundGradient }}
            >
              {post.media_type === 'image' ? (
                <>
                  <img
                    src={currentImage}
                    alt={post.title}
                    className="max-w-full max-h-full w-auto h-auto object-contain"
                    style={{ maxHeight: 'calc(100vh - 120px)' }}
                  />

                  {images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all"
                      >
                        <ChevronLeft size={24} className="text-gray-800" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all"
                      >
                        <ChevronRight size={24} className="text-gray-800" />
                      </button>

                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                        {images.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`w-2 h-2 rounded-full transition-all ${
                              index === currentImageIndex ? 'bg-blue-300 w-6' : 'bg-gray-400'
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </>
              ) : post.media_type === 'spotify' ? (
                <div className="flex items-center justify-center w-full h-full p-6 md:p-8">
                  <div className="w-full max-w-2xl flex items-center justify-center">
                    {(() => {
                      const spotifyUrl = post.media_url || '';
                      let trackId = '';

                      // Extraer ID del track de diferentes formatos de URL
                      if (spotifyUrl.includes('/track/')) {
                        trackId = spotifyUrl.split('/track/')[1]?.split('?')[0]?.split('&')[0] || '';
                      } else if (spotifyUrl.includes('spotify:track:')) {
                        trackId = spotifyUrl.split('spotify:track:')[1]?.split('?')[0] || '';
                      }

                      return trackId ? (
                        <iframe
                          src={`https://open.spotify.com/embed/track/${trackId}`}
                          width="100%"
                          height="600"
                          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                          loading="lazy"
                          className="rounded-2xl shadow-2xl"
                          style={{ minHeight: '600px' }}
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-4 p-8 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl shadow-xl">
                          <Music size={64} className="text-white" />
                          <p className="text-white text-lg font-medium">Enlace de Spotify no válido</p>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4 w-full">
                  <Play size={64} className="text-red-500" />
                  <iframe
                    width="100%"
                    height="480"
                    src={`https://www.youtube.com/embed/${post.media_url?.split('/').pop()}`}
                    title="Video de YouTube"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="rounded-2xl"
                  />
                </div>
              )}
            </div>

            <div className="p-8 flex flex-col h-full bg-white/50 backdrop-blur-sm overflow-hidden">
              <div 
                className={`flex-1 overflow-y-auto transition-all duration-300 min-h-0`}
                style={{
                  maxHeight: aportesExpanded ? 'calc(50vh - 200px)' : 'none'
                }}
              >
                {post.description && (
                  <div className="relative bg-[#fefefe]" style={{ 
                    minHeight: aportesExpanded ? '300px' : '400px'
                  }}>
                    {/* Título dentro de la página de texto */}
                    <div className="px-16 pt-8 pb-4">
                      <h2 className="text-4xl font-light text-gray-900 mb-6 leading-tight">{post.title}</h2>
                    </div>
                    
                    {/* Líneas horizontales del cuaderno - Igual que en creación */}
                    {(() => {
                      const fontSizeNum = 16; // Tamaño de fuente base
                      const lineHeightNum = 1.8;
                      const lineHeight = fontSizeNum * lineHeightNum; // 28.8px
                      
                      return (
                        <div 
                          className="absolute inset-0 pointer-events-none"
                          style={{
                            backgroundImage: `repeating-linear-gradient(
                              to bottom,
                              transparent 0px,
                              transparent ${lineHeight - 1}px,
                              #d1d5db ${lineHeight - 1}px,
                              #d1d5db ${lineHeight}px
                            )`,
                            backgroundPosition: '16px 32px',
                            backgroundSize: `calc(100% - 32px) ${lineHeight}px`,
                            backgroundRepeat: 'repeat-y',
                          }}
                        />
                      );
                    })()}
                    
                    <div 
                      className="text-gray-600 leading-relaxed prose prose-sm max-w-none relative z-10 px-16 pb-8 post-content"
                      dangerouslySetInnerHTML={{ __html: processedDescription || post.description }}
                      style={{
                        fontFamily: '"Inter", "Segoe UI", system-ui, sans-serif',
                        fontSize: '16px',
                        lineHeight: '1.8',
                        backgroundColor: 'transparent',
                      }}
                    />
                    <style>{`
                      .post-content p {
                        margin: 8px 0;
                        padding: 0;
                        line-height: 1.8;
                      }
                      .post-content p:first-child {
                        margin-top: 0;
                      }
                      .post-content p:last-child {
                        margin-bottom: 0;
                      }
                      .post-content ul, .post-content ol {
                        margin: 12px 0;
                        padding-left: 2em;
                      }
                      .post-content li {
                        margin: 4px 0;
                      }
                      .post-content strong {
                        font-weight: 600;
                      }
                      .post-content em {
                        font-style: italic;
                      }
                      .post-content u {
                        text-decoration: underline;
                      }
                      .post-content pre {
                        background: #f4f4f4;
                        padding: 12px;
                        border-radius: 6px;
                        overflow-x: auto;
                        font-family: 'Courier New', monospace;
                        font-size: 14px;
                        line-height: 1.5;
                        margin: 12px 0;
                        white-space: pre-wrap;
                        word-wrap: break-word;
                      }
                      .post-content code {
                        background: #f4f4f4;
                        padding: 2px 6px;
                        border-radius: 3px;
                        font-family: 'Courier New', monospace;
                        font-size: 0.9em;
                      }
                      .post-content pre code {
                        background: transparent;
                        padding: 0;
                        border-radius: 0;
                      }
                      .post-content blockquote {
                        border-left: 4px solid #ddd;
                        padding-left: 16px;
                        margin: 12px 0;
                        color: #666;
                        font-style: italic;
                      }
                      .post-content h1 {
                        font-size: 2em;
                        font-weight: 600;
                        margin: 24px 0 16px 0;
                        line-height: 1.3;
                      }
                      .post-content h2 {
                        font-size: 1.5em;
                        font-weight: 600;
                        margin: 20px 0 12px 0;
                        line-height: 1.3;
                      }
                      .post-content h3 {
                        font-size: 1.2em;
                        font-weight: 600;
                        margin: 16px 0 8px 0;
                        line-height: 1.3;
                      }
                      .post-content a {
                        color: #2563eb;
                        text-decoration: underline;
                      }
                    `}</style>
                  </div>
                )}

                {referencedPosts.length > 0 && (
                  <div className="pt-4 border-t border-gray-200 mt-4">
                    <p className="text-sm text-gray-500 mb-3">Publicaciones referenciadas</p>
                    <div className="grid grid-cols-2 gap-3">
                      {referencedPosts.map((referencedPost) => (
                        <button
                          key={referencedPost.id}
                          onClick={() => {
                            if (onPostClick) {
                              onPostClick(referencedPost);
                            }
                          }}
                          className="rounded-lg overflow-hidden border-2 border-gray-200 hover:border-blue-300 transition-all group cursor-pointer"
                        >
                          <div className="relative aspect-video bg-gray-100">
                            {referencedPost.media_type === 'image' ? (
                              <img
                                src={referencedPost.image_url}
                                alt={referencedPost.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                            ) : referencedPost.media_type === 'spotify' ? (
                              <div className="w-full h-full flex items-center justify-center bg-green-500">
                                <Music size={32} className="text-white" />
                              </div>
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-red-500">
                                <Play size={32} className="text-white" />
                              </div>
                            )}
                          </div>
                          <div className="p-2 bg-white">
                            <p className="text-xs font-medium text-gray-800 line-clamp-2 text-left">
                              {referencedPost.title}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sección de Aportes - Fija abajo, mismo ancho que texto, siempre visible */}
              <div className="pt-4 border-t border-gray-200/30 mt-4 flex-shrink-0 bg-white/50">
                <AportesSection 
                  postId={post.id} 
                  userProfiles={userProfiles} 
                  postColors={bgColors}
                  onExpandedChange={setAportesExpanded}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
