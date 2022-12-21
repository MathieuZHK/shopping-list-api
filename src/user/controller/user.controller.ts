import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Put,
} from '@nestjs/common';
import { GetCurrentUser } from 'src/common/decorators';
import { UserFormDto } from '../dto/userForm.dto';
import { UserService } from '../service/user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Delete()
  @HttpCode(HttpStatus.OK)
  deleteUserByUserId(@GetCurrentUser() userId: string) {
    return this.userService.deleteByUserId(userId);
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  updateUser(@GetCurrentUser() userId: string, @Body() dto: UserFormDto) {
    return this.userService.updateUser(userId, dto);
  }
}
