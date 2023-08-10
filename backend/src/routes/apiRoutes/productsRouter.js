import { Router } from "express";
import {
    getAllProductsController,
    getProductByIdController,
    createProductController,
    deleteProductController,
    updateProductController,
    getProductBySomethingController,
    getMockingProdsController,
    createMockingProdsController
} from '../../controllers/productController.js';
import { checkAuth } from '../../jwt/auth.js';
const router = Router();
import { ensureIsAdmin } from '../../middlewares/ensureIsAdmin.js'
import { validateCreateProduct } from '../../middlewares/validators/productValidator.js'

router.get('/mocking', getMockingProdsController);
router.post('/mocking', createMockingProdsController);
router.get('/', checkAuth,  getAllProductsController)
router.get('/:id', checkAuth, getProductByIdController);
router.post('/', checkAuth, ensureIsAdmin, validateCreateProduct, createProductController);
router.put('/:id', checkAuth, ensureIsAdmin, updateProductController);
router.delete('/:id', checkAuth, ensureIsAdmin, deleteProductController);
router.get('/search/:key/:value', checkAuth, getProductBySomethingController);


export default router