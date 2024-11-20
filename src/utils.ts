import jwt, { SignOptions } from 'jsonwebtoken';
import { CustomError } from '@/errorTypes';

const SECRET_KEY = process.env.JWT_SECRET_KEY as string;
const SERVER_URL = process.env.SERVER_URL as string;

const generateToken = (payload: Record<string, any>, expiresIn?: string | number) => {
  const options: SignOptions = {};

  if (expiresIn) {
    options.expiresIn = expiresIn;
  }

  const token = jwt.sign(payload, SECRET_KEY, options);
  return token;
}

const verifyToken = async (token: string): Promise<jwt.JwtPayload> => {
  try {
    return jwt.verify(token, SECRET_KEY) as jwt.JwtPayload;
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      throw new CustomError(401, 'Token has expired');
    } else if (error.name === 'JsonWebTokenError') {
      throw new CustomError(401, 'Invalid token');
    } else {
      throw new CustomError(500, 'Token verification failed');
    }
  }
};

const isEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

const generateMagicLink = (email: string): string => {
  const signInToken = generateToken({ email }, '24h')
  const magicLink = `${SERVER_URL}/entry/verify?signInToken=${signInToken}`;
  return magicLink;
}


export { generateToken, verifyToken, isEmail, generateMagicLink };