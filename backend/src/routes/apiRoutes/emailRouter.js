import { Router } from "express";
import { checkAuth } from '../../jwt/auth.js';
import { sendConfirmationEmailController, sendRecoverPasswordEmailController } from "../../controllers/emailController.js";
const router = Router();

router.post('/recover', sendRecoverPasswordEmailController);
router.post('/:ticketCode', checkAuth, sendConfirmationEmailController);


export default router