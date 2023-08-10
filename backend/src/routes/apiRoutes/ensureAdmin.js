import { Router } from "express";
import { ensureIsAdminController } from '../../controllers/userController.js';
import { checkAuth } from '../../jwt/auth.js';
const router = Router();

router.get('/', checkAuth, ensureIsAdminController);

export default router