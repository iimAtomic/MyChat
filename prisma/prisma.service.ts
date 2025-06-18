import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    constructor() {
        super({

            log: ['query', 'info', 'warn', 'error'],
            errorFormat: 'pretty',
        });
    }

    async onModuleInit() {
        await this.$connect();
        console.log('🔌 Connected to database');
    }

    async onModuleDestroy() {
        await this.$disconnect();
        console.log('🔌 Disconnected from database');
    }


    async cleanDatabase() {
        const models = Reflect.ownKeys(this).filter(key => key[0] !== '_');

        return Promise.all(
            models.map((modelKey) => {
                const model = this[modelKey as keyof this];
                if (model && typeof model === 'object' && 'deleteMany' in model) {
                    return (model as any).deleteMany();
                }
            })
        );
    }


    async executeTransaction<T>(
        callback: (prisma: PrismaClient) => Promise<T>
    ): Promise<T> {
        return this.$transaction(callback);
    }
}