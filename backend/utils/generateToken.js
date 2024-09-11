import jwt from 'jsonwebtoken';
import { ENV_VARS } from '../config/envVars.js';

export const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ userId }, ENV_VARS.JWT_SECRET, { expiresIn: '90d' });

  res.cookie('jwt-netflix', token, {
    maxAge: 90 * 24 * 60 * 60 * 1000, //90d left
    httpOnly: true, // prevent XSS attacks
    sameSite: 'strict', //prevent CSRF attacks
    secure: ENV_VARS.NODE_ENV !== 'development', //local=>false, deploy=>true
  });

  return token;
};
