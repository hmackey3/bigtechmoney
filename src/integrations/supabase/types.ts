export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {

      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          system_account_id: string | null
          timezone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          system_account_id?: string | null
          timezone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          system_account_id?: string | null
          timezone?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_system_account_id_fkey"
            columns: ["system_account_id"]
            isOneToOne: false
            referencedRelation: "system_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      accept_system_invitation: {
        Args: {
          p_invitation_token: string
        }
        Returns: boolean
      }
      fetch_audit_log: {

        Returns: {
          id: string
          action_type: string
          description: string | null
          ip_address: string | null
          metadata: Json | null
          created_at: string
        }[]
      }
      delete_user_account:
      | {
        Args: {
          new_owner_id?: string
        }
        Returns: boolean
      }
      | {
        Args: {
          user_id_param: string
          new_owner_id?: string
        }
        Returns: boolean
      }
      get_age_distribution: {
        Args: {
          p_system_account_id: string
        }
        Returns: {
          age_range: string
          count: number
        }[]
      }
      get_employment_time_distribution: {
        Args: {
          p_system_account_id: string
        }
        Returns: {
          emp_range: string
          count: number
        }[]
      }
      get_event_distribution: {
        Args: {
          p_system_account_id: string
        }
        Returns: {
          month: string
          birthdays: number
          workiversaries: number
        }[]
      }
      get_system_members: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          user_id: string
          email: string
          role: string
          status: string
          system_account_id: string
          invitation_token: string
          invited_by: string
          invited_at: string
          created_at: string
          updated_at: string
          full_name: string
        }[]
      }
      get_team_growth: {
        Args: {
          p_system_account_id: string
        }
        Returns: {
          date: string
          count: number
        }[]
      }
      get_team_insights: {
        Args: {
          p_system_account_id: string
        }
        Returns: {
          total_members: number
          average_employment_time: number
          average_age: number
          gender_ratio: number
        }[]
      }
      get_upcoming_events: {
        Args: {
          p_system_account_id: string
        }
        Returns: {
          id: string
          name: string
          date: string
          days_until: number
          event_type: string
          age: number
          years_at_company: number
        }[]
      }
      get_user_system_account_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_user_timezone: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      invite_system_member: {
        Args: {
          member_email: string
          member_role: string
        }
        Returns: string
      }
      is_system_owner_or_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      transfer_system_ownership: {
        Args: {
          new_owner_id: string
        }
        Returns: boolean
      }
      update_system_member_role: {
        Args: {
          member_id: string
          new_role: string
        }
        Returns: boolean
      }
      update_system_member_status: {
        Args: {
          member_id: string
          new_status: string
        }
        Returns: boolean
      }
      update_user_timezone: {
        Args: {
          new_timezone: string
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
  | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
  | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
  ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
    Database[PublicTableNameOrOptions["schema"]]["Views"])
  : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
    Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
  ? R
  : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
    PublicSchema["Views"])
  ? (PublicSchema["Tables"] &
    PublicSchema["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
  ? R
  : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
  | keyof PublicSchema["Tables"]
  | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
  ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
  : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Insert: infer I
  }
  ? I
  : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
    Insert: infer I
  }
  ? I
  : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
  | keyof PublicSchema["Tables"]
  | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
  ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
  : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Update: infer U
  }
  ? U
  : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
    Update: infer U
  }
  ? U
  : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
  | keyof PublicSchema["Enums"]
  | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
  ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
  : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
  ? PublicSchema["Enums"][PublicEnumNameOrOptions]
  : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
  | keyof PublicSchema["CompositeTypes"]
  | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
  ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
  : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
  ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never
