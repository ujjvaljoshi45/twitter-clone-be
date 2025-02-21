import { Controller, Param, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth-guard';
import { LikesService } from './likes.service';

@ApiTags('Likes')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post(':postId')
  async likeTweet(@Request() req, @Param('postId') postId: string) {
    return this.likesService.likeTweet(req.user.userId, postId);
  }
  @Post(':postId')
  async unlikeTweet(@Request() req, @Param('postId') postId: string) {
    return this.likesService.unlikeTweet(req.user.userId, postId);
  }
  @Post(':postId')
  async hasLikedTweet(@Request() req, @Param('postId') postId: string) {
    return this.likesService.hasLikedTweet(req.user.userId, postId);
  }
}
