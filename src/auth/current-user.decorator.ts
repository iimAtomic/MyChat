import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
    (data: unknown, context: ExecutionContext) => {
        const ctx = context.switchToHttp();
        const request = ctx.getRequest();

        if (request) {
            return request.user;
        } else {
            // WebSocket context
            const wsContext = context.switchToWs();
            return wsContext.getData().user;
        }
    },
);
