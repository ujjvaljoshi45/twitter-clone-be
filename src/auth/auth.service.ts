import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async registerUser(username: string, email: string, password: string) {
    // Hash password
    const hashedPassword: string = await bcrypt.hash(password, 10);

    // Save user to database
    const user = await this.prisma.user.create({
      data: { username, email, password: hashedPassword },
    });

    return { message: 'User registered successfully', user };
  }

  async loginUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid credentials');

    const token = this.jwtService.sign({ userId: user.id, email: user.email });

    return { accessToken: token };
  }
}
