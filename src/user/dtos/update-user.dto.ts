import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ example: 'New Bio', required: false })
  @IsOptional()
  @IsString()
  bio?: string;
  @ApiProperty({ example: 'Image Url', required: false })
  @IsOptional()
  @IsString()
  avatar_url?: string;
}
