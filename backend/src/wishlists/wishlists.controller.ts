import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { GetUser } from '../decorators/user.decorator';
import { AuthenticatedUser } from '../decorators/user.interface';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { UpdateWishDto } from '../wishes/dto/update-wish.dto';

@Controller('wishlistlists')
@UseGuards(JwtGuard)
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}
  @Post()
  create(
    @Body() createWishlistDto: CreateWishlistDto,
    @GetUser() user: AuthenticatedUser,
  ) {
    return this.wishlistsService.create(createWishlistDto, user.userId);
  }

  @Get()
  findAll() {
    return this.wishlistsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.wishlistsService.findOne(id);
  }

  @Patch(':id')
  updateOne(
    @Param('id') id: number,
    @Body() dto: UpdateWishDto,
    @GetUser() user: AuthenticatedUser,
  ) {
    return this.wishlistsService.updateOne(id, dto, user.userId);
  }

  @Delete(':id')
  removeOne(@Param('id') id: number, @GetUser() user: AuthenticatedUser) {
    return this.wishlistsService.removeOne(id, user.userId);
  }
}
