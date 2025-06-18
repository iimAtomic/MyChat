import { Module, forwardRef } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { MessageQueueService } from './message-queue.service';
import { MessageQueueProcessor } from './message-queue.processor';
import { WebsocketModule } from '../websocket/websocket.module';
import { MessagesModule } from '../messages/messages.module';

@Module({
    imports: [
        BullModule.registerQueue({
            name: 'message-processing',
        }),
        forwardRef(() => MessagesModule), // ici forwardRef  est utilisé pour bloquer les dependances circulaires qui me fatiguaient
        WebsocketModule,
    ],
    providers: [MessageQueueService, MessageQueueProcessor],
    exports: [MessageQueueService],
})
export class QueueModule {}