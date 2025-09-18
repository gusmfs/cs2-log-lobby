import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthenticatedRequest } from '../interfaces/AuthenticatedRequest';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// FUNÇÃO PARA O USUÁRIO LOGADO BUSCAR SEU PRÓPRIO PERFIL
export const getMe = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      // Usamos 'select' para garantir que NUNCA retornaremos a senha
      select: {
        id: true,
        name: true,
        email: true,
        whatsappNumber: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar perfil do usuário.' });
  }
};

// FUNÇÃO PARA O USUÁRIO LOGADO ATUALIZAR SEU PERFIL
export const updateMe = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  const { name, whatsappNumber } = req.body;

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        whatsappNumber,
      },
      select: { // Novamente, selecionamos os campos seguros para retornar
        id: true,
        name: true,
        email: true,
        whatsappNumber: true,
      },
    });

    return res.status(200).json(updatedUser);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao atualizar o perfil.' });
  }
};

interface GetUserByIdParams {
  id: string;
}
// FUNÇÃO PARA BUSCAR O PERFIL PÚBLICO DE QUALQUER USUÁRIO
export const getUserById = async (req: Request<GetUserByIdParams>, res: Response) => {
    const { id } = req.params;

    try {
        const user = await prisma.user.findUnique({
            where: { id },
            // ATENÇÃO: Selecionamos apenas os dados que consideramos PÚBLICOS
            select: {
                id: true,
                name: true,
                createdAt: true,
            }
        });

        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }

        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao buscar usuário.' });
    }
};

// FUNÇÃO PARA O USUÁRIO LOGADO DELETAR A PRÓPRIA CONTA
export const deleteMe = async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.id;

    try {
        await prisma.user.delete({
            where: { id: userId }
        });

        // 204 No Content é o status ideal para uma deleção bem-sucedida
        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao deletar a conta.' });
    }
}


// FUNÇÃO QUE JÁ TÍNHAMOS: ALTERAR A SENHA
export const changePassword = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    const isPasswordValid = bcrypt.compareSync(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'A senha atual está incorreta.' });
    }

    const hashedNewPassword = bcrypt.hashSync(newPassword, 12);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
    });

    return res.status(200).json({ message: 'Senha alterada com sucesso.' });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao alterar a senha.' });
  }
};