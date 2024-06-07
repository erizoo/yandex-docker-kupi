import { IsNotEmpty } from 'class-validator';

export class RequestLoginDto {
  @IsNotEmpty()
  username: string;
  @IsNotEmpty()
  password: string;
}
