import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { MessageType } from '../entities/message.entity';

@InputType()
export class CreateMessageInput {
    @Field()
    @IsNotEmpty()
    content: string;

    @Field(() => String, { defaultValue: MessageType.TEXT })
    @IsOptional()
    @IsEnum(MessageType)
    type?: MessageType;

    @Field()
    @IsNotEmpty()
    conversationId: string;
}