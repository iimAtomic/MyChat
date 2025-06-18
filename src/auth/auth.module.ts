import { Module } from '@nestjs/common';
import { JwtModule , JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { JwtStrategy } from './jwt.strategy';
import { UsersModule } from '../users/users.module';

@Module({
    imports: [
        ConfigModule,
        PassportModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET') || 'defaultSecret',
                signOptions: { expiresIn: '7d' },
            }),
        }),
        UsersModule,
    ],
    providers: [AuthService, AuthResolver, JwtStrategy],
    exports: [AuthService , JwtModule],
})
export class AuthModule {}
