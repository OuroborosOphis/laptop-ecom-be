import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { ResetTokenEntity } from "./resetToken.entity";
import { ResetTokenDto } from "./resetToken.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { UserService } from "src/user/user.service";

@Injectable()
export class ResetTokenService {
    constructor(
        @InjectRepository(ResetTokenEntity)
        private readonly resetTokenRepository: Repository<ResetTokenEntity>,
        @Inject(forwardRef(() => UserService))
        private readonly userService: UserService
      ) {}

    async create(resetToken:ResetTokenDto):Promise<any> {
        // Xóa token cũ nếu có
  await this.resetTokenRepository.delete({ user: { id: resetToken.userId } });

     const newResetToken = new ResetTokenEntity()
     newResetToken.token = resetToken.token
     newResetToken.expriedAt = resetToken.expriedAt
     const user = await this.userService.findOne(resetToken.userId)
     if(!user) return "id không hợp lệ"
     newResetToken.user = user

     return await this.resetTokenRepository.save(newResetToken)
    }

    async findOne(token: string): Promise<ResetTokenEntity | null> {
      return await this.resetTokenRepository.findOne({
         where: { token },
         relations:['user'] 
        });
    }

}