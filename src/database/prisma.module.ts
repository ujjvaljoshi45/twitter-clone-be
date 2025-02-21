import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { JwtModule } from '@nestjs/jwt';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
  imports: [
    JwtModule.register({ global: true, secret: process.env.JWT_SECRET }),
  ],
})
export class CommonModule {}
