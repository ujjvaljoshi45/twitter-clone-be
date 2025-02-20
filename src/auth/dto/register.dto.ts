import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
export class RegisterDto {
  @ApiProperty({ example: 'Jane Doe' })
  @IsNotEmpty()
  username: string;
  @ApiProperty({ example: 'user@exmaple.com' })
  @IsEmail()
  email: string;
  @IsNotEmpty()
  @MinLength(6)
  @ApiProperty({ example: 'securepassword' })
  password: string;
}
