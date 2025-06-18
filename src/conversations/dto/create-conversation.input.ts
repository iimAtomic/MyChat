import { InputType, Field } from '@nestjs/graphql';
import { IsOptional, IsBoolean, IsArray, ArrayNotEmpty } from 'class-validator';

@InputType()
export class CreateConversationInput {
  @Field()
  @IsOptional()
  @IsBoolean()
  isGroup?: boolean;

  @Field(() => [String])
  @IsArray()
  @ArrayNotEmpty()
  participantIds: string[];
}