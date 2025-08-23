import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export interface Auth0User {
  sub: string;
  email?: string;
  name?: string;
  picture?: string;
  aud?: string | string[];
  iss?: string;
  iat?: number;
  exp?: number;
  scope?: string;
  [key: string]: any;
}

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): Auth0User | undefined => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return request.auth;
  },
);