import CartsDaoMongoDB from "../persistence/daos/mongodb/cartsDao.js";
import ProductsDaoMongoDB from "../persistence/daos/mongodb/productsDao.js";
import { HttpResponse } from "../utils/httpResponse.js";
const cartDao = new CartsDaoMongoDB();
const prodDao = new ProductsDaoMongoDB();
const httpResponse = new HttpResponse();

export const getCartController = async (req, res, next) =>{
    try {
        if(!req.user){
            return httpResponse.Unauthorized(res, 'Expired token')
        }else{
            const userData= req.user
            const cartId = userData.cartId
            const cart = await cartDao.getCart(cartId);
            return httpResponse.Ok(res, cart)
        };
    } catch (error) {
        next(error)
    };
};
export const createCartController = async (req, res, next) =>{
    try {
        const newCart = await cartDao.createCart()
        return httpResponse.Ok(res, newCart)
    } catch (error) {
        next(error)
    };
};
export const addProductToCartController = async (req, res, next) =>{
    try {
        const cartId = req.user.cartId;
        const prodId = req.params.prodId;
        const existenceValidator = await prodDao.getProductById(prodId)
        if(!existenceValidator){
            return httpResponse.NotFound(res, 'the product you are trying to add does not exist')
        } else{
            const prodAdded = await cartDao.addProductToCart(prodId, cartId);
            return httpResponse.Ok(res, prodAdded)
        }
    } catch (error) {
        next(error)
    };
};
export const deleteProductToCartController = async (req, res, next) =>{
    try {
        const cartId =  req.user.cartId;
        const prodId = req.params.prodId;
        const prodDelete = await cartDao.deleteProductToCart(prodId, cartId)
        if(!prodDelete)return httpResponse.NotFound(res, 'the product you are trying to remove does not exist')
            else return httpResponse.Ok(res, prodDelete);
    } catch (error) {
        next(error)
    };
};
export const deleteAllProductsToCartController = async (req, res, next) =>{
    try {
        const userData = req.user
        const cartId = userData.cartId;
        const cartToDelete = await cartDao.deleteAllProductsToCart(cartId)
        if(!cartToDelete) return httpResponse.NotFound(res, 'the cart you are trying to remove does not exist')
            else return httpResponse.Ok(res, `cart with id ${cartId} successfully products removed`)
    } catch (error) {
        next(error)
    };
};
export const updateQuantityOfProductController = async (req, res, next) =>{
    try {
        const cartId = req.user.cartId;
        const prodId = req.params.prodId;
        const newQuantity = req.body.quantity;
        const updatedProd = await cartDao.updateQuantityOfProduct(cartId, prodId, newQuantity);
        if(!updatedProd) return httpResponse.NotFound(res, 'error: the product you are trying to remove does not exist');
        else return httpResponse.Ok(res, updatedProd);
    } catch (error) {
        next(error)
    };
};
