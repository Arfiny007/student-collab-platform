import {
  Body,
  Controller,
  Get,
  Patch,
  Param,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";
import { RolesGuard } from "../../auth/roles.guard";
import { Roles } from "../../auth/roles.decorator";
import { AdminService } from "./admin.service";
import { UserRole } from "../user/user.entity";

@Controller("admin")
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  constructor(
    private adminService: AdminService,
  ) {}

  @Get("stats")
  @Roles(
    UserRole.ADMIN,
    UserRole.MODERATOR,
  )
  stats(@Req() req) {
    return this.adminService.getStats(
      req.user.role,
    );
  }

  @Get("moderation/posts")
  @Roles(
    UserRole.ADMIN,
    UserRole.MODERATOR,
  )
  moderation(
    @Req() req,
    @Query("page") page = 1,
  ) {
    return this.adminService.getModerationQueue(
      req.user.role,
      Number(page),
    );
  }

  @Get("users")
  @Roles(UserRole.ADMIN)
  users(
    @Req() req,
    @Query("page") page = 1,
    @Query("q") q = "",
  ) {
    return this.adminService.listUsers(
      req.user.role,
      Number(page),
      q,
    );
  }

  @Patch("users/:id")
  @Roles(UserRole.ADMIN)
  updateUser(
    @Req() req,
    @Param("id") id: string,
    @Body() body: {
      role?: UserRole;
      isBlocked?: boolean;
      isMuted?: boolean;
    },
  ) {
    return this.adminService.updateUser(
      req.user.role,
      Number(id),
      body,
    );
  }
}
