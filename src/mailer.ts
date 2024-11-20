import Mailgun from 'mailgun.js';
import formData from 'form-data';
import { generateMagicLink } from './utils';
import { CustomError } from '@/errorTypes';

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
  By ${process.env.APP_DOMAIN as string}`;

  const messageHtml = `
    <p>Hi,</p>
    <p>Click the button below to securely sign in to your account:</p>
    <a href=${magicLink} style="padding: 10px 20px; color: white; background-color: #007bff; text-decoration: none; border-radius: 5px;">Sign In</a>
    <p>This link is valid for the next 24 hours. If you didn't request this email, you can safely ignore it.</p>
    <p>Thank you,</p>
    <p>By ${process.env.APP_DOMAIN as string}</p>`;

  const messageData = {
    from: `noreply@${process.env.MAILGUN_DOMAIN as string}`,
    to: email,
    subject: 'Your Sign In Link',
    text: messageText,
    // html: messageHtml
  };

  try {
    const response = await client.messages.create(process.env.MAILGUN_DOMAIN as string, messageData);
    return response;
  } catch (error) {
    throw new CustomError(500, 'Mailgun Error!')
  }
}

export { sendMagicLinkEmail };

