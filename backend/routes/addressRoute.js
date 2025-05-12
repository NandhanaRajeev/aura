import express from 'express';
import { submitaddress, getUserAddress } from '../controllers/addressController.js';
import { authenticateUser } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', authenticateUser, submitaddress); // ✅ protect this route
router.get('/address/:user_id', authenticateUser, getUserAddress);

export default router;
