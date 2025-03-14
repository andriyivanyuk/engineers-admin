export interface RegistrationCode {
  code: string;
  is_used: boolean;
  created_at: string;
  expires_at?: string;
}
