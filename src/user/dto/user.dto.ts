import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password too weak',
  })
  password: string;
}

export class UserForRegistration extends PartialType(LoginDto) {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username: string;
}

export class UserDto extends PartialType(UserForRegistration) {
  @ApiProperty()
  @IsString()
  biography?: string;

  @ApiProperty()
  @IsString()
  picture?: string;

  @IsString()
  token: string;
}

export class UserForUpdate extends PartialType(
  OmitType(UserDto, ['token', 'password'] as const),
) {}
export class UserForRegisterWithGoogle extends PartialType(
  OmitType(UserDto, ['token', 'password', 'biography'] as const),
) {}

export class UserForDelete {
  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  id: string[];
}
