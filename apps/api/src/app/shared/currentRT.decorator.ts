import { createParamDecorator, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';

export const CurrentRefreshToken = createParamDecorator((data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const auth = request.headers.authorization
    if (auth.split(' ')[0] !== 'Bearer') {
      throw new HttpException('Invalid CurrentRefreshToken ', HttpStatus.UNAUTHORIZED);
    }
    const token = auth.split(' ')[1];
    return token;
  }
);
