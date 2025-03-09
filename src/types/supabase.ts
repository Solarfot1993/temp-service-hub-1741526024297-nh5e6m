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
      services: {
        Row: {
          id: string
          title: string
          description: string
          price: number
          category: string
          image_url: string
          rating: number
          review_count: number
          location: string
          duration: string
          availability: string
          includes: string[]
          additional_info: string | null
          provider_id: string
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          title: string
          description: string
          price: number
          category: string
          image_url: string
          rating?: number
          review_count?: number
          location: string
          duration: string
          availability: string
          includes: string[]
          additional_info?: string | null
          provider_id: string
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string
          price?: number
          category?: string
          image_url?: string
          rating?: number
          review_count?: number
          location?: string
          duration?: string
          availability?: string
          includes?: string[]
          additional_info?: string | null
          provider_id?: string
          created_at?: string
          updated_at?: string | null
        }
      }
      reviews: {
        Row: {
          id: string
          service_id: string
          user_id: string
          rating: number
          comment: string
          created_at: string
        }
        Insert: {
          id?: string
          service_id: string
          user_id: string
          rating: number
          comment: string
          created_at?: string
        }
        Update: {
          id?: string
          service_id?: string
          user_id?: string
          rating?: number
          comment?: string
          created_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          service_id: string
          user_id: string
          provider_id: string
          date: string
          time: string
          duration: number
          price: number
          status: string
          notes: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          service_id: string
          user_id: string
          provider_id: string
          date: string
          time: string
          duration: number
          price: number
          status?: string
          notes?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          service_id?: string
          user_id?: string
          provider_id?: string
          date?: string
          time?: string
          duration?: number
          price?: number
          status?: string
          notes?: string | null
          created_at?: string
          updated_at?: string | null
        }
      }
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string
          avatar_url: string | null
          is_provider: boolean
          provider_since: string | null
          provider_bio: string | null
          completed_jobs: number
          created_at: string
        }
        Insert: {
          id: string
          email: string
          full_name: string
          avatar_url?: string | null
          is_provider?: boolean
          provider_since?: string | null
          provider_bio?: string | null
          completed_jobs?: number
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          avatar_url?: string | null
          is_provider?: boolean
          provider_since?: string | null
          provider_bio?: string | null
          completed_jobs?: number
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}