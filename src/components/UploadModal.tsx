import { useState, useRef, useEffect } from 'react';
import { X, Upload, Image as ImageIcon, Plus, Lock, Unlock, Link2, Music, Play, BookOpen, Quote, Search } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { extractImageAspectRatio } from '../lib/colorUtils';
import { extractSpotifyId, extractYouTubeId, getSpotifyThumbnail, getYouTubeThumbnail, getSpotifyTrackInfo } from '../lib/mediaUtils';
import { RichTextEditor } from './RichTextEditor';

interface Folder {
  id: string;
  name: string;
  color: string;
}

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  folders: Folder[];
  onSuccess: () => void;
  postToEdit?: any;
}

export function UploadModal({ isOpen, onClose, folders, onSuccess, postToEdit, onFoldersUpdate }: UploadModalProps) {
  const [title, setTitle] = useState(postToEdit?.title || '');
  const [description, setDescription] = useState(postToEdit?.description || '');
  const [folderId, setFolderId] = useState<string>(postToEdit?.folder_id || '');
  const [mediaType, setMediaType] = useState<'image' | 'spotify' | 'youtube'>(postToEdit?.media_type || 'image');
  const [mediaUrl, setMediaUrl] = useState(postToEdit?.media_url || '');
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [customThumbnail, setCustomThumbnail] = useState(postToEdit?.thumbnail_url || postToEdit?.image_url || '');
  const [isPrivate, setIsPrivate] = useState(postToEdit?.is_private || false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showRestoredMessage, setShowRestoredMessage] = useState(false);
  const [showMediaOptions, setShowMediaOptions] = useState(postToEdit?.media_type !== 'image');
  const [referencedPosts, setReferencedPosts] = useState<any[]>([]);
  const [showPostReferences, setShowPostReferences] = useState(false);
  const [postSearchQuery, setPostSearchQuery] = useState('');
  const [availablePosts, setAvailablePosts] = useState<any[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderColor, setNewFolderColor] = useState('#3b82f6');
  const [creatingFolder, setCreatingFolder] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const STORAGE_KEY = 'draft_post_autosave';

  const PRESET_COLORS = [
    '#ef4444', '#f97316', '#f59e0b', '#84cc16', '#10b981',
    '#14b8a6', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899'
  ];

  // Función para guardar en localStorage
  const saveToLocalStorage = () => {
    if (!user || postToEdit) return; // No guardar si es edición
    
    const draftData = {
      title,
      description,
      folderId,
      mediaType,
      mediaUrl,
      imagePreviews,
      customThumbnail,
      isPrivate,
      showMediaOptions,
      timestamp: Date.now(),
    };
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(draftData));
    } catch (e) {
      console.error('Error guardando borrador:', e);
    }
  };

  // Función para cargar desde localStorage
  const loadFromLocalStorage = () => {
    if (postToEdit) return null; // No cargar si es edición
    
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const draftData = JSON.parse(saved);
        // Solo cargar si tiene menos de 7 días
        if (Date.now() - draftData.timestamp < 7 * 24 * 60 * 60 * 1000) {
          return draftData;
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch (e) {
      console.error('Error cargando borrador:', e);
    }
    return null;
  };

  // Función para limpiar localStorage
  const clearLocalStorage = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error('Error limpiando borrador:', e);
    }
  };

  // Auto-guardar cada 2 segundos
  useEffect(() => {
    if (!isOpen || postToEdit || !user) return;
    
    const interval = setInterval(() => {
      if (title || description || imagePreviews.length > 0) {
        saveToLocalStorage();
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [title, description, folderId, mediaType, mediaUrl, imagePreviews, customThumbnail, isPrivate, showMediaOptions, isOpen, postToEdit, user]);

  // Guardar antes de cerrar la página
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (isOpen && !postToEdit && user && (title || description || imagePreviews.length > 0)) {
        saveToLocalStorage();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isOpen, postToEdit, user, title, description, imagePreviews]);

  useEffect(() => {
    if (!isOpen) {
      // Resetear todo al cerrar
      setTitle('');
      setDescription('');
      setFolderId('');
      setMediaType('image');
      setMediaUrl('');
      setImagePreviews([]);
      setCustomThumbnail('');
      setIsPrivate(false);
      setShowMediaOptions(false);
      setImageFiles([]);
      setError('');
      setReferencedPosts([]);
      setPostSearchQuery('');
      return;
    }

    // Si hay un post para editar, cargar toda su información original
    if (postToEdit) {
      // Cargar título (extraer texto plano si tiene HTML)
      const titleContent = postToEdit.title || '';
      // Si el título tiene HTML, extraer solo el texto plano
      const titlePlainText = titleContent.replace(/<[^>]*>/g, '').trim() || '';
      setTitle(titlePlainText);

      // Cargar descripción (con HTML formateado)
      setDescription(postToEdit.description || '');
      
      // Cargar resto de información
      setFolderId(postToEdit.folder_id || '');
      setMediaType(postToEdit.media_type || 'image');
      setMediaUrl(postToEdit.media_url || '');
      
      // Cargar imágenes (si es tipo imagen)
      if (postToEdit.media_type === 'image') {
        setImagePreviews(postToEdit.images || (postToEdit.image_url ? [postToEdit.image_url] : []));
        setCustomThumbnail('');
      } else {
        // Para Spotify o YouTube, cargar el thumbnail
        setImagePreviews([]);
        setCustomThumbnail(postToEdit.thumbnail_url || postToEdit.image_url || '');
      }
      
      setIsPrivate(postToEdit.is_private || false);
      setShowMediaOptions(postToEdit.media_type !== 'image');
      setImageFiles([]);
      setError('');
      setReferencedPosts([]);
      setPostSearchQuery('');
    } else {
      // Si no hay post para editar, NO cargar imágenes desde localStorage
      // Solo cargar texto y configuración, pero NO imágenes
      const savedDraft = loadFromLocalStorage();
      if (savedDraft) {
        setTitle(savedDraft.title || '');
        setDescription(savedDraft.description || '');
        setFolderId(savedDraft.folderId || '');
        setMediaType(savedDraft.mediaType || 'image');
        setMediaUrl(savedDraft.mediaUrl || '');
        // NO cargar imágenes predeterminadas
        setImagePreviews([]);
        setCustomThumbnail('');
        setIsPrivate(savedDraft.isPrivate || false);
        setShowMediaOptions(savedDraft.showMediaOptions || false);
        setShowRestoredMessage(true);
        // Ocultar el mensaje después de 5 segundos
        setTimeout(() => setShowRestoredMessage(false), 5000);
      }
    }
  }, [isOpen, postToEdit]);

  // Cargar publicaciones disponibles para referenciar
  useEffect(() => {
    if (!showPostReferences) return;
    
    const timer = setTimeout(() => {
      if (postSearchQuery.length > 0) {
        searchPosts();
      } else {
        loadRecentPosts();
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [postSearchQuery, showPostReferences]);

  const loadRecentPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('id, title, image_url, created_at')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      setAvailablePosts(data || []);
    } catch (err) {
      console.error('Error loading posts:', err);
    }
  };

  const searchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('id, title, image_url, created_at')
        .ilike('title', `%${postSearchQuery}%`)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      setAvailablePosts(data || []);
    } catch (err) {
      console.error('Error searching posts:', err);
    }
  };

  const addPostReference = (post: any) => {
    if (!referencedPosts.find(p => p.id === post.id)) {
      setReferencedPosts([...referencedPosts, post]);
      setPostSearchQuery('');
    }
  };

  const removePostReference = (postId: string) => {
    setReferencedPosts(referencedPosts.filter(p => p.id !== postId));
  };

  const handleCreateFolder = async () => {
    if (!user || !newFolderName.trim() || creatingFolder) return;

    setCreatingFolder(true);
    try {
      const { data, error } = await supabase
        .from('folders')
        .insert({
          name: newFolderName.trim(),
          color: newFolderColor,
          created_by: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      // Actualizar la lista de carpetas y seleccionar la nueva
      if (data) {
        setFolderId(data.id);
        setShowCreateFolder(false);
        setNewFolderName('');
        // Notificar al componente padre para que actualice las carpetas
        if (onFoldersUpdate) {
          onFoldersUpdate();
        }
      }
    } catch (err) {
      console.error('Error creating folder:', err);
      setError('Error al crear la carpeta');
    } finally {
      setCreatingFolder(false);
    }
  };

  if (!isOpen) return null;

  const processFiles = (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const newFiles: File[] = [];
    const newPreviews: string[] = [];
    let hasError = false;

    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];

      if (!file.type.startsWith('image/')) {
        setError('Por favor selecciona solo imágenes');
        hasError = true;
        break;
      }

      if (file.size > 10 * 1024 * 1024) {
        setError('Alguna imagen es demasiado grande (máx. 10MB)');
        hasError = true;
        break;
      }

      newFiles.push(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result as string);
        if (newPreviews.length === newFiles.length) {
          setImageFiles((prev) => [...prev, ...newFiles]);
          setImagePreviews((prev) => [...prev, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    }

    if (!hasError) {
      setError('');
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    processFiles(files);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
  };

  const handleMediaUrlChange = async (url: string) => {
    setMediaUrl(url);
    setError('');

    if (!url.trim()) {
      setCustomThumbnail('');
      return;
    }

    // Intentar detectar Spotify
    const spotifyId = extractSpotifyId(url);
    if (spotifyId) {
      if (mediaType !== 'spotify') setMediaType('spotify');
      
      // Primero mostrar el placeholder
      const placeholderThumbnail = getSpotifyThumbnail(spotifyId);
      setCustomThumbnail(placeholderThumbnail);
      
      // Intentar obtener la imagen real del álbum
      try {
        const trackInfo = await getSpotifyTrackInfo(spotifyId);
        if (trackInfo && trackInfo.thumbnail) {
          setCustomThumbnail(trackInfo.thumbnail);
        }
      } catch (err) {
        console.error('Error obteniendo imagen del álbum de Spotify:', err);
        // Mantener el placeholder si falla
      }
      return;
    }

    // Intentar detectar YouTube
    const youtubeId = extractYouTubeId(url);
    if (youtubeId) {
      if (mediaType !== 'youtube') setMediaType('youtube');
      const thumbnail = getYouTubeThumbnail(youtubeId);
      setCustomThumbnail(thumbnail);
      return;
    }

    // Si no se detecta ninguno, mostrar error
    if (url.length > 5) {
      setError('URL no reconocida. Asegúrate de copiar el enlace completo de Spotify o YouTube');
    }
  };

  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveDraft = async () => {
    const form = document.getElementById('upload-form') as HTMLFormElement;
    if (form) {
      const syntheticEvent = {
        preventDefault: () => {},
        currentTarget: form,
        target: form,
      } as unknown as React.FormEvent<HTMLFormElement>;
      await handleSubmit(syntheticEvent, true);
    }
  };

  const handleSubmit = async (e: React.FormEvent, isDraft: boolean = false) => {
    e.preventDefault();
    if (!user) return;
    
    // Para borradores, no requerir título ni imágenes
    if (!isDraft) {
      if (!title.trim()) return;

      if (mediaType === 'image' && imagePreviews.length === 0) {
        setError('Por favor selecciona al menos una imagen');
        return;
      }

      if ((mediaType === 'spotify' || mediaType === 'youtube') && !mediaUrl.trim()) {
        setError('Por favor ingresa un URL válido');
        return;
      }
    }

    setLoading(true);
    setError('');

    try {
      let uploadedImages: string[] = [];
      let primaryImage = '';
      let aspectRatio = 1;

      // Para borradores, permitir guardar sin imágenes
      if (isDraft && mediaType === 'image' && imagePreviews.length === 0 && imageFiles.length === 0) {
        // Para borradores sin imagen, usar un placeholder o mantener la imagen existente si se está editando
        if (postToEdit && postToEdit.image_url) {
          primaryImage = postToEdit.image_url;
          uploadedImages = postToEdit.images || [postToEdit.image_url];
        } else {
          // Usar un placeholder SVG en base64 para borradores sin imagen
          primaryImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmNGY4Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk0YTNiOCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkJvcnJhZG9yPC90ZXh0Pjwvc3ZnPg==';
          uploadedImages = [primaryImage];
        }
        aspectRatio = 1;
      } else if (mediaType === 'image') {
        // Validar que haya imágenes antes de continuar
        if (imagePreviews.length === 0 && imageFiles.length === 0 && !postToEdit) {
          throw new Error('Por favor selecciona al menos una imagen');
        }
        if (postToEdit) {
          uploadedImages = [...imagePreviews];

          for (const file of imageFiles) {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
            const filePath = `${user.id}/${fileName}`;

            const { error: uploadError } = await supabase.storage
              .from('posts')
              .upload(filePath, file, { cacheControl: '3600', upsert: false });

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
              .from('posts')
              .getPublicUrl(filePath);

            uploadedImages.push(publicUrl);
          }

          primaryImage = uploadedImages[0];
          
          // Calcular aspect ratio de la primera imagen
          if (uploadedImages.length > 0) {
            aspectRatio = await extractImageAspectRatio(uploadedImages[0]);
          }
        } else {
          for (let i = 0; i < imageFiles.length; i++) {
            const file = imageFiles[i];
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
            const filePath = `${user.id}/${fileName}`;

            const { error: uploadError } = await supabase.storage
              .from('posts')
              .upload(filePath, file, { cacheControl: '3600', upsert: false });

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
              .from('posts')
              .getPublicUrl(filePath);

            uploadedImages.push(publicUrl);
            aspectRatio = await extractImageAspectRatio(publicUrl);
          }

          primaryImage = uploadedImages[0];
        }
      } else {
        // Para Spotify o YouTube, validar que haya thumbnail
        if (!customThumbnail && !postToEdit?.thumbnail_url) {
          throw new Error('No se pudo obtener la imagen de portada. Verifica la URL');
        }
        uploadedImages = [];
        primaryImage = customThumbnail || postToEdit?.thumbnail_url || postToEdit?.image_url || '';
        aspectRatio = mediaType === 'youtube' ? 16 / 9 : 1;
      }

      // Validar que haya una imagen principal antes de continuar
      if (!primaryImage && !isDraft) {
        throw new Error('Se requiere una imagen para publicar');
      }

      // Asegurar que primaryImage nunca esté vacío (requerido por la BD)
      if (!primaryImage) {
        primaryImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmNGY4Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk0YTNiOCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkJvcnJhZG9yPC90ZXh0Pjwvc3ZnPg==';
      }

      // Obtener el título como texto plano (sin formato)
      // Para borradores, permitir título vacío
      const titlePlainText = title.trim() || (isDraft ? 'Borrador sin título' : 'Sin título');

      // Agregar referencias al contenido si existen
      let finalDescription = description || '';
      
      if (referencedPosts.length > 0) {
        let referencesHtml = '<div style="margin-top: 2em; padding-top: 1em; border-top: 1px solid #ddd;"><p style="font-weight: 600; margin-bottom: 0.5em;">Referencias:</p><ul>';
        referencedPosts.forEach(post => {
          referencesHtml += `<li><a href="#post-${post.id}" style="color: #666; text-decoration: underline;">${post.title}</a></li>`;
        });
        referencesHtml += '</ul></div>';
        finalDescription = description + referencesHtml;
      }

      // Preparar datos para insertar/actualizar
      const postData: any = {
        title: titlePlainText,
        description: finalDescription,
        image_url: primaryImage,
        images: mediaType === 'image' ? uploadedImages : [],
        folder_id: folderId || null,
        is_private: isPrivate,
        media_type: mediaType,
        media_url: mediaType !== 'image' ? mediaUrl : null,
        thumbnail_url: mediaType !== 'image' ? primaryImage : null,
        aspect_ratio: aspectRatio,
      };

      // Solo agregar is_draft si la columna existe (evitar error si la migración no se ha ejecutado)
      // Intentaremos agregarlo, y si falla, lo intentaremos sin él
      try {
        if (postToEdit) {
          postData.updated_at = new Date().toISOString();
          postData.published_at = isDraft ? postToEdit.published_at : (postToEdit.published_at || new Date().toISOString());
          postData.is_draft = isDraft;
          
          const { error: updateError } = await supabase
            .from('posts')
            .update(postData)
            .eq('id', postToEdit.id);

          if (updateError) {
            // Si el error es por la columna is_draft, intentar sin ella
            if (updateError.message?.includes('is_draft')) {
              delete postData.is_draft;
              const { error: retryError } = await supabase
                .from('posts')
                .update(postData)
                .eq('id', postToEdit.id);
              if (retryError) throw retryError;
            } else {
              throw updateError;
            }
          }
        } else {
          postData.created_by = user.id;
          postData.published_at = isDraft ? null : new Date().toISOString();
          postData.is_draft = isDraft;
          
          const { error: insertError } = await supabase
            .from('posts')
            .insert(postData);

          if (insertError) {
            // Si el error es por la columna is_draft, intentar sin ella
            if (insertError.message?.includes('is_draft')) {
              delete postData.is_draft;
              const { error: retryError } = await supabase
                .from('posts')
                .insert(postData);
              if (retryError) throw retryError;
            } else {
              throw insertError;
            }
          }
        }
      } catch (err: any) {
        // Si aún falla, intentar sin is_draft
        if (err?.message?.includes('is_draft')) {
          delete postData.is_draft;
          if (postToEdit) {
            const { error: finalError } = await supabase
              .from('posts')
              .update(postData)
              .eq('id', postToEdit.id);
            if (finalError) throw finalError;
          } else {
            const { error: finalError } = await supabase
              .from('posts')
              .insert(postData);
            if (finalError) throw finalError;
          }
        } else {
          throw err;
        }
      }

      // Limpiar localStorage después de publicar o guardar borrador exitosamente
      clearLocalStorage();
      
      setTitle('');
      setDescription('');
      setFolderId('');
      setImageFiles([]);
      setImagePreviews([]);
      setCustomThumbnail('');
      setIsPrivate(false);
      setMediaType('image');
      setMediaUrl('');
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Error al procesar publicación:', err);
      
      // Extraer mensaje de error de Supabase si existe
      let errorMessage = 'Error al procesar';
      if (err?.message) {
        errorMessage = err.message;
      } else if (err?.error?.message) {
        errorMessage = err.error.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      }
      
      // Mostrar mensaje más descriptivo
      if (errorMessage.includes('duplicate') || errorMessage.includes('unique')) {
        setError('Ya existe una publicación con estos datos');
      } else if (errorMessage.includes('permission') || errorMessage.includes('policy') || errorMessage.includes('RLS')) {
        setError('No tienes permiso para realizar esta acción. Verifica que estés autenticado.');
      } else if (errorMessage.includes('storage') || errorMessage.includes('bucket')) {
        setError('Error al subir la imagen. Verifica que el archivo sea válido');
      } else if (errorMessage.includes('null value') || errorMessage.includes('NOT NULL')) {
        setError('Faltan datos requeridos. Verifica que todos los campos estén completos.');
      } else {
        setError(`Error: ${errorMessage}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#f5f1e8] z-50 flex flex-col" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(0,0,0,0.02) 1px, transparent 0)', backgroundSize: '40px 40px' }}>
      {/* Barra superior */}
      <div className="bg-[#f5f1e8] border-b border-gray-300 flex items-center justify-between px-4 py-2 flex-shrink-0 shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-700"
          >
            <X size={20} />
          </button>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-700">
              {postToEdit ? 'Editar publicación' : 'Nueva publicación'}
            </span>
            {showRestoredMessage && (
              <span className="text-xs text-blue-400 mt-1">
                ✓ Borrador restaurado automáticamente
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <select
              value={folderId}
              onChange={(e) => setFolderId(e.target.value)}
              className="w-full px-3 py-1.5 text-sm bg-[#fefcf8] border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 outline-none transition-all shadow-sm"
            >
              <option value="">Sin carpeta</option>
              {folders.map((folder) => (
                <option key={folder.id} value={folder.id}>
                  {folder.name}
                </option>
              ))}
            </select>
            {showCreateFolder && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-xl z-50 p-4">
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Nombre de la carpeta"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleCreateFolder();
                      }
                      if (e.key === 'Escape') {
                        setShowCreateFolder(false);
                        setNewFolderName('');
                      }
                    }}
                  />
                  <div>
                    <p className="text-xs text-gray-600 mb-2">Color</p>
                    <div className="flex gap-2 flex-wrap">
                      {PRESET_COLORS.map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setNewFolderColor(color)}
                          className={`w-8 h-8 rounded-full border-2 transition-all ${
                            newFolderColor === color
                              ? 'border-gray-800 scale-110'
                              : 'border-gray-300 hover:border-gray-500'
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleCreateFolder}
                      disabled={!newFolderName.trim() || creatingFolder}
                      className="flex-1 px-3 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {creatingFolder ? 'Creando...' : 'Crear'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowCreateFolder(false);
                        setNewFolderName('');
                      }}
                      className="px-3 py-2 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 transition-all"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => {
              setShowCreateFolder(!showCreateFolder);
              if (!showCreateFolder) {
                setNewFolderColor(PRESET_COLORS[7]); // Azul por defecto
              }
            }}
            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
            title="Crear nueva carpeta"
          >
            <Plus size={18} />
          </button>

          <button
            type="button"
            onClick={() => setIsPrivate(!isPrivate)}
            className={`p-2 rounded-lg transition-all ${
              isPrivate
                ? 'bg-blue-100 text-blue-600'
                : 'bg-[#fefcf8] text-gray-700 hover:bg-[#faf8f3] border border-gray-300'
            }`}
            title={isPrivate ? 'Solo para ti' : 'Visible para todos'}
          >
            {isPrivate ? <Lock size={18} /> : <Unlock size={18} />}
          </button>

          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={loading}
            className="px-4 py-1.5 bg-gray-400 text-white rounded-lg text-sm font-medium hover:bg-gray-500 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? 'Guardando...' : 'Guardar borrador'}
          </button>

          <button
            type="submit"
            form="upload-form"
            disabled={loading || (mediaType === 'image' && imagePreviews.length === 0) || !title.trim()}
            className="px-4 py-1.5 bg-gray-700 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? 'Guardando...' : (postToEdit ? 'Guardar' : 'Publicar')}
          </button>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor principal - estilo Google Docs */}
        <form 
          id="upload-form"
          onSubmit={handleSubmit} 
          className="flex-1 flex flex-col overflow-hidden bg-white"
        >
          <div className="flex-1 overflow-y-auto" style={{ backgroundColor: '#f5f1e8' }}>
            <div className="max-w-6xl mx-auto py-4 px-4">
              {/* Título - arriba de todo, sin formato */}
              <div className="mb-4">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Título"
                  className="w-full px-4 py-3 text-2xl font-light text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 focus:outline-none focus:border-gray-500 transition-colors placeholder-gray-400"
                  style={{
                    fontFamily: '"Inter", "Segoe UI", system-ui, sans-serif',
                    letterSpacing: '-0.02em',
                  }}
                />
              </div>

              {/* Editor de texto enriquecido - estilo papel rayado */}
              <div className="bg-[#fefefe] shadow-lg relative overflow-hidden rounded-lg" style={{ 
                boxShadow: '0 0 0 1px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.1), 0 0 0 1px rgba(255,255,255,0.5) inset',
                minHeight: 'calc(100vh - 180px)'
              }}>
                {/* Editor de texto enriquecido */}
                <div className="relative z-10">
                  <RichTextEditor
                    value={description}
                    onChange={setDescription}
                    placeholder="Escribe aquí..."
                  />
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* Sidebar derecho - Opciones de multimedia */}
        <div className="w-80 bg-[#f5f1e8] border-l border-gray-300 overflow-y-auto flex flex-col shadow-sm">
          <div className="p-4 space-y-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Multimedia</h3>
            
            {/* Opciones de tipo de contenido */}
            {!showMediaOptions ? (
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowMediaOptions(true);
                    setMediaType('image');
                  }}
                  className="w-full p-5 bg-gradient-to-br from-blue-50 to-violet-50 border-2 border-blue-100 rounded-xl hover:border-blue-200 hover:from-blue-50 hover:to-violet-50 transition-all flex flex-col items-center gap-3 shadow-md hover:shadow-lg transform hover:scale-[1.02]"
                >
                  <div className="p-3 bg-white rounded-full shadow-sm">
                    <ImageIcon size={28} className="text-blue-400" />
                  </div>
                  <span className="text-gray-800 font-medium text-base">Agregar imagen</span>
                  <span className="text-xs text-gray-500">Lo más importante después del texto</span>
                </button>
                
                <div className="space-y-2 pt-2 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowMediaOptions(true);
                      setMediaType('spotify');
                    }}
                    className="w-full p-3 bg-[#fefcf8] border border-gray-300 rounded-lg hover:border-gray-400 hover:bg-[#faf8f3] transition-all flex items-center gap-2 text-sm shadow-sm"
                  >
                    <Music size={18} className="text-gray-700" />
                    <span className="text-gray-800">Música (Spotify)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowMediaOptions(true);
                      setMediaType('youtube');
                    }}
                    className="w-full p-3 bg-[#fefcf8] border border-gray-300 rounded-lg hover:border-gray-400 hover:bg-[#faf8f3] transition-all flex items-center gap-2 text-sm shadow-sm"
                  >
                    <Play size={18} className="text-gray-700" />
                    <span className="text-gray-800">Video (YouTube)</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-700">
                    {mediaType === 'image' ? 'Imagen' : mediaType === 'spotify' ? 'Spotify' : 'YouTube'}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setShowMediaOptions(false);
                      setMediaType('image');
                      setMediaUrl('');
                      setImageFiles([]);
                      setImagePreviews([]);
                      setCustomThumbnail('');
                      setError('');
                    }}
                    className="text-xs text-gray-400 hover:text-gray-600"
                  >
                    <X size={16} />
                  </button>
                </div>

                {mediaType === 'image' && (
                  <div className="space-y-3">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageSelect}
                      className="hidden"
                    />

                    {imagePreviews.length > 0 && (
                      <div className="space-y-2">
                        {imagePreviews.map((preview, index) => (
                          <div key={index} className="relative">
                            <img
                              src={preview}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute top-1 right-1 bg-white p-1.5 rounded-full shadow-md hover:bg-gray-100 transition-colors"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div
                      onDragEnter={handleDragEnter}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={`w-full p-6 border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-3 transition-all text-sm ${
                        isDragging
                          ? 'border-blue-400 bg-blue-50 scale-[1.02]'
                          : 'border-gray-400 bg-[#fefcf8] hover:border-gray-500 hover:bg-[#faf8f3]'
                      }`}
                    >
                      <div className="flex flex-col items-center gap-2">
                        {isDragging ? (
                          <>
                            <Upload size={24} className="text-blue-500" />
                            <span className="text-blue-600 font-medium">Suelta los archivos aquí</span>
                          </>
                        ) : (
                          <>
                            <Plus size={20} className="text-gray-600" />
                            <span className="text-gray-700">Arrastrar archivo aquí</span>
                            <span className="text-xs text-gray-500">o</span>
                          </>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className={`px-4 py-2 rounded-lg transition-all ${
                          isDragging
                            ? 'bg-blue-500 text-white hover:bg-blue-600'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        Seleccionar desde la biblioteca
                      </button>
                    </div>
                  </div>
                )}

                {(mediaType === 'spotify' || mediaType === 'youtube') && (
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium text-gray-700 block mb-1.5">
                        {mediaType === 'spotify' ? 'Enlace de Spotify' : 'Enlace de YouTube'}
                      </label>
                      <input
                        type="text"
                        placeholder={mediaType === 'spotify' 
                          ? 'https://open.spotify.com/track/...' 
                          : 'https://youtube.com/watch?v=...'}
                        value={mediaUrl}
                        onChange={(e) => handleMediaUrlChange(e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-[#fefcf8] border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 outline-none transition-all"
                      />
                    </div>

                    {customThumbnail && (
                      <div className="relative">
                        <img
                          src={customThumbnail}
                          alt="Thumbnail"
                          className="w-full h-32 object-cover rounded-lg"
                          onError={(e) => {
                            if (mediaType === 'youtube' && e.currentTarget.src.includes('maxresdefault')) {
                              const videoId = extractYouTubeId(mediaUrl);
                              if (videoId) {
                                e.currentTarget.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                              }
                            }
                          }}
                        />
                        <p className="text-xs text-gray-500 mt-1">✓ Portada detectada</p>
                      </div>
                    )}

                    <div>
                      <label className="text-xs font-medium text-gray-700 block mb-1.5">
                        Imagen personalizada
                      </label>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setCustomThumbnail(reader.result as string);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full p-3 border-2 border-dashed border-gray-400 rounded-lg flex flex-col items-center justify-center gap-2 hover:border-gray-500 hover:bg-[#faf8f3] transition-all text-sm bg-[#fefcf8]"
                      >
                        <ImageIcon size={18} className="text-gray-600" />
                        <span className="text-gray-700">Elegir imagen</span>
                      </button>
                    </div>
                  </div>
                )}

                {error && (
                  <p className="text-red-500 text-xs">{error}</p>
                )}
              </div>
            )}

            {/* Separador */}
            <div className="border-t border-gray-300 my-4"></div>

            {/* Referencias a publicaciones */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Referencias</h3>
                <button
                  type="button"
                  onClick={() => {
                    setShowPostReferences(!showPostReferences);
                    if (!showPostReferences) {
                      loadRecentPosts();
                    }
                  }}
                  className="text-xs text-gray-600 hover:text-gray-800"
                >
                  {showPostReferences ? 'Ocultar' : 'Mostrar'}
                </button>
              </div>

              {showPostReferences && (
                <div className="space-y-2">
                  <div className="relative">
                    <Search size={14} className="absolute left-2 top-2.5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Buscar publicaciones..."
                      value={postSearchQuery}
                      onChange={(e) => setPostSearchQuery(e.target.value)}
                      className="w-full pl-8 pr-2 py-1.5 text-xs bg-[#fefcf8] border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 outline-none"
                    />
                  </div>

                  {availablePosts.length > 0 && (
                    <div className="max-h-40 overflow-y-auto space-y-1">
                      {availablePosts
                        .filter(post => !referencedPosts.find(p => p.id === post.id))
                        .map(post => (
                          <button
                            key={post.id}
                            type="button"
                            onClick={() => addPostReference(post)}
                            className="w-full p-2 bg-[#fefcf8] border border-gray-300 rounded text-left hover:bg-[#faf8f3] transition-all text-xs"
                          >
                            <div className="flex items-center gap-2">
                              {post.image_url && (
                                <img src={post.image_url} alt={post.title} className="w-8 h-8 object-cover rounded" />
                              )}
                              <span className="flex-1 truncate">{post.title}</span>
                            </div>
                          </button>
                        ))}
                    </div>
                  )}

                  {referencedPosts.length > 0 && (
                    <div className="space-y-1 mt-2">
                      <p className="text-xs text-gray-600 font-medium">Referencias seleccionadas:</p>
                      {referencedPosts.map(post => (
                        <div key={post.id} className="flex items-center gap-2 p-2 bg-[#faf8f3] border border-gray-300 rounded text-xs">
                          {post.image_url && (
                            <img src={post.image_url} alt={post.title} className="w-6 h-6 object-cover rounded" />
                          )}
                          <span className="flex-1 truncate">{post.title}</span>
                          <button
                            type="button"
                            onClick={() => removePostReference(post.id)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
