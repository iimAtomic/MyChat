import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class WsJwtGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const client = context.switchToWs().getClient();
    const token = client.handshake.auth?.token;

    if (!token) throw new WsException('Token manquant');

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'yourSecret');
      client.user = decoded;
      return true;
    } catch (err) {
      throw new WsException('Token invalide');
    }
  }
}
