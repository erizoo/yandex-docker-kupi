import { User } from './entities/users.entity';
import { DataSource, Like, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { Wish } from '../wishes/wishes.entity';

@Injectable()
export class UserRepository {
  private repository: Repository<User>;

  constructor(@InjectDataSource() dataSource: DataSource) {
    this.repository = dataSource.getRepository(User);
  }

  async createUser(param: {
    password: string;
    about: string;
    avatar: string;
    email: string;
    username: string;
  }) {
    const user = this.repository.create({
      ...param,
    });
    return await this.repository.save(user);
  }

  async findUserByUsername(username: string) {
    return this.repository.findOne({
      where: { username: username },
    });
  }

  async findUserById(userId: number) {
    return this.repository.findOne({
      where: { id: userId },
      relations: ['wishes'],
    });
  }

  async findUserContainByUsernameOrEmail(query: string) {
    return this.repository.find({
      where: [{ username: Like(`%${query}%`) }, { email: Like(`%${query}%`) }],
    });
  }

  async findCopiedWishes(userId: number): Promise<Wish[]> {
    const user = await this.repository.findOne({
      where: { id: userId },
      relations: [
        'wishes',
        'wishes.owner',
        'wishes.offers',
        'wishes.offers.user',
        'wishes.offers.item',
      ],
    });

    // Проверяем, что пользователь найден и у него есть желания
    if (user && user.wishes) {
      return user.wishes;
    } else {
      // Если пользователь не найден или у него нет желаний, возвращаем пустой массив
      return [];
    }
  }

  async updateUser(user: User) {
    return this.repository.save(user);
  }

  async checkUniqueEmailOrUsername(email: string, username: string) {
    const user = await this.repository.findOne({
      where: [
        {
          email: email,
        },
        {
          username: username,
        },
      ],
    });
    return !!user;
  }
}
