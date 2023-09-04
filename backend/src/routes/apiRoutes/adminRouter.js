import { Router } from "express";
import { 
    ensureIsAdminController, 
    ensureIsAdmOrPremController,
    getAllUsersController,
    convertToPremiumController,
    convertToUserController
} from '../../controllers/userController.js';
import { getAllTicketsController } from '../../controllers/ticketController.js'
import { checkAuth } from '../../jwt/auth.js';
import logger from '../../utils/logger.js'
import { ensureIsAdmOrPrem } from "../../middlewares/ensureIsAdmOrPrem.js";
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
router.get('/only', checkAuth, ensureIsAdminController);
router.get('/', checkAuth, ensureIsAdmOrPremController);
router.put('/toPremium/:userId', checkAuth, convertToPremiumController )
router.put('/toUser/:userId', checkAuth, convertToUserController )
router.get('/users', checkAuth, ensureIsAdmOrPrem, getAllUsersController)
router.get('/all', checkAuth, ensureIsAdmOrPrem, getAllTicketsController)

export default router