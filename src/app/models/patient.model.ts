export interface Patient {
  id: number;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: 'Male' | 'Female';
  phone: string;
  email?: string;
  address: string;
  national_id: string;
  created_at?: string;
  updated_at?: string;
}
