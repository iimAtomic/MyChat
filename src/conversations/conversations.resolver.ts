import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { Conversation } from './entities/conversation.entity';
import { CreateConversationInput } from './dto/create-conversation.input';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '../users/entities/user.entity';

@Resolver(() => Conversation)
export class ConversationsResolver {
    constructor(private readonly conversationsService: ConversationsService) {}

    @Mutation(() => Conversation)
    @UseGuards(JwtAuthGuard)
    async createConversation(
        @Args('createConversationInput') createConversationInput: CreateConversationInput,
        @CurrentUser() user: User,
    ): Promise<Conversation> {
        return this.conversationsService.create(createConversationInput, user.id);
    }

    @Query(() => [Conversation])
    @UseGuards(JwtAuthGuard)
    async getMyConversations(@CurrentUser() user: User): Promise<Conversation[]> {
        return this.conversationsService.findByUser(user.id);
    }

    @Query(() => Conversation, { nullable: true })
    @UseGuards(JwtAuthGuard)
    async getConversation(
        @Args('id') id: string,
        @CurrentUser() user: User,
    ): Promise<Conversation | null> {
        return this.conversationsService.findById(id, user.id);
    }

    @Mutation(() => Boolean)
    @UseGuards(JwtAuthGuard)
    async markConversationAsRead(
        @Args('conversationId') conversationId: string,
        @CurrentUser() user: User,
    ): Promise<boolean> {
        await this.conversationsService.markAsRead(conversationId, user.id);
        return true;
    }

    @Mutation(() => Boolean)
    @UseGuards(JwtAuthGuard)
    async addParticipantToConversation(
        @Args('conversationId') conversationId: string,
        @Args('participantId') participantId: string,
        @CurrentUser() user: User,
    ): Promise<boolean> {
        await this.conversationsService.addParticipant(conversationId, user.id, participantId);
        return true;
    }
}
