import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { SetMetadata } from '@nestjs/common';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true; // No roles defined means open to all
    }

    const request = context.switchToHttp().getRequest<Request>();
    const user = request['user'];

    if (!roles.includes(user.role)) {
      throw new ForbiddenException(
        `Role: ${user.role} is not allowed to access this resource.`,
      );
    }

    return true;
  }
}

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
