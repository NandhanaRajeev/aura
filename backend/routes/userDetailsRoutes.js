// routes/userDetailsRoute.js
import express from 'express';
import db from '../db.js';

const router = express.Router();

router.post('/ProfileForm', (req, res) => {
  const { fullName, mobile, email, gender, dob, address } = req.body;

  const query = `
    INSERT INTO user_details (full_name, mobile, email, gender, dob, address)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const values = [fullName, mobile, email, gender, dob, address];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Error inserting data:', err);
      return res.status(500).json({ error: 'Database insert failed' });
    }
    res.status(200).json({ message: 'Data inserted successfully' });
  });
});

export default router;
