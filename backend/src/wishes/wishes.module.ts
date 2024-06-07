import { Module } from '@nestjs/common';
import { WishesService } from './wishes.service';
import { WishesController } from './wishes.controller';
import { WishesRepository } from './wishes.repository';
import { UserRepository } from '../users/users.repository';

@Module({
  controllers: [WishesController],
  providers: [WishesService, WishesRepository, UserRepository],
})
export class WishesModule {}
