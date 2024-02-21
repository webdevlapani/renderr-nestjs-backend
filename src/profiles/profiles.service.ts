import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { castToProfile, ProfileDto } from './dto';
import { DbService } from '../db/db.service';

@Injectable()
export class ProfilesService {
  constructor(private prisma: DbService) {}

  async findUser(user: User, userName: string) {
    const userFromDb = await this.prisma.user.findUnique({
      where: {
        username: userName,
      },
    });
    if (!userFromDb) throw new NotFoundException('user not found');

    const isFollowing = userFromDb.followersIds.includes(user.id);
    const profile: ProfileDto = castToProfile(userFromDb, isFollowing);
    return profile;
  }

  async followUser(user: User, userName: string) {
    const userFollowed = await this.prisma.user.update({
      where: {
        username: userName,
      },
      data: {
        followers: {
          set: [{ username: user.username }],
        },
      },
    });

    const profile: ProfileDto = castToProfile(userFollowed, true);
    return profile;
  }

  async unfollowUser(user: User, username: string) {
    const userFromDb = await this.prisma.user.update({
      where: {
        username: username,
      },
      data: {
        followers: {
          disconnect: [{ id: user.id }],
        },
      },
    });

    const profile: ProfileDto = castToProfile(userFromDb, false);
    return profile;
  }
}
