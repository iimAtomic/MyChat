// src/users/entities/user.entity.ts
import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class User {
    @Field(() => ID)
    id: string;

    @Field()
    email: string;

    @Field()
    username: string;

    // Pas de @Field() pour ne pas exposer dans GraphQL
    password: string;

    @Field({ nullable: true })
    firstName?: string;

    @Field({ nullable: true })
    lastName?: string;

    @Field({ nullable: true })
    avatar?: string;

    @Field()
    isOnline: boolean;

    @Field({ nullable: true })
    lastSeen?: Date;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;
}