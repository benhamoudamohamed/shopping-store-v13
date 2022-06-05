import { CanActivate, ExecutionContext, Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CustomAuthGuard implements CanActivate {

  private logger = new Logger('AuthGuard')

  constructor(private configService: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    if (request) {
      if (!request.headers.authorization) {
        return false;
      }
      request.user = await this.validateToken(request.headers.authorization);
      return true;
    }
  }

  async validateToken(auth: string) {
    if (auth.split(' ')[0] !== 'Bearer') {
      Logger.error(`🟥 AuthGuard validateToken split error`)
      throw new HttpException('AuthGuard validateToken split error ', HttpStatus.UNAUTHORIZED);
    }
    const token = auth.split(' ')[1];
    try {
      return jwt.verify(token, this.configService.get('JWT_SECRET'));
    } catch (err) {
      Logger.error(`🟥 AuthGuard validateToken catch error ${err}`)
      throw new HttpException('AuthGuard validateToken catch error ', HttpStatus.UNAUTHORIZED);
    }
  }
}
