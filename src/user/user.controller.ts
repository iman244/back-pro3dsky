import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { credentials } from './users.type';

@Controller('users')
export class UserController {
  constructor(private readonly UserService: UserService) {}
  @Get()
  AllUsersInformation() {
    return this.UserService.AllUsersInformation();
  }

  @Post('register')
  async register(@Body() body: credentials) {
    const user = await this.UserService.register(body);
    return user;
  }

  @Put(':id')
  updateUser(@Param('id') id: string) {
    return this.UserService.updateUser(id);
  }

  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    return this.UserService.deleteUser(id);
  }
}
