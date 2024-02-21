import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-apple';

@Injectable()
export class AppleStrategy extends PassportStrategy(Strategy, 'apple') {
  constructor() {
    super({
      clientID: process.env.APPLE_CLIENT_ID,
      teamID: process.env.APPLE_TEAM_ID,
      keyID: process.env.APPLE_KEY_ID,
      keyFilePath: process.env.APPLE_KEY_FILE_PATH,
      callbackURL: process.env.APPLE_CALLBACK_URL,
      passReqToCallback: process.env.PASS_REQ_TO_CALLBACK,
      scope: ['email', 'name'],
    });
  }

  async validate(
    req: any,
    accessToken: string,
    refreshToken: string,
    idToken: string,
    profile: string,
    cb: any,
  ): Promise<any> {
    console.log(
      '🚀 ~ file: apple.strategy.ts:27 ~ AppleStrategy ~ classAppleStrategyextendsPassportStrategy ~ profile:',
      profile,
    );
    // const { emails, photos } = profile;
    const user = {
      email: '',
      username: '',
      picture: '',
    };
    cb(null, user);
  }
}
