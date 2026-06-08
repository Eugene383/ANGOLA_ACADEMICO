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
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      anos_lectivos: {
        Row: {
          activo: boolean
          ano: string
          created_at: string
          id: string
        }
        Insert: {
          activo?: boolean
          ano: string
          created_at?: string
          id?: string
        }
        Update: {
          activo?: boolean
          ano?: string
          created_at?: string
          id?: string
        }
        Relationships: []
      }
      areas_conhecimento: {
        Row: {
          codigo_isced: string
          created_at: string
          id: string
          nome: string
          parent_id: string | null
        }
        Insert: {
          codigo_isced: string
          created_at?: string
          id?: string
          nome: string
          parent_id?: string | null
        }
        Update: {
          codigo_isced?: string
          created_at?: string
          id?: string
          nome?: string
          parent_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "areas_conhecimento_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "areas_conhecimento"
            referencedColumns: ["id"]
          },
        ]
      }
      cursos: {
        Row: {
          activo: boolean
          area_id: string
          created_at: string
          duracao_anos: number
          id: string
          ies_id: string
          nivel_id: string
          nome: string
          regime: Database["public"]["Enums"]["curso_regime"]
          updated_at: string
        }
        Insert: {
          activo?: boolean
          area_id: string
          created_at?: string
          duracao_anos: number
          id?: string
          ies_id: string
          nivel_id: string
          nome: string
          regime?: Database["public"]["Enums"]["curso_regime"]
          updated_at?: string
        }
        Update: {
          activo?: boolean
          area_id?: string
          created_at?: string
          duracao_anos?: number
          id?: string
          ies_id?: string
          nivel_id?: string
          nome?: string
          regime?: Database["public"]["Enums"]["curso_regime"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cursos_area_id_fkey"
            columns: ["area_id"]
            isOneToOne: false
            referencedRelation: "areas_conhecimento"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cursos_ies_id_fkey"
            columns: ["ies_id"]
            isOneToOne: false
            referencedRelation: "ies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cursos_nivel_id_fkey"
            columns: ["nivel_id"]
            isOneToOne: false
            referencedRelation: "niveis_ensino"
            referencedColumns: ["id"]
          },
        ]
      }
      graduados: {
        Row: {
          ano_lectivo_id: string
          created_at: string
          curso_id: string
          feminino: number
          id: string
          masculino: number
          total: number
          updated_at: string
        }
        Insert: {
          ano_lectivo_id: string
          created_at?: string
          curso_id: string
          feminino: number
          id?: string
          masculino: number
          total: number
          updated_at?: string
        }
        Update: {
          ano_lectivo_id?: string
          created_at?: string
          curso_id?: string
          feminino?: number
          id?: string
          masculino?: number
          total?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "graduados_ano_lectivo_id_fkey"
            columns: ["ano_lectivo_id"]
            isOneToOne: false
            referencedRelation: "anos_lectivos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "graduados_curso_id_fkey"
            columns: ["curso_id"]
            isOneToOne: false
            referencedRelation: "cursos"
            referencedColumns: ["id"]
          },
        ]
      }
      ies: {
        Row: {
          activa: boolean
          ano_fundacao: number | null
          created_at: string
          email: string | null
          id: string
          natureza: Database["public"]["Enums"]["ies_natureza"]
          nome: string
          provincia_id: string
          sigla: string
          tipo: Database["public"]["Enums"]["ies_tipo"]
          updated_at: string
          website: string | null
        }
        Insert: {
          activa?: boolean
          ano_fundacao?: number | null
          created_at?: string
          email?: string | null
          id?: string
          natureza: Database["public"]["Enums"]["ies_natureza"]
          nome: string
          provincia_id: string
          sigla: string
          tipo: Database["public"]["Enums"]["ies_tipo"]
          updated_at?: string
          website?: string | null
        }
        Update: {
          activa?: boolean
          ano_fundacao?: number | null
          created_at?: string
          email?: string | null
          id?: string
          natureza?: Database["public"]["Enums"]["ies_natureza"]
          nome?: string
          provincia_id?: string
          sigla?: string
          tipo?: Database["public"]["Enums"]["ies_tipo"]
          updated_at?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ies_provincia_id_fkey"
            columns: ["provincia_id"]
            isOneToOne: false
            referencedRelation: "provincias"
            referencedColumns: ["id"]
          },
        ]
      }
      ies_usuarios: {
        Row: {
          created_at: string
          id: string
          ies_id: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          ies_id: string
          role?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          ies_id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ies_usuarios_ies_id_fkey"
            columns: ["ies_id"]
            isOneToOne: false
            referencedRelation: "ies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ies_usuarios_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      inscritos: {
        Row: {
          ano_lectivo_id: string
          created_at: string
          curso_id: string
          feminino: number
          id: string
          masculino: number
          novos: number
          repetentes: number
          total: number
          updated_at: string
        }
        Insert: {
          ano_lectivo_id: string
          created_at?: string
          curso_id: string
          feminino: number
          id?: string
          masculino: number
          novos: number
          repetentes: number
          total: number
          updated_at?: string
        }
        Update: {
          ano_lectivo_id?: string
          created_at?: string
          curso_id?: string
          feminino?: number
          id?: string
          masculino?: number
          novos?: number
          repetentes?: number
          total?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "inscritos_ano_lectivo_id_fkey"
            columns: ["ano_lectivo_id"]
            isOneToOne: false
            referencedRelation: "anos_lectivos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inscritos_curso_id_fkey"
            columns: ["curso_id"]
            isOneToOne: false
            referencedRelation: "cursos"
            referencedColumns: ["id"]
          },
        ]
      }
      niveis_ensino: {
        Row: {
          codigo_isced: string
          created_at: string
          id: string
          nome: string
          ordem: number
        }
        Insert: {
          codigo_isced: string
          created_at?: string
          id?: string
          nome: string
          ordem: number
        }
        Update: {
          codigo_isced?: string
          created_at?: string
          id?: string
          nome?: string
          ordem?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          nome: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          id: string
          nome?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          nome?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
      provincias: {
        Row: {
          codigo: string
          created_at: string
          id: string
          latitude: number | null
          longitude: number | null
          nome: string
        }
        Insert: {
          codigo: string
          created_at?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          nome: string
        }
        Update: {
          codigo?: string
          created_at?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          nome?: string
        }
        Relationships: []
      }
      vagas: {
        Row: {
          ano_lectivo_id: string
          created_at: string
          curso_id: string
          id: string
          updated_at: string
          vagas_ofertadas: number
          vagas_preenchidas: number
        }
        Insert: {
          ano_lectivo_id: string
          created_at?: string
          curso_id: string
          id?: string
          updated_at?: string
          vagas_ofertadas: number
          vagas_preenchidas: number
        }
        Update: {
          ano_lectivo_id?: string
          created_at?: string
          curso_id?: string
          id?: string
          updated_at?: string
          vagas_ofertadas?: number
          vagas_preenchidas?: number
        }
        Relationships: [
          {
            foreignKeyName: "vagas_ano_lectivo_id_fkey"
            columns: ["ano_lectivo_id"]
            isOneToOne: false
            referencedRelation: "anos_lectivos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vagas_curso_id_fkey"
            columns: ["curso_id"]
            isOneToOne: false
            referencedRelation: "cursos"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
    }
    Enums: {
      curso_regime: "presencial" | "a_distancia" | "misto"
      ies_natureza: "publica" | "privada" | "publica_privada"
      ies_tipo:
        | "universidade"
        | "instituto_superior"
        | "escola_superior"
        | "academia"
      user_role: "admin" | "gestor_ies" | "publico"
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      curso_regime: ["presencial", "a_distancia", "misto"],
      ies_natureza: ["publica", "privada", "publica_privada"],
      ies_tipo: [
        "universidade",
        "instituto_superior",
        "escola_superior",
        "academia",
      ],
      user_role: ["admin", "gestor_ies", "publico"],
    },
  },
} as const
