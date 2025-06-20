import { Controller } from '@nestjs/common';
import { ResetTokenService } from './resetToken.service';

@Controller('resetToken')
export class ResetTokenController {
  constructor(private readonly resetTokenService: ResetTokenService) {}
}
