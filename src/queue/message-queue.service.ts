import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class MessageQueueService {
    constructor(
        @InjectQueue('message-processing') private messageQueue: Queue,
    ) {}

    async addMessageToQueue(messageData: any) {
        await this.messageQueue.add('process-message', messageData, {
            delay: 1000, // Délai de 1 seconde
            attempts: 3,
            backoff: {
                type: 'exponential',
                delay: 2000,
            },
        });
    }

    async addNotificationToQueue(notificationData: any) {
        await this.messageQueue.add('send-notification', notificationData);
    }

    async getQueueStats() {
        const waiting = await this.messageQueue.getWaiting();
        const active = await this.messageQueue.getActive();
        const completed = await this.messageQueue.getCompleted();
        const failed = await this.messageQueue.getFailed();

        return {
            waiting: waiting.length,
            active: active.length,
            completed: completed.length,
            failed: failed.length,
        };
    }
}
