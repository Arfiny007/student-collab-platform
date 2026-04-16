import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('register')
  register(@Body() body: { email: string; password: string }) {
    return this.userService.create(body.email, body.password);
  }
}