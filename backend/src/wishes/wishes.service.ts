import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { WishesRepository } from './wishes.repository';
import { UserRepository } from '../users/users.repository';
import { mapToResponseWishesDto, mapToWishDto } from '../mappers/mappers';
import { WishDto } from './dto/wish.dto';
import { AuthenticatedUser } from '../decorators/user.interface';

@Injectable()
export class WishesService {
  constructor(
    private readonly wishesRepository: WishesRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async create(createWishDto: CreateWishDto, userId: number) {
    const user = await this.userRepository.findUserById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return await this.wishesRepository.create(createWishDto, user);
  }

  async findLast(): Promise<WishDto[]> {
    const wishes = await this.wishesRepository.findLast(40);
    return mapToResponseWishesDto(wishes);
  }

  async findTop(): Promise<WishDto[]> {
    const wishes = await this.wishesRepository.findTop();
    return mapToResponseWishesDto(wishes);
  }

  async findOne(id: number): Promise<WishDto> {
    const wish = await this.wishesRepository.findById(id);
    if (!wish) {
      throw new NotFoundException('Wish not found');
    }
    return mapToWishDto(wish);
  }

  async update(
    id: number,
    updateWishDto: UpdateWishDto,
    user: AuthenticatedUser,
  ) {
    const wish = await this.wishesRepository.findById(id);
    if (!wish) {
      throw new NotFoundException('Wish not found');
    }
    if (wish.owner.id != user.userId) {
      throw new ForbiddenException();
    }
    if (wish.raised > 0) {
      throw new ForbiddenException();
    }
    return await this.wishesRepository.update(id, updateWishDto);
  }

  async removeOne(id: number, userId: number): Promise<WishDto> {
    const user = await this.userRepository.findUserById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const wish = await this.wishesRepository.findById(id);
    if (!wish) {
      throw new NotFoundException('Wish not found');
    }
    // Проверяем, является ли пользователь владельцем желания
    if (wish.owner.id != userId) {
      // Проверяем наличие желания в промежуточной таблице
      const isWishLinked = user.wishes.some((w) => w.id === wish.id);
      if (!isWishLinked) {
        throw new ForbiddenException();
      }
      // Удаляем связь желания с пользователем, если оно было скопировано, а не принадлежит пользователю
      user.wishes = user.wishes.filter((w) => w.id !== wish.id);
      await this.userRepository.updateUser(user);
    } else {
      await this.wishesRepository.remove(wish);
    }
    return mapToWishDto(wish);
  }

  async copyWish(id: number, userId: number): Promise<WishDto> {
    const user = await this.userRepository.findUserById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const wish = await this.wishesRepository.findById(id);
    if (!wish) {
      throw new NotFoundException('Wish not found');
    }
    const alreadyCopied = user.wishes.some((w) => w.id === wish.id);
    if (alreadyCopied) {
      throw new BadRequestException('You have already copied this wish');
    }
    wish.copied = wish.copied + 1;
    if (!user.wishes) {
      user.wishes = [];
    }
    user.wishes.push(wish);
    await this.userRepository.updateUser(user);
    await this.wishesRepository.updateCopied(id);
    return mapToWishDto(wish);
  }
}
