import express from 'express';
import cors from 'cors';
import 'dotenv/config';

// Importando as rotas
import authRouter from './routes/auth';
import userRouter from './routes/users';

const app = express();

// Middlewares essenciais
app.use(cors()); // Permite requisições de diferentes origens (ex: seu frontend)
app.use(express.json()); // Habilita o parsing de JSON no corpo das requisições


app.use('/auth', authRouter);
app.use('/users', userRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});