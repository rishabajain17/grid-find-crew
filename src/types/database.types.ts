
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UserType = 'driver' | 'engineer' | 'team'
export type JobStatus = 'open' | 'pending' | 'filled'
export type SeatStatus = 'open' | 'pending' | 'filled'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          username: string | null
          avatar_url: string | null
          user_type: UserType | null
          full_name: string | null
          bio: string | null
          location: string | null
          website: string | null
          social_links: Json | null
          experience_years: number | null
          expertise: string[] | null
          achievements: string[] | null
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          username?: string | null
          avatar_url?: string | null
          user_type?: UserType | null
          full_name?: string | null
          bio?: string | null
          location?: string | null
          website?: string | null
          social_links?: Json | null
          experience_years?: number | null
          expertise?: string[] | null
          achievements?: string[] | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          username?: string | null
          avatar_url?: string | null
          user_type?: UserType | null
          full_name?: string | null
          bio?: string | null
          location?: string | null
          website?: string | null
          social_links?: Json | null
          experience_years?: number | null
          expertise?: string[] | null
          achievements?: string[] | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          id: string
          sender_id: string
          recipient_id: string
          content: string
          read: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          sender_id: string
          recipient_id: string
          content: string
          read?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          sender_id?: string
          recipient_id?: string
          content?: string
          read?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      // Additional tables would be defined here...
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_type: UserType
      job_status: JobStatus
      seat_status: SeatStatus
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
