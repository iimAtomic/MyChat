
import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

@InputType()
export class CreateUserInput {
    @Field()
    @IsEmail()
    email: string;

    @Field()
    @IsNotEmpty()
    username: string;

    @Field()
    @IsNotEmpty()
    password: string;

    @Field({ nullable: true })
    @IsOptional()
    firstName?: string;

    @Field({ nullable: true })
    lastName?: string;

    @Field({ nullable: true })
    @IsOptional()
    avatar?: string;

    @Field({ nullable: true, defaultValue: false })
    @IsOptional()
    @IsBoolean()
    isOnline?: boolean;

    @Field({ nullable: true })
    @IsOptional()
    lastSeen?: Date;
}