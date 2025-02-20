import { RegisterDto } from './dto/register.dto';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.registerUser(
      registerDto.username,
      registerDto.email,
      registerDto.password,
    );
  }
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.loginUser(loginDto.email, loginDto.password);
  }
}
