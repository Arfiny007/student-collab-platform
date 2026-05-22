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

@Module({
  imports: [
    UserModule,

    PassportModule,

    JwtModule.register({
      secret:
        process.env
          .JWT_SECRET ||
        "supersecret",

      signOptions: {
        expiresIn:
          "7d",
      },
    }),
  ],

  providers: [
    AuthService,
    JwtStrategy,
  ],

  controllers: [
    AuthController,
  ],

  exports: [
    JwtModule,
  ],
})
export class AuthModule {}