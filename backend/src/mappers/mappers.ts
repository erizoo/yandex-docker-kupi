import { User } from '../users/entities/users.entity';
import { ResponseProfileDto } from '../users/dto/response-profile.dto';
import { Wish } from '../wishes/wishes.entity';
import { WishDto } from '../wishes/dto/wish.dto';
import { Offer } from '../offers/offers.entity';
import { ResponseOfferDto } from '../offers/dto/response-offer.dto';
import { FullUserDto } from '../users/dto/full-user-dto';

export function mapToResponseProfileDto(user: User): ResponseProfileDto {
  return {
    id: user.id,
    username: user.username,
    about: user.about,
    avatar: user.avatar,
    email: user.email,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}

export function mapToUserDto(offer: Offer): FullUserDto {
  return {
    id: offer.user.id,
    username: offer.user.username,
    about: offer.user.about,
    avatar: offer.user.avatar,
    email: offer.user.email,
    createdAt: offer.user.createdAt.toISOString(),
    updatedAt: offer.user.updatedAt.toISOString(),
    wishes: [],
    offers: [],
    wishlist: [],
  };
}

export function mapToOfferDto(offer: Offer): ResponseOfferDto {
  return {
    id: offer.id,
    createdAt: offer.createdAt.toISOString(),
    updatedAt: offer.updatedAt.toISOString(),
    amount: offer.amount,
    hidden: offer.hidden,
    item: mapToWishDto(offer.item),
    user: mapToUserDto(offer),
  };
}

export function mapToWishDto(wish: Wish): WishDto {
  const totalRaised =
    wish.offers?.reduce((sum, item) => {
      const amount = Number(item.amount); // Ensure number conversion here
      return sum + amount;
    }, 0) ?? 0;
  return {
    id: wish.id,
    createdAt: wish.createdAt.toISOString(),
    updatedAt: wish.updatedAt.toISOString(),
    name: wish.name,
    link: wish.link,
    image: wish.image,
    price: Number(wish.price),
    raised: Number(totalRaised) ?? 0,
    copied: 0,
    description: wish.description,
    owner: mapToResponseProfileDto(wish.owner),
    offers: wish.offers?.map((offer) => offer.item),
  };
}

export function mapToResponseOfferDto(offers: Offer[]): ResponseOfferDto[] {
  return offers.map((offer) => mapToOfferDto(offer));
}

export function mapToResponseWishesDto(wishes: Wish[]): WishDto[] {
  return wishes.map((wish) => mapToWishDto(wish));
}
