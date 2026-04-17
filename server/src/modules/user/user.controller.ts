import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { UseGuards, Get, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('register')
  register(@Body() body: { email: string; password: string }) {
    return this.userService.create(body.email, body.password);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Req() req) {
  return req.user;
}

}