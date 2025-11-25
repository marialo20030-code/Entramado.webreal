import { useState, useEffect } from 'react';
import { X, Trash2, Calendar, Lock, ChevronLeft, ChevronRight, Music, Play, FolderPlus, Folder } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { extractColorsFromImage } from '../lib/colorUtils';

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

interface PostDetailModalProps {
  post: Post | null;
  onClose: () => void;
  onDelete: () => void;
  onMoveToFolder?: (post: Post, folderId: string | null) => Promise<void> | void;
  onPostClick?: (post: Post) => void;
  currentUserId?: string;
  folders?: Folder[];
}

export function PostDetailModal({ post, onClose, onDelete, onMoveToFolder, onPostClick, currentUserId, folders = [] }: PostDetailModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [bgColors, setBgColors] = useState<string[]>([]);
  const [showFolderMenu, setShowFolderMenu] = useState(false);
  const [referencedPosts, setReferencedPosts] = useState<Post[]>([]);
  const [processedDescription, setProcessedDescription] = useState<string>('');

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
          <div className="flex items-center gap-2 text-sm text-gray-500">
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
              className="flex items-center justify-center p-4 md:p-8 relative h-full min-h-[50vh] md:min-h-0"
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
                <div className="flex flex-col items-center gap-4">
                  <Music size={64} className="text-green-500" />
                  <iframe
                    src={`https://open.spotify.com/embed/track/${post.media_url?.split('/track/')[1]}`}
                    width="100%"
                    height="152"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                    className="rounded-2xl"
                  />
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

            <div className="p-8 space-y-4 overflow-y-auto h-full bg-white/50 backdrop-blur-sm">
              <div>
                <h2 className="text-3xl font-light text-gray-800 mb-2">{post.title}</h2>
              </div>

              {post.description && (
                <div className="relative bg-[#fefcf8] rounded-lg shadow-lg overflow-hidden" style={{ 
                  boxShadow: '0 0 0 1px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.1), 0 0 0 1px rgba(255,255,255,0.5) inset',
                  minHeight: '400px'
                }}>
                  {/* Fondo con líneas rayadas */}
                  {(() => {
                    const fontSizeNum = 16; // Tamaño de fuente base
                    const lineHeightNum = 1.8;
                    const lineHeight = fontSizeNum * lineHeightNum; // 28.8px
                    const paddingLeft = 64; // px-16 = 64px
                    const paddingTop = 32; // py-8 = 32px
                    // El offset vertical debe dejar espacio en blanco al inicio
                    // Agregamos una línea completa de altura para que haya espacio antes de la primera línea rayada
                    const verticalOffset = paddingTop + lineHeight; // Espacio en blanco antes de la primera línea
                    
                    return (
                      <div 
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          backgroundImage: `repeating-linear-gradient(to bottom, transparent 0px, transparent ${lineHeight - 1}px, #d1d5db ${lineHeight - 1}px, #d1d5db ${lineHeight}px)`,
                          backgroundPosition: `${paddingLeft}px ${verticalOffset}px`,
                          backgroundSize: `calc(100% - ${paddingLeft * 2}px) ${lineHeight}px`,
                          backgroundRepeat: 'repeat-y',
                          opacity: 0.35
                        }}
                      />
                    );
                  })()}
                  
                  <div 
                    className="text-gray-600 leading-relaxed prose prose-sm max-w-none relative z-10 px-16 py-8 post-content"
                    dangerouslySetInnerHTML={{ __html: processedDescription || post.description }}
                    style={{
                      fontFamily: '"Roboto", "Helvetica Neue", Arial, sans-serif',
                      fontSize: '16px',
                      lineHeight: '1.8',
                      backgroundColor: 'transparent',
                    }}
                  />
                  <style>{`
                    .post-content p {
                      margin: 0;
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
                      margin: 0.8em 0;
                      padding-left: 2em;
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
                  `}</style>
                </div>
              )}

              {images.length > 1 && post.media_type === 'image' && (
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500 mb-3">
                    {currentImageIndex + 1} de {images.length} imágenes
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {images.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`rounded-lg overflow-hidden border-2 transition-all ${
                          index === currentImageIndex
                            ? 'border-blue-300'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <img
                          src={img}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-20 object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {referencedPosts.length > 0 && (
                <div className="pt-4 border-t border-gray-200">
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
          </div>
        </div>
      </div>
    </div>
  );
}
