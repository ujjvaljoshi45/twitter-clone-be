import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token);

      request['user'] = payload;
      return true;
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException();
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const token = request.headers.authorization?.replace('Bearer ', '');
    return token;
  }
}

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJmOGM2YWI1Yi0wY2I4LTRjNWItODAxOS05Mzk2ZjQyZmZiYzciLCJlbWFpbCI6InVzZXJAZXhtYXBsZS5jb20iLCJpYXQiOjE3NDAxMTY0OTAsImV4cCI6MTc0MDIwMjg5MH0.2ACv7w7UYH7RvLB8ERgFJ-GxoyBwkMKhqJWI4sAVL1E
