import { ResponseProfileDto } from '../../users/dto/response-profile.dto';
import { ResponseOfferDto } from '../../offers/dto/response-offer.dto';

export class WishDto {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  link: string;
  image: string;
  price: number;
  raised: number;
  copied: number;
  description: string;
  owner: ResponseProfileDto;
  offers: ResponseOfferDto[];
}
