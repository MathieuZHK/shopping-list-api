import { Controller, Get } from '@nestjs/common';
import { UserService } from '../service/user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('getAllUsers')
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Get('countAllUsers')
  countAllUsers() {
    return this.userService.countAllUsers();
  }
}
