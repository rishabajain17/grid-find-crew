
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UserType = 'driver' | 'engineer' | 'team' | 'admin' | 'management'
export type ListingStatus = 'open' | 'pending' | 'filled'
export type ListingType = 'seat' | 'job' | 'management'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          created_at?: string
          updated_at?: string
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
          role_id?: number | null
          username?: string | null
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
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
          role_id?: number | null
          username?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
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
          role_id?: number | null
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          }
        ]
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
      },
      roles: {
        Row: {
          id: number
          name: UserType
          created_at: string
        }
        Insert: {
          id?: number
          name: UserType
          created_at?: string
        }
        Update: {
          id?: number
          name?: UserType
          created_at?: string
        }
        Relationships: []
      },
      seats: {
        Row: {
          id: string
          team_id: string
          car_type: string
          event_name: string
          location: string
          date_start: string
          date_end: string
          price: number
          requirements: string | null
          media_urls: string[] | null
          status: ListingStatus
          created_at: string
        }
        Insert: {
          id?: string
          team_id: string
          car_type: string
          event_name: string
          location: string
          date_start: string
          date_end: string
          price: number
          requirements?: string | null
          media_urls?: string[] | null
          status?: ListingStatus
          created_at?: string
        }
        Update: {
          id?: string
          team_id?: string
          car_type?: string
          event_name?: string
          location?: string
          date_start?: string
          date_end?: string
          price?: number
          requirements?: string | null
          media_urls?: string[] | null
          status?: ListingStatus
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "seats_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      },
      jobs: {
        Row: {
          id: string
          team_id: string
          title: string
          description: string
          skills: string[] | null
          date_start: string
          date_end: string | null
          pay_rate: number
          payment_term: string
          location: string
          media_urls: string[] | null
          status: ListingStatus
          created_at: string
        }
        Insert: {
          id?: string
          team_id: string
          title: string
          description: string
          skills?: string[] | null
          date_start: string
          date_end?: string | null
          pay_rate: number
          payment_term: string
          location: string
          media_urls?: string[] | null
          status?: ListingStatus
          created_at?: string
        }
        Update: {
          id?: string
          team_id?: string
          title?: string
          description?: string
          skills?: string[] | null
          date_start?: string
          date_end?: string | null
          pay_rate?: number
          payment_term?: string
          location?: string
          media_urls?: string[] | null
          status?: ListingStatus
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "jobs_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      },
      applications: {
        Row: {
          id: string
          listing_id: string
          listing_type: ListingType
          applicant_id: string
          message: string | null
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          listing_id: string
          listing_type: ListingType
          applicant_id: string
          message?: string | null
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          listing_id?: string
          listing_type?: ListingType
          applicant_id?: string
          message?: string | null
          status?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "applications_applicant_id_fkey"
            columns: ["applicant_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    },
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: {
          user_id: string
        }
        Returns: UserType
      }
    }
    Enums: {
      user_role: UserType
      listing_status: ListingStatus
      listing_type: ListingType
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
