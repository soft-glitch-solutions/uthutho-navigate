
export interface Stop {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  cost: number | null;
  created_at: string;
  updated_at: string;
  image_url: string | null;
  notes: string | null;
}

export interface Route {
  id: string;
  name: string;
}

export interface Hub {
  id: string;
  name: string;
}

export interface RouteStop {
  route_id: string;
  stop_id: string;
  order_number: number;
}

export interface HubStop {
  hub_id: string;
  stop_id: string;
  distance_meters: number | null;
}
