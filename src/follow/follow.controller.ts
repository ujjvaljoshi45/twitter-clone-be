import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { FollowService } from './follow.service';
import { JWtAuthGuard } from 'src/auth/guards/jwt-auth-guard';

@ApiTags('Follow')
@ApiBearerAuth()
@Controller('follow')
@UseGuards(JWtAuthGuard)
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @Post(':userId')
  async followUser(@Request() req, @Param('userId') userId: string) {
    return this.followService.followUser(req.user.userId, userId);
  }
  @Delete(':userId')
  async unfollowUser(@Request() req, @Param('userId') userId: string) {
    return this.followService.unfollowUser(req.user.userId, userId);
  }

  @Get(':userId')
  async isFollowingUser(@Request() req, @Param('userId') userId: string) {
    return this.followService.isFollowingUser(req.user.userId, userId);
  }
}
