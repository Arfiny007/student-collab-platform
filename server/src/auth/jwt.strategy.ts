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
import { getJwtSecret } from "../config/jwt.config";

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

      secretOrKey: getJwtSecret(),
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
