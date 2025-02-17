import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { UsersService } from './authentication.service';
import { MongooseModule } from '@nestjs/mongoose';

import { User, UserSchema } from 'src/authentication/schemas/user.schema';
import { UsersController } from './authentication.cotroller';

import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { AuthGuard } from './auth.guard';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '864000s' },
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, AuthGuard],
  exports: [UsersService],
})
export class AuthenticationModule {}
