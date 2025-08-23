import { Module } from '@nestjs/common';
import { Auth0Guard, OptionalAuth0Guard } from './auth0.guard';

@Module({
  providers: [Auth0Guard, OptionalAuth0Guard],
  exports: [Auth0Guard, OptionalAuth0Guard],
})
export class Auth0Module {}