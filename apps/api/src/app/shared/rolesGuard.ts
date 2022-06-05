import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Logger } from '@nestjs/common';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {

    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) return true;
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    return roles.some((role) => {
      if(role !== user.userRole) Logger.error(`🟥 RolesGuard: User: id: ${user.id} email: ${user.email} role: ${user.userRole} is attempting to Access ${role} routes`)
      return role === user.userRole;
    });
  }
}
