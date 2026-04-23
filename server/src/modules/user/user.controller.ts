import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { UseGuards, Get, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  

  @Post('register')
  register(@Body() body: CreateUserDto) {
      console.log("BODY:", body); // 🔥 ADD THIS
  return this.userService.register(body);
}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Req() req) {
  return req.user;
}

}