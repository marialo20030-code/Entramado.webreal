export interface MediaMetadata {
  type: 'image' | 'spotify' | 'youtube';
  thumbnail: string;
  title: string;
  aspectRatio: number;
}

export async function extractImageAspectRatio(imageSrc: string): Promise<number> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      resolve(img.width / img.height);
    };
    img.onerror = () => {
      resolve(1);
    };
    img.src = imageSrc;
  });
}

export function extractSpotifyId(url: string): string | null {
  // Eliminar espacios y parámetros extra
  const cleanUrl = url.trim().split('?')[0];
  
  const patterns = [
    /spotify\.com\/track\/([a-zA-Z0-9]+)/,
    /spotify\.com\/intl-[a-z]+\/track\/([a-zA-Z0-9]+)/,
    /open\.spotify\.com\/track\/([a-zA-Z0-9]+)/,
    /open\.spotify\.com\/intl-[a-z]+\/track\/([a-zA-Z0-9]+)/,
  ];

  for (const pattern of patterns) {
    const match = cleanUrl.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export function extractYouTubeId(url: string): string | null {
  // Eliminar espacios
  const cleanUrl = url.trim();
  
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/, // Solo el ID
  ];

  for (const pattern of patterns) {
    const match = cleanUrl.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export function getSpotifyThumbnail(_trackId: string): string {
  // Spotify no proporciona una URL directa pública para las imágenes del álbum
  // Necesitamos obtenerla a través de la API de Spotify
  // Por ahora devolvemos un placeholder que será reemplazado cuando obtengamos los metadatos
  return `https://img.icons8.com/color/480/spotify--v1.png`;
}

export async function getSpotifyTrackInfo(trackId: string): Promise<{ thumbnail: string; title: string; artist: string } | null> {
  try {
    // Usar un proxy público de Spotify o hacer la petición directamente
    // La API pública de Spotify requiere autenticación, así que usamos un enfoque alternativo
    // Intentamos obtener la información desde el embed de Spotify
    
    // Alternativa: usar la API de Spotify Web API sin autenticación (limitado)
    // O usar un servicio proxy público
    
    // Método 1: Usar spotifydown API (servicio público sin autenticación)
    try {
      const response = await fetch(`https://api.spotifydown.com/metadata/${trackId}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.cover && data.title) {
          return {
            thumbnail: data.cover,
            title: data.title,
            artist: Array.isArray(data.artists) ? data.artists.join(', ') : (data.artists || 'Artista desconocido')
          };
        }
      }
    } catch (err) {
      console.log('Error con spotifydown API:', err);
    }
    
    // Método 2: Intentar directamente con OEmbed de Spotify
    try {
      const oembedUrl = `https://open.spotify.com/oembed?url=https://open.spotify.com/track/${trackId}`;
      const response = await fetch(oembedUrl);
      if (response.ok) {
        const data = await response.json();
        if (data.thumbnail_url) {
          return {
            thumbnail: data.thumbnail_url,
            title: data.title || 'Canción de Spotify',
            artist: data.author_name || 'Artista desconocido'
          };
        }
      }
    } catch (err) {
      // CORS puede bloquear esto, es normal
      console.log('OEmbed bloqueado por CORS (normal):', err);
    }
    
    return null;
  } catch (error) {
    console.error('Error obteniendo información de Spotify:', error);
    return null;
  }
}

export function getYouTubeThumbnail(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}

export async function getMediaMetadata(url: string): Promise<MediaMetadata | null> {
  const spotifyId = extractSpotifyId(url);
  if (spotifyId) {
    return {
      type: 'spotify',
      thumbnail: getSpotifyThumbnail(spotifyId),
      title: 'Canción de Spotify',
      aspectRatio: 1,
    };
  }

  const youtubeId = extractYouTubeId(url);
  if (youtubeId) {
    return {
      type: 'youtube',
      thumbnail: getYouTubeThumbnail(youtubeId),
      title: 'Video de YouTube',
      aspectRatio: 16 / 9,
    };
  }

  return null;
}

export function getEmbedUrl(type: 'spotify' | 'youtube', id: string): string {
  if (type === 'spotify') {
    return `https://open.spotify.com/embed/track/${id}`;
  }
  return `https://www.youtube.com/embed/${id}`;
}
