import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { JwtService } from '@nestjs/jwt';

import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConversationsModule } from './conversations/conversations.module';
import { MessagesModule } from './messages/messages.module';
import { QueueModule } from './queue/queue.module';
import { WebsocketModule } from './websocket/websocket.module';

import { AuthService } from './auth/auth.service';
import { UsersService } from './users/users.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [AuthModule, UsersModule], // AuthModule exports JwtModule
      inject: [AuthService, JwtService],
      useFactory: (authService: AuthService, jwtService: JwtService) => ({
        autoSchemaFile: 'schema.gql',
        sortSchema: true,
        graphiql: true,
        introspection: true,
        subscriptions: {
          'graphql-ws': {
            onConnect: async (context) => {
              const { connectionParams } = context;
              const token = connectionParams?.authorization || connectionParams?.Authorization;

              if (!token) {
                throw new Error('No authorization token provided');
              }

              const user = await authService.validateToken(token as string);

              if (!user) {
                throw new Error('Unauthorized');
              }

              return { user };
            },
          },
          'subscriptions-transport-ws': {
            onConnect: async (connectionParams) => {
              const token = connectionParams.authorization || connectionParams.Authorization;

              if (!token) {
                throw new Error('No authorization token provided');
              }

              const user = await authService.validateToken(token as string);

              if (!user) {
                throw new Error('Unauthorized');
              }

              return { user };
            },
          },
        },
        context: async ({ req, connection }) => {
          if (connection) {
            return connection.context; // contexte websocket déjà ok
          }
          if (req) {
            const authHeader = req.headers.authorization || req.headers.Authorization;
            if (authHeader) {
              const user = await authService.validateToken(authHeader);
              if (user) {
                req.user = user; // injecte user pour JwtAuthGuard
              }
            }
            return { req };
          }
          return {};
        },
      }),
    }),

    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'message-processing',
    }),

    DatabaseModule,
    AuthModule,
    UsersModule,
    ConversationsModule,
    MessagesModule,
    QueueModule,
    WebsocketModule,
  ],
})
export class AppModule {}