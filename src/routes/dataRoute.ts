import express, { Request, Response } from 'express';

import { UserData } from '@/data/models';
import { verifyToken } from '@/utils';
import { DecodedAuth } from '@/types';
import { CustomError } from '@/errorTypes';

const router = express.Router();

router.get(`/get-data`, async (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;

    const authToken = authHeader?.split(' ')[1];
    if (!authToken)  {
      return res.status(401).json(null)
    }

    const decoded = await verifyToken(authToken);
    const { userId } = decoded as DecodedAuth;
  try {
    const userData = await UserData.findOne({ userId: userId });
    return res.json(userData)
  } catch (error) {
    throw new CustomError(500, 'Database Error')
  }
}); 

export default router;