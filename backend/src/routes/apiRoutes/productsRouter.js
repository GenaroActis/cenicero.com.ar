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
import { ensureIsAdmOrPrem } from '../../middlewares/ensureIsAdmOrPrem.js'
import { validateCreateProduct } from '../../middlewares/validators/productValidator.js'

router.get('/mocking', getMockingProdsController);
router.post('/mocking', createMockingProdsController);
router.get('/', checkAuth,  getAllProductsController)
router.get('/:id', checkAuth, getProductByIdController);
router.post('/', checkAuth, ensureIsAdmOrPrem, validateCreateProduct, createProductController);
router.put('/:id', checkAuth, ensureIsAdmOrPrem, updateProductController);
router.delete('/:id', checkAuth, ensureIsAdmOrPrem, deleteProductController);
router.get('/search/:key/:value', checkAuth, getProductBySomethingController);


export default router