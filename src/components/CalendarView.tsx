import { useMemo } from 'react';

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

interface UserProfile {
  id: string;
  name: string;
}

interface CalendarViewProps {
  posts: Post[];
  onPostClick: (post: Post) => void;
  userProfiles?: { [userId: string]: UserProfile };
}

export function CalendarView({ posts, onPostClick, userProfiles = {} }: CalendarViewProps) {
  const getUserName = (userId: string): string => {
    return userProfiles[userId]?.name || 'Usuario';
  };
  const groupedByDate = useMemo(() => {
    const groups: { [key: string]: Post[] } = {};

    posts.forEach((post) => {
      const date = new Date(post.created_at).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(post);
    });

    return Object.entries(groups).sort((a, b) => {
      return new Date(b[1][0].created_at).getTime() - new Date(a[1][0].created_at).getTime();
    });
  }, [posts]);

  return (
    <div className="space-y-8">
      {groupedByDate.map(([date, datePosts]) => (
        <div key={date} className="space-y-4">
          <div className="sticky top-0 bg-gradient-to-r from-blue-50 to-violet-50 backdrop-blur-sm py-3 px-6 rounded-full inline-block shadow-sm">
            <h2 className="text-lg font-medium text-gray-700">{date}</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {datePosts.map((post) => (
              <div
                key={post.id}
                onClick={() => onPostClick(post)}
                className="group relative aspect-square bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105"
              >
                <img
                  src={post.image_url}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p className="text-white text-sm font-medium line-clamp-2 mb-1">
                      {post.title}
                    </p>
                    <p className="text-white/80 text-xs">
                      {getUserName(post.created_by)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {groupedByDate.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          No hay publicaciones aún
        </div>
      )}
    </div>
  );
}
