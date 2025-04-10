import { Request } from 'express';
import { SignInType } from './modules/manage/auth/dto/signIn.dto';

declare global {
  export interface AuthPayload {
    sub: string;
    type: SignInType;
    refresh?: boolean;
  }

  export type AuthRequest = Request & { user: AuthPayload };
}
