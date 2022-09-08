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

  @Get('count')
  async UsersCount() {
    console.log('get request for usersCount');
    return this.UserService.usersCount();
  }

  @Post('register')
  async register(@Body() body: credentials) {
    const user = await this.UserService.register(body);
    return user;
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
  AllUsersInformation(
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return this.UserService.AllUsersInformation(page, limit);
  }
}
