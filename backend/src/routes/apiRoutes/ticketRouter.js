import { Router } from 'express'
import { 
    generateTicketController,
    getTicketByCodeController,
    finalizePurchaseController,
} from '../../controllers/ticketController.js'
import { checkAuth } from '../../jwt/auth.js';
const router = Router()

router.get('/:id', checkAuth, generateTicketController)
router.get('/purchase/:code', checkAuth, getTicketByCodeController)
router.post('/finalizePurchase', checkAuth, finalizePurchaseController)

export default router