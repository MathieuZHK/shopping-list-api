import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserRepository } from '../user/repository/user.repository';
import { UserService } from '../user/service/user.service';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';
import { AccessTokenStrategy, RefreshTokenStrategy } from './strategies';

@Module({
  imports: [JwtModule.register({})],
  providers: [
    AuthService,
    UserService,
    UserRepository,
    PrismaService,
    RefreshTokenStrategy,
    AccessTokenStrategy,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
