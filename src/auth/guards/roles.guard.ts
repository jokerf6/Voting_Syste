import {
  Injectable,
  CanActivate,
  ExecutionContext,
  SetMetadata,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { roles } from "@prisma/client";
import { ResponseController } from "src/static/responses";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<roles[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    console.log(roles);
    console.log(ROLES_KEY);
    console.log(requiredRoles);
    if (!requiredRoles) {
      throw new Error(
        "RolesGuard can't be used without @Roles() decorator initiated with roles"
      );
    }
    if (!requiredRoles.some((role) => req.user.userObject?.Role === role)) {
      return false;
    }
    return true;
  }
}

export const ROLES_KEY = "roles";
export const Roles = (...roles: roles[]) => {
  if (roles.length === 0) throw new Error("Roles cannot be empty");
  return SetMetadata(ROLES_KEY, roles);
};
