import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  GetCurrentUser,
  GetCurrentUserId,
  Public,
} from '../../common/decorators';
import { RtGuard } from '../../common/guards';
import { UserFormDto } from './../../user/dto/UserFormDto';
import { AuthDto } from '../dto/authDto';
import { AuthService } from '../service/auth.service';
import { Tokens } from '../types';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe())
  signup(@Body() dto: UserFormDto): Promise<Tokens> {
    return this.authService.signup(dto);
  }

  @Public()
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe())
  signin(@Body() dto: AuthDto): Promise<Tokens> {
    return this.authService.signin(dto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@GetCurrentUserId() userId: string) {
    return this.authService.logout(userId);
  }

  @Public()
  @UseGuards(RtGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refreshTokens(
    @GetCurrentUserId() userId: string,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ) {
    return this.authService.refreshTokens(userId, refreshToken);
  }
}
