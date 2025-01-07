import { Router } from 'express';
import { validateBody } from '../middlewares/validateBody.js';
import {
  registerSchema,
  loginSchema,
  requestResetEmailSchema,
  resetPasswordSchema,
} from '../validation/auth.js';
import {
  register,
  login,
  logout,
  refresh,
  sendResetEmailController,
  resetPasswordController,
} from '../controllers/auth.js';

const router = Router();

router.post('/register', validateBody(registerSchema), register);
router.post('/login', validateBody(loginSchema), login);
router.post('/logout', logout);
router.post('/refresh', refresh);
router.post(
  '/send-reset-email',
  validateBody(requestResetEmailSchema),
  sendResetEmailController
);
router.post(
  '/reset-pwd',
  validateBody(resetPasswordSchema),
  resetPasswordController
);

export default router;
