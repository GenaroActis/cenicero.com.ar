import {CartsModel} from './models/cartsModel.js';
import logger from '../../../utils/logger.js'
export default class CartsDaoMongoDB {
    async createCart() {
        try {
        const response = await CartsModel.create({});
        if (!response) {
            logger.error('error in the dao of the cart, function createCart')
            return false
        } else return response;
        } catch (error) {
        logger.error(error)
        throw new Error(error);
        };
    };
    async getCart(id) {
        try {
            const response = await CartsModel.findOne({ _id: id }).populate('products._id')
            if (!response) {
                logger.error('Error cart dao, getCart function')
                return false
            } else return response;
        } catch (error) {
            logger.error(error)
            throw new Error(error);
        };
    };
    async addProductToCart(prodId, cartId){
        try {
            const cartFind = await CartsModel.findById(cartId)
            if(!cartFind) {
                logger.error('Error cart dao, addProductToCart function')
                return false
            } const existingProduct = cartFind.products.find(productIt => productIt._id.toString() === prodId);
            if(existingProduct){
                const updatedQuantity = existingProduct.quantity + 1
                await CartsModel.updateOne(
                    {_id: cartId, 'products._id': prodId},
                    {$set: {'products.$.quantity': updatedQuantity}}
                );
            } else{
                await CartsModel.findOneAndUpdate(
                    {_id: cartId},
                    {$push: {products: {_id: prodId, quantity: 1}}},
                );
            };
            const cartUpdate = await CartsModel.findById(cartId);
            return cartUpdate
        } catch (error) {
            logger.error(error)
            throw new Error(error);
        };
    };
    async deleteProductToCart (prodId, cartId){
        try {
            const cartFind = await CartsModel.findById(cartId);
            const existingProduct = cartFind.products.find(productIt => productIt._id.toString() === prodId);
            if(!existingProduct) return false
            else{
                if(existingProduct.quantity > 1){
                    const updatedQuantity = existingProduct.quantity - 1;
                    await CartsModel.updateOne(
                        {_id: cartId, 'products._id': prodId},
                        {$set: {'products.$.quantity': updatedQuantity}}
                    );
                } else{
                    await CartsModel.findOneAndUpdate(
                        {_id: cartId},
                        {$pull: {products: {_id: prodId}}},
                    );
                };
            };
            const cartUpdate = await CartsModel.findById(cartId).populate('products._id');
            return cartUpdate;
        } catch (error) {
            logger.error(error)
            throw new Error(error);
        };
    };
    async deleteAllProductsToCart (cartId) {
        try {
            const cartFind = await CartsModel.findById(cartId);
            if(!cartFind) return false
            else{
                const emptyCart = await CartsModel.updateOne(
                    { _id: cartId },
                    { $set: { products: [] } }
                );
                return emptyCart
            };
        } catch (error) {
            logger.error(error)
            throw new Error(error);
        };
    };
    async updateQuantityOfProduct (cartId, prodId, newQuantity) {
        try {
            const cartFind = await CartsModel.findById(cartId);
            const existingProduct = await cartFind.products.find(productIt => productIt._id.toString()  === prodId);
            if(!existingProduct) return false
            else{
                existingProduct.quantity = newQuantity;
                if(existingProduct.quantity > 1){
                    await CartsModel.updateOne(
                        {_id: cartId, 'products._id': prodId},
                        {$set: {'products.$.quantity': newQuantity}}
                    );
                } else{
                    await CartsModel.findOneAndUpdate(
                        {_id: cartId},
                        {$pull: {products: {_id: prodId}}},
                    );
                };
            };
            const cartUpdate = await CartsModel.findById(cartId).populate('products._id');
            return cartUpdate;
        } catch (error) {
            logger.error(error)
            throw new Error(error);
        };
    };
    async updateCartProducts(cartId, newProductsList) {
        try {
            const cartFind = await CartsModel.findById(cartId);
            if (!cartFind) {
                return false;
            } else {
                cartFind.products = newProductsList;
                const updatedCart = await cartFind.save();
                return updatedCart;
            }
        } catch (error) {
            logger.error(error)
            throw new Error(error);
        }
    }
};