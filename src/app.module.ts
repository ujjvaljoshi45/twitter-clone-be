import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './database/prisma.module';
import { UserModule } from './user/user.module';
import { TweetsModule } from './tweets/tweets.module';
import { LikesModule } from './likes/likes.module';
import { FollowModule } from './follow/follow.module';
import { SearchModule } from './search/search.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    CommonModule,
    AuthModule,
    UserModule,
    TweetsModule,
    LikesModule,
    FollowModule,
    SearchModule,
    UploadModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
