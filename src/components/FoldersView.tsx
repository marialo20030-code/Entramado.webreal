import { useState } from 'react';
import { Folder, Plus } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface Folder {
  id: string;
  name: string;
  color: string;
  created_at: string;
  created_by: string;
}

interface Post {
  id: string;
  title: string;
  description: string;
  image_url: string;
  folder_id: string | null;
  created_at: string;
  created_by: string;
}

interface FoldersViewProps {
  folders: Folder[];
  posts: Post[];
  onFolderSelect: (folderId: string | null) => void;
  onRefresh: () => void;
}

const PRESET_COLORS = [
  '#ef4444', '#f97316', '#f59e0b', '#84cc16', '#10b981',
  '#14b8a6', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899'
];

export function FoldersView({ folders, posts, onFolderSelect, onRefresh }: FoldersViewProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const getPostCountByFolder = (folderId: string) => {
    return posts.filter((post) => post.folder_id === folderId).length;
  };

  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newFolderName.trim()) return;

    setLoading(true);
    try {
      const { error } = await supabase.from('folders').insert({
        name: newFolderName.trim(),
        color: selectedColor,
        created_by: user.id,
      });

      if (error) throw error;

      setNewFolderName('');
      setIsCreating(false);
      onRefresh();
    } catch (err) {
      console.error('Error creating folder:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-light text-gray-800">Carpetas</h2>
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-300 to-violet-300 text-white px-4 py-2 rounded-full hover:shadow-lg transform hover:scale-105 transition-all"
        >
          <Plus size={20} />
          Nueva
        </button>
      </div>

      {isCreating && (
        <div className="bg-white p-6 rounded-3xl shadow-lg">
          <form onSubmit={handleCreateFolder} className="space-y-4">
            <input
              type="text"
              placeholder="Nombre de la carpeta"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              autoFocus
              required
            />

            <div>
              <p className="text-sm text-gray-600 mb-2">Color</p>
              <div className="flex gap-2 flex-wrap">
                {PRESET_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`w-10 h-10 rounded-full transition-all ${
                      selectedColor === color ? 'ring-4 ring-offset-2 ring-gray-300 scale-110' : ''
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={loading || !newFolderName.trim()}
                className="flex-1 bg-gradient-to-r from-blue-300 to-violet-300 text-white py-2 rounded-2xl font-medium hover:shadow-lg transition-all disabled:opacity-50"
              >
                {loading ? 'Creando...' : 'Crear'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsCreating(false);
                  setNewFolderName('');
                }}
                className="px-6 bg-gray-100 text-gray-700 py-2 rounded-2xl font-medium hover:bg-gray-200 transition-all"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          onClick={() => onFolderSelect(null)}
          className="group bg-gradient-to-br from-gray-100 to-gray-200 p-6 rounded-3xl cursor-pointer hover:shadow-xl transition-all transform hover:scale-105"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-white/80 rounded-2xl">
              <Folder size={24} className="text-gray-600" />
            </div>
            <h3 className="font-medium text-gray-800">Todas</h3>
          </div>
          <p className="text-2xl font-light text-gray-700">{posts.length}</p>
        </div>

        {folders.map((folder) => (
          <div
            key={folder.id}
            className="group bg-white p-6 rounded-3xl hover:shadow-xl transition-all transform hover:scale-105 border-2 border-transparent hover:border-gray-100 relative"
          >
            <div 
              onClick={() => onFolderSelect(folder.id)}
              className="cursor-pointer"
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="p-3 rounded-2xl"
                  style={{ backgroundColor: `${folder.color}20` }}
                >
                  <Folder size={24} style={{ color: folder.color }} />
                </div>
                <h3 className="font-medium text-gray-800 flex-1">{folder.name}</h3>
              </div>
              <p className="text-2xl font-light text-gray-700">
                {getPostCountByFolder(folder.id)}
              </p>
            </div>
            
          </div>
        ))}
      </div>

      {folders.length === 0 && !isCreating && (
        <div className="text-center py-12 text-gray-400">
          Crea tu primera carpeta para organizar tus publicaciones
        </div>
      )}
    </div>
  );
}
