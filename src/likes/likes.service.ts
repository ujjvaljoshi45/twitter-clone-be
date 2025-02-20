import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class LikesService {
  constructor(private readonly prisma: PrismaService) {}

  async likeTweet(userId: string, postId: string) {
    return this.prisma.like.create({
      data: {
        user_id: userId,
        post_id: postId,
      },
    });
  }
  async unlikeTweet(userId: string, postId: string) {
    const like = await this.prisma.like.findFirst({
      where: {
        user_id: userId,
        post_id: postId,
      },
    });

    if (!like) throw new NotFoundException('Liked Post Not Found');
    return this.prisma.like.delete({
      where: {
        id: like.id,
      },
    });
  }
  async hasLikedTweet(userId: string, postId: string) {
    return !!(await this.prisma.like.findFirst({
      where: { user_id: userId, post_id: postId },
    }));
  }
}
