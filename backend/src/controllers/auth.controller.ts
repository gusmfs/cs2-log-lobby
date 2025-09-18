// Em src/controllers/auth.controller.ts

import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto'; // Módulo nativo do Node.js

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'seu_segredo_super_secreto';

// --- FUNÇÃO DE REGISTRO ---
export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Este e-mail já está em uso.' });
    }

    const hashedPassword = bcrypt.hashSync(password, 12);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
      select: { id: true, name: true, email: true }, // Nunca retorne a senha
    });

    return res.status(201).json(user);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao registrar usuário.' });
  }
};

// --- FUNÇÃO DE LOGIN ---
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: '7d', // Token expira em 7 dias
    });

    // Remove a senha do objeto de usuário antes de enviar a resposta
    const { password: _, ...userWithoutPassword } = user;

    return res.json({ user: userWithoutPassword, token });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao fazer login.' });
  }
};

// --- FLUXO DE "ESQUECEU SUA SENHA" ---

// Solicitar a redefinição
export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Importante: Não informe ao cliente que o e-mail não foi encontrado por segurança
      return res.status(200).json({ message: 'Se o e-mail estiver cadastrado, um link de redefinição será enviado.' });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    const now = new Date();
    now.setHours(now.getHours() + 1); // Token válido por 1 hora

    await prisma.user.update({
      where: { email },
      data: {
        passwordResetToken: resetToken,
        passwordResetExpires: now,
      },
    });

    // =======================================================================
    // AQUI ENTRA A LÓGICA DE ENVIO DE E-MAIL (Ex: Nodemailer, SendGrid)
    // Você precisa implementar um serviço para enviar o e-mail abaixo.
    console.log(`Enviando e-mail para ${email} com o token: ${resetToken}`);
    // Exemplo de link: http://seu-frontend.com/reset-password?token=${resetToken}
    // =======================================================================

    return res.status(200).json({ message: 'Se o e-mail estiver cadastrado, um link de redefinição será enviado.' });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao processar a solicitação de redefinição de senha.' });
  }
};

// Redefinir a senha com o token
export const resetPassword = async (req: Request, res: Response) => {
    const { token, newPassword } = req.body;

    try {
        const user = await prisma.user.findFirst({
            where: {
                passwordResetToken: token,
                passwordResetExpires: { gte: new Date() }, // Verifica se o token não expirou
            },
        });

        if (!user) {
            return res.status(400).json({ error: 'Token inválido ou expirado.' });
        }

        const hashedPassword = bcrypt.hashSync(newPassword, 12);

        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                passwordResetToken: null, // Limpa o token para não ser reutilizado
                passwordResetExpires: null,
            },
        });

        return res.status(200).json({ message: 'Senha redefinida com sucesso.' });
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao redefinir a senha.' });
    }
};