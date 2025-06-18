
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { MessageType } from '@prisma/client';
import { User } from '../../users/entities/user.entity';
import { Conversation } from '../../conversations/entities/conversation.entity';



@ObjectType()
export class Message {
    @Field(() => ID)
    id: string;

    @Field()
    content: string;

    @Field(() => String)
    type: MessageType;

    @Field()
    senderId: string;

    @Field()
    conversationId: string;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;

    // Relations
    @Field(() => User)
    sender: User;

    @Field(() => Conversation)
    conversation: Conversation;
}

export { MessageType } from '@prisma/client';
