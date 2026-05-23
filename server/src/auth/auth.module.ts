import {
  Module,
} from "@nestjs/common";

import {
  AuthService,
} from "./auth.service";

import {
  AuthController,
} from "./auth.controller";

import {
  UserModule,
} from "../modules/user/user.module";

import {
  JwtModule,
} from "@nestjs/jwt";

import {
  JwtStrategy,
} from "./jwt.strategy";

import {
  PassportModule,
} from "@nestjs/passport";

import {
  RolesGuard,
} from "./roles.guard";

import { getJwtSecret } from "../config/jwt.config";

@Module({
  imports: [
    UserModule,

    PassportModule,

    JwtModule.register({
      secret: getJwtSecret(),

      signOptions: {
        expiresIn:
          "7d",
      },
    }),
  ],

  providers: [
    AuthService,
    JwtStrategy,
    RolesGuard,
  ],

  controllers: [
    AuthController,
  ],

  exports: [
    JwtModule,
    RolesGuard,
  ],
})
export class AuthModule {}