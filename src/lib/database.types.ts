export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          name: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          updated_at?: string
        }
      }
      folders: {
        Row: {
          id: string
          name: string
          color: string
          created_at: string
          created_by: string
        }
        Insert: {
          id?: string
          name: string
          color?: string
          created_at?: string
          created_by: string
        }
        Update: {
          id?: string
          name?: string
          color?: string
          created_at?: string
          created_by?: string
        }
      }
      posts: {
        Row: {
          id: string
          title: string
          description: string
          image_url: string
          images: string[]
          folder_id: string | null
          created_at: string
          created_by: string
          updated_at: string
          is_private: boolean
          published_at: string | null
          media_type: string
          media_url: string | null
          thumbnail_url: string | null
          aspect_ratio: number
        }
        Insert: {
          id?: string
          title: string
          description?: string
          image_url: string
          images?: string[]
          folder_id?: string | null
          created_at?: string
          created_by: string
          updated_at?: string
          is_private?: boolean
          published_at?: string | null
          media_type?: string
          media_url?: string | null
          thumbnail_url?: string | null
          aspect_ratio?: number
        }
        Update: {
          id?: string
          title?: string
          description?: string
          image_url?: string
          images?: string[]
          folder_id?: string | null
          created_at?: string
          created_by?: string
          updated_at?: string
          is_private?: boolean
          published_at?: string | null
          media_type?: string
          media_url?: string | null
          thumbnail_url?: string | null
          aspect_ratio?: number
        }
      }
      extracted_colors: {
        Row: {
          id: string
          post_id: string
          colors: string[]
          created_at: string
        }
        Insert: {
          id?: string
          post_id: string
          colors: string[]
          created_at?: string
        }
        Update: {
          colors?: string[]
        }
      }
    }
  }
}
