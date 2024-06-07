import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class RequestUpdateProfileDto {
  @IsOptional()
  @IsNotEmpty()
  username: string;
  @IsOptional()
  about: string;
  @IsOptional()
  avatar: string;
  @IsEmail()
  @IsOptional()
  email: string;
  @IsNotEmpty()
  @IsOptional()
  password: string;
}
