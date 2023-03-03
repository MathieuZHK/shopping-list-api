import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Put,
} from '@nestjs/common';
import { GetCurrentUserId } from 'src/common/decorators';
import { UserFormDto } from '../dto/userForm.dto';
import { UserService } from '../service/user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getCurrentUserInfoById(@GetCurrentUserId() userId: string) {
    console.log(userId);
    return this.userService.getUserDtoById(userId);
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  deleteUserByUserId(@GetCurrentUserId() userId: string) {
    return this.userService.deleteByUserId(userId);
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  updateUser(@GetCurrentUserId() userId: string, @Body() dto: UserFormDto) {
    return this.userService.updateUser(userId, dto);
  }
}
