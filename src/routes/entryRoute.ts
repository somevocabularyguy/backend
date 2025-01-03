import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { CustomError } from '@/errorTypes';
import { sendMagicLinkEmail } from '@/mailer';
import { DecodedSignIn, DecodedAuth } from '@/types';
import { User, UserDeletion, WaitingVerify } from '@/data/models';
import { isEmail, verifyToken, generateToken, isTokenExpired } from '@/utils';

const router = express.Router();

router.post('/send-magic-link', async (req: Request, res: Response) => {
  const { email } = req.body as { email: string };
  console.log("🚀 ~ file: entryRoute.ts:14 ~ email:", email);
  if (!isEmail(email)) {
    console.log("🚀 ~ file: entryRoute.ts:16 ~ email:", email);
    throw new CustomError(400, 'Invalid email format!');
  }

  const response = await sendMagicLinkEmail(email);
  console.log("🚀 ~ file: entryRoute.ts:21 ~ response:", response);
  if (response.status === 200) {
    const tempVerifyToken = generateToken({ email }, '24h')
    console.log("🚀 ~ file: entryRoute.ts:24 ~ tempVerifyToken:", tempVerifyToken);
    res.status(200).json({ tempVerifyToken: tempVerifyToken })
    await WaitingVerify.create({ email: email });
  }
});

router.get('/verify-magic-link', async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const signInToken = authHeader?.split(' ')[1];
  console.log("🚀 ~ file: entryRoute.ts:33 ~ signInToken:", signInToken);

  if (!signInToken) {
    throw new CustomError(400, 'Token is required and must be a string');
  }

  if (isTokenExpired(signInToken)) return res.status(401).json('Link Is Expired.');
    
  const decoded: jwt.JwtPayload = await verifyToken(signInToken);
  console.log("🚀 ~ file: entryRoute.ts:42 ~ decoded:", decoded);

  if (decoded) {
    try {
      const { email } = decoded as DecodedSignIn;
      console.log("🚀 ~ file: entryRoute.ts:47 ~ email:", email);
      const isWaiting = await WaitingVerify.findOne({ email: email })
      console.log("🚀 ~ file: entryRoute.ts:49 ~ isWaiting:", isWaiting);

      if (!isWaiting) return res.status(401).json('No Entry.');
      if (isWaiting.verified) return res.status(200).json('Verified')

      await WaitingVerify.updateOne({ email: email }, { $set: { verified: true }})

      const existingUser = await User.findOne({ email: email })
      console.log("🚀 ~ file: entryRoute.ts:57 ~ existingUser:", existingUser);

      if (!existingUser) {
        await User.create({ email: email });
      }

      if (existingUser?.willBeDeleted) {
        await UserDeletion.deleteMany({ userId: existingUser._id })
        await User.updateOne({ _id: existingUser._id }, { $set: { willBeDeleted: false }})
      }
      res.status(200).json('Verified');
    } catch (error) {
      console.log("🚀 ~ file: entryRoute.ts:69 ~ error:", error);
      throw new CustomError(500, 'Database error')
    }
  }
});

router.get('/verify-sign-in', async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const tempVerifyToken = authHeader?.split(' ')[1];
  console.log("🚀 ~ file: entryRoute.ts:76 ~ tempVerifyToken:", tempVerifyToken);

  if (!tempVerifyToken) {
    throw new CustomError(400, 'Token is required and must be a string');
  }

  const decoded: jwt.JwtPayload = await verifyToken(tempVerifyToken);
  console.log("🚀 ~ file: entryRoute.ts:83 ~ decoded:", decoded);
  const { email } = decoded;
  console.log("🚀 ~ file: entryRoute.ts:87 ~ email:", email);
  const waitingVerifyObject = await WaitingVerify.findOne({ email })
  console.log("🚀 ~ file: entryRoute.ts:86 ~ waitingVerifyObject:", waitingVerifyObject);

  if (!decoded || isTokenExpired(tempVerifyToken) || !waitingVerifyObject) return res.status(401).json(null);

  if (!waitingVerifyObject.verified) return res.status(403).json(null);

  const user = await User.findOne({ email: email });
  console.log("🚀 ~ file: entryRoute.ts:93 ~ user:", user);
  if (!user) return res.status(403).json(null);
  const userId = user._id
  const authToken = generateToken({ userId });
  console.log("🚀 ~ file: entryRoute.ts:97 ~ authToken:", authToken);

  res.status(200).json({ authToken: authToken });
  await WaitingVerify.deleteOne({ _id: waitingVerifyObject._id })
});

router.delete('/delete-account', async (req, res) => {
  const authHeader = req.headers.authorization;
  const authToken = authHeader?.split(' ')[1];
  console.log("🚀 ~ file: entryRoute.ts:109 ~ authToken:", authToken);
  if (!authToken) {
    return res.status(400).json('No Token');
  }
  try {
    const decoded = await verifyToken(authToken);
    console.log("🚀 ~ file: entryRoute.ts:115 ~ decoded:", decoded);
    const { userId } = decoded as DecodedAuth;
    await UserDeletion.create({ userId: userId });
    await User.findOneAndUpdate({ _id: userId }, { willBeDeleted: true });
    return res.status(202).json({ message: "Success" });
  } catch (error) {
    console.log("🚀 ~ file: entryRoute.ts:121 ~ error:", error);
    console.error(error)
  }

})

export default router;