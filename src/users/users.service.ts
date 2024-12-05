import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findPublicProfile(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        avatar: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    return user;
  }

  async getLatestUsers() {
    return this.prisma.user.findMany({
      take: 6,
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        name: true,
        avatar: true,
      }
    });
  }
}
