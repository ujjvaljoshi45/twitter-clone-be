import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class TweetsService {
  constructor(private readonly prisma: PrismaService) {}
  async createTweet(userId: string, content: string) {
    return this.prisma.post.create({
      data: { user_id: userId, content },
    });
  }

  async fetchTweets() {
    return this.prisma.post.findMany({
      include: {
        user: { select: { id: true, username: true, avatar_url: true } },
      },
      orderBy: { created_at: 'desc' },
    });
  }
  async fetchUserTweets(userId: string) {
    return this.prisma.post.findMany({
      where: { user_id: userId },
      include: {
        user: { select: { id: true, username: true, avatar_url: true } },
      },
      orderBy: { created_at: 'desc' },
    });
  }
  async deleteTweets(tweetId: string, userId: string) {
    const tweet = await this.prisma.post.findUnique({ where: { id: tweetId } });

    if (!tweet) throw new NotFoundException('Tweet Not Found');

    if (tweet.user_id !== userId)
      throw new UnauthorizedException('Not authorized to delete this post');

    return this.prisma.post.delete({ where: { id: tweetId } });
  }
}
