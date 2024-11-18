import jwt from 'jsonwebtoken';

const SECRET_KEY = 'key';
const BASE_URL = 'http://localhost:5000/'

const generateMagicLink = (email: string): string => {
  const token = jwt.sign({ email }, SECRET_KEY);
  const magicLink = `${BASE_URL}entry/verify?token=${token}`;
  return magicLink;
}

const isEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

const verifyToken = async (token: string): Promise<string> => {
  try {
    jwt.verify(token as string, SECRET_KEY);
    return 'verified';  
  } catch (error) {
    return 'error';
  }
}

export { isEmail, generateMagicLink, verifyToken };