import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { GetUser } from '../decorators/user.decorator';
import { AuthenticatedUser } from '../decorators/user.interface';
import { JwtGuard } from '../auth/guards/jwt.guard';

@Controller('offers')
@UseGuards(JwtGuard)
export class OffersController {
  constructor(private readonly offersService: OffersService) {}
  @Post()
  async create(
    @Body() dto: CreateOfferDto,
    @GetUser() user: AuthenticatedUser,
  ) {
    return this.offersService.create(dto, user.userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.offersService.findOne(id);
  }

  @Get()
  async findAll() {
    return this.offersService.findAll();
  }
}
