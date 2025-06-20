import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { User } from "src/user/user.interface";
import { UserService } from "src/user/user.service";

@Injectable()
export class UserIsAuthorGuard implements CanActivate {
    constructor(
        private userService:UserService,
    ) { }

    async canActivate(context: ExecutionContext):  Promise<boolean> {
        const request = context.switchToHttp().getRequest()
        const params = request.params
        const blogId: number = Number(params.id)
        const user:User = request.user.user

        try {
            if(!user.id) return false
            const foundUser = await this.userService.findOne(user.id)


            return !!foundUser
        } catch (error) {
            return false
        }
    }
}