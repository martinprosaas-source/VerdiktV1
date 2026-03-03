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
      teams: {
        Row: {
          id: string
          name: string
          slug: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          created_at?: string
          updated_at?: string
        }
      }
      poles: {
        Row: {
          id: string
          team_id: string | null
          name: string
          description: string | null
          color: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          team_id?: string | null
          name: string
          description?: string | null
          color?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          team_id?: string | null
          name?: string
          description?: string | null
          color?: string
          created_at?: string
          updated_at?: string
        }
      }
      users: {
        Row: {
          id: string
          team_id: string | null
          pole_id: string | null
          first_name: string
          last_name: string
          email: string
          role: 'owner' | 'admin' | 'member'
          avatar_color: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          team_id?: string | null
          pole_id?: string | null
          first_name: string
          last_name: string
          email: string
          role?: 'owner' | 'admin' | 'member'
          avatar_color?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          team_id?: string | null
          pole_id?: string | null
          first_name?: string
          last_name?: string
          email?: string
          role?: 'owner' | 'admin' | 'member'
          avatar_color?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      decisions: {
        Row: {
          id: string
          team_id: string | null
          pole_id: string | null
          creator_id: string
          title: string
          context: string | null
          deadline: string
          status: 'active' | 'completed' | 'archived'
          template_id: string | null
          completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          team_id?: string | null
          pole_id?: string | null
          creator_id: string
          title: string
          context?: string | null
          deadline: string
          status?: 'active' | 'completed' | 'archived'
          template_id?: string | null
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          team_id?: string | null
          pole_id?: string | null
          creator_id?: string
          title?: string
          context?: string | null
          deadline?: string
          status?: 'active' | 'completed' | 'archived'
          template_id?: string | null
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      vote_options: {
        Row: {
          id: string
          decision_id: string
          label: string
          position: number
          created_at: string
        }
        Insert: {
          id?: string
          decision_id: string
          label: string
          position?: number
          created_at?: string
        }
        Update: {
          id?: string
          decision_id?: string
          label?: string
          position?: number
          created_at?: string
        }
      }
      votes: {
        Row: {
          id: string
          decision_id: string
          option_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          decision_id: string
          option_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          decision_id?: string
          option_id?: string
          user_id?: string
          created_at?: string
        }
      }
      arguments: {
        Row: {
          id: string
          decision_id: string
          option_id: string
          user_id: string
          text: string
          mentions: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          decision_id: string
          option_id: string
          user_id: string
          text: string
          mentions?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          decision_id?: string
          option_id?: string
          user_id?: string
          text?: string
          mentions?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      decision_participants: {
        Row: {
          id: string
          decision_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          decision_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          decision_id?: string
          user_id?: string
          created_at?: string
        }
      }
      ai_summaries: {
        Row: {
          id: string
          decision_id: string
          result: string
          winning_option: string
          main_arguments: Json
          concerns: string[] | null
          recommendation: string
          created_at: string
        }
        Insert: {
          id?: string
          decision_id: string
          result: string
          winning_option: string
          main_arguments: Json
          concerns?: string[] | null
          recommendation: string
          created_at?: string
        }
        Update: {
          id?: string
          decision_id?: string
          result?: string
          winning_option?: string
          main_arguments?: Json
          concerns?: string[] | null
          recommendation?: string
          created_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          decision_id: string | null
          triggered_by_user_id: string | null
          type: string
          title: string
          message: string
          read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          decision_id?: string | null
          triggered_by_user_id?: string | null
          type: string
          title: string
          message: string
          read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          decision_id?: string | null
          triggered_by_user_id?: string | null
          type?: string
          title?: string
          message?: string
          read?: boolean
          created_at?: string
        }
      }
      audit_logs: {
        Row: {
          id: string
          user_id: string | null
          decision_id: string | null
          action: string
          details: string
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          decision_id?: string | null
          action: string
          details: string
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          decision_id?: string | null
          action?: string
          details?: string
          metadata?: Json | null
          created_at?: string
        }
      }
      pending_invites: {
        Row: {
          id: string
          team_id: string
          email: string
          role: 'admin' | 'member'
          invited_by_user_id: string
          expires_at: string
          created_at: string
        }
        Insert: {
          id?: string
          team_id: string
          email: string
          role?: 'admin' | 'member'
          invited_by_user_id: string
          expires_at: string
          created_at?: string
        }
        Update: {
          id?: string
          team_id?: string
          email?: string
          role?: 'admin' | 'member'
          invited_by_user_id?: string
          expires_at?: string
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
