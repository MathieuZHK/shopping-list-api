import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserFormDto } from '../../user/dto/UserFormDto';
import { UserService } from '../../user/service/user.service';
import { Tokens } from '../types';
import * as bcrypt from 'bcrypt';
import { AuthDto } from '../dto/authDto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signup(data: UserFormDto): Promise<Tokens> {
    const newUser = await this.userService.createUser(data);
    const tokens = await this.getTokens(newUser.id, newUser.email);
    await this.updateRtHash(newUser.id, tokens.refresh_token);
    return tokens;
  }

  async signin(dto: AuthDto): Promise<Tokens> {
    const user = await this.userService.getUserByEmail(dto.email);

    if (!user) throw new ForbiddenException('Access denied');
    const passwordMatches = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatches) throw new ForbiddenException('Access denied');
    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, user.refresh_token);
    return tokens;
  }

  async logout(userId: string) {
    await this.userService.deleteRefreshTokenByUserId(userId);
  }

  async updateRtHash(userId: string, rt: string) {
    const hash = await bcrypt.hash(rt, 10);
    this.userService.updateRefreshTokenByUserId(userId, hash);
  }

  async refreshTokens(userId: string, rt: string) {
    const user = await this.userService.getUserById(userId);
    if (!user || !user.refresh_token)
      throw new ForbiddenException('Access denied');

    const rtMatches = await bcrypt.compare(rt, user.refresh_token);
    if (!rtMatches) throw new ForbiddenException('Access denied');
    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, user.refresh_token);
    return tokens;
  }

  async getTokens(userId: string, email: string): Promise<Tokens> {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: 'at-secret', // .env
          expiresIn: 60 * 15,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: 'rt-secret', // .env
          expiresIn: 60 * 60 * 24 * 7,
        },
      ),
    ]);
    return {
      access_token: at,
      refresh_token: rt,
    };
  }
}
