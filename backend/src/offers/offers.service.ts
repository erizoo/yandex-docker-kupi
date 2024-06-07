import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { OffersRepository } from './offers.repository';
import { UserRepository } from '../users/users.repository';
import { WishesRepository } from '../wishes/wishes.repository';
import { mapToOfferDto, mapToResponseOfferDto } from '../mappers/mappers';

@Injectable()
export class OffersService {
  constructor(
    private readonly offersRepository: OffersRepository,
    private readonly userRepository: UserRepository,
    private readonly wishesRepository: WishesRepository,
  ) {}

  async findOne(id: number) {
    const offer = await this.offersRepository.findById(id);
    if (!offer) {
      throw new NotFoundException('Offer not found');
    }
    return mapToOfferDto(offer);
  }

  async create(dto: CreateOfferDto, userId: number) {
    const user = await this.userRepository.findUserById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const wish = await this.wishesRepository.findById(dto.itemId);
    if (!wish) {
      throw new NotFoundException('Wish not found');
    }
    if (wish.owner.id == userId) {
      throw new ForbiddenException();
    }
    const totalRaised =
      wish.offers?.reduce((sum, item) => {
        const amount = Number(item.amount); // Ensure number conversion here
        return sum + amount;
      }, 0) ?? 0;
    if (totalRaised == wish.price) {
      throw new ForbiddenException();
    }
    await this.offersRepository.create(dto, wish, user);
    return dto;
  }

  async findAll() {
    const offers = await this.offersRepository.findAll();
    return mapToResponseOfferDto(offers);
  }
}
