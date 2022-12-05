import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getAllUser(skip?: number, limit?: number) {
    return this.prisma.user.findMany({
      orderBy: [
        {
          nickname: 'asc',
        },
      ],
      skip: skip,
      take: limit,
      select: {
        id: true,
        nickname: true,
        email: true,
        isActive: true,
      },
    });
  }
  async countAllUser() {
    return this.prisma.user.count();
  }
}
