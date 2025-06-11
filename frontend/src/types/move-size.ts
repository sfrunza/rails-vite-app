export interface MoveSize {
  id: number
  name: string
  description: string
  index: number
  dispersion: number
  truck_count: number
  weight: number;
  volume: number;
  volume_with_dispersion: number;
  crew_size_settings: number[][];
  image_url: string | null;
};
