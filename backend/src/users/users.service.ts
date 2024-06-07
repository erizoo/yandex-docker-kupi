import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { UserRepository } from './users.repository';
import { RequestUpdateProfileDto } from './dto/request-update-profile.dto';
import { WishesRepository } from '../wishes/wishes.repository';
import {
  mapToResponseProfileDto,
  mapToResponseWishesDto,
} from '../mappers/mappers';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly wishesRepository: WishesRepository,
  ) {}

  async findOwn(userId: number) {
    const user = await this.userRepository.findUserById(userId);
    if (!user) {
      throw new BadRequestException('Пользователь не найден');
    }
    return mapToResponseProfileDto(user);
  }

  async update(userId: number, dto: RequestUpdateProfileDto) {
    const user = await this.userRepository.findUserById(userId);
    if (!user) {
      throw new BadRequestException('Пользователь не найден');
    }
    const isHaveUser = await this.userRepository.checkUniqueEmailOrUsername(
      dto.email,
      dto.username,
    );
    if (isHaveUser) {
      throw new ConflictException(
        'Пользователь с таким email или username уже зарегистрирован',
      );
    }
    user.avatar = dto.avatar;
    user.username = dto.username;
    user.about = dto.about;
    user.email = dto.email;
    user.updatedAt = new Date();
    await this.userRepository.updateUser(user);
    return mapToResponseProfileDto(user);
  }
  async findOne(username: string) {
    const user = await this.userRepository.findUserByUsername(username);
    if (!user) {
      throw new BadRequestException('Пользователь не найден');
    }
    return mapToResponseProfileDto(user);
  }

  async findMany(query: string) {
    const users = await this.userRepository.findUserContainByUsernameOrEmail(
      query,
    );
    if (users.length === 0) {
      return [];
    }
    return users.map((user) => mapToResponseProfileDto(user));
  }

  async getOwnWishes(userId: number) {
    const wishes = await this.wishesRepository.findByUserId(userId);
    const copiedWishes = await this.userRepository.findCopiedWishes(userId);
    const allWishes = [...wishes, ...copiedWishes];
    return mapToResponseWishesDto(allWishes);
  }

  async getWishes(username: string) {
    const user = await this.userRepository.findUserByUsername(username);
    if (!user) {
      throw new BadRequestException('Пользователь не найден');
    }
    const wishes = await this.wishesRepository.findByUserId(user.id);
    return mapToResponseWishesDto(wishes);
  }
}
