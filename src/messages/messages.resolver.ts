import { Resolver, Query, Mutation, Args, Subscription } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { MessagesService } from './messages.service';
import { Message } from './entities/message.entity';
import { CreateMessageInput } from './dto/create-message.input';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '../users/entities/user.entity';

const pubSub = new PubSub();

@Resolver(() => Message)
export class MessagesResolver {
    constructor(private readonly messagesService: MessagesService) {}

    @Mutation(() => Boolean)
    @UseGuards(JwtAuthGuard)
    async createMessage(
        @Args('createMessageInput') createMessageInput: CreateMessageInput,
        @CurrentUser() user: User,
    ): Promise<boolean> {
        await this.messagesService.create({
            ...createMessageInput,
            senderId: user.id,
        });

        return true;
    }


    @Query(() => [Message])
    @UseGuards(JwtAuthGuard)
    async getMessages(
        @Args('conversationId') conversationId: string,
        @Args('limit', { defaultValue: 50 }) limit: number,
        @Args('offset', { defaultValue: 0 }) offset: number,
    ): Promise<Message[]> {
        return this.messagesService.findByConversation(conversationId, limit, offset);
    }


    @Query(() => Message, { nullable: true })
    @UseGuards(JwtAuthGuard)
    async getMessage(@Args('id') id: string): Promise<Message | null> {
        return this.messagesService.findById(id);
    }

    /**
     * websoack écoute des nouveaux messages
     */
    @Subscription(() => Message, {
        filter: (payload, variables) =>
            payload.messageAdded.conversationId === variables.conversationId,
    })
    messageAdded(@Args('conversationId') _conversationId: string) {
        return (pubSub as any).asyncIterator('messageAdded');
    }
}
