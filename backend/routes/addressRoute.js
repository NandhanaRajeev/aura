import express from 'express';
import { submitaddress } from '../controllers/addressController.js';  // Adjust if necessary

const router = express.Router();

// POST /api/address
router.post('/', submitaddress);

export default router;




