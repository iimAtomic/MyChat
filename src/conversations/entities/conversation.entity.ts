import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from '../../users/entities/user.entity';
import {Message} from "../../messages/entities/message.entity";

@ObjectType()
export class ConversationUser {
    @Field(() => ID)
    id: string;

    @Field()
    userId: string;

    @Field()
    conversationId: string;

    @Field()
    joinedAt: Date;

    @Field(() => Date, { nullable: true })
    lastReadAt?: Date;

    @Field(() => User)
    user: User;
}

@ObjectType()
export class Conversation {
    @Field(() => ID)
    id: string;

    @Field(() => String, { nullable: true })
    name?: string;

    @Field()
    isGroup: boolean;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;

    // Relations
    @Field(() => [ConversationUser])
    participants: ConversationUser[];

    @Field(() => [Message], { nullable: true })
    messages?: any[];
}