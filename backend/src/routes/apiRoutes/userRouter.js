import { Router } from 'express'
import {register, login, logoutUserController} from '../../controllers/userController.js'
import passport from 'passport';
import { frontResponseGithub } from '../../passport/github.js'
import { checkAuth } from '../../jwt/auth.js';
import { validateRegister } from '../../middlewares/validators/userValidator.js';

const router = Router();

router.post('/register', validateRegister, register);
router.post('/login', login)
router.get('/logout', logoutUserController)
router.get('/register-github', passport.authenticate('github', { scope: [ 'user:email' ] }));
router.get('/github-profile', frontResponseGithub);

export default router