import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { WishlistsRepository } from './wishlists.repository';
import { WishesRepository } from '../wishes/wishes.repository';
import { Wish } from '../wishes/wishes.entity';
import { UserRepository } from '../users/users.repository';
import { UpdateWishDto } from '../wishes/dto/update-wish.dto';

@Injectable()
export class WishlistsService {
  constructor(
    private readonly wishlistsRepository: WishlistsRepository,
    private readonly wishesRepository: WishesRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async removeOne(id: number, userId: number) {
    const wishlist = await this.wishlistsRepository.findOne(id);
    if (wishlist.owner.id !== userId) {
      throw new ForbiddenException(
        'Вы не можете удалять чужие списки подарков',
      );
    }
    return this.wishlistsRepository.removeOne(id);
  }

  async updateOne(id: number, dto: UpdateWishDto, userId: number) {
    const wishlist = await this.wishlistsRepository.findOne(id);
    if (wishlist.owner.id !== userId) {
      throw new ForbiddenException(
        'Вы не можете редактировать чужие списки подарков',
      );
    }
    return await this.wishlistsRepository.update(dto, id);
  }

  async findOne(id: number) {
    return await this.wishlistsRepository.findOne(id);
  }

  async create(dto: CreateWishlistDto, userId: number) {
    const wishes: Wish[] = [];
    for (const item of dto.itemsId) {
      wishes.push(await this.wishesRepository.findById(item));
    }
    const user = await this.userRepository.findUserById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.wishlistsRepository.create(dto, wishes, user);
  }

  async findAll() {
    return this.wishlistsRepository.findAll();
  }
}
