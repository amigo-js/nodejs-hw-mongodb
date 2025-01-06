import { User } from '../db/models/user.js';
import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';
import { Session } from '../db/models/session.js';
import {
  SMTP,
  TEMPLATES_DIR,
  FIFTEEN_MINUTES,
  ONE_DAY,
} from '../constants/index.js';
import { env } from '../utils/env.js';
import { sendEmail } from '../utils/sendEmail.js';
import path from 'node:path';
import fs from 'node:fs/promises';
import handlebars from 'handlebars';

// Регистрация нового пользователя
export const registerUser = async ({ name, email, password }) => {
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw createHttpError(409, 'Email is already in use');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({ name, email, password: hashedPassword });

  return {
    id: newUser._id,
    name: newUser.name,
    email: newUser.email,
  };
};

// Авторизация пользователя
export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(401, 'Invalid email or password');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw createHttpError(401, 'Invalid email or password');
  }

  await Session.deleteMany({ userId: user._id });

  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  const session = await Session.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + ONE_DAY * 30),
  });

  return {
    accessToken: session.accessToken,
    refreshToken: session.refreshToken,
    _id: session._id,
  };
};

// Выход пользователя
export const logoutUser = async (sessionId) => {
  await Session.deleteOne({ _id: sessionId });
};

// Обновление токенов
export const refreshUsersSession = async ({ sessionId, refreshToken }) => {
  const session = await Session.findOne({ _id: sessionId, refreshToken });
  if (!session) {
    throw createHttpError(401, 'Invalid session or token');
  }

  const isTokenExpired =
    new Date() > new Date(session.refreshTokenValidUntil);

  if (isTokenExpired) {
    throw createHttpError(401, 'Refresh token expired');
  }

  const newAccessToken = randomBytes(30).toString('base64');
  const newRefreshToken = randomBytes(30).toString('base64');

  session.accessToken = newAccessToken;
  session.refreshToken = newRefreshToken;
  session.accessTokenValidUntil = new Date(Date.now() + FIFTEEN_MINUTES);
  session.refreshTokenValidUntil = new Date(Date.now() + ONE_DAY * 30);

  await session.save();

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};

// Отправка токена сброса пароля
export const requestResetToken = async (email) => {
  console.log('SMTP_FROM:', env('SMTP_FROM'));
  console.log('APP_DOMAIN:', env('APP_DOMAIN'));

  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  const resetToken = jwt.sign({ sub: user._id, email }, env('JWT_SECRET'), {
    expiresIn: '5m',
  });

  const templatePath = path.join(TEMPLATES_DIR, 'reset-password-email.html');
  const source = await fs.readFile(templatePath, 'utf8');
  const template = handlebars.compile(source);

  const html = template({
    name: user.name,
    link: `${env('APP_DOMAIN')}/reset-password?token=${resetToken}`,
  });

  await sendEmail({
    from: env('SMTP_FROM'),
    to: email,
    subject: 'Password Reset Request',
    html,
  });
};

// Сброс пароля
export const resetPassword = async ({ token, password }) => {
  let decoded;

  try {
    decoded = jwt.verify(token, env('JWT_SECRET'));
  } catch (err) {
    throw createHttpError(401, 'Token is invalid or expired.');
  }

  const user = await User.findOne({
    _id: decoded.sub,
    email: decoded.email,
  });

  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  user.password = hashedPassword;

  await user.save();
};
