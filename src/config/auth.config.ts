// src/config/auth.config.ts
import { registerAs } from '@nestjs/config';

export interface AuthConfig {
  secret: string;
  refreshSecret: string;
  expiresIn: string;
  refreshExpiresIn: string;
}

export const authConfig = registerAs(
  'auth',
  (): AuthConfig => ({
    secret: 'access_secret_key',
    refreshSecret: 'refresh_secret_key',
    expiresIn: '15m',
    refreshExpiresIn: '7d',
  }),
);
