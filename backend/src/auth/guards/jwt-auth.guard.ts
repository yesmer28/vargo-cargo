import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const token = extractBearerToken(request.headers.authorization);

    if (!token) {
      throw new UnauthorizedException('Debe iniciar sesión para rastrear paquetes.');
    }

    try {
      const payload = this.jwtService.verify<{ sub: string }>(token);
      request.user = { id: payload.sub };
      return true;
    } catch {
      throw new UnauthorizedException('Sesión expirada o no válida.');
    }
  }
}

function extractBearerToken(header?: string): string | null {
  if (!header?.startsWith('Bearer ')) {
    return null;
  }

  return header.slice(7).trim() || null;
}
