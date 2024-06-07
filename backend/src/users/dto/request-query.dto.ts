import { IsNotEmpty } from 'class-validator';

export class RequestQueryDto {
  @IsNotEmpty()
  query: string;
}
