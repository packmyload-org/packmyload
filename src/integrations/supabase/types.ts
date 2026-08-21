export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      artisan_requests: {
        Row: {
          address: string | null
          artisan_id: string | null
          created_at: string
          details: string | null
          email: string | null
          full_name: string
          id: string
          phone: string
          preferred_date: string | null
          status: string
          trade: string
        }
        Insert: {
          address?: string | null
          artisan_id?: string | null
          created_at?: string
          details?: string | null
          email?: string | null
          full_name: string
          id?: string
          phone: string
          preferred_date?: string | null
          status?: string
          trade: string
        }
        Update: {
          address?: string | null
          artisan_id?: string | null
          created_at?: string
          details?: string | null
          email?: string | null
          full_name?: string
          id?: string
          phone?: string
          preferred_date?: string | null
          status?: string
          trade?: string
        }
        Relationships: [
          {
            foreignKeyName: "artisan_requests_artisan_id_fkey"
            columns: ["artisan_id"]
            isOneToOne: false
            referencedRelation: "artisans"
            referencedColumns: ["id"]
          },
        ]
      }
      artisans: {
        Row: {
          bio: string | null
          created_at: string
          full_name: string
          id: string
          is_active: boolean
          is_verified: boolean
          phone: string
          photo_url: string | null
          rate_max: number | null
          rate_min: number | null
          rate_unit: string
          service_areas: string[]
          trade: string
          updated_at: string
          whatsapp: string | null
        }
        Insert: {
          bio?: string | null
          created_at?: string
          full_name: string
          id?: string
          is_active?: boolean
          is_verified?: boolean
          phone: string
          photo_url?: string | null
          rate_max?: number | null
          rate_min?: number | null
          rate_unit?: string
          service_areas?: string[]
          trade: string
          updated_at?: string
          whatsapp?: string | null
        }
        Update: {
          bio?: string | null
          created_at?: string
          full_name?: string
          id?: string
          is_active?: boolean
          is_verified?: boolean
          phone?: string
          photo_url?: string | null
          rate_max?: number | null
          rate_min?: number | null
          rate_unit?: string
          service_areas?: string[]
          trade?: string
          updated_at?: string
          whatsapp?: string | null
        }
        Relationships: []
      }
      bookings: {
        Row: {
          arrival_window: string | null
          created_at: string
          deposit_amount: number | null
          destination_address: string | null
          destination_floor: string | null
          email: string | null
          estimate_max: number | null
          estimate_min: number | null
          full_name: string
          id: string
          is_quick_request: boolean
          move_size: string | null
          moving_date: string | null
          notes: string | null
          payment_reference: string | null
          payment_status: string
          phone: string
          photo_paths: string[]
          pickup_address: string
          pickup_floor: string | null
          reference: string
          service: string
          status: string
          survey_fee: number | null
          survey_requested: boolean
        }
        Insert: {
          arrival_window?: string | null
          created_at?: string
          deposit_amount?: number | null
          destination_address?: string | null
          destination_floor?: string | null
          email?: string | null
          estimate_max?: number | null
          estimate_min?: number | null
          full_name: string
          id?: string
          is_quick_request?: boolean
          move_size?: string | null
          moving_date?: string | null
          notes?: string | null
          payment_reference?: string | null
          payment_status?: string
          phone: string
          photo_paths?: string[]
          pickup_address: string
          pickup_floor?: string | null
          reference: string
          service: string
          status?: string
          survey_fee?: number | null
          survey_requested?: boolean
        }
        Update: {
          arrival_window?: string | null
          created_at?: string
          deposit_amount?: number | null
          destination_address?: string | null
          destination_floor?: string | null
          email?: string | null
          estimate_max?: number | null
          estimate_min?: number | null
          full_name?: string
          id?: string
          is_quick_request?: boolean
          move_size?: string | null
          moving_date?: string | null
          notes?: string | null
          payment_reference?: string | null
          payment_status?: string
          phone?: string
          photo_paths?: string[]
          pickup_address?: string
          pickup_floor?: string | null
          reference?: string
          service?: string
          status?: string
          survey_fee?: number | null
          survey_requested?: boolean
        }
        Relationships: []
      }
      lead_inquiries: {
        Row: {
          created_at: string
          destination_address: string
          destination_floor: string | null
          email: string
          full_name: string
          id: string
          moving_date: string | null
          notes: string | null
          phone: string
          pickup_address: string
          pickup_floor: string | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          destination_address: string
          destination_floor?: string | null
          email: string
          full_name: string
          id?: string
          moving_date?: string | null
          notes?: string | null
          phone: string
          pickup_address: string
          pickup_floor?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          destination_address?: string
          destination_floor?: string | null
          email?: string
          full_name?: string
          id?: string
          moving_date?: string | null
          notes?: string | null
          phone?: string
          pickup_address?: string
          pickup_floor?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      outbound_clicks: {
        Row: {
          created_at: string
          destination: string
          id: string
          label: string | null
          referrer: string | null
          source_path: string | null
          utm: Json | null
        }
        Insert: {
          created_at?: string
          destination: string
          id?: string
          label?: string | null
          referrer?: string | null
          source_path?: string | null
          utm?: Json | null
        }
        Update: {
          created_at?: string
          destination?: string
          id?: string
          label?: string | null
          referrer?: string | null
          source_path?: string | null
          utm?: Json | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
