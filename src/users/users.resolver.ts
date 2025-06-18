import { Resolver, Query, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Resolver(() => User)
export class UsersResolver {
    constructor(private readonly usersService: UsersService) {}

    @Query(() => [User])
    @UseGuards(JwtAuthGuard)
    async users(): Promise<User[]> {
        return this.usersService.findAll();
    }

    @Query(() => User)
    @UseGuards(JwtAuthGuard)
    async me(@CurrentUser() user: User): Promise<User> {
        return user;
    }

    @Query(() => User, { nullable: true })
    @UseGuards(JwtAuthGuard)
    async user(@Args('id') id: string): Promise<User | null> {
        return this.usersService.findById(id);
    }
}