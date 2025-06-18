import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { AuthPayload } from './entities/auth-payload.entity';
import { RegisterInput } from './dto/register.input';
import {LoginInput} from "./dto/login.input";

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {}

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.usersService.findByEmail(email);
        if (user && await bcrypt.compare(password, user.password)) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(loginInput: LoginInput): Promise<AuthPayload> {
        const { email, password } = loginInput;
        const user = await this.validateUser(email, password);
        if (!user) {
            throw new Error('Invalid credentials');
        }
        const payload = { sub: user.id, email: user.email };
        return {
            access_token: this.jwtService.sign(payload),
            user: user
        };
    }
    async register(registerInput: RegisterInput): Promise<AuthPayload> {
        const hashedPassword = await bcrypt.hash(registerInput.password, 10);

        const user = await this.usersService.createFromData({
            email: registerInput.email,
            username: registerInput.username,
            password: hashedPassword,
            firstName: registerInput.firstName,
            lastName: registerInput.lastName,
        });

        const payload = { sub: user.id, email: user.email };
        return {
            access_token: this.jwtService.sign(payload),
            user: user,
        };
    }
    async validateToken(token?: string) {
        if (!token) return null;


        if (token.startsWith('Bearer ')) {
            token = token.slice(7);
        }

        try {
            const payload = this.jwtService.verify(token, {
                secret: process.env.JWT_SECRET || 'yourSecret',
            });

            const user = await this.usersService.findById(payload.sub);
            if (!user) return null;

            const { password, ...result } = user;
            return result;
        } catch (error) {
            return null;
        }
    }

}