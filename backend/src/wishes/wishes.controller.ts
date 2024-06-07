import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { GetUser } from '../decorators/user.decorator';
import { AuthenticatedUser } from '../decorators/user.interface';
import { JwtGuard } from '../auth/guards/jwt.guard';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtGuard)
  create(
    @GetUser() user: AuthenticatedUser,
    @Body() createWishDto: CreateWishDto,
  ) {
    return this.wishesService.create(createWishDto, user.userId);
  }

  @Get('last')
  findLast() {
    return this.wishesService.findLast();
  }

  @Get('top')
  findTop() {
    return this.wishesService.findTop();
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  findOne(@Param('id') id: number) {
    return this.wishesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtGuard)
  update(
    @Param('id') id: number,
    @Body() updateWishDto: UpdateWishDto,
    @GetUser() user: AuthenticatedUser,
  ) {
    return this.wishesService.update(id, updateWishDto, user);
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  removeOne(@Param('id') id: number, @GetUser() user: AuthenticatedUser) {
    return this.wishesService.removeOne(id, user.userId);
  }

  @Post(':id/copy')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtGuard)
  copyWish(@Param('id') id: number, @GetUser() user: AuthenticatedUser) {
    return this.wishesService.copyWish(id, user.userId);
  }
}
