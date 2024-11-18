import * as dotenv from 'dotenv';
import Mailgun from 'mailgun.js';
import formData from 'form-data';
import { generateMagicLink } from './utils';

dotenv.config();

const mailgun = new Mailgun(formData);
const client = mailgun.client({
  username: 'api',
  key: process.env.MAILGUN_API_KEY as string,
  url:"https://api.eu.mailgun.net"
});

const sendMagicLinkEmail = async (email: string) => {
  const magicLink = generateMagicLink(email);

  const messageText = `Hi,

  Click the link below to securely sign in to your account:
  ${magicLink}

  This link is valid for the next 24 hours. If you didn't request this email, you can safely ignore it.

  Thank you,
  By somevocabulary.com`;

  const messageHtml = `
    <p>Hi,</p>
    <p>Click the button below to securely sign in to your account:</p>
    <a href=${magicLink} style="padding: 10px 20px; color: white; background-color: #007bff; text-decoration: none; border-radius: 5px;">Sign In</a>
    <p>This link is valid for the next 24 hours. If you didn't request this email, you can safely ignore it.</p>
    <p>Thank you,</p>
    <p>By somevocabulary.com</p>`;

  const messageData = {
    from: 'noreply@somevocabulary.com',
    to: 'mks1601junkemail@gmail.com',
    subject: 'Your Sign In Link',
    text: messageText,
    html: messageHtml
  };

  try {
    const response = await client.messages.create(process.env.BASE_DOMAIN as string, messageData);
    console.log('Magic link sent:', response);
  } catch (error) {
    console.error('Error sending magic link:', error);
  }
}

sendMagicLinkEmail('')


export { sendMagicLinkEmail };

