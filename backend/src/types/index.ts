// Global type definitions for the application
export interface User {
  id: number;
  email: string;
  name?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface JWTPayload {
  userId: number;
  email: string;
  iat?: number;
  exp?: number;
}

export interface AuthRequest extends Request {
  user?: User;
}
