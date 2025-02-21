import { RegisterDto } from './dto/register.dto';
import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from './guards/auth-guard';
import { RequestOtpDto } from './dto/requestOtp.dto';
import { VerifyOtpDto } from './dto/verifyOtp.dto';

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
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get()
  async getUser(@Request() req) {
    return this.authService.getUser(req.user.userId);
  }

  @Post('google')
  async googleLogin(@Body('token') token: string) {
    return this.authService.verifyGoogleToken(token);
  }

  @Post('send-otp')
  async sendOtp(@Body() requestOtpDto: RequestOtpDto) {
    return this.authService.generateOtp(requestOtpDto.email);
  }

  @Post('verify-otp')
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.authService.verifyOtp(verifyOtpDto.email, verifyOtpDto.otp);
  }
}
