import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { UserService } from 'src/user/user.service';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private userService:UserService
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean>  {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) return false;
    const request = context.switchToHttp().getRequest();
    console.log(request);
    const user = request.user.user;
    console.log(user)
    // check xem role của user có nằm trong list có quyền truy cập api hay k
    const foundUser = await this.userService.findByEmail(user.email)
    console.log(foundUser)
    // nếu user decode từ jwt thành công và role có tồn tại thì pass
    return !!(foundUser && foundUser.role && roles.includes(foundUser.role))

  }
}
