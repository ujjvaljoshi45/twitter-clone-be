import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class FollowService {
  constructor(private readonly primsa: PrismaService) {}

  async followUser(followerId: string, followingId: string) {
    return this.primsa.follow.create({
      data: {
        follower_id: followerId,
        following_id: followingId,
      },
    });
  }
  async unfollowUser(followerId: string, followingId: string) {
    // const follow = await this.primsa.follow.findFirst({
    //   where: {
    //     follower_id: followerId,
    //     following_id: followingId,
    //   },
    // });

    // if (!follow) throw new NotFoundException('Follow not Found');

    return this.primsa.follow.delete({
      where: {
        follower_id_following_id: {
          follower_id: followerId,
          following_id: followingId,
        },
      },
    });
  }
  async isFollowingUser(followerId: string, followingId: string) {
    return !!(await this.primsa.follow.findFirst({
      where: {
        follower_id: followerId,
        following_id: followingId,
      },
    }));
  }
}
