import { useState } from 'react';
import { ArrowLeft, Plus, Check, X } from 'lucide-react';
import { PinterestGrid } from './PinterestGrid';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface Folder {
  id: string;
  name: string;
  color: string;
}

interface Post {
  id: string;
  title: string;
  description: string;
  image_url: string;
  folder_id: string | null;
  created_at: string;
  created_by: string;
  media_type?: string;
  media_url?: string;
  aspect_ratio?: number;
}

interface UserProfile {
  id: string;
  name: string;
  username?: string;
  email?: string;
}

interface FolderContentViewProps {
  folder: Folder;
  posts: Post[];
  folderPosts: Post[];
  onBack: () => void;
  onPostClick: (post: Post) => void;
  onEdit: (post: Post) => void;
  onDelete: (post: Post) => void;
  onRefresh: () => void;
  postColors: { [postId: string]: string[] };
  userProfiles: { [userId: string]: UserProfile };
  currentUserId?: string;
}

export function FolderContentView({
  folder,
  posts,
  folderPosts,
  onBack,
  onPostClick,
  onEdit,
  onDelete,
  onRefresh,
  postColors,
  userProfiles,
  currentUserId,
}: FolderContentViewProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPosts, setSelectedPosts] = useState<Set<string>>(new Set());
  const [addingPosts, setAddingPosts] = useState(false);
  const { user } = useAuth();

  // Filtrar publicaciones que NO están ya en esta carpeta
  const availablePosts = posts.filter(
    (post) => post.folder_id !== folder.id
  );

  const togglePostSelection = (postId: string) => {
    const newSelected = new Set(selectedPosts);
    if (newSelected.has(postId)) {
      newSelected.delete(postId);
    } else {
      newSelected.add(postId);
    }
    setSelectedPosts(newSelected);
  };

  const handleAddSelectedPosts = async () => {
    if (selectedPosts.size === 0 || !user) return;

    setAddingPosts(true);
    try {
      const updates = Array.from(selectedPosts).map((postId) =>
        supabase
          .from('posts')
          .update({ folder_id: folder.id })
          .eq('id', postId)
      );

      const results = await Promise.all(updates);
      const errors = results.filter((r) => r.error);

      if (errors.length > 0) {
        throw new Error('Error al agregar algunas publicaciones');
      }

      setSelectedPosts(new Set());
      setShowAddModal(false);
      onRefresh();
    } catch (err) {
      console.error('Error adding posts to folder:', err);
      alert('Error al agregar las publicaciones. Intenta de nuevo.');
    } finally {
      setAddingPosts(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Volver a carpetas"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div className="flex items-center gap-3">
            <div
              className="p-3 rounded-2xl"
              style={{ backgroundColor: `${folder.color}20` }}
            >
              <div
                className="w-8 h-8 rounded-lg"
                style={{ backgroundColor: folder.color }}
              />
            </div>
            <div>
              <h2 className="text-2xl font-light text-gray-800">{folder.name}</h2>
              <p className="text-sm text-gray-500">
                {folderPosts.length} {folderPosts.length === 1 ? 'publicación' : 'publicaciones'}
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-300 to-violet-300 text-white px-4 py-2 rounded-full hover:shadow-lg transform hover:scale-105 transition-all"
        >
          <Plus size={20} />
          Agregar
        </button>
      </div>

      {/* Grid de publicaciones de la carpeta */}
      {folderPosts.length > 0 ? (
        <PinterestGrid
          posts={folderPosts}
          onPostClick={onPostClick}
          onEdit={onEdit}
          onDelete={onDelete}
          currentUserId={currentUserId}
          folders={[folder]}
          postColors={postColors}
          userProfiles={userProfiles}
        />
      ) : (
        <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
          <p className="text-gray-400 mb-4">Esta carpeta está vacía</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-blue-300 to-violet-300 text-white px-6 py-3 rounded-full hover:shadow-lg transform hover:scale-105 transition-all"
          >
            Agregar publicaciones
          </button>
        </div>
      )}

      {/* Modal para agregar publicaciones */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            {/* Header del modal */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h3 className="text-xl font-medium text-gray-800">
                  Agregar publicaciones a "{folder.name}"
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {selectedPosts.size > 0
                    ? `${selectedPosts.size} ${selectedPosts.size === 1 ? 'publicación seleccionada' : 'publicaciones seleccionadas'}`
                    : 'Selecciona las publicaciones que quieres agregar'}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setSelectedPosts(new Set());
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>

            {/* Lista de publicaciones disponibles */}
            <div className="flex-1 overflow-y-auto p-6">
              {availablePosts.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <p>No hay publicaciones disponibles para agregar</p>
                  <p className="text-sm mt-2">
                    Todas las publicaciones ya están en esta carpeta
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {availablePosts.map((post) => {
                    const isSelected = selectedPosts.has(post.id);
                    return (
                      <div
                        key={post.id}
                        onClick={() => togglePostSelection(post.id)}
                        className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                          isSelected
                            ? 'border-blue-500 ring-2 ring-blue-200'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {/* Checkbox visual */}
                        <div
                          className={`absolute top-2 right-2 z-10 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                            isSelected
                              ? 'bg-blue-500 text-white'
                              : 'bg-white/80 text-gray-400'
                          }`}
                        >
                          {isSelected && <Check size={16} />}
                        </div>

                        {/* Imagen */}
                        <div className="relative aspect-video bg-gray-100">
                          {post.media_type === 'image' ? (
                            <img
                              src={post.image_url}
                              alt={post.title}
                              className="w-full h-full object-cover"
                            />
                          ) : post.media_type === 'spotify' ? (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-400 to-green-600">
                              <div className="text-white text-center">
                                <div className="text-2xl mb-1">🎵</div>
                                <div className="text-xs">Spotify</div>
                              </div>
                            </div>
                          ) : post.media_type === 'youtube' ? (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-500 to-red-700">
                              <div className="text-white text-center">
                                <div className="text-2xl mb-1">▶️</div>
                                <div className="text-xs">YouTube</div>
                              </div>
                            </div>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-200">
                              <div className="text-gray-400 text-center">
                                <div className="text-2xl mb-1">📄</div>
                                <div className="text-xs">Publicación</div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Título */}
                        <div className="p-3 bg-white">
                          <p className="text-sm font-medium text-gray-800 line-clamp-2">
                            {post.title}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer del modal */}
            <div className="flex items-center justify-between p-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setSelectedPosts(new Set());
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddSelectedPosts}
                disabled={selectedPosts.size === 0 || addingPosts}
                className="px-6 py-2 bg-gradient-to-r from-blue-300 to-violet-300 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
              >
                {addingPosts ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Agregando...
                  </>
                ) : (
                  <>
                    <Plus size={18} />
                    Agregar {selectedPosts.size > 0 ? `(${selectedPosts.size})` : ''}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}




