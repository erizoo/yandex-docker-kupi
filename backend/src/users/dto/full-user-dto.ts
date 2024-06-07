import { ResponseProfileDto } from './response-profile.dto';

export class FullUserDto extends ResponseProfileDto {
  wishes: string[];
  offers: string[];
  wishlist: string[];
}
