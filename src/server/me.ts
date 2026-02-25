import { Router } from 'express';
import db from './database';
import { authenticateToken } from './middleware';

const router = Router();

router.get('/me', authenticateToken, (req, res) => {
  const { id } = req.user;
  try {
    const stmt = db.prepare('SELECT id, name, email, role, paymentStatus, biodataStatus, documentStatus, tkaStatus, admissionStatus FROM users WHERE id = ?');
    const user = stmt.get(id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'An error occurred.', error });
  }
});

export default router;
