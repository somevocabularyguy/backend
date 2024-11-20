import express, { Request, Response } from 'express';

import { UserData } from '@/data/models';
import { verifyToken } from '@/utils';
import { DecodedAuth } from '@/types';
import { CustomError } from '@/errorTypes';

const router = express.Router();

router.get(`/get-data`, async (req: Request, res: Response) => {
    const authToken: string | null = req.cookies.authToken;
    if (!authToken)  {
      return res.status(401).json({ data: null, message: 'Not Signed In.' })
    }

    const decoded = await verifyToken(authToken);
    const { userId } = decoded as DecodedAuth;
  try {
    const userData = await UserData.find({ _id: userId });
    return res.json({ data: userData, message: 'Data get successfully'});
  } catch (error) {
    throw new CustomError(500, 'Database Error')
  }
}); 

export default router;