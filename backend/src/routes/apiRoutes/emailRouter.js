import { Router } from "express";
import { checkAuth } from '../../jwt/auth.js';
import { sendConfirmationEmailController } from "../../controllers/emailController.js";
const router = Router();

router.post('/:ticketCode', checkAuth, sendConfirmationEmailController);

export default router