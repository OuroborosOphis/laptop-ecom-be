import { Module,forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ResetTokenEntity } from "./resetToken.entity";
import { ResetTokenController } from "./resetToken.controller";
import { ResetTokenService } from "./resetToken.service";
import { UserModule } from "src/user/user.module";
@Module({
    imports: [
      TypeOrmModule.forFeature([ResetTokenEntity]),
      forwardRef(() => UserModule),
    ],
    controllers: [ResetTokenController],
    providers: [ResetTokenService],
    exports: [ResetTokenService] // Chỉ export service là đủ
  })
  export class ResetTokenModule {}