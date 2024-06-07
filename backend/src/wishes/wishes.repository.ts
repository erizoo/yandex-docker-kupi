import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { Wish } from './wishes.entity';
import { CreateWishDto } from './dto/create-wish.dto';
import { User } from '../users/entities/users.entity';
import { UpdateWishDto } from './dto/update-wish.dto';

@Injectable()
export class WishesRepository {
  private repository: Repository<Wish>;

  constructor(@InjectDataSource() dataSource: DataSource) {
    this.repository = dataSource.getRepository(Wish);
  }

  async create(createWishDto: CreateWishDto, user: User) {
    const newWish = new Wish();
    newWish.description = createWishDto.description;
    newWish.name = createWishDto.name;
    newWish.link = createWishDto.link;
    newWish.image = createWishDto.image;
    newWish.price = createWishDto.price;
    newWish.owner = user;
    return await this.repository.save(newWish);
  }

  async findByUserId(userId: number): Promise<Wish[]> {
    return await this.repository.find({
      where: { owner: { id: userId } },
      relations: ['owner', 'offers', 'offers.user', 'offers.item'],
    });
  }

  async findById(id: number): Promise<Wish> {
    return await this.repository.findOne({
      where: { id: id },
      relations: ['owner', 'offers', 'offers.user', 'offers.item'],
    });
  }

  async updateCopied(id: number) {
    const wish = await this.repository.findOne({
      where: { id: id },
    });
    wish.copied = wish.copied + 1;
    await this.repository.save(wish);
  }

  async remove(wish: Wish) {
    await this.repository.remove(wish);
  }

  async findLast(number: number) {
    return await this.repository.find({
      relations: ['owner', 'offers', 'offers.user', 'offers.item'],
      order: { createdAt: 'DESC' },
      take: number,
    });
  }

  async findTop() {
    return await this.repository.find({
      relations: ['owner', 'offers', 'offers.user', 'offers.item'],
      order: { copied: 'DESC' },
      take: 10,
    });
  }

  async update(id: number, updateWishDto: UpdateWishDto) {
    await this.repository.update(id, updateWishDto);
    return true;
  }
}
