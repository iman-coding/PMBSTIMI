import express from 'express';
import cookieParser from 'cookie-parser';
import { initDb } from './src/server/database';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  initDb();
  const PORT = 3000;

  app.use(express.json());
  app.use(cookieParser());

  import authRoutes from './src/server/auth';

  import studentRoutes from './src/server/student';

  app.use('/api/auth', authRoutes);
  import adminRoutes from './src/server/admin';

  app.use('/api/student', studentRoutes);
  import meRoutes from './src/server/me';

  app.use('/api/admin', adminRoutes);
  app.use('/api/student', meRoutes);
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
