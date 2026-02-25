import { Router } from 'express';
import db from './database';
import { authenticateToken } from './middleware';

const router = Router();

// Middleware to check for admin role
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden: Admins only.' });
  }
  next();
};

router.use(authenticateToken, isAdmin);

router.get('/students', (req, res) => {
  try {
    const stmt = db.prepare('SELECT id, name, email, paymentStatus, biodataStatus, documentStatus, tkaScore, admissionStatus FROM users WHERE role = ?');
    const students = stmt.all('student');
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching students.', error });
  }
});

router.post('/approve-payment', (req, res) => {
  const { userId } = req.body;
  try {
    const stmt = db.prepare("UPDATE users SET paymentStatus = 'Approved' WHERE id = ?");
    stmt.run(userId);
    res.status(200).json({ message: 'Payment approved successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error approving payment.', error });
  }
});

router.post('/approve-documents', (req, res) => {
  const { userId } = req.body;
  try {
    const stmt = db.prepare("UPDATE users SET documentStatus = 'Approved' WHERE id = ?");
    stmt.run(userId);
    res.status(200).json({ message: 'Documents approved successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error approving documents.', error });
  }
});

router.post('/update-admission-status', (req, res) => {
  const { userId, status } = req.body;
  try {
    const stmt = db.prepare("UPDATE users SET admissionStatus = ? WHERE id = ?");
    stmt.run(status, userId);
    res.status(200).json({ message: `Student marked as ${status}.` });
  } catch (error) {
    res.status(500).json({ message: 'Error updating status.', error });
  }
});

export default router;
