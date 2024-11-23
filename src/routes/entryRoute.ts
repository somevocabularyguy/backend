import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { isEmail, verifyToken, generateToken } from '@/utils';
import { sendMagicLinkEmail } from '@/mailer';
import { DecodedSignIn } from '@/types';
import { CustomError } from '@/errorTypes';
import { User } from '@/data/models';

const router = express.Router();

router.post('/send-magic-link', async (req: Request, res: Response) => {
  const { email } = req.body as { email: string };
  if (!isEmail(email)) {
    throw new CustomError(400, 'Invalid email format!');
  }

  const response = await sendMagicLinkEmail(email);
  res.status(200).json({ message: 'Email Sent.' })
});


router.get('/verify', async (req: Request, res: Response) => {
  const { signInToken } = req.query as { signInToken: string };
  if (typeof signInToken !== 'string') {
    throw new CustomError(400, 'Token is required and must be a string');
  }

  const decoded: jwt.JwtPayload = await verifyToken(signInToken);

  if (decoded) {
    try {
      const { email } = decoded as DecodedSignIn;
      const existingUser = await User.findOne({ email: email})
      let userId: string;

      if (existingUser) {
        userId = existingUser._id.toString();
      } else {
        const user = await User.create({ email: email });
        userId = user._id.toString()
      }

      const authToken = generateToken({ userId })

      res.cookie('authCookie', authToken, { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });
      res.json('You can go back to your initial page.');

    } catch (error) {
      console.error(error)
      throw new CustomError(500, 'Database error')
    }
  }
  
});

export default router;