import express, { Request, Response } from 'express';

import { UserData, User } from '@/data/models';
import { CustomError } from '@/errorTypes';
import { DecodedAuth, UserDataType } from '@/types';
import { verifyToken, compareUserData, filterToUserDataType } from '@/utils';

const router = express.Router();

router.get(`/get-user-data`, async (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    const authToken = authHeader?.split(' ')[1];

    if (!authToken)  {
      return res.status(401).json(null)
    }

    const decoded = await verifyToken(authToken);
    const { userId } = decoded as DecodedAuth;
  try {
    const userData = await UserData.findOne({ userId: userId });
    // if userdata is null, delete the token.
    return res.json(userData)
  } catch (error) {
    throw new CustomError(500, 'Database Error')
  }
}); 

router.post(`/sync-user-data`, async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const authToken = authHeader?.split(' ')[1];

  if (!authToken)  {
    return res.status(401).json(null)
  }
  const decoded = await verifyToken(authToken);
  const { userId } = decoded as DecodedAuth;

  const { clientUserData } = req.body as { clientUserData: UserDataType | null };

  try {
    let serverUserData: UserDataType | null = null;
    let serverUseTimeObject = await UserData.findOne({ userId: userId }).select('totalUseTime -_id') as { totalUseTime: number } | null;
    if (!serverUseTimeObject) {
      const user = await User.findById(userId);
      if (user) {
        const newUserData = new UserData({ userId: userId });
        await newUserData.save();
        serverUserData = filterToUserDataType(newUserData)
      }
    }
    const truth = compareUserData(clientUserData?.totalUseTime, serverUseTimeObject?.totalUseTime)
    console.log("🚀 ~ file: dataRoute.ts:52 ~ truth:", truth);
    if (truth === 'server') {
      if (!serverUserData) {
        serverUserData = await UserData.findOne({ userId: userId }) as UserDataType | null;
      }
      return res.status(200).json({ serverUserData });
    } else if (truth === 'client' && clientUserData) {
      res.status(200).json(null);
      await UserData.updateOne({ userId: userId }, { $set: clientUserData })
    }
  } catch (error) {
    throw new CustomError(500, 'Database Error')
  }
}); 

export default router;