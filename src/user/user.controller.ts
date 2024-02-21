import { Body, Controller, Delete, Get, Put, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../common/decorator/get-user.decorator';
import { JwtGuard } from '../common/guard';
import { UserService } from './user.service';
import { UserForDelete, UserForUpdate } from './dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@UseGuards(JwtGuard)
@ApiTags('User')
@ApiBearerAuth('access-token')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  getCurrentUser(@GetUser() user: User) {
    return { statusCode: 200, data: { user } };
  }

  @Put()
  async updateUser(@GetUser() user: User, @Body() dto: UserForUpdate) {
    return {
      statusCode: 201,
      data: { user: await this.userService.updateUser(user, dto) },
    };
  }
}

@UseGuards(JwtGuard)
@ApiTags('Users')
@ApiBearerAuth('access-token')
@Controller('Users')
export class UsersController {
  constructor(private userService: UserService) {}

  @Get()
  async getAllUser() {
    const users = await this.userService.allUsers();
    return { statusCode: 200, data: { users } };
  }

  @Delete()
  async deleteUser(@Body() dto: UserForDelete) {
    const deletedUser = await this.userService.deleteUser(dto);
    return { statusCode: 201, data: { deletedUser } };
  }
}
