import { Router } from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import db from './database';
import { authenticateToken } from './middleware'; // We will create this middleware next

const router = Router();

router.post('/biodata', authenticateToken, (req, res) => {
  const { id } = req.user;
  const { fullName, placeOfBirth, dateOfBirth, nik, nisn, address, phoneNumber } = req.body;

  try {
    const stmt = db.prepare(`
      UPDATE users 
      SET name = ?, placeOfBirth = ?, dateOfBirth = ?, nik = ?, nisn = ?, address = ?, phoneNumber = ?, biodataStatus = 'Complete'
      WHERE id = ?
    `);
    stmt.run(fullName, placeOfBirth, dateOfBirth, nik, nisn, address, phoneNumber, id);
    res.status(200).json({ message: 'Biodata updated successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while updating biodata.', error });
  }
});

router.post('/confirm-payment', authenticateToken, (req, res) => {
  const { id } = req.user;

  try {
    // In a real app, this might be 'Pending' until finance admin verifies.
    // For now, we'll set it directly to 'Paid'.
    const stmt = db.prepare("UPDATE users SET paymentStatus = 'Paid' WHERE id = ?");
    stmt.run(id);
    res.status(200).json({ message: 'Payment confirmation received. Please wait for admin approval.' });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred.', error });
  }
});

// Multer setup for file uploads
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userUploadDir = path.join(uploadDir, String(req.user.id));
    if (!fs.existsSync(userUploadDir)) {
      fs.mkdirSync(userUploadDir, { recursive: true });
    }
    cb(null, userUploadDir);
  },
  filename: (req, file, cb) => {
    // fieldname will be 'ktp', 'kk', or 'ijazah'
    cb(null, `${file.fieldname}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

router.post('/upload-documents', authenticateToken, upload.fields([
  { name: 'ktp', maxCount: 1 },
  { name: 'kk', maxCount: 1 },
  { name: 'ijazah', maxCount: 1 },
]), (req, res) => {
  const { id } = req.user;
  // Check if files were uploaded
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({ message: 'No files were uploaded.' });
  }

  try {
    const stmt = db.prepare("UPDATE users SET documentStatus = 'Complete' WHERE id = ?");
    stmt.run(id);
    res.status(200).json({ message: 'Documents uploaded successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred.', error });
  }
});

router.post('/submit-test', authenticateToken, (req, res) => {
  const { id } = req.user;
  const { score } = req.body;

  try {
    const stmt = db.prepare("UPDATE users SET tkaStatus = 'Complete', tkaScore = ? WHERE id = ?");
    stmt.run(score, id);
    res.status(200).json({ message: 'Test results submitted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred.', error });
  }
});

export default router;
