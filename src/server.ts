import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';

// mongoose.connect('mongodb://localhost:27017/applicationDatabase')
  // .then(() => console.log('Connected to MongoDB'))
  // .catch((error: Error) => console.error('Failed to connect to MongoDB', error));

const app = express();
const port = 5000;

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());

import dataRoute from './routes/dataRoute';
import entryRoute from './routes/entryRoute';

app.use('/api', dataRoute)
app.use('/entry', entryRoute)

import { google } from 'googleapis';
const oauth2Client = new google.auth.OAuth2(
  "581733570713-nqeo6v6jpgvv2s217m5rlleb6qegujgm.apps.googleusercontent.com",
  "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",
  'http://localhost:5000/oauth2callback' // This should match your redirect URI
);
app.get('/oauth2callback', async (req, res) => {
  const { code } = req.query;

  const { tokens } = await oauth2Client.getToken(code as string);
  oauth2Client.setCredentials(tokens);
console.log('Access Token:', tokens.access_token);
console.log('Refresh Token:', tokens.refresh_token);

  res.send('Authentication successful! You can close this tab.');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
