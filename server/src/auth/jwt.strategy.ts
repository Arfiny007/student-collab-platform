import {
  Injectable,
} from "@nestjs/common";

import {
  PassportStrategy,
} from "@nestjs/passport";

import {
  ExtractJwt,
  Strategy,
} from "passport-jwt";

import { UserService } from "../modules/user/user.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(
  Strategy,
) {
  constructor(
    private userService: UserService,
  ) {
    super({
      jwtFromRequest:
        ExtractJwt.fromAuthHeaderAsBearerToken(),

      secretOrKey:
        process.env.JWT_SECRET ||
        "supersecret",
    });
  }

  async validate(
    payload: {
      sub: number;
      email: string;
    },
  ) {
    const user =
      await this.userService.findByEmail(
        payload.email,
      );

    return {
      userId:
        payload.sub,

      email:
        payload.email,

      role:
        user?.role ||
        "user",
    };
  }
}
