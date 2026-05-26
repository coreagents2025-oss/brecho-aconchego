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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      banners: {
        Row: {
          ativo: boolean
          created_at: string
          id: string
          imagem_url: string
          link_url: string
          ordem: number
          subtitulo: string
          titulo: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          id?: string
          imagem_url?: string
          link_url?: string
          ordem?: number
          subtitulo?: string
          titulo?: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          created_at?: string
          id?: string
          imagem_url?: string
          link_url?: string
          ordem?: number
          subtitulo?: string
          titulo?: string
          updated_at?: string
        }
        Relationships: []
      }
      page_visits: {
        Row: {
          created_at: string
          id: string
          path: string
          referrer: string | null
          session_id: string
          source: string | null
          user_agent: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          path: string
          referrer?: string | null
          session_id: string
          source?: string | null
          user_agent?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          path?: string
          referrer?: string | null
          session_id?: string
          source?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      popup: {
        Row: {
          ativo: boolean
          created_at: string
          cta_texto: string
          cta_url: string
          id: string
          imagem_url: string
          mensagem: string
          titulo: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          cta_texto?: string
          cta_url?: string
          id?: string
          imagem_url?: string
          mensagem?: string
          titulo?: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          created_at?: string
          cta_texto?: string
          cta_url?: string
          id?: string
          imagem_url?: string
          mensagem?: string
          titulo?: string
          updated_at?: string
        }
        Relationships: []
      }
      product_views: {
        Row: {
          created_at: string
          id: string
          product_codigo: string
          session_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_codigo: string
          session_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_codigo?: string
          session_id?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          categoria: string
          codigo: string
          condicao: string | null
          cor: string | null
          created_at: string
          descricao: string | null
          id: string
          marca: string | null
          medidas: string | null
          nome: string
          preco_brl: number
          status: string
          tag: string[] | null
          tamanho: string | null
          tecido: string | null
          updated_at: string
          url_capa: string | null
          url_galeria_1: string | null
          url_galeria_2: string | null
          url_galeria_3: string | null
          url_video: string | null
        }
        Insert: {
          categoria?: string
          codigo: string
          condicao?: string | null
          cor?: string | null
          created_at?: string
          descricao?: string | null
          id?: string
          marca?: string | null
          medidas?: string | null
          nome: string
          preco_brl?: number
          status?: string
          tag?: string[] | null
          tamanho?: string | null
          tecido?: string | null
          updated_at?: string
          url_capa?: string | null
          url_galeria_1?: string | null
          url_galeria_2?: string | null
          url_galeria_3?: string | null
          url_video?: string | null
        }
        Update: {
          categoria?: string
          codigo?: string
          condicao?: string | null
          cor?: string | null
          created_at?: string
          descricao?: string | null
          id?: string
          marca?: string | null
          medidas?: string | null
          nome?: string
          preco_brl?: number
          status?: string
          tag?: string[] | null
          tamanho?: string | null
          tecido?: string | null
          updated_at?: string
          url_capa?: string | null
          url_galeria_1?: string | null
          url_galeria_2?: string | null
          url_galeria_3?: string | null
          url_video?: string | null
        }
        Relationships: []
      }
      sales: {
        Row: {
          buyer_contact: string | null
          buyer_name: string | null
          channel: string
          created_at: string
          final_price: number
          id: string
          notes: string | null
          product_codigo: string
          sold_at: string
        }
        Insert: {
          buyer_contact?: string | null
          buyer_name?: string | null
          channel?: string
          created_at?: string
          final_price?: number
          id?: string
          notes?: string | null
          product_codigo: string
          sold_at?: string
        }
        Update: {
          buyer_contact?: string | null
          buyer_name?: string | null
          channel?: string
          created_at?: string
          final_price?: number
          id?: string
          notes?: string | null
          product_codigo?: string
          sold_at?: string
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
      whatsapp_clicks: {
        Row: {
          created_at: string
          id: string
          product_codigo: string | null
          session_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_codigo?: string | null
          session_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_codigo?: string | null
          session_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      daily_visits: {
        Args: { days?: number }
        Returns: {
          dia: string
          total: number
          unicos: number
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      top_products: {
        Args: { days?: number }
        Returns: {
          nome: string
          product_codigo: string
          url_capa: string
          views: number
          wa_clicks: number
        }[]
      }
      traffic_sources: {
        Args: { days?: number }
        Returns: {
          source: string
          total: number
        }[]
      }
      whatsapp_conversion: {
        Args: { days?: number }
        Returns: {
          total_clicks: number
          total_views: number
        }[]
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
      app_role: ["admin", "user"],
    },
  },
} as const
