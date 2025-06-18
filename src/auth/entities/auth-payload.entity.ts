import { ObjectType, Field } from '@nestjs/graphql';
import { User } from '../../users/entities/user.entity';

@ObjectType()
export class AuthPayload {
    @Field()
    access_token: string;

    @Field(() => User)
    user: User;
}
