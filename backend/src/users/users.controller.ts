import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { GetUser } from '../decorators/user.decorator';
import { AuthenticatedUser } from '../decorators/user.interface';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { RequestUpdateProfileDto } from './dto/request-update-profile.dto';
import { RequestQueryDto } from './dto/request-query.dto';

@Controller('users')
@UseGuards(JwtGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async findOwn(@GetUser() user: AuthenticatedUser) {
    return this.usersService.findOwn(user.userId);
  }

  @Patch('me')
  async update(
    @GetUser() user: AuthenticatedUser,
    @Body() dto: RequestUpdateProfileDto,
  ) {
    return this.usersService.update(user.userId, dto);
  }

  @Get('me/wishes')
  async getOwnWishes(@GetUser() user: AuthenticatedUser) {
    return this.usersService.getOwnWishes(user.userId);
  }

  @Get(':username/wishes')
  async getWishes(@Param('username') username: string) {
    return this.usersService.getWishes(username);
  }

  @Get(':username')
  async findOne(@Param('username') username: string) {
    return this.usersService.findOne(username);
  }

  @Post('find')
  async findMany(@Body() dto: RequestQueryDto) {
    return this.usersService.findMany(dto.query);
  }
}
