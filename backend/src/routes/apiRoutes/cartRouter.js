import { Router } from "express";
import {
    getCartController,
    createCartController,
    addProductToCartController,
    deleteProductToCartController,
    updateQuantityOfProductController,
    deleteAllProductsToCartController
} from '../../controllers/cartController.js';
import { checkAuth } from '../../jwt/auth.js';
const router = Router();

router.get('/', checkAuth, getCartController);
router.post('/', createCartController);
router.put('/:prodId', checkAuth, addProductToCartController);
router.put('/quantity/:prodId', checkAuth, updateQuantityOfProductController);
router.delete('/all', checkAuth, deleteAllProductsToCartController);
router.delete('/:prodId', checkAuth, deleteProductToCartController);

export default router