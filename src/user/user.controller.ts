import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { JWtAuthGuard } from 'src/auth/guards/jwt-auth-guard';
import { UpdateUserDto } from './dtos/update-user.dto';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JWtAuthGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get(':id')
  async getUserProfile(@Param('id') userId: string) {
    return this.userService.fetchUserProfile(userId);
  }

  @Put(':id')
  async updateUserProfile(
    @Param('id') userId: string,
    @Body() updateDto: UpdateUserDto,
  ) {
    return this.userService.updateUserProile(userId, updateDto);
  }

  @Get('search')
  async searchUsers(@Query('query') query: string) {
    return this.userService.searchUsers(query);
  }
}
