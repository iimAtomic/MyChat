// src/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { User as PrismaUser } from '@prisma/client';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { PrismaService } from "../database/prisma.service";

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}

    async findAll(): Promise<User[]> {
        const users = await this.prisma.user.findMany();
        return users.map(this.transformUser);
    }

    async findById(id: string): Promise<User | null> {
        const user = await this.prisma.user.findUnique({
            where: { id }
        });
        return user ? this.transformUser(user) : null;
    }

    async findByEmail(email: string): Promise<User | null> {
        const user = await this.prisma.user.findUnique({
            where: { email }
        });
        return user ? this.transformUser(user) : null;
    }

    async findByEmailWithPassword(email: string): Promise<PrismaUser | null> {
        return this.prisma.user.findUnique({
            where: { email }
        });
    }

    async create(createUserInput: CreateUserInput): Promise<User> {
        const user = await this.prisma.user.create({
            data: {
                email: createUserInput.email,
                username: createUserInput.username,
                firstName: createUserInput.firstName,
                lastName: createUserInput.lastName,
                avatar: createUserInput.avatar,
                isOnline: createUserInput.isOnline || false,
                lastSeen: createUserInput.lastSeen,
            }
        });
        return this.transformUser(user);
    }

    async createFromData(data: {
        email: string;
        username: string;
        password: string;
        firstName?: string;
        lastName?: string;
    }): Promise<User> {
        const user = await this.prisma.user.create({
            data
        });
        return this.transformUser(user);
    }

    async remove(id: string): Promise<User> {
        const user = await this.prisma.user.delete({
            where: { id }
        });
        return this.transformUser(user);
    }

    async findOne(id: string): Promise<User | null> {
        return this.findById(id);
    }

    private transformUser(prismaUser: PrismaUser): User {
        return prismaUser as User;
    }
}