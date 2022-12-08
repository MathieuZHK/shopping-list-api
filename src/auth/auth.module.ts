import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserRepository } from '../user/repository/userRepository';
import { UserService } from '../user/service/user.service';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';
import { AtStrategy, RtStrategy } from './strategies';

@Module({
  imports: [JwtModule.register({})],
  providers: [
    AuthService,
    UserService,
    UserRepository,
    PrismaService,
    RtStrategy,
    AtStrategy,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
