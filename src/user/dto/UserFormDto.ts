export interface UserFormDto {
  id: string | null;
  nickname: string;
  email: string;
  password: string;
  confirmPassword?: string;
  isActive: string;
}
