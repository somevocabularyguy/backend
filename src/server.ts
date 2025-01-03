import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';

// import '@/cronJob'; //Todo: Will be activated.

if (process.env.NODE_ENV !== 'production') {
  import('dotenv').then((dotenv) => dotenv.config());
}

mongoose.connect(process.env.MONGO_URI as string)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error: Error) => console.error('Failed to connect to MongoDB', error));

const app = express();
const port = 5000;

const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '1mb' }));
app.use(bodyParser.json({ limit: '1mb' }));
app.use(cookieParser());

import dataRoute from '@/routes/dataRoute';
import entryRoute from '@/routes/entryRoute';
import feedbackRoute from '@/routes/feedbackRoute';

app.use('/data', dataRoute)
app.use('/entry', entryRoute)
app.use('/feedback', feedbackRoute)

import { errorHandler } from '@/middleware';
app.use(errorHandler)

app.listen(port, () => {
  console.log(`Server is running on http://backend:${port}`);
});
