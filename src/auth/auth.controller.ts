import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, UserForRegistration } from '../user/dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
// import { RefreshTokenGuard } from 'src/common/guard/refreshToken.guard';

@Controller('auth')
@ApiTags('Auth')
@ApiBearerAuth('access-token')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async loginUser(@Body() dto: LoginDto) {
    const user = await this.authService.verifyUser(dto);
    return { statusCode: 201, data: { user } };
  }

  @Post('register')
  async registerUser(@Body() dto: UserForRegistration) {
    const user = await this.authService.createUser(dto);
    return { statusCode: 201, data: { user } };
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res) {
    const user = await this.authService.createUserWithOAuth(req.user);
    res.cookie('at', user.accessToken, {
      maxAge: 2 * 60 * 60 * 1000,
      httpOnly: true,
    });
    res.cookie('rt', user.refreshToken, {
      maxAge: 72 * 60 * 60 * 1000,
      httpOnly: true,
    });
    res.redirect(302, '/');
  }

  @Get('facebook')
  @UseGuards(AuthGuard('facebook'))
  async facebookLogin() {}

  @Get('facebook/redirect')
  @UseGuards(AuthGuard('facebook'))
  async facebookLoginRedirect(@Req() req, @Res() res) {
    const user = await this.authService.createUserWithOAuth(req.user);
    res.cookie('at', user.accessToken, {
      maxAge: 2 * 60 * 60 * 1000,
      httpOnly: true,
    });
    res.cookie('rt', user.refreshToken, {
      maxAge: 72 * 60 * 60 * 1000,
      httpOnly: true,
    });
    res.redirect(302, '/');
  }

  @Get('apple')
  @UseGuards(AuthGuard('apple'))
  async appleLogin() {}

  @Get('apple/redirect')
  @UseGuards(AuthGuard('apple'))
  async appleLoginRedirect(@Req() req, @Res() res) {
    const user = await this.authService.createUserWithOAuth(req.user);
    res.cookie('at', user.accessToken, {
      maxAge: 2 * 60 * 60 * 1000,
      httpOnly: true,
    });
    res.cookie('rt', user.refreshToken, {
      maxAge: 72 * 60 * 60 * 1000,
      httpOnly: true,
    });
    res.redirect(302, '/');
  }

  // @UseGuards(RefreshTokenGuard)
  // @Get('refresh')
  // refreshTokens(@Req() req: Request) {
  //   const userId = req.user['sub'];
  //   const refreshToken = req.user['refreshToken'];
  //   return this.authService.refreshTokens(userId, refreshToken);
  // }
}
