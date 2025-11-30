import { useEffect, useRef, useState } from 'react';
import { Trash2, Edit2, Music, Play, FolderPlus, Folder } from 'lucide-react';

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
}

interface PinterestGridProps {
  posts: Post[];
  onPostClick: (post: Post) => void;
  onEdit?: (post: Post) => void;
  onDelete?: (post: Post) => void;
  onMoveToFolder?: (post: Post, folderId: string | null) => void;
  currentUserId?: string;
  folders?: Folder[];
  postColors: { [postId: string]: string[] };
  userProfiles?: { [userId: string]: UserProfile };
}

const COLUMN_COUNT = {
  mobile: 1,
  tablet: 2,
  desktop: 4,
  wide: 4,
};

export function PinterestGrid({
  posts,
  onPostClick,
  onEdit,
  onDelete,
  onMoveToFolder,
  currentUserId,
  folders = [],
  postColors,
  userProfiles = {},
}: PinterestGridProps) {
  const [showFolderMenu, setShowFolderMenu] = useState<{ [postId: string]: boolean }>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const [columnCount, setColumnCount] = useState(COLUMN_COUNT.desktop);
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      let columns = COLUMN_COUNT.desktop;
      if (width < 640) columns = COLUMN_COUNT.mobile;
      else if (width < 1024) columns = COLUMN_COUNT.tablet;
      else if (width >= 1920) columns = COLUMN_COUNT.wide;
      else columns = COLUMN_COUNT.desktop;
      setColumnCount(columns);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const distributeItems = () => {
    const columnItems: Post[][] = Array.from({ length: columnCount }, () => []);
    
    // Distribuir posts secuencialmente en columnas (orden cronológico)
    posts.forEach((post, index) => {
      const columnIndex = index % columnCount;
      columnItems[columnIndex].push(post);
    });

    return { items: columnItems, heights: [] };
  };

  const { items: columnItems } = distributeItems();

  const getPostColors = (postId: string): string[] => {
    return postColors[postId] || ['#f8f9fa', '#e9f0f7'];
  };

  const canEdit = (post: Post) => {
    return currentUserId === post.created_by;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Hace poco';
    if (diffMins < 60) return `Hace ${diffMins}m`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffDays < 7) return `Hace ${diffDays}d`;
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  };


  const getUserName = (userId: string): string => {
    return userProfiles[userId]?.name || 'Usuario';
  };

  return (
    <div
      ref={containerRef}
      className="flex gap-6 w-full max-w-7xl mx-auto"
      style={{
        gridAutoColumns: `1fr`,
      }}
    >
      {columnItems.map((column, columnIndex) => (
        <div key={columnIndex} className="flex-1 flex flex-col gap-6 h-fit">
          {column.map((post) => {
            const colors = getPostColors(post.id);
            const hasMultipleImages = post.images && post.images.length > 1;
            const imageCount = hasMultipleImages ? post.images.length : 0;

            return (
              <div
                key={post.id}
                className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-400 cursor-pointer"
              >
                {/* Imagen */}
                <div 
                  onClick={() => onPostClick(post)}
                  className="relative overflow-hidden"
                >
                  <div
                    className="w-full"
                    style={{
                      paddingTop: '75%',
                      backgroundColor: colors[0] || '#f8f9fa',
                    }}
                  >
                    {post.media_type === 'image' ? (
                      <img
                        src={post.image_url}
                        alt={post.title}
                        className="absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-300"
                        loading="lazy"
                      />
                    ) : post.media_type === 'spotify' ? (
                      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gradient-to-br from-green-400 to-green-600">
                        <img
                          src={post.image_url}
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                          <Music size={44} className="text-white" />
                        </div>
                      </div>
                    ) : (
                      <div className="absolute top-0 left-0 w-full h-full">
                        <img
                          src={post.image_url}
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/35">
                          <Play size={44} className="text-white fill-white" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Indicador de múltiples imágenes */}
                  {hasMultipleImages && (
                    <div className="absolute top-3 right-3 z-10">
                      <div className="bg-black/60 backdrop-blur-sm text-white text-xs font-normal px-2.5 py-1 rounded-full flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{imageCount}</span>
                      </div>
                    </div>
                  )}

                  {/* Overlay hover sutil */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
                </div>

                {/* Contenido de texto - Siempre visible y clickeable */}
                <div 
                  onClick={() => onPostClick(post)}
                  className="p-4 space-y-2 cursor-pointer"
                >
                  <h3 className="font-normal text-base text-gray-800 line-clamp-2 leading-snug">
                    {post.title}
                  </h3>
                  
                  {post.description && (
                    <div 
                      className="text-sm text-gray-600 line-clamp-3 leading-relaxed prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ 
                        __html: post.description.length > 150 
                          ? post.description.substring(0, 150).replace(/<[^>]*>/g, '') + '...' 
                          : post.description.replace(/<[^>]*>/g, '')
                      }}
                      style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    />
                  )}
                  
                  <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                    <div className="text-xs text-gray-500 flex items-center gap-2">
                      <span className="font-medium text-gray-700">{getUserName(post.created_by)}</span>
                      <span className="text-gray-400">•</span>
                      <time>{formatDate(post.created_at)}</time>
                    </div>
                    
                    {canEdit(post) && (
                      <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 relative">
                        {onEdit && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onEdit(post);
                            }}
                            className="bg-gray-100 text-gray-700 p-1.5 rounded hover:bg-gray-200 transition-colors duration-200"
                            title="Editar"
                          >
                            <Edit2 size={12} />
                          </button>
                        )}
                        {onMoveToFolder && (
                          <div className="relative">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowFolderMenu((prev) => ({
                                  ...prev,
                                  [post.id]: !prev[post.id],
                                }));
                              }}
                              className="bg-gray-100 text-gray-700 p-1.5 rounded hover:bg-gray-200 transition-colors duration-200"
                              title="Mover a carpeta"
                            >
                              <FolderPlus size={12} />
                            </button>
                            {showFolderMenu[post.id] && (
                              <div
                                className="absolute right-0 bottom-full mb-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[180px] max-h-64 overflow-y-auto"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <div className="p-2">
                                  <button
                                    onClick={() => {
                                      onMoveToFolder(post, null);
                                      setShowFolderMenu((prev) => ({
                                        ...prev,
                                        [post.id]: false,
                                      }));
                                    }}
                                    className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-100 transition-colors flex items-center gap-2 ${
                                      !post.folder_id ? 'bg-gray-50 font-medium' : ''
                                    }`}
                                  >
                                    <Folder size={14} className="text-gray-400" />
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
                                        setShowFolderMenu((prev) => ({
                                          ...prev,
                                          [post.id]: false,
                                        }));
                                      }}
                                      className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-100 transition-colors flex items-center gap-2 ${
                                        post.folder_id === folder.id
                                          ? 'bg-gray-50 font-medium'
                                          : ''
                                      }`}
                                    >
                                      <div
                                        className="w-3 h-3 rounded-full flex-shrink-0"
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
                        {onDelete && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDelete(post);
                            }}
                            className="bg-gray-100 text-gray-700 p-1.5 rounded hover:bg-gray-200 transition-colors duration-200"
                            title="Eliminar"
                          >
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
