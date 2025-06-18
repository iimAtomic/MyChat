import { Module, forwardRef } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesResolver } from './messages.resolver';
import { QueueModule } from '../queue/queue.module';

@Module({
    imports: [forwardRef(() => QueueModule)],
    providers: [MessagesService, MessagesResolver],
    exports: [MessagesService],
})
export class MessagesModule {}
