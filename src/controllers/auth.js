import { ONE_DAY } from '../constants/index.js';
import {
  loginUser,
  logoutUser,
  refreshUsersSession,
  registerUser,
  requestResetToken,
  resetPassword,
} from '../services/auth.js';

export const register = async (req, res, next) => {
  try {
    const user = await registerUser(req.body);

    res.status(201).json({
      status: 201,
      message: 'Successfully registered a user!',
      data: user,
    });
  } catch (error) {
    if (error.status === 409) {
      res.status(409).json({
        status: 409,
        message: 'Email is already in use',
      });
    } else {
      next(error);
    }
  }
};

export const login = async (req, res, next) => {
  try {
    const session = await loginUser(req.body);

    res.cookie('refreshToken', session.refreshToken, {
      httpOnly: true,
      expires: new Date(Date.now() + ONE_DAY * 30),
    });
    res.cookie('sessionId', session._id, {
      httpOnly: true,
      expires: new Date(Date.now() + ONE_DAY * 30),
    });

    res.json({
      status: 200,
      message: 'Successfully logged in a user!',
      data: {
        accessToken: session.accessToken,
      },
    });
  } catch (error) {
    if (error.status === 401) {
      res.status(401).json({
        status: 401,
        message: 'Invalid email or password',
      });
    } else {
      next(error);
    }
  }
};

export const logout = async (req, res) => {
  try {
    if (req.cookies.sessionId) {
      await logoutUser(req.cookies.sessionId);
    }

    res.clearCookie('sessionId');
    res.clearCookie('refreshToken');

    res.status(204).send();
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: 'Failed to logout user.',
    });
  }
};

export const refresh = async (req, res, next) => {
  try {
    const session = await refreshUsersSession({
      sessionId: req.cookies.sessionId,
      refreshToken: req.cookies.refreshToken,
    });

    res.cookie('refreshToken', session.refreshToken, {
      httpOnly: true,
      expires: new Date(Date.now() + ONE_DAY * 30),
    });
    res.cookie('sessionId', session._id, {
      httpOnly: true,
      expires: new Date(Date.now() + ONE_DAY * 30),
    });

    res.json({
      status: 200,
      message: 'Successfully refreshed a session!',
      data: {
        accessToken: session.accessToken,
      },
    });
  } catch (error) {
    if (error.status === 401) {
      res.status(401).json({
        status: 401,
        message: 'Invalid session or token',
      });
    } else {
      next(error);
    }
  }
};

export const sendResetEmailController = async (req, res, next) => {
  try {
    await requestResetToken(req.body.email);

    res.status(200).json({
      status: 200,
      message: 'Reset password email has been successfully sent.',
      data: {},
    });
  } catch (error) {
    if (error.status === 404) {
      res.status(404).json({
        status: 404,
        message: 'User not found',
      });
    } else {
      next(error);
    }
  }
};

export const resetPasswordController = async (req, res, next) => {
  try {
    await resetPassword(req.body);

    res.status(200).json({
      status: 200,
      message: 'Password has been successfully reset.',
      data: {},
    });
  } catch (error) {
    if (error.status === 401) {
      res.status(401).json({
        status: 401,
        message: 'Token is invalid or expired.',
      });
    } else {
      next(error);
    }
  }
};
