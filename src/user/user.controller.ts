import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { credentials } from './users.type';

@Controller('users')
export class UserController {
  constructor(private readonly UserService: UserService) {}

  @Post('register')
  async register(@Body() body: credentials) {
    const user = await this.UserService.register(body);
    return user;
  }

  @Get('search')
  async searchInUsers(
    @Body('searchKeyWord') keyword: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    console.log('keyword', keyword);
    console.log('page', page);
    if (keyword === '') {
      return this.UserService.AllUsersInformation(page, limit);
    } else {
      console.log("its not ''");
    }
    return 'search';
  }

  @Put(':id')
  updateUser(@Param('id') id: string, @Body() data: credentials) {
    return this.UserService.updateUser(id, data);
  }

  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    return this.UserService.deleteUser(id);
  }

  @Get()
  async AllUsersInformation(
    @Query('keyword') keyword: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    if (!keyword) {
      return this.UserService.AllUsersInformation(page, limit);
    } else {
      return this.UserService.searchUsers(keyword, page, limit);
    }
  }
}
