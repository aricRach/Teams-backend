import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from '@nestjs/common';
import admin from '../firebase/firebase-admin';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization || '';
    const token = authHeader.split('Bearer ')[1];

    if (!token) throw new UnauthorizedException('No token provided');

    try {
      request.user = await admin.auth().verifyIdToken(token);
      return true;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}