import express, { Request, Response } from 'express';

import { FeedbackData, DecodedAuth } from '@/types';
import { CustomError } from '@/errorTypes';
import { Feedback } from '@/data/models';
import { verifyToken } from '@/utils';

const router = express.Router();

router.post('/send-feedback', async (req: Request, res: Response) => {
  const feedbackData = req.body.feedbackData as FeedbackData;
  console.log("🚀 ~ file: feedbackRoute.ts:45 ~ feedbackData:", feedbackData);

  const authHeader = req.headers.authorization;
  console.log("🚀 ~ file: feedbackRoute.ts:46 ~ authHeader:", authHeader);

  let id: string | null = null;
  if (authHeader) {
    const authToken = authHeader.split(' ')[1];
    console.log("🚀 ~ file: feedbackRoute.ts:20 ~ authToken:", authToken);
    const decoded = await verifyToken(authToken);
    console.log("🚀 ~ file: feedbackRoute.ts:22 ~ decoded:", decoded);
    const { userId } = decoded as DecodedAuth;
    id = userId;
  }

  const userId = id;

  if (!feedbackData) {
    throw new CustomError(400, 'No Feedback Data Arrived.');
  }

  const { feedbackType, feedbackText, files } = feedbackData;

  try {
    await Feedback.create({
      userId,
      feedbackType,
      feedbackText,
      files,
      anonymous: !userId
    });
    console.log('Feedback Successfully Saved')
    res.status(201).json({ message: 'Feedback submitted successfully.' })
  } catch (error) {
    console.log("🚀 ~ file: feedbackRoute.ts:46 ~ error:", error);
    throw new CustomError(500, 'MongoDB Create Error.')
  }
}); 

export default router;