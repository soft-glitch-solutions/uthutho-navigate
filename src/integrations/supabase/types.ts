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
      activity_logs: {
        Row: {
          action: string
          created_at: string | null
          details: Json | null
          id: string
          ip_address: string | null
          page_url: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: string | null
          page_url?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: string | null
          page_url?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      blogs: {
        Row: {
          author_id: string
          content: string
          created_at: string | null
          id: string
          published_at: string | null
          status: string
          tags: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string | null
          id?: string
          published_at?: string | null
          status?: string
          tags?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string | null
          id?: string
          published_at?: string | null
          status?: string
          tags?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      deployment_logs: {
        Row: {
          changes: string[] | null
          completed_at: string | null
          created_at: string | null
          deployed_by: string | null
          id: string
          status: string
          version: string | null
        }
        Insert: {
          changes?: string[] | null
          completed_at?: string | null
          created_at?: string | null
          deployed_by?: string | null
          id?: string
          status: string
          version?: string | null
        }
        Update: {
          changes?: string[] | null
          completed_at?: string | null
          created_at?: string | null
          deployed_by?: string | null
          id?: string
          status?: string
          version?: string | null
        }
        Relationships: []
      }
      help_documentation: {
        Row: {
          content: string
          created_at: string | null
          created_by: string | null
          id: string
          status: string
          tags: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          status?: string
          tags?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          status?: string
          tags?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      hub_posts: {
        Row: {
          content: string
          created_at: string | null
          hub_id: string
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          hub_id: string
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          hub_id?: string
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "hub_posts_hub_id_fkey"
            columns: ["hub_id"]
            isOneToOne: false
            referencedRelation: "hubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hub_posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      hub_requests: {
        Row: {
          address: string
          created_at: string
          description: string | null
          id: string
          latitude: number
          longitude: number
          name: string
          status: string | null
          transport_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          address: string
          created_at?: string
          description?: string | null
          id?: string
          latitude: number
          longitude: number
          name: string
          status?: string | null
          transport_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string
          created_at?: string
          description?: string | null
          id?: string
          latitude?: number
          longitude?: number
          name?: string
          status?: string | null
          transport_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      hubs: {
        Row: {
          address: string | null
          created_at: string | null
          id: string
          image: string | null
          latitude: number
          longitude: number
          name: string
          transport_type: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          id?: string
          image?: string | null
          latitude: number
          longitude: number
          name: string
          transport_type?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          id?: string
          image?: string | null
          latitude?: number
          longitude?: number
          name?: string
          transport_type?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      login_streaks: {
        Row: {
          created_at: string
          current_streak: number
          id: string
          last_login: string
          max_streak: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_streak?: number
          id?: string
          last_login?: string
          max_streak?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_streak?: number
          id?: string
          last_login?: string
          max_streak?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "login_streaks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      mission_progress: {
        Row: {
          created_at: string
          current_count: number
          id: string
          is_completed: boolean
          last_updated: string
          mission_id: string
          reward_claimed: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_count?: number
          id?: string
          is_completed?: boolean
          last_updated?: string
          mission_id: string
          reward_claimed?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_count?: number
          id?: string
          is_completed?: boolean
          last_updated?: string
          mission_id?: string
          reward_claimed?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mission_progress_mission_id_fkey"
            columns: ["mission_id"]
            isOneToOne: false
            referencedRelation: "missions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mission_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      missions: {
        Row: {
          created_at: string
          description: string
          id: string
          points_reward: number
          requirement_count: number
          requirement_type: string
          title: string
          title_reward: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          points_reward: number
          requirement_count: number
          requirement_type: string
          title: string
          title_reward?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          points_reward?: number
          requirement_count?: number
          requirement_type?: string
          title?: string
          title_reward?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      nearby_spots: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          distance_meters: number | null
          id: string
          image_url: string | null
          latitude: number
          longitude: number
          name: string
          stop_id: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          distance_meters?: number | null
          id?: string
          image_url?: string | null
          latitude: number
          longitude: number
          name: string
          stop_id: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          distance_meters?: number | null
          id?: string
          image_url?: string | null
          latitude?: number
          longitude?: number
          name?: string
          stop_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "nearby_spots_stop_id_fkey"
            columns: ["stop_id"]
            isOneToOne: false
            referencedRelation: "stops"
            referencedColumns: ["id"]
          },
        ]
      }
      post_comments: {
        Row: {
          content: string
          created_at: string | null
          hub_post: string | null
          id: string
          stop_post: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          hub_post?: string | null
          id?: string
          stop_post?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          hub_post?: string | null
          id?: string
          stop_post?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_comments_hub_post_fkey"
            columns: ["hub_post"]
            isOneToOne: false
            referencedRelation: "hub_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_comments_stop_post_fkey"
            columns: ["stop_post"]
            isOneToOne: false
            referencedRelation: "stop_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      post_reactions: {
        Row: {
          created_at: string | null
          id: string
          post_hub_id: string | null
          post_stop_id: string | null
          reaction_type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          post_hub_id?: string | null
          post_stop_id?: string | null
          reaction_type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          post_hub_id?: string | null
          post_stop_id?: string | null
          reaction_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_reactions_post_hub_id_fkey"
            columns: ["post_hub_id"]
            isOneToOne: false
            referencedRelation: "hub_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_reactions_post_stop_id_fkey"
            columns: ["post_stop_id"]
            isOneToOne: false
            referencedRelation: "stop_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_reactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      price_change_requests: {
        Row: {
          created_at: string | null
          current_price: number
          id: string
          new_price: number
          route_id: string
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          current_price: number
          id?: string
          new_price: number
          route_id: string
          status?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          current_price?: number
          id?: string
          new_price?: number
          route_id?: string
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "price_change_requests_route_id_fkey"
            columns: ["route_id"]
            isOneToOne: false
            referencedRelation: "routes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "price_change_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          favorites: Json | null
          first_name: string | null
          id: string
          last_name: string | null
          points: number | null
          preferred_transport: string | null
          selected_title: string | null
          titles: string[] | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          favorites?: Json | null
          first_name?: string | null
          id: string
          last_name?: string | null
          points?: number | null
          preferred_transport?: string | null
          selected_title?: string | null
          titles?: string[] | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          favorites?: Json | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          points?: number | null
          preferred_transport?: string | null
          selected_title?: string | null
          titles?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      route_requests: {
        Row: {
          cost: number | null
          created_at: string
          description: string | null
          end_point: string
          id: string
          start_point: string
          status: string | null
          transport_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          cost?: number | null
          created_at?: string
          description?: string | null
          end_point: string
          id?: string
          start_point: string
          status?: string | null
          transport_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          cost?: number | null
          created_at?: string
          description?: string | null
          end_point?: string
          id?: string
          start_point?: string
          status?: string | null
          transport_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "route_requests_end_point_fkey"
            columns: ["end_point"]
            isOneToOne: false
            referencedRelation: "hubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "route_requests_start_point_fkey"
            columns: ["start_point"]
            isOneToOne: false
            referencedRelation: "hubs"
            referencedColumns: ["id"]
          },
        ]
      }
      route_stops: {
        Row: {
          created_at: string | null
          id: string
          order_number: number
          route_id: string
          stop_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          order_number: number
          route_id: string
          stop_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          order_number?: number
          route_id?: string
          stop_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "route_stops_route_id_fkey"
            columns: ["route_id"]
            isOneToOne: false
            referencedRelation: "routes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "route_stops_stop_id_fkey"
            columns: ["stop_id"]
            isOneToOne: false
            referencedRelation: "stops"
            referencedColumns: ["id"]
          },
        ]
      }
      routes: {
        Row: {
          cost: number
          created_at: string | null
          end_point: string
          hub_id: string | null
          id: string
          name: string
          start_point: string
          transport_type: string
          updated_at: string | null
        }
        Insert: {
          cost: number
          created_at?: string | null
          end_point: string
          hub_id?: string | null
          id?: string
          name: string
          start_point: string
          transport_type: string
          updated_at?: string | null
        }
        Update: {
          cost?: number
          created_at?: string | null
          end_point?: string
          hub_id?: string | null
          id?: string
          name?: string
          start_point?: string
          transport_type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_hub"
            columns: ["hub_id"]
            isOneToOne: false
            referencedRelation: "hubs"
            referencedColumns: ["id"]
          },
        ]
      }
      stop_busy_times: {
        Row: {
          busyness_level: number
          created_at: string | null
          day_of_week: number
          hour_of_day: number
          id: string
          safety_level: number
          stop_id: string
          updated_at: string | null
        }
        Insert: {
          busyness_level: number
          created_at?: string | null
          day_of_week: number
          hour_of_day: number
          id?: string
          safety_level: number
          stop_id: string
          updated_at?: string | null
        }
        Update: {
          busyness_level?: number
          created_at?: string | null
          day_of_week?: number
          hour_of_day?: number
          id?: string
          safety_level?: number
          stop_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stop_busy_times_stop_id_fkey"
            columns: ["stop_id"]
            isOneToOne: false
            referencedRelation: "stops"
            referencedColumns: ["id"]
          },
        ]
      }
      stop_posts: {
        Row: {
          content: string
          created_at: string | null
          id: string
          route_id: string | null
          stop_id: string
          transport_waiting_for: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          route_id?: string | null
          stop_id: string
          transport_waiting_for?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          route_id?: string | null
          stop_id?: string
          transport_waiting_for?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "stop_posts_route_id_fkey"
            columns: ["route_id"]
            isOneToOne: false
            referencedRelation: "routes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stop_posts_stop_id_fkey"
            columns: ["stop_id"]
            isOneToOne: false
            referencedRelation: "stops"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stop_posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      stop_requests: {
        Row: {
          cost: number | null
          created_at: string
          description: string | null
          id: string
          latitude: number
          longitude: number
          name: string
          route_id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          cost?: number | null
          created_at?: string
          description?: string | null
          id?: string
          latitude: number
          longitude: number
          name: string
          route_id: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          cost?: number | null
          created_at?: string
          description?: string | null
          id?: string
          latitude?: number
          longitude?: number
          name?: string
          route_id?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "stop_requests_route_id_fkey"
            columns: ["route_id"]
            isOneToOne: false
            referencedRelation: "routes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stop_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      stop_waiting: {
        Row: {
          created_at: string | null
          expires_at: string
          id: string
          route_id: string | null
          stop_id: string
          transport_type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          expires_at?: string
          id?: string
          route_id?: string | null
          stop_id: string
          transport_type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          expires_at?: string
          id?: string
          route_id?: string | null
          stop_id?: string
          transport_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "stop_waiting_route_id_fkey"
            columns: ["route_id"]
            isOneToOne: false
            referencedRelation: "routes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stop_waiting_stop_id_fkey"
            columns: ["stop_id"]
            isOneToOne: false
            referencedRelation: "stops"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stop_waiting_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      stops: {
        Row: {
          cost: number | null
          created_at: string | null
          id: string
          image_url: string | null
          latitude: number
          longitude: number
          name: string
          order_number: number
          route_id: string
          updated_at: string | null
        }
        Insert: {
          cost?: number | null
          created_at?: string | null
          id?: string
          image_url?: string | null
          latitude: number
          longitude: number
          name: string
          order_number: number
          route_id: string
          updated_at?: string | null
        }
        Update: {
          cost?: number | null
          created_at?: string | null
          id?: string
          image_url?: string | null
          latitude?: number
          longitude?: number
          name?: string
          order_number?: number
          route_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_route"
            columns: ["route_id"]
            isOneToOne: false
            referencedRelation: "routes"
            referencedColumns: ["id"]
          },
        ]
      }
      support_tickets: {
        Row: {
          assigned_to: string | null
          created_at: string | null
          created_by: string
          description: string
          id: string
          priority: string
          status: string
          title: string
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string | null
          created_by: string
          description: string
          id?: string
          priority?: string
          status?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          created_at?: string | null
          created_by?: string
          description?: string
          id?: string
          priority?: string
          status?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      ticket_comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          ticket_id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          ticket_id: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          ticket_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ticket_comments_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "support_tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      titles: {
        Row: {
          created_at: string | null
          id: number
          points_required: number
          title: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          points_required: number
          title: string
        }
        Update: {
          created_at?: string | null
          id?: number
          points_required?: number
          title?: string
        }
        Relationships: []
      }
      traffic_reports: {
        Row: {
          created_at: string | null
          description: string
          hub_id: string | null
          id: string
          incident_time: string | null
          incident_type: string
          location: string
          reporter_id: string | null
          status: Database["public"]["Enums"]["report_status"] | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          hub_id?: string | null
          id?: string
          incident_time?: string | null
          incident_type: string
          location: string
          reporter_id?: string | null
          status?: Database["public"]["Enums"]["report_status"] | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          hub_id?: string | null
          id?: string
          incident_time?: string | null
          incident_type?: string
          location?: string
          reporter_id?: string | null
          status?: Database["public"]["Enums"]["report_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "traffic_reports_hub_id_fkey"
            columns: ["hub_id"]
            isOneToOne: false
            referencedRelation: "hubs"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      webhooks: {
        Row: {
          created_at: string | null
          description: string | null
          events: string[]
          id: string
          is_active: boolean | null
          last_triggered: string | null
          secret: string
          url: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          events: string[]
          id?: string
          is_active?: boolean | null
          last_triggered?: string | null
          secret: string
          url: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          events?: string[]
          id?: string
          is_active?: boolean | null
          last_triggered?: string | null
          secret?: string
          url?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cleanup_expired_waiting: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      cleanup_old_posts: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      get_user_email: {
        Args: { user_id: string }
        Returns: string
      }
      handle_login_streak: {
        Args: { input_user_id: string }
        Returns: {
          current_streak: number
          max_streak: number
          points_earned: number
        }[]
      }
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
      report_status: "pending" | "approved" | "rejected"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
      report_status: ["pending", "approved", "rejected"],
    },
  },
} as const
