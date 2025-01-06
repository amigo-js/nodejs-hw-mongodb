import express from 'express';
import { validateBody } from '../middlewares/validateBody.js';
import { registerSchema, loginSchema } from '../validation/auth.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { register, login, refresh, logout } from '../controllers/auth.js';

const router = express.Router();

router.post('/register', validateBody(registerSchema), ctrlWrapper(register));
router.post('/login', validateBody(loginSchema), ctrlWrapper(login));
router.post('/refresh', ctrlWrapper(refresh));
router.post('/logout', ctrlWrapper(logout));

export default router;
