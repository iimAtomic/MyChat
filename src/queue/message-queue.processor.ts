// src/queue/message-queue.processor.ts
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Injectable } from '@nestjs/common';
import { MessagesService } from '../messages/messages.service';
import { WebsocketGateway } from '../websocket/websocket.gateway';

@Processor('message-processing')
@Injectable()
export class MessageQueueProcessor {
    constructor(
        private messagesService: MessagesService,
        private websocketGateway: WebsocketGateway,
    ) {}

    @Process('process-message')
    async handleMessageProcessing(job: Job) {
        const { messageData } = job.data;


        const processedMessage = await this.messagesService.processMessage(messageData);


        this.websocketGateway.sendMessageToConversation(
            processedMessage.conversationId,
            processedMessage,
        );

        return processedMessage;
    }

    @Process('send-notification')
    async handleNotification(job: Job) {
        const { notificationData } = job.data;

        console.log('Sending notification:', notificationData);
    }
}