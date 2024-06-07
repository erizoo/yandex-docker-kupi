import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RequestUpdateProfileDto } from '../users/dto/request-update-profile.dto';
import { ResponseProfileDto } from '../users/dto/response-profile.dto';
import { RequestLoginDto } from './dto/request-login.dto';
import { ResponseLoginDto } from './dto/response-login.dto';
import { compare, genSaltSync, hashSync } from 'bcrypt';
import { UserRepository } from '../users/users.repository';
import { User } from '../users/entities/users.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async registration(dto: RequestUpdateProfileDto) {
    const isHaveUser = await this.userRepository.checkUniqueEmailOrUsername(
      dto.email,
      dto.username,
    );
    if (isHaveUser) {
      throw new ConflictException(
        'Пользователь с таким email или username уже зарегистрирован',
      );
    }
    const salt = genSaltSync(10);
    const newUser = await this.userRepository.createUser({
      ...dto,
      password: hashSync(dto.password, salt),
    });
    return this.mapToResponseRegistrationDto(newUser);
  }

  private mapToResponseRegistrationDto(user: User): ResponseProfileDto {
    return {
      id: user.id,
      username: user.username,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }

  async validateUser(username: string, password: string): Promise<User> {
    const user = await this.userRepository.findUserByUsername(username);
    if (!user) {
      throw new UnauthorizedException('Некорректная пара логин и пароль');
    }
    const isCorrectPassword = await compare(password, user.password);
    if (!isCorrectPassword) {
      throw new UnauthorizedException('Некорректная пара логин и пароль');
    }
    return user;
  }

  async getToken(user: any) {
    const payload = { userId: user.id };
    return this.jwtService.sign(payload, {
      expiresIn: this.configService.get<string>('JWT_EXPIRE_IN'),
    });
  }

  async login(dto: RequestLoginDto) {
    const user = await this.validateUser(dto.username, dto.password);
    const response = new ResponseLoginDto();
    response.access_token = await this.getToken(user);
    return response;
  }
}
