import { Injectable, NotFoundException } from '@nestjs/common';
import { NotFoundError } from 'rxjs';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async fetchUserProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        avatar_url: true,
        bio: true,
        created_at: true,
      },
    });

    if (!user) throw new NotFoundException('User Not Found');
    return user;
  }
  async updateUserProile(
    userId: string,
    data: { bio?: string; avatar_url?: string },
  ) {
    return this.prisma.user.update({
      where: { id: userId },
      data,
    });
  }
  async searchUsers(query: string) {
    return this.prisma.user.findMany({
      where: { username: { contains: query, mode: 'insensitive' } },
      select: { id: true, username: true, avatar_url: true, email: true },
    });
  }
}
