import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { UserFormDto } from '../dto/UserFormDto';
import { UserRepository } from '../repository/userRepository';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private repository: UserRepository) {}

  async createUser(data: UserFormDto) {
    const userExist = await this.checkUserExistByEmailOrNickname(
      data.email,
      data.nickname,
    );
    if (!userExist) {
      const hash = await bcrypt.hash(data.password, 10);
      const userConverter: User = {
        id: null,
        nickname: data.nickname,
        emailVerified: null,
        email: data.email,
        isActive: true,
        password: hash,
        refresh_token: null,
      };
      const response = await this.repository.createUser(userConverter);
      return response;
    }
    throw new HttpException(
      { message: 'User exist', Error },
      HttpStatus.BAD_REQUEST,
    );
  }

  async getUserByEmail(email: string) {
    return await this.repository.getUserByEmail(email);
  }

  async getUserById(userId: string) {
    return await this.repository.getUserById(userId);
  }

  async getAllUsers() {
    return await this.repository.getAllUsers();
  }
  async countAllUsers(): Promise<number> {
    return await this.repository.countAllUsers();
  }

  async checkUserExistByEmailOrNickname(email: string, nickname: string) {
    return await this.repository.checkIfUserExistByEmailOrNickname(
      email,
      nickname,
    );
  }

  async updateRefreshTokenByUserId(userId: string, refreshToken: string) {
    return await this.repository.updateRefreshTokenByUserId(
      userId,
      refreshToken,
    );
  }

  async deleteRefreshTokenByUserId(userId: string) {
    return await this.repository.deleteRefreshTokenByUserId(userId);
  }
}
