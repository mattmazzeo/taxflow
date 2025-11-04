export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// Helper type for flexible updates
export type PartialUpdate<T> = Partial<T>

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          user_id: string
          full_name: string | null
          email: string | null
          plan: 'free' | 'basic' | 'pro'
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          full_name?: string | null
          email?: string | null
          plan?: 'free' | 'basic' | 'pro'
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          full_name?: string | null
          email?: string | null
          plan?: 'free' | 'basic' | 'pro'
          created_at?: string
          updated_at?: string
        }
      }
      households: {
        Row: {
          id: string
          owner_id: string | null
          name: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          owner_id?: string | null
          name?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          owner_id?: string | null
          name?: string
          created_at?: string
          updated_at?: string
        }
      }
      memberships: {
        Row: {
          household_id: string
          user_id: string
          role: 'owner' | 'member'
          created_at: string
        }
        Insert: {
          household_id: string
          user_id: string
          role?: 'owner' | 'member'
          created_at?: string
        }
        Update: {
          household_id?: string
          user_id?: string
          role?: 'owner' | 'member'
          created_at?: string
        }
      }
      tax_years: {
        Row: {
          id: string
          household_id: string | null
          year: number
          status: 'collecting' | 'reviewing' | 'ready' | 'exported'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          household_id?: string | null
          year: number
          status?: 'collecting' | 'reviewing' | 'ready' | 'exported'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          household_id?: string | null
          year?: number
          status?: 'collecting' | 'reviewing' | 'ready' | 'exported'
          created_at?: string
          updated_at?: string
        }
      }
      documents: {
        Row: {
          id: string
          household_id: string | null
          tax_year_id: string | null
          source: 'upload' | 'gmail' | 'drive' | 'manual'
          provider_id: string | null
          filename: string
          mime_type: string | null
          storage_path: string | null
          file_size: number | null
          parsed: boolean
          parse_error: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          household_id?: string | null
          tax_year_id?: string | null
          source?: 'upload' | 'gmail' | 'drive' | 'manual'
          provider_id?: string | null
          filename: string
          mime_type?: string | null
          storage_path?: string | null
          file_size?: number | null
          parsed?: boolean
          parse_error?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          household_id?: string | null
          tax_year_id?: string | null
          source?: 'upload' | 'gmail' | 'drive' | 'manual'
          provider_id?: string | null
          filename?: string
          mime_type?: string | null
          storage_path?: string | null
          file_size?: number | null
          parsed?: boolean
          parse_error?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      document_entities: {
        Row: {
          id: string
          document_id: string | null
          entity_type: string
          key: string
          value: string | null
          confidence: number | null
          created_at: string
        }
        Insert: {
          id?: string
          document_id?: string | null
          entity_type: string
          key: string
          value?: string | null
          confidence?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          document_id?: string | null
          entity_type?: string
          key?: string
          value?: string | null
          confidence?: number | null
          created_at?: string
        }
      }
      checklist_items: {
        Row: {
          id: string
          tax_year_id: string | null
          title: string
          description: string | null
          status: 'todo' | 'in_progress' | 'done'
          required: boolean
          category: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tax_year_id?: string | null
          title: string
          description?: string | null
          status?: 'todo' | 'in_progress' | 'done'
          required?: boolean
          category?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tax_year_id?: string | null
          title?: string
          description?: string | null
          status?: 'todo' | 'in_progress' | 'done'
          required?: boolean
          category?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      nudges: {
        Row: {
          id: string
          tax_year_id: string | null
          user_id: string | null
          channel: 'email'
          template: string | null
          subject: string | null
          sent_at: string
          created_at: string
        }
        Insert: {
          id?: string
          tax_year_id?: string | null
          user_id?: string | null
          channel?: 'email'
          template?: string | null
          subject?: string | null
          sent_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          tax_year_id?: string | null
          user_id?: string | null
          channel?: 'email'
          template?: string | null
          subject?: string | null
          sent_at?: string
          created_at?: string
        }
      }
      billing: {
        Row: {
          user_id: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          plan: 'free' | 'basic' | 'pro'
          current_period_end: string | null
          cancel_at_period_end: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          plan?: 'free' | 'basic' | 'pro'
          current_period_end?: string | null
          cancel_at_period_end?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          plan?: 'free' | 'basic' | 'pro'
          current_period_end?: string | null
          cancel_at_period_end?: boolean
          created_at?: string
          updated_at?: string
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

