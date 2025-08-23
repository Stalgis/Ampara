import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { expressjwt } from 'express-jwt';
import { expressJwtSecret } from 'jwks-rsa';

interface Auth0User {
  sub: string;
  email?: string;
  name?: string;
  picture?: string;
  [key: string]: any;
}

declare global {
  namespace Express {
    interface Request {
      auth?: Auth0User;
    }
  }
}

@Injectable()
export class Auth0Guard implements CanActivate {
  private jwtCheck: any;

  constructor(private configService: ConfigService) {
    const domain = this.configService.get<string>('AUTH0_DOMAIN');
    const audience = this.configService.get<string>('AUTH0_AUDIENCE');

    if (!domain || !audience) {
      throw new Error('AUTH0_DOMAIN and AUTH0_AUDIENCE must be configured');
    }

    this.jwtCheck = expressjwt({
      secret: expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://${domain}/.well-known/jwks.json`,
      }) as any,
      audience: audience,
      issuer: `https://${domain}/`,
      algorithms: ['RS256'],
      credentialsRequired: true,
      getToken: (req: Request) => {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
          return authHeader.substring(7);
        }
        return undefined;
      },
    });
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    
    return new Promise((resolve, reject) => {
      this.jwtCheck(request, {} as any, (err: any) => {
        if (err) {
          console.error('JWT validation error:', err);
          reject(new UnauthorizedException('Invalid or missing token'));
        } else {
          resolve(true);
        }
      });
    });
  }
}

@Injectable()
export class OptionalAuth0Guard implements CanActivate {
  private jwtCheck: any;

  constructor(private configService: ConfigService) {
    const domain = this.configService.get<string>('AUTH0_DOMAIN');
    const audience = this.configService.get<string>('AUTH0_AUDIENCE');

    if (!domain || !audience) {
      throw new Error('AUTH0_DOMAIN and AUTH0_AUDIENCE must be configured');
    }

    this.jwtCheck = expressjwt({
      secret: expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://${domain}/.well-known/jwks.json`,
      }) as any,
      audience: audience,
      issuer: `https://${domain}/`,
      algorithms: ['RS256'],
      credentialsRequired: false, // This makes the token optional
      getToken: (req: Request) => {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
          return authHeader.substring(7);
        }
        return undefined;
      },
    });
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    
    return new Promise((resolve) => {
      this.jwtCheck(request, {} as any, (err: any) => {
        if (err) {
          // For optional auth, we allow the request to proceed even if token is invalid
          console.warn('Optional JWT validation failed:', err.message);
        }
        resolve(true);
      });
    });
  }
}