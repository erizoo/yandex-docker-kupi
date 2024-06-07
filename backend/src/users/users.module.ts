import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserRepository } from './users.repository';
import { WishesRepository } from '../wishes/wishes.repository';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UserRepository, WishesRepository],
})
export class UsersModule {}
