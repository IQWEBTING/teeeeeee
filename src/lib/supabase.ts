import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      girl_game_scores: {
        Row: {
          id: string;
          player_name: string;
          selections_used: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          player_name: string;
          selections_used: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          player_name?: string;
          selections_used?: number;
          created_at?: string;
        };
      };
      balloon_game_scores: {
        Row: {
          id: string;
          player_name: string;
          rows_used: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          player_name: string;
          rows_used: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          player_name?: string;
          rows_used?: number;
          created_at?: string;
        };
      };
      announcements: {
        Row: {
          id: string;
          announced_at: string;
          winners_json: Json;
        };
        Insert: {
          id?: string;
          announced_at?: string;
          winners_json: Json;
        };
        Update: {
          id?: string;
          announced_at?: string;
          winners_json?: Json;
        };
      };
    };
  };
}
