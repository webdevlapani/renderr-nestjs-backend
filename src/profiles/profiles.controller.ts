import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../common/decorator/get-user.decorator';
import { JwtGuard } from '../common/guard';
import { ProfilesService } from './profiles.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@UseGuards(JwtGuard)
@ApiTags('Follow & UnFollow')
@ApiBearerAuth('access-token')
@Controller('profiles')
export class ProfilesController {
  constructor(private profileService: ProfilesService) {}
  @Get(':username')
  async findUser(@GetUser() user: User, @Param('username') userName: string) {
    const profile = await this.profileService.findUser(user, userName);
    return { statusCode: 200, data: { profile } };
  }

  @HttpCode(HttpStatus.OK)
  @Post(':username/follow')
  async followUser(@GetUser() user: User, @Param('username') userName: string) {
    const profile = await this.profileService.followUser(user, userName);
    return { statusCode: 201, data: { profile } };
  }

  @Delete(':username/follow')
  async unfollowUser(
    @GetUser() user: User,
    @Param('username') username: string,
  ) {
    const profile = await this.profileService.unfollowUser(user, username);
    return { statusCode: 201, data: { profile } };
  }
}
