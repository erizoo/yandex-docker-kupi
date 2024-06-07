import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { Offer } from './offers.entity';
import { CreateOfferDto } from './dto/create-offer.dto';
import { Wish } from '../wishes/wishes.entity';
import { User } from '../users/entities/users.entity';

@Injectable()
export class OffersRepository {
  private repository: Repository<Offer>;

  constructor(@InjectDataSource() dataSource: DataSource) {
    this.repository = dataSource.getRepository(Offer);
  }

  async create(dto: CreateOfferDto, wish: Wish, user: User) {
    const offer = new Offer();
    offer.amount = dto.amount;
    offer.item = wish;
    offer.hidden = dto.hidden;
    offer.user = user;
    await this.repository.save(offer);
  }

  async findAll() {
    return await this.repository.find({
      relations: [
        'user', // Связь с User
        'user.wishes', // Желания, которые интересуют пользователя
        'user.wishes.owner', // Владельцы желаний
        'user.wishes.offers', // Предложения по каждому желанию
        'user.wishes.offers.user', // Пользователи, сделавшие предложения
        'user.wishes.offers.item', // Желания, для которых сделаны предложения
        'user.offers', // Предложения, сделанные пользователем
        'user.offers.user', // Пользователи, сделавшие эти предложения
        'user.offers.item', // Желания, для которых сделаны предложения
        'item', // Связь с Wish
        'item.owner', // Владелец желания
        'item.offers', // Предложения по желанию
        'item.offers.user', // Пользователи, сделавшие предложения
        'item.offers.item', // Желания, для которых сделаны предложения
      ],
    });
  }

  async findById(id: number) {
    return await this.repository.findOne({
      where: { id: id },
      relations: [
        'user', // Связь с User
        'user.wishes', // Желания, которые интересуют пользователя
        'user.wishes.owner', // Владельцы желаний
        'user.wishes.offers', // Предложения по каждому желанию
        'user.wishes.offers.user', // Пользователи, сделавшие предложения
        'user.wishes.offers.item', // Желания, для которых сделаны предложения
        'user.offers', // Предложения, сделанные пользователем
        'user.offers.user', // Пользователи, сделавшие эти предложения
        'user.offers.item', // Желания, для которых сделаны предложения
        'item', // Связь с Wish
        'item.owner', // Владелец желания
        'item.offers', // Предложения по желанию
        'item.offers.user', // Пользователи, сделавшие предложения
        'item.offers.item', // Желания, для которых сделаны предложения
      ],
    });
  }
}
