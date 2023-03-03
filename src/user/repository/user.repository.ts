import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDto } from '../dto/user.dto';

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  async createUser(data: User): Promise<User> {
    return this.prisma.user.create({
      data: {
        nickname: data.nickname,
        email: data.email,
        emailVerified: data.emailVerified,
        isActive: data.isActive,
        password: data.password,
      },
    });
  }

  async getUserById(userId: string): Promise<User> {
    return this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
  }

  async getAllUsers(): Promise<UserDto[] | []> {
    return this.prisma.user.findMany({
      orderBy: [
        {
          nickname: 'asc',
        },
      ],
      select: {
        id: true,
        nickname: true,
        email: true,
        isActive: true,
      },
    });
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
  }

  async updateUser(data: User): Promise<User> {
    if (data.password === '') {
      return this.prisma.user.update({
        where: {
          id: data.id,
        },
        data: {
          id: data.id,
          nickname: data.nickname,
          email: data.email,
          emailVerified: data.emailVerified,
          isActive: data.isActive,
        },
      });
    } else {
      return this.prisma.user.update({
        where: {
          id: data.id,
        },
        data: {
          id: data.id,
          nickname: data.nickname,
          email: data.email,
          emailVerified: data.emailVerified,
          password: data.password,
          isActive: data.isActive,
        },
      });
    }
  }

  async deleteUser(userId: string): Promise<User> {
    return this.prisma.user.delete({
      where: {
        id: userId,
      },
    });
  }

  async countAllUsers(): Promise<number> {
    return this.prisma.user.count();
  }

  async checkIfUserExistByEmailOrNickname(
    email: string,
    nickname: string,
  ): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: {
        OR: [
          {
            email: email,
          },
          { nickname: nickname },
        ],
      },
    });
  }

  async updateRefreshTokenByUserId(userId: string, refreshToken: string) {
    return this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        refresh_token: refreshToken,
      },
    });
  }

  async deleteRefreshTokenByUserId(userId: string) {
    return this.prisma.user.updateMany({
      where: {
        id: userId,
        refresh_token: {
          not: null,
        },
      },
      data: {
        refresh_token: null,
      },
    });
  }

  async getShoppingListByUserId(userId: string) {
    return this.prisma.user.findMany({
      where: {
        id: userId,
      },
      include: {
        shoppingLists: {
          select: {
            shoppingList: {
              select: {
                name: true,
                products: true,
                createdAt: true,
              },
            },
          },
        },
      },
    });
  }
}
