import { Controller, Get } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  @Get('login')
  getHello(): string {
    // TODO: require an Bearer token, validation token
    return 'HELLO';
  }
}
