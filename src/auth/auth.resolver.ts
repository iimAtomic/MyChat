import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginInput } from './dto/login.input';
import { RegisterInput } from './dto/register.input';
import { AuthPayload } from './entities/auth-payload.entity';

@Resolver()
export class AuthResolver {
    constructor(private readonly authService: AuthService) {}

    @Mutation(() => AuthPayload)
    async login(@Args('loginInput') loginInput: LoginInput): Promise<AuthPayload> {
        return this.authService.login(loginInput);
    }

    @Mutation(() => AuthPayload)
    async register(@Args('registerInput') registerInput: RegisterInput): Promise<AuthPayload> {
        return this.authService.register(registerInput);
    }
}
