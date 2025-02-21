import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SearchService } from './search.service';
import { query } from 'express';
import { AuthGuard } from 'src/auth/guards/auth-guard';

@ApiTags('Search')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('search')
export class SearchController {
  constructor(private searchService: SearchService) {}

  @Get('users')
  async searchUser(@Query('query') query: string) {
    return this.searchService.searchUser(query);
  }
}
