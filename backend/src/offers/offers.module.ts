import { Module } from '@nestjs/common';
import { OffersService } from './offers.service';
import { OffersController } from './offers.controller';
import { WishesRepository } from '../wishes/wishes.repository';
import { UserRepository } from '../users/users.repository';
import { OffersRepository } from './offers.repository';

@Module({
  controllers: [OffersController],
  providers: [
    OffersService,
    WishesRepository,
    UserRepository,
    OffersRepository,
  ],
})
export class OffersModule {}
