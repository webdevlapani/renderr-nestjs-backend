import { Module } from '@nestjs/common';
import { UserController, UsersController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController, UsersController],
  providers: [UserService],
})
export class UserModule {}
