import { JwtPayload } from '../auth/jwt-payload.interface';

declare module 'express-serve-static-core' {
  interface Request {
    user?: JwtPayload;
  }
}
