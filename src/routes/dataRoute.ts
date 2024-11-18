import express from 'express';
const router = express.Router();
import jwt from 'jsonwebtoken';
import { UserData } from '../data/models';

const SECRET_KEY = 'key';

interface DecodedProps {
  userId: string
}

router.get(`/get-data`, async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).send('Access denied');

    const decoded = jwt.verify(token, SECRET_KEY);
    const userId = (decoded as DecodedProps).userId;
    const userData = await UserData.find({ _id: userId });
    res.json({ data: userData, message: 'Data get successfully'});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' })
  }
});

export default router;