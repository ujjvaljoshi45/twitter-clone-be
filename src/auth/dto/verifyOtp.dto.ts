import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class VerifyOtpDto {
  @ApiProperty({ example: 'jane@example.com' })
  @IsEmail()
  email: string;
  @ApiProperty({ example: '123123' })
  @IsNotEmpty()
  otp: string;
}
