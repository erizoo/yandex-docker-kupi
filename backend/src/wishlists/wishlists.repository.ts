import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { Wishlist } from './wishlists.entity';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { Wish } from '../wishes/wishes.entity';
import { User } from '../users/entities/users.entity';
import { UpdateWishDto } from '../wishes/dto/update-wish.dto';

@Injectable()
export class WishlistsRepository {
  private repository: Repository<Wishlist>;

  constructor(@InjectDataSource() dataSource: DataSource) {
    this.repository = dataSource.getRepository(Wishlist);
  }

  async create(dto: CreateWishlistDto, wishes: Wish[], user: User) {
    const wishlist = new Wishlist();
    wishlist.name = dto.name;
    wishlist.image = dto.image;
    wishlist.items = wishes;
    wishlist.owner = user;
    return this.repository.save(wishlist);
  }

  async findAll() {
    return this.repository.find({
      relations: ['owner'],
    });
  }

  async findOne(id: number) {
    return this.repository.findOne({
      where: { id },
      relations: ['owner', 'items', 'items.owner'],
    });
  }

  async removeOne(id: number) {
    return this.repository.delete(id);
  }

  async update(dto: UpdateWishDto, id: number) {
    return await this.repository.update(id, dto);
  }
}
