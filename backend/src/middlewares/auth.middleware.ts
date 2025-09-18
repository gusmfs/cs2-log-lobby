import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest, TokenPayload } from '../interfaces/AuthenticatedRequest';

export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: 'Token não fornecido.' });
  }

  // Pega apenas o token, ignorando o "Bearer "
  const token = authorization.split(' ')[1];

  try {
    const data = jwt.verify(token, process.env.JWT_SECRET || 'seu_segredo_aqui');

    req.user = data as TokenPayload;

    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido ou expirado.' });
  }
};