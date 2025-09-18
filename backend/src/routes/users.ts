import { Router } from 'express';
import { changePassword, getMe, updateMe, deleteMe, getUserById } from '../controllers/user.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get('/me', authMiddleware, getMe);
router.patch('/me', authMiddleware, updateMe);
router.delete('/me', authMiddleware, deleteMe);
router.patch('/me/password', authMiddleware, changePassword);

// --- Rotas Públicas ---
// Esta rota pode ser acessada por qualquer um para ver perfis básicos
router.get('/:id', getUserById);

export default router;