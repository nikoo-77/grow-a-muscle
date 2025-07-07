export interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  gender?: string;
  experience_level?: string;
  workout_time?: string;
  fitness_goal: string;
  created_at: string;
  last_login: string;
  height?: number | null;
  weight?: number | null;
  medical_info?: string;
  emergency_contacts?: unknown;
  profile_picture?: string;
} 