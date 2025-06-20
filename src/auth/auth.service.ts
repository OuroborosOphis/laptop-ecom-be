import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/user.interface';
const bcrypt = require('bcrypt');
@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  genarateToken(user: User): Promise<string> {
    return this.jwtService.signAsync(user);
  }

  hashPassword(password: string): Promise<any> {
    return bcrypt.hash(password, 12);
  }

  comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
