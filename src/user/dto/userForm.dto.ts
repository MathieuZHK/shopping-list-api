import { IsEmail, IsNotEmpty } from 'class-validator';

export class UserFormDto {
  @IsNotEmpty()
  nickname: string;
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  password: string;
  isActive: boolean;
}
