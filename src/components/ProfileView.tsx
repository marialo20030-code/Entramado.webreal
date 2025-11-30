import { useState, useEffect } from 'react';
import { User, Calendar, Lock, Globe, Mail, Edit2, LogOut, Plus } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { PinterestGrid } from './PinterestGrid';
import { PostDetailModal } from './PostDetailModal';

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

interface UserProfile {
  id: string;
  name: string;
}

interface ProfileViewProps {
  userId: string;
  userProfiles: { [userId: string]: UserProfile };
  onPostClick: (post: Post) => void;
  onEdit?: (post: Post) => void;
  onDelete?: (post: Post) => void;
  onMoveToFolder?: (post: Post, folderId: string | null) => Promise<void> | void;
  folders?: Array<{ id: string; name: string; color: string }>;
  postColors: { [postId: string]: string[] };
  currentUserId?: string;
  onProfileUpdate?: () => void;
  onSignOut?: () => Promise<void>;
  onCreatePost?: () => void;
}

export function ProfileView({
  userId,
  userProfiles,
  onPostClick,
  onEdit,
  onDelete,
  onMoveToFolder,
  folders = [],
  postColors,
  currentUserId,
  onProfileUpdate,
  onSignOut,
  onCreatePost,
}: ProfileViewProps) {
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [memberSince, setMemberSince] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState('');

  // Usar estado local para el nombre si está siendo editado, sino usar el del prop
  const userProfile = userProfiles[userId];
  const [localUserName, setLocalUserName] = useState(userProfile?.name || 'Usuario');
  
  // Actualizar el nombre local cuando cambie el perfil
  useEffect(() => {
    if (userProfiles[userId]?.name) {
      setLocalUserName(userProfiles[userId].name);
    }
  }, [userProfiles, userId]);
  
  const userName = localUserName;

  useEffect(() => {
    loadUserPosts();
    loadUserInfo();
  }, [userId]);

  const loadUserInfo = async () => {
    try {
      // Obtener email del usuario autenticado si es el mismo
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser && authUser.id === userId) {
        setUserEmail(authUser.email || '');
      }
    } catch (err) {
      console.error('Error loading user info:', err);
    }
  };

  const loadUserPosts = async () => {
    setLoading(true);
    try {
      // Cargar TODAS las publicaciones del usuario (incluyendo antiguas de otros usuarios)
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('created_by', userId)
        .neq('is_draft', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const posts = data || [];
      setUserPosts(posts);

      // Obtener fecha de creación del usuario
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser?.created_at) {
        setMemberSince(formatDate(authUser.created_at));
      } else if (posts.length > 0) {
        // Si no hay fecha de auth, usar la publicación más antigua
        const oldestPost = posts[posts.length - 1];
        setMemberSince(formatDate(oldestPost.created_at));
      }
    } catch (err) {
      console.error('Error loading user posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleUpdateName = async () => {
    if (!editedName.trim() || editedName.trim() === userName) {
      setIsEditingName(false);
      return;
    }

    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ name: editedName.trim() })
        .eq('id', userId);

      if (error) throw error;

      // Actualizar el estado local inmediatamente para feedback visual instantáneo
      setLocalUserName(editedName.trim());
      setIsEditingName(false);
      
      // Recargar datos del usuario
      loadUserPosts();
      
      // Notificar al componente padre para que recargue los perfiles
      // Esto actualizará el nombre en todas las vistas (grid, calendar, modals, etc.)
      if (onProfileUpdate) {
        // Usar setTimeout para asegurar que la actualización de la BD se complete primero
        setTimeout(() => {
          onProfileUpdate();
        }, 100);
      }
    } catch (err) {
      console.error('Error updating name:', err);
      alert('Error al actualizar el nombre. Asegúrate de tener permisos para editar tu perfil.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header del Perfil */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-start gap-6">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-300 to-violet-300 flex items-center justify-center text-white text-3xl font-light shadow-lg">
            {userName.charAt(0).toUpperCase()}
          </div>

          {/* Información */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              {isEditingName ? (
                <div className="flex items-center gap-2 flex-1">
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="text-3xl font-light text-gray-800 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1 focus:ring-2 focus:ring-blue-200 outline-none"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleUpdateName();
                      if (e.key === 'Escape') {
                        setIsEditingName(false);
                        setEditedName(userName);
                      }
                    }}
                  />
                  <button
                    onClick={handleUpdateName}
                    className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    title="Guardar"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => {
                      setIsEditingName(false);
                      setEditedName(userName);
                    }}
                    className="p-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    title="Cancelar"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-3xl font-light text-gray-800">{userName}</h2>
                  {currentUserId === userId && (
                    <button
                      onClick={() => {
                        setEditedName(userName);
                        setIsEditingName(true);
                      }}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Editar nombre"
                    >
                      <Edit2 size={18} className="text-gray-500" />
                    </button>
                  )}
                </>
              )}
            </div>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
              {userEmail && (
                <div className="flex items-center gap-1">
                  <Mail size={16} />
                  <span>{userEmail}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Calendar size={16} />
                <span>Miembro desde {memberSince || 'recientemente'}</span>
              </div>
              <div className="flex items-center gap-1">
                <User size={16} />
                <span>ID: {userId.substring(0, 8)}...</span>
              </div>
            </div>

            {/* Botones de acción */}
            {currentUserId === userId && (
              <div className="flex items-center gap-3 mt-6">
                {onCreatePost && (
                  <button
                    onClick={onCreatePost}
                    className="flex items-center gap-2 bg-gradient-to-r from-blue-300 to-violet-300 text-white px-4 py-2 rounded-full hover:shadow-lg transform hover:scale-105 transition-all"
                  >
                    <Plus size={18} />
                    <span>Nueva publicación</span>
                  </button>
                )}
                {onSignOut && (
                  <button
                    onClick={onSignOut}
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-full transition-all"
                    title="Cerrar sesión"
                  >
                    <LogOut size={18} />
                    <span>Cerrar sesión</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Publicaciones del Usuario - Abajo */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-light text-gray-800">
            Publicaciones
          </h3>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400">Cargando...</div>
        ) : userPosts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <User size={48} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-400 mb-4">Aún no has creado publicaciones</p>
          </div>
        ) : (
          <PinterestGrid
            posts={userPosts}
            onPostClick={(post) => {
              setSelectedPost(post);
              onPostClick(post);
            }}
            onEdit={onEdit}
            onDelete={onDelete}
            onMoveToFolder={onMoveToFolder}
            currentUserId={userId}
            folders={folders}
            postColors={postColors}
            userProfiles={userProfiles}
          />
        )}
      </div>

      {/* Modal de Detalle */}
      <PostDetailModal
        post={selectedPost}
        onClose={() => setSelectedPost(null)}
        onDelete={() => {
          if (selectedPost && onDelete) {
            onDelete(selectedPost);
          }
          loadUserPosts();
          setSelectedPost(null);
        }}
        onMoveToFolder={onMoveToFolder}
        onPostClick={(referencedPost) => {
          setSelectedPost(referencedPost);
        }}
        currentUserId={userId}
        folders={folders}
        userProfiles={userProfiles}
      />
    </div>
  );
}

