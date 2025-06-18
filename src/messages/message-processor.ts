import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { MessagesService } from './messages.service';
import { PubSub } from 'graphql-subscriptions';

const pubSub = new PubSub();

@Processor('message-processing')
export class MessageProcessor {
    constructor(private readonly messagesService: MessagesService) {}

    @Process('process-message')
    async handleMessage(job: Job) {
        const messageData = job.data;

        const message = await this.messagesService.processMessage(messageData);

        await pubSub.publish('messageAdded', {
            messageAdded: message,
            conversationId: message.conversationId,
        });

        return message;
    }
}
