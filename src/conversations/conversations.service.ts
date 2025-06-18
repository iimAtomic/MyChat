import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Conversation } from './entities/conversation.entity';

@Injectable()
export class ConversationsService {
    constructor(private prisma: PrismaService) {}

    async create(input: any, userId: string): Promise<Conversation> {
        const participantIds = Array.from(new Set([userId, ...input.participantIds]));

        // Rechercher si une conversation entre ces utilisateurs existe déjà
        if (!input.isGroup && participantIds.length === 2) {
            const existingConversation = await this.prisma.conversation.findFirst({
                where: {
                    isGroup: false,
                    participants: {
                        every: {
                            userId: {
                                in: participantIds
                            }
                        }
                    }
                },
                include: {
                    participants: { include: { user: true } },
                    messages: true,
                },
            });

            if (existingConversation) {
                return this.transformConversation(existingConversation);
            }
        }

        const conversation = await this.prisma.conversation.create({
            data: {
                name: input.name,
                isGroup: input.isGroup ?? false,
                participants: {
                    create: participantIds.map((id: string) => ({
                        userId: id
                    }))
                }
            },
            include: {
                participants: { include: { user: true } },
                messages: true
            }
        });

        return this.transformConversation(conversation);
    }

    async findByUser(userId: string): Promise<Conversation[]> {
        const conversations = await this.prisma.conversation.findMany({
            where: {
                participants: {
                    some: {
                        userId: userId
                    }
                }
            },
            include: {
                participants: { include: { user: true } },
                messages: true
            }
        });
        return conversations.map(this.transformConversation);
    }

    async findById(id: string, userId: string): Promise<Conversation | null> {
        const conversation = await this.prisma.conversation.findFirst({
            where: {
                id,
                participants: {
                    some: {
                        userId
                    }
                }
            },
            include: {
                participants: { include: { user: true } },
                messages: true
            }
        });
        return conversation ? this.transformConversation(conversation) : null;
    }

    async markAsRead(conversationId: string, userId: string): Promise<void> {
        // a faire mardi
    }

    async addParticipant(conversationId: string, userId: string, participantId: string): Promise<void> {
        // a faire mardi
    }

    private transformConversation(prismaConversation: any): Conversation {
        return {
            ...prismaConversation,
            name: prismaConversation.name,
            participants: prismaConversation.participants?.map((p: any) => ({
                ...p,
                user: {
                    ...p.user,
                    firstName: p.user.firstName,
                    lastName: p.user.lastName,
                    avatar: p.user.avatar,
                    lastSeen: p.user.lastSeen,
                }
            })) || [],
            messages: prismaConversation.messages || []
        };
    }
}
