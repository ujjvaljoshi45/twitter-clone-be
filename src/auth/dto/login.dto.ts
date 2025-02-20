import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
export class LoginDto {
  @ApiProperty({ example: 'user@exmaple.com' })
  @IsEmail()
  email: string;
  @IsNotEmpty()
  @MinLength(6)
  @ApiProperty({ example: 'securepassword' })
  password: string;
}
