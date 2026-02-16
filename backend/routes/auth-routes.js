import { Router } from 'express';
import { registerUser } from '#controllers/auth/register-controller.js';
import { verifyEmail } from '#controllers/auth/verify-email-controller.js';

export const authRouter = Router();

authRouter.route('/register').post(registerUser);

authRouter.route('/verify/:emailToken/:userId').get(verifyEmail);
