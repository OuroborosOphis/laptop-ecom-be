import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { RoleGuard } from './guards/role.guard';
import { JwtGuard } from './guards/jwt.guard';
import { JwtStrategy } from './guards/jwt.stradegy';
import { UserModule } from 'src/user/user.module';
import { UserIsAuthorGuard } from './guards/user-is-author-guard';

@Module({
  imports: [
    forwardRef(()=>UserModule),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '10000s' },
      }),
    }),
  ],
  providers: [AuthService,RoleGuard,JwtGuard,JwtStrategy,UserIsAuthorGuard],
  exports:[AuthService]
})
export class AuthModule {}
