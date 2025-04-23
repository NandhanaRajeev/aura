import express from 'express';
import { submitFeedback } from '../controllers/feedbackController.js';  // Adjust if necessary

const router = express.Router();

// POST /api/feedback
router.post('/', submitFeedback);

export default router;




