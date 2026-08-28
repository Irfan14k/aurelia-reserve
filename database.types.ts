/**
 * Hand-maintained types mirroring supabase/migrations/*.sql.
 *
 * If you later run `supabase gen types typescript`, replace this file with the
 * generated output — the rest of the app only depends on the shape below.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type InquiryStatus = "new" | "contacted" | "qualified" | "closed";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          full_name: string | null;
          phone: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          full_name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          email?: string | null;
          full_name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };

      residences: {
        Row: {
          id: string;
          numeral: string;
          name: string;
          beds: string;
          size_sqft: number;
          availability: number;
          total: number;
          collection: string;
          description: string;
          image_url: string | null;
          features: string[];
          display_order: number;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          numeral: string;
          name: string;
          beds: string;
          size_sqft: number;
          availability?: number;
          total?: number;
          collection: string;
          description?: string;
          image_url?: string | null;
          features?: string[];
          display_order?: number;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          numeral?: string;
          name?: string;
          beds?: string;
          size_sqft?: number;
          availability?: number;
          total?: number;
          collection?: string;
          description?: string;
          image_url?: string | null;
          features?: string[];
          display_order?: number;
          is_published?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };

      inquiries: {
        Row: {
          id: string;
          residence_id: string | null;
          user_id: string | null;
          first_name: string;
          last_name: string;
          email: string;
          phone: string | null;
          message: string | null;
          status: InquiryStatus;
          source: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          residence_id?: string | null;
          user_id?: string | null;
          first_name: string;
          last_name: string;
          email: string;
          phone?: string | null;
          message?: string | null;
          status?: InquiryStatus;
          source?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          residence_id?: string | null;
          user_id?: string | null;
          first_name?: string;
          last_name?: string;
          email?: string;
          phone?: string | null;
          message?: string | null;
          status?: InquiryStatus;
          source?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<never, never>;
    Functions: Record<never, never>;
    Enums: {
      inquiry_status: InquiryStatus;
    };
    CompositeTypes: Record<never, never>;
  };
}

/** Convenience row aliases. */
export type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
export type ResidenceRow = Database["public"]["Tables"]["residences"]["Row"];
export type InquiryRow = Database["public"]["Tables"]["inquiries"]["Row"];
