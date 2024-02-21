import { IsBoolean, IsString } from 'class-validator';
import { User } from '@prisma/client';

export class ProfileDto {
  @IsString()
  username: string;

  @IsString()
  biography: string;

  @IsString()
  picture: string;

  @IsBoolean()
  following: boolean;
}

export function castToProfile(user: User, isFollowing: boolean): ProfileDto {
  return {
    username: user.username,
    biography: user.biography,
    picture: user.picture,
    following: isFollowing,
  };
}
