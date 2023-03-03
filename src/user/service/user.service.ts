import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { UserFormDto } from '../dto/userForm.dto';
import { UserRepository } from '../repository/user.repository';
import * as bcrypt from 'bcrypt';
import { UserDto } from '../dto/user.dto';

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
  async getUserDtoById(userId: string) {
    const userEntity = await this.repository.getUserById(userId);
    return this.convertUserEntityToUserDto(userEntity);
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

  async updateUser(userId: string, data: UserFormDto) {
    if (!data.oldPassword)
      throw new ForbiddenException('Please enter your old password');
    const user = await this.getUserByEmail(data.email);
    if (!user) throw new ForbiddenException('Access denied');
    const passwordMatches = await bcrypt.compare(
      data.oldPassword,
      user.password,
    );
    if (!passwordMatches) throw new ForbiddenException('Access denied');
    return await this.repository.updateUser(
      await this.convertUserFormDtoToUserEntity(userId, data),
    );
  }

  async deleteByUserId(userId: string) {
    return await this.repository.deleteUser(userId);
  }

  async deleteRefreshTokenByUserId(userId: string) {
    return await this.repository.deleteRefreshTokenByUserId(userId);
  }

  async convertUserFormDtoToUserEntity(userId: string, data: UserFormDto) {
    const hash = await bcrypt.hash(data.password, 10);
    const userEntity: User = {
      id: userId,
      email: data.email,
      emailVerified: null,
      nickname: data.nickname,
      isActive: data.isActive,
      password: hash,
      refresh_token: null,
    };

    return userEntity;
  }

  async convertUserEntityToUserDto(userEntity: User) {
    const userDto: UserDto = {
      id: userEntity.id,
      nickname: userEntity.nickname,
      email: userEntity.email,
      isActive: userEntity.isActive,
    };

    return userDto;
  }
}
