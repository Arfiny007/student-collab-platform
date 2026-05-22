import {
  CanActivate,
  ExecutionContext,
  Injectable,
} from "@nestjs/common";

@Injectable()
export class RolesGuard
  implements CanActivate
{
  constructor(
    private roles: string[],
  ) {}

  canActivate(
    context: ExecutionContext,
  ) {
    const req =
      context
        .switchToHttp()
        .getRequest();

    const user =
      req.user;

    if (
      !user
    ) {
      return false;
    }

    return this.roles.includes(
      user.role ||
        "user",
    );
  }
}