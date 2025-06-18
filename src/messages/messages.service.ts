import { Injectable } from '@nestjs/common';
import { Message } from './entities/message.entity';
import { PrismaService } from '../database/prisma.service';
import { MessageQueueService } from '../queue/message-queue.service';

@Injectable()
export class MessagesService {
    constructor(
        private prisma: PrismaService,
        private messageQueueService: MessageQueueService,
    ) {}

    // Envoie les données dans la file d'attente pour traitement différé
    async create(data: {
        content: string;
        senderId: string;
        conversationId: string;
        type?: import('@prisma/client').MessageType;
    }): Promise<void> {
        await this.messageQueueService.addMessageToQueue(data);
    }

    // Traitement  du mess  appelé par le processor
    async processMessage(messageData: any): Promise<Message> {
        const message = await this.prisma.message.create({
            data: messageData,
            include: {
                sender: true,
                conversation: true,
            },
        });

        return this.transformMessage(message);
    }

    // Recherche d’un message par ID
    async findById(id: string): Promise<Message | null> {
        const message = await this.prisma.message.findUnique({
            where: { id },
            include: {
                sender: true,
                conversation: true,
            },
        });
        return message ? this.transformMessage(message) : null;
    }

    // Récupère les messages d’une conversation (avec pagination mais marche pas tres bien :) )
    async findByConversation(
        conversationId: string,
        limit?: number,
        offset?: number,
    ): Promise<Message[]> {
        const messages = await this.prisma.message.findMany({
            where: { conversationId },
            include: {
                sender: true,
                conversation: true,
            },
            orderBy: { createdAt: 'desc' },
            take: limit,
            skip: offset,
        });
        return messages.map(this.transformMessage);
    }


    private transformMessage(prismaMessage: any): Message {
        return {
            ...prismaMessage,
            type: prismaMessage.type,
            sender: prismaMessage.sender
                ? {
                    ...prismaMessage.sender,
                    firstName: prismaMessage.sender.firstName,
                    lastName: prismaMessage.sender.lastName,
                    avatar: prismaMessage.sender.avatar,
                    lastSeen: prismaMessage.sender.lastSeen,
                }
                : undefined,
            conversation: prismaMessage.conversation
                ? {
                    ...prismaMessage.conversation,
                    name: prismaMessage.conversation.name,
                }
                : undefined,
        };
    }
}
