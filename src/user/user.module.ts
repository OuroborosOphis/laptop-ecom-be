import { Module,forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./user.entity";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { AuthModule } from "src/auth/auth.module";
import { ResetTokenModule } from "src/resetToken/resetToken.module";
import { MailModule } from "src/mail/mail.module";
import { OrderModule } from "src/order/order.module";
// import { BlogModule } from "src/blog/blog.module";

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity]), forwardRef(() => AuthModule),forwardRef(()=>ResetTokenModule),forwardRef(()=>OrderModule), MailModule],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService] // Đảm bảo UserService được export ở đây
  })
  export class UserModule {}