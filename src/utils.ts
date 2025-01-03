import jwt, { SignOptions } from 'jsonwebtoken';
import { CustomError } from '@/errorTypes';
import { UserDataType } from '@/types';

const SECRET_KEY = process.env.JWT_SECRET_KEY as string;
const FRONTEND_URL = process.env.FRONTEND_URL as string;

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
  console.log("🚀 ~ file: utils.ts:42 ~ FRONTEND_URL:", FRONTEND_URL);
  const magicLink = `${FRONTEND_URL}/api/web/proxy/entry/verify-magic-link?signInToken=${signInToken}`;
  return magicLink;
}

const checkIfExpired = (expirationDate: number) => {
  const currentTime = Date.now();
  return expirationDate < currentTime;
};

const base64UrlDecode = (string: string) => {
  const base64 = string.replace(/-/g, '+').replace(/_/g, '/');
  const decoded = Buffer.from(base64, 'base64').toString('utf8');
  return JSON.parse(decoded);
};

const isTokenExpired = (token: string) => {
  const parts = token.split('.');
  if (parts.length !== 3) {
    return true;
  }

  const payload = base64UrlDecode(parts[1]);
  const currentTime = Math.floor(Date.now() / 1000);
  return payload.exp < currentTime;
};

const compareUserData = (clientUseTime?: number | null, serverUseTime?: number | null) => {
  if (!clientUseTime) return 'server';
  if (!serverUseTime) return 'client';
  if (clientUseTime >= serverUseTime) {
    return 'client';
  } else {
    return 'server';
  }
}

const filterToUserDataType = (data: Record<string, any>): UserDataType => {
  // Extract only the keys that exist in UserDataType
  const allowedKeys: (keyof UserDataType)[] = [
    'totalUseTime',
    'languageArray',
    'hiddenWordIds',
    'customWordIds',
    'wordsData',
  ];

  const filteredData = {} as UserDataType;

  for (const key of allowedKeys) {
    if (key in data) {
      filteredData[key] = data[key];
    }
  }

  return filteredData;
}

export { generateToken, verifyToken, isEmail, generateMagicLink, checkIfExpired, isTokenExpired, compareUserData, filterToUserDataType };