import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { UserForDelete, UserForUpdate } from '../user/dto';
import { DbService } from '../db/db.service';

@Injectable()
export class UserService {
  constructor(private prisma: DbService) {}

  async allUsers() {
    try {
      const allUsers = await this.prisma.user.findMany({
        select: {
          id: true,
          email: true,
          username: true,
          biography: true,
          createdAt: true,
          updatedAt: true,
          picture: true,
        },
      });
      return allUsers;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002')
          throw new BadRequestException('email or username taken');
      }
      return error;
    }
  }

  async updateUser(user: User, dto: UserForUpdate) {
    try {
      const userUpdated = await this.prisma.user.update({
        where: {
          email: user.email,
        },
        data: {
          ...dto,
        },
      });
      return userUpdated;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002')
          throw new BadRequestException('email or username taken');
      }
      return error;
    }
  }

  async deleteUser(dto: UserForDelete) {
    try {
      const userUpdated = await this.prisma.user.deleteMany({
        where: {
          id: { in: dto.id },
        },
      });
      return userUpdated;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002')
          throw new BadRequestException('id not exist');
      }
      return error;
    }
  }
}
