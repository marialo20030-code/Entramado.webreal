import { useState, useEffect } from 'react';
import { User, Calendar, Lock, Globe } from 'lucide-react';
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
}: ProfileViewProps) {
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [stats, setStats] = useState({ total: 0, public: 0, private: 0 });
  const [memberSince, setMemberSince] = useState<string>('');

  const userProfile = userProfiles[userId];
  const userName = userProfile?.name || 'Usuario';

  useEffect(() => {
    loadUserPosts();
  }, [userId]);

  const loadUserPosts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('created_by', userId)
        .neq('is_draft', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const posts = data || [];
      setUserPosts(posts);

      // Calcular estadísticas
      const total = posts.length;
      const publicPosts = posts.filter((p) => !p.is_private).length;
      const privatePosts = posts.filter((p) => p.is_private).length;

      setStats({ total, public: publicPosts, private: privatePosts });

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
            <h2 className="text-3xl font-light text-gray-800 mb-2">{userName}</h2>
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
              <div className="flex items-center gap-1">
                <User size={16} />
                <span>Miembro desde {memberSince || 'recientemente'}</span>
              </div>
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-light text-gray-800">{stats.total}</div>
                <div className="text-xs text-gray-500 mt-1">Publicaciones</div>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-light text-blue-600">{stats.public}</div>
                <div className="text-xs text-blue-500 mt-1 flex items-center justify-center gap-1">
                  <Globe size={12} />
                  Públicas
                </div>
              </div>
              <div className="bg-violet-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-light text-violet-600">{stats.private}</div>
                <div className="text-xs text-violet-500 mt-1 flex items-center justify-center gap-1">
                  <Lock size={12} />
                  Privadas
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Publicaciones del Usuario */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-light text-gray-800">
            Mis Publicaciones ({userPosts.length})
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
      />
    </div>
  );
}

