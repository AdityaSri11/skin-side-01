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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      derm: {
        Row: {
          Age_group: string | null
          Conditions: string | null
          Description: string | null
          Endpoint: string | null
          Gender: string | null
          Number: string
          Phase: string | null
          Product: string | null
          Sponsor: string
          Status: string | null
        }
        Insert: {
          Age_group?: string | null
          Conditions?: string | null
          Description?: string | null
          Endpoint?: string | null
          Gender?: string | null
          Number: string
          Phase?: string | null
          Product?: string | null
          Sponsor: string
          Status?: string | null
        }
        Update: {
          Age_group?: string | null
          Conditions?: string | null
          Description?: string | null
          Endpoint?: string | null
          Gender?: string | null
          Number?: string
          Phase?: string | null
          Product?: string | null
          Sponsor?: string
          Status?: string | null
        }
        Relationships: []
      }
      test: {
        Row: {
          id: string
          school: string
        }
        Insert: {
          id?: string
          school: string
        }
        Update: {
          id?: string
          school?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          address: string | null
          alcohol_intake: string | null
          allergies: string | null
          condition_stage_severity: string | null
          created_at: string
          current_prescription_medications: string | null
          date_of_birth: string
          date_of_diagnosis: string | null
          email_address: string
          existing_medical_conditions: string | null
          first_name: string
          gender: string | null
          id: string
          immunization_status: string | null
          last_name: string
          other_substances: string | null
          over_counter_medications: string | null
          phone_number: string | null
          pregnant_breastfeeding: string | null
          previous_medical_conditions: string | null
          previous_surgical_history: string | null
          primary_condition: string | null
          prior_clinical_trials: string | null
          recent_medication_changes: string | null
          recent_test_results: string | null
          smoke_history: string | null
          treatments_for_condition: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          alcohol_intake?: string | null
          allergies?: string | null
          condition_stage_severity?: string | null
          created_at?: string
          current_prescription_medications?: string | null
          date_of_birth: string
          date_of_diagnosis?: string | null
          email_address: string
          existing_medical_conditions?: string | null
          first_name: string
          gender?: string | null
          id?: string
          immunization_status?: string | null
          last_name: string
          other_substances?: string | null
          over_counter_medications?: string | null
          phone_number?: string | null
          pregnant_breastfeeding?: string | null
          previous_medical_conditions?: string | null
          previous_surgical_history?: string | null
          primary_condition?: string | null
          prior_clinical_trials?: string | null
          recent_medication_changes?: string | null
          recent_test_results?: string | null
          smoke_history?: string | null
          treatments_for_condition?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          alcohol_intake?: string | null
          allergies?: string | null
          condition_stage_severity?: string | null
          created_at?: string
          current_prescription_medications?: string | null
          date_of_birth?: string
          date_of_diagnosis?: string | null
          email_address?: string
          existing_medical_conditions?: string | null
          first_name?: string
          gender?: string | null
          id?: string
          immunization_status?: string | null
          last_name?: string
          other_substances?: string | null
          over_counter_medications?: string | null
          phone_number?: string | null
          pregnant_breastfeeding?: string | null
          previous_medical_conditions?: string | null
          previous_surgical_history?: string | null
          primary_condition?: string | null
          prior_clinical_trials?: string | null
          recent_medication_changes?: string | null
          recent_test_results?: string | null
          smoke_history?: string | null
          treatments_for_condition?: string | null
          updated_at?: string
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
      [_ in never]: never
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
    Enums: {},
  },
} as const
