import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    // console.log('request', request);

    const { token, role, loggedInUserId } =
      this.extractTokenFromCookie(request);

    // console.log(token, role);

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });

      if (!payload) {
        throw new UnauthorizedException('Invalid token');
      }

      // const user = await this.usersService.findById(payload.userId); // Verify user from the database

      // console.log('user', user);

      // if (!user) {
      //   throw new UnauthorizedException('User not found');
      // }

      // request['user'] = user;

      if (role !== payload.role || loggedInUserId !== payload.userId) {
        throw new BadRequestException('Unauthorized');
      }

      request['user'] = payload;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new BadRequestException('Token has expired.');
      }

      console.error('token error', error); // Log any verification errors
      throw new UnauthorizedException(error);
    }
    return true;
  }

  private extractTokenFromCookie(request: Request): {
    token?: string;
    role?: string;
    loggedInUserId?: string;
  } {
    // console.log('cookies', request.cookies);
    const encodedCookie = request.cookies['persist%3Aroot'];
    // console.log('encodedCookie', encodedCookie);

    if (encodedCookie) {
      try {
        const decodedCookie = decodeURIComponent(encodedCookie);
        const parsedCookie = JSON.parse(decodedCookie);
        const authenticated = JSON.parse(parsedCookie.authenticated);

        return {
          token: authenticated.loggedInUserToken,
          role: authenticated.role,
          loggedInUserId: authenticated.loggedInUserId,
        };
      } catch (error) {
        console.error('Error parsing cookie:', error);
        return {};
      }
    }
    return {};
  }
}
