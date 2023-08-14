import ProductsDaoMongoDB from "../persistence/daos/mongodb/productsDao.js";
import { generateCodeTicket } from "../utils/utils.js"
import { HttpResponse } from "../utils/httpResponse.js";
import logger from "../utils/logger.js";
const prodDao = new ProductsDaoMongoDB();
const httpResponse = new HttpResponse();

export const getAllProductsController = async (req, res, next) =>{
    try {
        const { page, limit, key, value, sortField, sortOrder } = req.query;
        const allProducts = await prodDao.getAllProducts(page, limit, key, value, sortField, sortOrder);
        const nextLink = allProducts.hasNextPage ? `http://localhost:3000/products/page=${allProducts.nextPage}` : null
        const prevLink = allProducts.hasPrevPage ? `http://localhost:3000/products/page=${allProducts.prevPage}` : null
        const userData = req.user
        const productsFile = {
            results: allProducts.docs,
            userData: userData,
            info: {
                count: allProducts.totalDocs,
                pages: allProducts.totalPages,
                actualPage: allProducts.page,
                hasPrevPage: allProducts.hasPrevPage,
                hasNextPage: allProducts.hasNextPage,
                nextPageLink: nextLink,
                prevPageLink: prevLink
            }
        };
        return httpResponse.Ok(res, productsFile);
    } catch (error) {
        logger.error(error)
        next(error)
    };
};

export const getProductByIdController = async (req, res, next) =>{
    try {
        const {id} = req.params;
        const productSearched = await prodDao.getProductById(id);
        if(!productSearched) return httpResponse.NotFound(res, productSearched)
        else return httpResponse.Ok(res, productSearched)
    } catch (error) {
        logger.error(error)
        next(error)
    };
};

export const createProductController = async (req, res, next) =>{
    try {
        const { title, description, price, stock, code, category, size } = req.body
        const addedProduct = await prodDao.createProduct({
            title,
            description,
            price,
            stock,
            code: generateCodeTicket(),
            category,
            size
        })
        if(!addedProduct) return httpResponse.BadRequest(res, 'One of the fields is not correct')
        else return httpResponse.Ok(res, addedProduct)
    } catch (error) {
        logger.error(error)
        next(error)
    };
};

export const deleteProductController = async (req, res, next) =>{
    try {
        const { id } = req.params
        const prodDeleted = await prodDao.deleteProduct(id)
        return httpResponse.Ok(res, prodDeleted);
    } catch (error) {
        logger.error(error)
        next(error)
    };
};

export const updateProductController = async (req, res, next) =>{
    try {
        const {id} = req.params;
        const {title, description, price, stock, code, category, size} = req.body;
        const existingValidator = await prodDao.getProductById(id);
        if (!existingValidator) {
            return httpResponse.NotFound(res, 'Product not found!')
        } else{
            const prodUpdated = await prodDao.updateProduct(
                id,
                { title, description, price, stock, code, category, size }
            );
            return httpResponse.Ok(res, prodUpdated);
        };
    } catch (error) {
        logger.error(error)
        next(error)
    };
};

export const getProductBySomethingController = async (req, res, next) =>{
    try {
        const {key} = req.params;
        const {value} = req.params;
        const productSearched = await prodDao.getProductBySomething(key, value)
        if(!productSearched) return httpResponse.NotFound(res, 'Product not found!')
        else return httpResponse.Ok(res, productSearched)
    } catch (error) {
        logger.error(error)
        next(error)
    };
};

export const getMockingProdsController = async (req, res, next) =>{
    try {
        const { page, limit, key, value, sortField, sortOrder } = req.query;
        const allProducts = await prodDao.getAllMockingProduct(page, limit, key, value, sortField, sortOrder);
        const nextLink = allProducts.hasNextPage ? `http://localhost:3000/products/page=${allProducts.nextPage}` : null
        const prevLink = allProducts.hasPrevPage ? `http://localhost:3000/products/page=${allProducts.prevPage}` : null
        const userData = req.user
        const productsFile = {
            results: allProducts.docs,
            userData: userData,
            info: {
                count: allProducts.totalDocs,
                pages: allProducts.totalPages,
                actualPage: allProducts.page,
                hasPrevPage: allProducts.hasPrevPage,
                hasNextPage: allProducts.hasNextPage,
                nextPageLink: nextLink,
                prevPageLink: prevLink
            }
        };
        return httpResponse.Ok(res, productsFile);
    } catch (error) {
        logger.error(error)
        next(error)
    };
};

export const createMockingProdsController = async (req, res, next) =>{
    try {
        const { quantity } = req.params
        const response = await prodDao.createMockingProduct(quantity)
        return httpResponse.Ok(res, response)
    } catch (error) {
        logger.error(error)
        next(error)
    };
};
