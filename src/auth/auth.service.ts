import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  LoginDto,
  UserDto,
  UserForRegisterWithGoogle,
  UserForRegistration,
} from '../user/dto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';

import * as argon from 'argon2';
import { DbService } from '../db/db.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: DbService,
    private config: ConfigService,
    private jwt: JwtService,
  ) {}

  async createUser(dto: UserForRegistration) {
    const { username, password, email } = dto;
    const hashedPassword = await argon.hash(password);
    try {
      const user = await this.prisma.user.create({
        data: {
          username,
          email,
          password: hashedPassword,
        },
      });
      const token = await this.signToken(user.id, user.email);
      const userToReturn: UserDto = {
        email: user.email,
        token: token,
        username: user.username,
        biography: user.biography,
        picture: user.picture,
      };

      return userToReturn;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002')
          throw new BadRequestException('email or username is taken');
      }
    }
  }

  async createUserWithOAuth(dto: UserForRegisterWithGoogle) {
    const { username, email, picture } = dto;
    try {
      const uniqueUser = await this.prisma.user.findUnique({
        where: { email },
      });

      if (uniqueUser) {
        const token = await this.signToken(uniqueUser.id, uniqueUser.email);
        const userToReturn = {
          accessToken: token,
          refreshToken: '',
        };
        return userToReturn;
      }

      const user = await this.prisma.user.create({
        data: {
          username,
          email,
          picture,
        },
      });
      const token = await this.signToken(user.id, user.email);
      const userToReturn = {
        accessToken: token,
        refreshToken: '',
      };

      return userToReturn;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002')
          throw new BadRequestException('email or username is taken');
      }
      return e;
    }
  }

  async verifyUser(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (!user) throw new NotFoundException('user does not exist');
    const matches = await argon.verify(user.password, dto.password);
    if (!matches)
      throw new UnauthorizedException('password and email do not match');
    const token = await this.signToken(user.id, user.email);
    const userReturned: UserDto = {
      email: user.email,
      token: token,
      username: user.username,
      biography: user.biography,
      picture: user.picture,
    };
    return userReturned;
  }

  // async logout(userId: string) {
  //   return this.usersService.update(userId, { refreshToken: null });
  // }

  // async updateRefreshToken(userId: string, refreshToken: string) {
  //   const hashedRefreshToken = await this.hashData(refreshToken);
  //   await this.usersService.update(userId, {
  //     refreshToken: hashedRefreshToken,
  //   });
  // }

  // async getTokens(userId: string, username: string) {
  //   const [accessToken, refreshToken] = await Promise.all([
  //     this.jwtService.signAsync(
  //       {
  //         sub: userId,
  //         username,
  //       },
  //       {
  //         secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
  //         expiresIn: '15m',
  //       },
  //     ),
  //     this.jwtService.signAsync(
  //       {
  //         sub: userId,
  //         username,
  //       },
  //       {
  //         secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
  //         expiresIn: '7d',
  //       },
  //     ),
  //   ]);

  //   return {
  //     accessToken,
  //     refreshToken,
  //   };
  // }

  // async refreshTokens(userId: string, refreshToken: string) {
  //   const user = await this.usersService.findById(userId);
  //   if (!user || !user.refreshToken)
  //     throw new ForbiddenException('Access Denied');
  //   const refreshTokenMatches = await argon2.verify(
  //     user.refreshToken,
  //     refreshToken,
  //   );
  //   if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
  //   const tokens = await this.getTokens(user.id, user.username);
  //   await this.updateRefreshToken(user.id, tokens.refreshToken);
  //   return tokens;
  // }

  async signToken(userId: string, email: string): Promise<string> {
    const data = {
      sub: userId,
      email: email,
    };
    const SECRET = this.config.get('SECRET');
    const token = await this.jwt.signAsync(data, {
      secret: SECRET,
      expiresIn: '2h',
    });
    return token;
  }
}
