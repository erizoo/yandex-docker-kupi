import { Module } from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { WishlistsController } from './wishlists.controller';
import { WishlistsRepository } from './wishlists.repository';
import { WishesRepository } from '../wishes/wishes.repository';
import { UserRepository } from '../users/users.repository';

@Module({
  controllers: [WishlistsController],
  providers: [
    WishlistsService,
    WishlistsRepository,
    WishesRepository,
    UserRepository,
  ],
})
export class WishlistsModule {}
