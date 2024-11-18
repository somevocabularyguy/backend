import express, { Request, Response } from 'express';
const router = express.Router();

import { isEmail, verifyToken } from '../utils';
import { sendMagicLinkEmail } from '../mailer';


router.post('/send-magic-link', async (req: Request, res: Response) => {
  console.log(req.body)
  const { email } = req.body;
  console.log(email);

  if (!isEmail(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  sendMagicLinkEmail(email);
});


router.get('/verify', async (req: Request, res: Response) => {
  const { token } = req.query;
  if (typeof token !== 'string') {
    return res.status(400).send('Token is required and must be a string');
  }
  if (await verifyToken(token) === 'error') {
    return res.status(401).send('Invalid token');
  }

  res.cookie('token', token, { httpOnly: true, secure: false });
  res.redirect('http://localhost:3000');
});

export default router;