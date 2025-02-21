import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class SearchService {
  constructor(private readonly prisma: PrismaService) {}

  async searchUser(query: string) {
    return this.prisma.user.findMany({
      where: {
        username: { contains: query, mode: 'insensitive' },
      },
      select: { id: true, username: true, avatar_url: true, email: true },
    });
  }
}
