import { Module } from '@nestjs/common';
import { TweetsService } from './tweets.service';
import { TweetsController } from './tweets.controller';

@Module({
  providers: [TweetsService],
  controllers: [TweetsController],
  exports: [TweetsService],
})
export class TweetsModule {}
