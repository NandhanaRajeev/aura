import express from 'express';
import { submitFeedback,getAllFeedback } from '../controllers/feedbackController.js';  // Adjust if necessary

const router = express.Router();

// POST /api/feedback
router.post('/', submitFeedback);
router.get('/', getAllFeedback); // GET /api/feedback

export default router;




