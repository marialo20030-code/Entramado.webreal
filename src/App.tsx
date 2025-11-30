import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { Auth } from './components/Auth';
import { PinterestGrid } from './components/PinterestGrid';
import { CalendarView } from './components/CalendarView';
import { FoldersView } from './components/FoldersView';
import { UploadModal } from './components/UploadModal';
import { PostDetailModal } from './components/PostDetailModal';
import { SearchBar } from './components/SearchBar';
import { DynamicBackground } from './components/DynamicBackground';
import { supabase } from './lib/supabase';
import { extractColorsFromImage } from './lib/colorUtils';
import { Plus, Grid3x3, Calendar, FolderOpen, FileText, X, Search, User } from 'lucide-react';
import { ProfileView } from './components/ProfileView';
import { EntramadoLogo } from './components/EntramadoLogo';

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
  is_draft?: boolean;
  published_at: string | null;
  media_type: string;
  media_url: string | null;
  aspect_ratio: number;
}

interface Folder {
  id: string;
  name: string;
  color: string;
  created_at: string;
  created_by: string;
}

interface UserProfile {
  id: string;
  name: string;
}

type View = 'grid' | 'calendar' | 'folders' | 'profile';

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, loading: authLoading, signOut } = useAuth();
  const [isReaderMode, setIsReaderMode] = useState(false);
  
  // Sincronizar vista con la URL
  const getViewFromUrl = (): View => {
    const path = location.pathname;
    if (path.includes('/calendar')) return 'calendar';
    if (path.includes('/folders')) return 'folders';
    if (path.includes('/profile')) return 'profile';
    return 'grid';
  };
  
  const [view, setView] = useState<View>(getViewFromUrl());
  const [posts, setPosts] = useState<Post[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [userProfiles, setUserProfiles] = useState<{ [userId: string]: UserProfile }>({});
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [postToEdit, setPostToEdit] = useState<Post | null>(null);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [postColors, setPostColors] = useState<{ [postId: string]: string[] }>({});
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [showDraftsView, setShowDraftsView] = useState(false);
  const [drafts, setDrafts] = useState<Post[]>([]);
  const [showAddToFolderModal, setShowAddToFolderModal] = useState<string | null>(null);
  const [availablePostsForFolder, setAvailablePostsForFolder] = useState<Post[]>([]);
  const [folderSearchQuery, setFolderSearchQuery] = useState('');
  const [movingPostToFolder, setMovingPostToFolder] = useState<string | null>(null);

  // Sincronizar estado con la URL cuando cambia (navegación del navegador)
  useEffect(() => {
    if (authLoading) return;
    
    const currentView = getViewFromUrl();
    if (currentView !== view) {
      setView(currentView);
    }
    
    // Sincronizar selectedFolderId con la URL
    const folderId = searchParams.get('folder');
    if (folderId && folderId !== selectedFolderId) {
      setSelectedFolderId(folderId);
      if (currentView !== 'grid') {
        setView('grid');
      }
    } else if (!folderId && selectedFolderId && location.pathname === '/') {
      setSelectedFolderId(null);
    }
    
    // Sincronizar selectedPost con la URL
    const postId = searchParams.get('post');
    if (postId) {
      const post = posts.find(p => p.id === postId);
      if (post && post.id !== selectedPost?.id) {
        setSelectedPost(post);
      }
    } else if (!postId && selectedPost) {
      setSelectedPost(null);
    }
  }, [location.pathname, searchParams.toString()]);

  useEffect(() => {
    if (authLoading) return;
    if (user || isReaderMode) {
      fetchData();
    }
  }, [user, authLoading, isReaderMode]);

  // Extraer colores de las imágenes de manera más eficiente
  useEffect(() => {
    const extractColorsForNewPosts = async () => {
      const newPosts = posts.filter(post => !postColors[post.id] && post.image_url);
      
      if (newPosts.length === 0) return;

      // Procesar colores en paralelo pero limitado para no sobrecargar
      const batchSize = 5;
      for (let i = 0; i < newPosts.length; i += batchSize) {
        const batch = newPosts.slice(i, i + batchSize);
        const colorPromises = batch.map(async (post) => {
          try {
            const colors = await extractColorsFromImage(post.image_url);
            return { postId: post.id, colors };
          } catch (err) {
            console.error('Error extracting colors:', err);
            return { postId: post.id, colors: [] };
          }
        });

        const results = await Promise.all(colorPromises);
        setPostColors((prev) => {
          const updated = { ...prev };
          results.forEach(({ postId, colors }) => {
            if (colors.length > 0) {
              updated[postId] = colors;
            }
          });
          return updated;
        });
      }
    };

    extractColorsForNewPosts();
  }, [posts]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [postsResponse, foldersResponse, profilesResponse] = await Promise.all([
        supabase.from('posts').select('*').order('created_at', { ascending: false }),
        user ? supabase.from('folders').select('*').order('created_at', { ascending: false }) : Promise.resolve({ data: [] }),
        supabase.from('user_profiles').select('*'),
      ]);

      let postsData = postsResponse.data || [];

      // Separar borradores del usuario (solo si la columna existe)
      if (user) {
        const userDrafts = postsData.filter((post) => post.is_draft && post.created_by === user.id);
        setDrafts(userDrafts);
      }

      // Filtrar borradores: solo mostrar publicaciones (is_draft = false o null)
      // Los borradores solo son visibles para su creador y no aparecen en el feed principal
      // Si is_draft no existe, simplemente mostrar todas las publicaciones
      postsData = postsData.filter((post) => post.is_draft === undefined || !post.is_draft);

      if (isReaderMode) {
        postsData = postsData.filter((post) => !post.is_private);
      } else if (user) {
        postsData = postsData.filter((post) => !post.is_private || post.created_by === user.id);
      }

      setPosts(postsData);
      if (foldersResponse.data) setFolders(foldersResponse.data);

      if (profilesResponse.data) {
        const profiles: { [userId: string]: UserProfile } = {};
        profilesResponse.data.forEach((profile: any) => {
          profiles[profile.id] = profile;
        });
        setUserProfiles(profiles);
        
        // Crear perfiles faltantes para usuarios que tienen publicaciones pero no tienen perfil
        // Esto asegura que todas las publicaciones antiguas muestren el nombre del usuario
        const userIdsWithPosts = new Set(postsData.map((post: Post) => post.created_by));
        const userIdsWithProfiles = new Set(profilesResponse.data.map((p: any) => p.id));
        const missingUserIds = Array.from(userIdsWithPosts).filter((id) => !userIdsWithProfiles.has(id));
        
        if (missingUserIds.length > 0) {
          // Intentar crear perfiles para usuarios que no tienen perfil
          // Si el usuario actual está en la lista, puede crear su propio perfil
          for (const userId of missingUserIds) {
            try {
              // Intentar obtener el email del usuario desde auth.users (solo si es el usuario actual)
              let defaultName = `Usuario ${userId.substring(0, 8)}`;
              
              if (user && user.id === userId) {
                // Si es el usuario actual, intentar usar el email como base para el nombre
                const emailName = user.email?.split('@')[0] || defaultName;
                defaultName = emailName.charAt(0).toUpperCase() + emailName.slice(1);
              }
              
              // Intentar crear el perfil (solo funcionará si es el propio usuario)
              const { error: insertError } = await supabase
                .from('user_profiles')
                .insert({
                  id: userId,
                  name: defaultName,
                });
              
              if (!insertError) {
                profiles[userId] = { id: userId, name: defaultName };
              } else {
                // Si no se puede insertar (por permisos), usar nombre genérico en el estado local
                profiles[userId] = { id: userId, name: defaultName };
              }
            } catch (err) {
              // Si falla, usar nombre genérico en el estado local
              const defaultName = `Usuario ${userId.substring(0, 8)}`;
              profiles[userId] = { id: userId, name: defaultName };
            }
          }
          
          // Actualizar el estado con los nuevos perfiles
          setUserProfiles(profiles);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (post: Post) => {
    if (!user || user.id !== post.created_by) return;

    const confirmed = window.confirm('¿Eliminar esta publicación?');
    if (!confirmed) return;

    try {
      const { error } = await supabase.from('posts').delete().eq('id', post.id);
      if (error) throw error;
      setPosts((prev) => prev.filter((p) => p.id !== post.id));
      setSelectedPost(null);
    } catch (err) {
      console.error('Error deleting post:', err);
    }
  };

  const handleMoveToFolder = async (post: Post, folderId: string | null) => {
    if (!user || user.id !== post.created_by) return;

    try {
      const { error } = await supabase
        .from('posts')
        .update({ folder_id: folderId })
        .eq('id', post.id);

      if (error) throw error;

      // Actualizar el estado local
      setPosts((prev) =>
        prev.map((p) => (p.id === post.id ? { ...p, folder_id: folderId } : p))
      );

      // Actualizar el post seleccionado si está abierto
      if (selectedPost && selectedPost.id === post.id) {
        setSelectedPost({ ...selectedPost, folder_id: folderId });
      }
    } catch (err) {
      console.error('Error moving post to folder:', err);
      alert('Error al mover la publicación a la carpeta');
    }
  };

  // Cargar publicaciones disponibles cuando se abre el modal de agregar a carpeta
  useEffect(() => {
    if (!showAddToFolderModal || !user) return;

    const loadAvailablePosts = async () => {
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .eq('created_by', user.id)
          .neq('is_draft', true)
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Filtrar las que no están en la carpeta seleccionada
        const postsNotInFolder = (data || []).filter(
          (post) => post.folder_id !== showAddToFolderModal
        );

        setAvailablePostsForFolder(postsNotInFolder);
      } catch (err) {
        console.error('Error loading posts:', err);
      }
    };

    loadAvailablePosts();
  }, [showAddToFolderModal, user]);

  const handleAddPostToFolder = async (postId: string, folderId: string) => {
    if (!user) return;

    setMovingPostToFolder(postId);
    try {
      const { error } = await supabase
        .from('posts')
        .update({ folder_id: folderId })
        .eq('id', postId);

      if (error) throw error;

      fetchData();
      setShowAddToFolderModal(null);
      setFolderSearchQuery('');
    } catch (err) {
      console.error('Error moving post to folder:', err);
      alert('Error al agregar la publicación a la carpeta');
    } finally {
      setMovingPostToFolder(null);
    }
  };

  const filteredFolderPosts = availablePostsForFolder.filter((post) =>
    post.title.toLowerCase().includes(folderSearchQuery.toLowerCase())
  );

  const filteredPosts = posts.filter((post) => {
    const matchesFolder = !selectedFolderId || post.folder_id === selectedFolderId;
    const matchesSearch =
      searchQuery === '' ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFolder && matchesSearch;
  });

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-violet-50 to-indigo-50 flex items-center justify-center">
        <div className="text-gray-400">Cargando...</div>
      </div>
    );
  }

  if (!user && !isReaderMode) {
    return <Auth onReaderMode={() => setIsReaderMode(true)} />;
  }

  return (
    <DynamicBackground colors={postColors}>
      <nav className="bg-white/90 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <EntramadoLogo />

            <div className="flex-1 max-w-md mx-4">
              <SearchBar onSearch={setSearchQuery} />
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden sm:flex bg-gray-100 rounded-full p-1 gap-1">
                <button
                  onClick={() => {
                    const params = new URLSearchParams(searchParams);
                    params.delete('folder');
                    navigate({ pathname: '/', search: params.toString() });
                    setSelectedFolderId(null);
                  }}
                  className={`p-2 rounded-full transition-all ${
                    view === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                  }`}
                  title="Vista cuadrícula"
                >
                  <Grid3x3 size={20} className={view === 'grid' ? 'text-blue-400' : 'text-gray-600'} />
                </button>
                <button
                  onClick={() => {
                    navigate('/calendar');
                    setSelectedFolderId(null);
                  }}
                  className={`p-2 rounded-full transition-all ${
                    view === 'calendar' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                  }`}
                  title="Vista calendario"
                >
                  <Calendar size={20} className={view === 'calendar' ? 'text-blue-400' : 'text-gray-600'} />
                </button>
                <button
                  onClick={() => {
                    navigate('/folders');
                    setSelectedFolderId(null);
                  }}
                  className={`p-2 rounded-full transition-all ${
                    view === 'folders' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                  }`}
                  title="Vista carpetas"
                >
                  <FolderOpen size={20} className={view === 'folders' ? 'text-blue-400' : 'text-gray-600'} />
                </button>
                {user && (
                  <button
                    onClick={() => {
                      navigate('/profile');
                      setSelectedFolderId(null);
                    }}
                    className={`p-2 rounded-full transition-all ${
                      view === 'profile' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                    }`}
                    title="Mi perfil"
                  >
                    <User size={20} className={view === 'profile' ? 'text-blue-400' : 'text-gray-600'} />
                  </button>
                )}
              </div>

              {user && (
                <div className="relative">
                  <button
                    onClick={() => setShowCreateMenu(!showCreateMenu)}
                    className="bg-gradient-to-r from-blue-300 to-violet-300 text-white p-3 rounded-full hover:shadow-lg transform hover:scale-110 transition-all"
                    title="Crear"
                  >
                    <Plus size={20} />
                  </button>
                  
                  {showCreateMenu && (
                    <>
                      <div 
                        className="fixed inset-0 z-30" 
                        onClick={() => setShowCreateMenu(false)}
                      />
                      <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-40 min-w-[200px] overflow-hidden">
                        <button
                          onClick={() => {
                            setPostToEdit(null);
                            setIsUploadModalOpen(true);
                            setShowCreateMenu(false);
                          }}
                          className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center gap-3"
                        >
                          <Plus size={18} className="text-gray-600" />
                          <span className="text-gray-800">Nueva publicación</span>
                        </button>
                        <button
                          onClick={() => {
                            setShowDraftsView(true);
                            setShowCreateMenu(false);
                          }}
                          className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center gap-3 border-t border-gray-100"
                        >
                          <FileText size={18} className="text-gray-600" />
                          <span className="text-gray-800">Borradores</span>
                          {drafts.length > 0 && (
                            <span className="ml-auto bg-blue-50 text-blue-500 text-xs px-2 py-0.5 rounded-full">
                              {drafts.length}
                            </span>
                          )}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}


              {isReaderMode && (
                <button
                  onClick={() => setIsReaderMode(false)}
                  className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-full transition-all"
                >
                  Iniciar sesión
                </button>
              )}
            </div>
          </div>

          {selectedFolderId && (
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    navigate('/folders');
                    setSelectedFolderId(null);
                  }}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-100"
                >
                  <FolderOpen size={16} />
                  <span>Volver a carpetas</span>
                </button>
                <span className="text-gray-400">/</span>
                <span className="text-sm text-gray-800 font-medium">
                  {folders.find((f) => f.id === selectedFolderId)?.name}
                </span>
              </div>
              
              {user && (
                <div className="relative">
                  <button
                    onClick={() => setShowAddToFolderModal(selectedFolderId)}
                    className="flex items-center gap-2 bg-gradient-to-r from-blue-300 to-violet-300 text-white px-4 py-2 rounded-full hover:shadow-lg transform hover:scale-105 transition-all text-sm"
                    title="Agregar publicaciones a esta carpeta"
                  >
                    <Plus size={18} />
                    <span>Agregar</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-12 text-gray-400">Cargando...</div>
        ) : showDraftsView ? (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-light text-gray-800">Borradores</h2>
                <p className="text-sm text-gray-500 mt-1">
                  {drafts.length === 0 
                    ? 'No tienes borradores guardados' 
                    : `${drafts.length} borrador${drafts.length !== 1 ? 'es' : ''} guardado${drafts.length !== 1 ? 's' : ''}`
                  }
                </p>
              </div>
              <button
                onClick={() => setShowDraftsView(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>
            
            {drafts.length === 0 ? (
              <div className="text-center py-12">
                <FileText size={48} className="text-gray-300 mx-auto mb-4" />
                <p className="text-gray-400 mb-4">Aún no has guardado ningún borrador</p>
                <button
                  onClick={() => {
                    setShowDraftsView(false);
                    setPostToEdit(null);
                    setIsUploadModalOpen(true);
                  }}
                  className="bg-gradient-to-r from-blue-300 to-violet-300 text-white px-6 py-3 rounded-full hover:shadow-lg transform hover:scale-105 transition-all"
                >
                  Crear nueva publicación
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {drafts.map((draft) => (
                  <div
                    key={draft.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer group"
                    onClick={() => {
                      setPostToEdit(draft);
                      setIsUploadModalOpen(true);
                      setShowDraftsView(false);
                    }}
                  >
                    {draft.image_url && (
                      <div className="mb-3 rounded-lg overflow-hidden bg-gray-100 aspect-video">
                        <img
                          src={draft.image_url}
                          alt={draft.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                    )}
                    <h3 className="font-medium text-gray-800 mb-1 line-clamp-2">
                      {draft.title || 'Sin título'}
                    </h3>
                    {draft.description && (
                      <p className="text-sm text-gray-500 line-clamp-2 mb-2">
                        {draft.description.replace(/<[^>]*>/g, '').substring(0, 100)}
                        {draft.description.replace(/<[^>]*>/g, '').length > 100 ? '...' : ''}
                      </p>
                    )}
                    <div className="flex items-center justify-between text-xs text-gray-400 mt-3 pt-3 border-t border-gray-100">
                      <span>
                        {new Date(draft.created_at).toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </span>
                      <span className="bg-blue-50 text-blue-500 px-2 py-0.5 rounded-full">
                        Borrador
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : view === 'folders' ? (
          <FoldersView
            folders={folders}
            posts={posts}
            onFolderSelect={(folderId) => {
              setSelectedFolderId(folderId);
              navigate({ pathname: '/', search: `?folder=${folderId}` });
            }}
            onRefresh={fetchData}
          />
        ) : view === 'calendar' ? (
          <CalendarView posts={filteredPosts} onPostClick={(post) => {
            setSelectedPost(post);
            setSearchParams({ post: post.id }, { replace: false });
          }} userProfiles={userProfiles} />
        ) : view === 'profile' && user ? (
          <ProfileView
            userId={user.id}
            userProfiles={userProfiles}
            onPostClick={(post) => {
              setSelectedPost(post);
              setSearchParams({ post: post.id }, { replace: false });
            }}
            onEdit={(post) => {
              setPostToEdit(post);
              setIsUploadModalOpen(true);
            }}
            onDelete={handleDeletePost}
            onMoveToFolder={handleMoveToFolder}
            folders={folders}
            postColors={postColors}
            currentUserId={user.id}
            onProfileUpdate={fetchData}
            onSignOut={signOut}
            onCreatePost={() => {
              setPostToEdit(null);
              setIsUploadModalOpen(true);
            }}
          />
        ) : (
          <PinterestGrid
            posts={filteredPosts}
            onPostClick={(post) => {
              setSelectedPost(post);
              setSearchParams({ post: post.id }, { replace: false });
            }}
            onEdit={(post) => {
              setPostToEdit(post);
              setIsUploadModalOpen(true);
            }}
            onDelete={handleDeletePost}
            onMoveToFolder={handleMoveToFolder}
            currentUserId={user?.id}
            folders={folders}
            postColors={postColors}
            userProfiles={userProfiles}
          />
        )}

        {!loading && filteredPosts.length === 0 && view !== 'folders' && view !== 'profile' && (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-4">
              {searchQuery ? 'No se encontraron resultados' : 'No hay publicaciones aún'}
            </p>
            {user && !searchQuery && (
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="bg-gradient-to-r from-blue-300 to-violet-300 text-white px-6 py-3 rounded-full hover:shadow-lg transform hover:scale-105 transition-all"
              >
                Crear la primera
              </button>
            )}
          </div>
        )}
      </main>

      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => {
          setIsUploadModalOpen(false);
          setPostToEdit(null);
          // Si estábamos en la vista de borradores, mantenerla abierta
          if (showDraftsView) {
            fetchData();
          }
        }}
        folders={folders}
        onSuccess={() => {
          fetchData();
          // Si se publicó un borrador, cerrar la vista de borradores
          if (postToEdit?.is_draft) {
            setShowDraftsView(false);
          }
        }}
        postToEdit={postToEdit}
        onFoldersUpdate={fetchData}
      />

      <PostDetailModal
        post={selectedPost}
        onClose={() => {
          setSelectedPost(null);
          setSearchParams(prev => {
            const newParams = new URLSearchParams(prev);
            newParams.delete('post');
            return newParams;
          }, { replace: true });
        }}
        onDelete={fetchData}
        onMoveToFolder={handleMoveToFolder}
        onPostClick={(referencedPost) => {
          setSelectedPost(referencedPost);
          setSearchParams({ post: referencedPost.id }, { replace: false });
        }}
        currentUserId={user?.id}
        folders={folders}
        userProfiles={userProfiles}
      />

      {/* Modal para agregar publicaciones a la carpeta */}
      {showAddToFolderModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col m-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h3 className="text-xl font-medium text-gray-800">
                  Agregar publicaciones a "{folders.find(f => f.id === showAddToFolderModal)?.name}"
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Selecciona las publicaciones que quieres agregar
                </p>
              </div>
              <button
                onClick={() => {
                  setShowAddToFolderModal(null);
                  setFolderSearchQuery('');
                }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>

            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar publicaciones..."
                  value={folderSearchQuery}
                  onChange={(e) => setFolderSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {filteredFolderPosts.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  {folderSearchQuery ? 'No se encontraron publicaciones' : 'No hay publicaciones disponibles para agregar'}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {filteredFolderPosts.map((post) => (
                    <div
                      key={post.id}
                      className="border border-gray-200 rounded-lg p-3 hover:border-blue-200 hover:shadow-md transition-all cursor-pointer group"
                      onClick={() => handleAddPostToFolder(post.id, showAddToFolderModal)}
                    >
                      {post.image_url && (
                        <div className="mb-2 rounded-lg overflow-hidden bg-gray-100 aspect-video">
                          <img
                            src={post.image_url}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                      )}
                      <h4 className="font-medium text-gray-800 text-sm line-clamp-2 mb-1">
                        {post.title || 'Sin título'}
                      </h4>
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>
                          {new Date(post.created_at).toLocaleDateString('es-ES', {
                            day: 'numeric',
                            month: 'short',
                          })}
                        </span>
                        {movingPostToFolder === post.id && (
                          <span className="text-blue-400">Agregando...</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </DynamicBackground>
  );
}

export default App;
