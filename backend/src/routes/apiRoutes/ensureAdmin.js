import { Router } from "express";
import { ensureIsAdminController } from '../../controllers/userController.js';
import { checkAuth } from '../../jwt/auth.js';
import logger from '../../utils/logger.js'
const router = Router();

router.get('/loggerTest', (req, res) => {
    logger.debug('Debug message');
    logger.http('HTTP message');
    logger.info('Info message');
    logger.warning('Warning message');
    logger.error('Error message');
    logger.fatal('Fatal message');
    res.send('Check the logs');
});
router.get('/', checkAuth, ensureIsAdminController);

export default router