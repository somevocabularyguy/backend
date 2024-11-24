import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { isEmail, verifyToken, generateToken } from '@/utils';
import { sendMagicLinkEmail } from '@/mailer';
import { DecodedSignIn, DecodedAuth } from '@/types';
import { CustomError } from '@/errorTypes';
import { User, UserDeletion } from '@/data/models';

const router = express.Router();

router.post('/send-magic-link', async (req: Request, res: Response) => {
  const { email } = req.body as { email: string };
  if (!isEmail(email)) {
    throw new CustomError(400, 'Invalid email format!');
  }

  const response = await sendMagicLinkEmail(email);
  if (response.status === 200) {
    res.status(200).json({ message: 'Email Sent.' })
  }

  const user = await User.findOne({ email: email });
  if (user?.willBeDeleted) {
    await UserDeletion.deleteOne({ userId: user._id })
  }
});


router.get('/verify', async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const signInToken = authHeader?.split(' ')[1];

  if (!signInToken) {
    throw new CustomError(400, 'Token is required and must be a string');
  }
    
  const decoded: jwt.JwtPayload = await verifyToken(signInToken);

  if (decoded) {
    try {
      const { email } = decoded as DecodedSignIn;
      const existingUser = await User.findOne({ email: email })
      let userId: string;

      if (existingUser) {
        userId = existingUser._id.toString();
      } else {
        const user = await User.create({ email: email });
        userId = user._id.toString()
      }

      const authToken = generateToken({ userId })
      res.json({ authToken: authToken });

    } catch (error) {
      console.error(error)
      throw new CustomError(500, 'Database error')
    }
  }
});

router.delete('/delete-account', async (req, res) => {
  const authHeader = req.headers.authorization;
  const authToken = authHeader?.split(' ')[1];
  if (!authToken) {
    return res.status(400).json('No Token');
  }
  try {
    const decoded = await verifyToken(authToken);
    const { userId } = decoded as DecodedAuth;
    await UserDeletion.create({ userId: userId });
    await User.findOneAndUpdate({ _id: userId }, { willBeDeleted: true });
    return res.status(202).json({ message: "Success" });
  } catch (error) {
    console.error(error)
  }

})

export default router;