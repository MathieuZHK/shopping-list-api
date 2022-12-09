import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserFormDto } from '../../user/dto/userForm.dto';
import { UserService } from '../../user/service/user.service';
import { Tokens } from '../types';
import * as bcrypt from 'bcrypt';
import { AuthDto } from '../dto/auth.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async signup(data: UserFormDto): Promise<Tokens> {
    const newUser = await this.userService.createUser(data);
    const tokens = await this.getTokens(newUser.id, newUser.email);
    await this.updateRefreshTokenHash(newUser.id, tokens.refresh_token);
    return tokens;
  }

  async signin(dto: AuthDto): Promise<Tokens> {
    const user = await this.userService.getUserByEmail(dto.email);

    if (!user) throw new ForbiddenException('Access denied');
    const passwordMatches = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatches) throw new ForbiddenException('Access denied');
    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshTokenHash(user.id, tokens.refresh_token);
    return tokens;
  }

  async logout(userId: string) {
    await this.userService.deleteRefreshTokenByUserId(userId);
  }

  async updateRefreshTokenHash(userId: string, refreshToken: string) {
    const hash = await bcrypt.hash(refreshToken, 10);
    this.userService.updateRefreshTokenByUserId(userId, hash);
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.userService.getUserById(userId);
    if (!user || !user.refresh_token)
      throw new ForbiddenException('Access denied');

    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.refresh_token,
    );
    if (!refreshTokenMatches) throw new ForbiddenException('Access denied');
    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshTokenHash(user.id, user.refresh_token);
    return tokens;
  }

  async getTokens(userId: string, email: string): Promise<Tokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: this.config.get<string>('SECRET_ACCESS_TOKEN'),
          expiresIn: this.config.get<string>('JWT_ACCESS_TOKEN_EXPIRE'),
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: this.config.get<string>('SECRET_REFRESH_TOKEN'),
          expiresIn: this.config.get<string>('JWT_REFRESH_TOKEN_EXPIRE'),
        },
      ),
    ]);
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }
}
