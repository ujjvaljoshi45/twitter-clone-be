import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTweetDto {
  @ApiProperty({ example: 'Hello world! This is my first tweet.' })
  @IsNotEmpty()
  @IsString()
  content: string;
}
