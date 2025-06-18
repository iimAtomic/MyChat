import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    canActivate(context: ExecutionContext) {
        const ctx = context.switchToHttp();
        const request = ctx.getRequest();

        if (!request) {
            const wsContext = context.switchToWs();
            const user = context.getArgs()[2]?.user;
            if (!user) throw new UnauthorizedException();
            wsContext.getData().user = user;
            return true;
        }

        return super.canActivate(context);
    }

    handleRequest(err, user) {
        if (err || !user) {
            throw err || new UnauthorizedException();
        }
        return user;
    }
}
