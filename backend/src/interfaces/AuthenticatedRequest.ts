import { Request } from 'express';


export interface TokenPayload {
  id: string;
  email: string;
}

export interface AuthenticatedRequest extends Request {
  user?: TokenPayload;
}