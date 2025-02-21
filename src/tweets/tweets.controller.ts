import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TweetsService } from './tweets.service';
import { AuthGuard } from 'src/auth/guards/auth-guard';
import { CreateTweetDto } from './dtos/create-tweet.dto';

@ApiTags('Tweets')
@ApiBearerAuth()
@Controller('tweets')
export class TweetsController {
  constructor(private readonly tweetService: TweetsService) {}

  @UseGuards(AuthGuard)
  @Post()
  async createTweet(@Request() req, @Body() createTweetDto: CreateTweetDto) {
    return this.tweetService.createTweet(
      req.user.userId,
      createTweetDto.content,
    );
  }

  @Get()
  async fetchTweets() {
    return this.tweetService.fetchTweets();
  }
  @Get('user/:userId')
  async fetchUserTweets(@Param('userId') userId: string) {
    return this.tweetService.fetchUserTweets(userId);
  }
  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteTweet(@Request() req, @Param('id') tweetId: string) {
    return this.tweetService.deleteTweets(tweetId, req.user.userId);
  }
}
