import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './database/prisma.module';
import { UserModule } from './user/user.module';
import { TweetsModule } from './tweets/tweets.module';
import { LikesModule } from './likes/likes.module';
import { FollowModule } from './follow/follow.module';

@Module({
  imports: [PrismaModule, AuthModule, UserModule, TweetsModule, LikesModule, FollowModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
