import TicketDaoMongoDB from "../persistence/daos/mongodb/ticketDao.js";
import CartsDaoMongoDB from "../persistence/daos/mongodb/cartsDao.js";
import ProductsDaoMongoDB from "../persistence/daos/mongodb/productsDao.js";
import { generateCodeTicket } from "../utils/utils.js"
import buyerUserDto from "../persistence/dtos/buyerUserDto.js"
import { HttpResponse } from "../utils/httpResponse.js";
import logger from "../utils/logger.js";
const ticketDao = new TicketDaoMongoDB();
const cartDao = new CartsDaoMongoDB();
const prodDao = new ProductsDaoMongoDB();
const httpResponse = new HttpResponse();

export const getTicketByCodeController = async (req, res, next) =>{
    try {
        const { code } = req.params;
        const ticket = await ticketDao.getTicketByCode(code)
        if(!ticket) {
            logger.error(`ticket with ${code} code not found`)
            return httpResponse.NotFound(res, ticket)
        } else return httpResponse.Ok(res, ticket)
    } catch (error) {
        logger.error(error)
        next(error);
    };
};   
export const getTicketByIdController = async (req, res, next) =>{
    try {
        const { id } = req.params;
        const ticket = await ticketDao.getTicketById(id)
        if(!ticket) {
            logger.error(`ticket with ${id} id not found`)
            return httpResponse.NotFound(res, ticket)
        } else return httpResponse.Ok(res, ticket)
    } catch (error) {
        logger.error(error)
        next(error);
    };
};
export const generateTicketController = async (req, res, next) =>{
    try {
        const user = req.user;
        const userDto = new buyerUserDto(user)
        const ticketCode = generateCodeTicket()
        const userCart = await cartDao.getCart(user.cartId)
        let totalPriceCart = 0;
        let remainingProducts = []
        userCart.products.forEach((prod) =>{
            const {quantity, _id} = prod
            if(quantity > _id.stock){
                const remainingQuantity = quantity - _id.stock
                prod.quantity = _id.stock
                remainingProducts.push({
                    quantity: remainingQuantity, 
                    _id: _id
                })
                userCart.products = userCart.products.filter((p) => p.quantity > 0)
            }
            const totalPriceProd = prod.quantity * _id.price
            totalPriceCart += totalPriceProd
        });
        const ticket = {
            remainingProducts: remainingProducts,
            products: userCart.products,
            code: ticketCode,
            totalPrice: totalPriceCart,
            purchaser: userDto
        }
        if(ticket.products.length === 0){
            return httpResponse.Conflict(res, 'Products are out of stock') 
        } else{
            return httpResponse.Ok(res, ticket)
        }
    } catch (error) {
        logger.error(error)
        next(error)
    };
};
export const finalizePurchaseController = async (req, res, next)=>{
    try {
        const cartId = req.user.cartId ;
        const confirmedTicket = req.body
        const remainingProducts = confirmedTicket.remainingProducts
        cartDao.updateCartProducts(cartId, remainingProducts)
        const savePurchase = await ticketDao.createTicket(confirmedTicket)
        if(!savePurchase) { 
            logger.error(savePurchase)
            return httpResponse.ServerError(res, savePurchase)
        } else{
            confirmedTicket.products.forEach(async (prod) => {
                const { quantity, _id } = prod;
                const remainingStock = _id.stock - quantity
                await prodDao.updateProductStock(_id, remainingStock);
            })
            return httpResponse.Ok(res, savePurchase)
        };
    } catch (error) {
        logger.error(error)
        next(error)
    };
};
export const getAllTicketsController = async (req, res, next)=>{
    try {
        try {
            const { page, limit, key, value, sortField, sortOrder } = req.query;
            const allTickets = await ticketDao.getAllTickets(page, limit, key, value, sortField, sortOrder);
            const nextLink = allTickets.hasNextPage ? `http://localhost:3000/admin/salesHistory/page=${allTickets.nextPage}` : null
            const prevLink = allTickets.hasPrevPage ? `http://localhost:3000/admin/salesHistory/page=${allTickets.prevPage}` : null
            const userData = req.user
            const ticketsFile = {
                results: allTickets.docs,
                userData: userData,
                info: {
                    count: allTickets.totalDocs,
                    pages: allTickets.totalPages,
                    actualPage: allTickets.page,
                    hasPrevPage: allTickets.hasPrevPage,
                    hasNextPage: allTickets.hasNextPage,
                    nextPageLink: nextLink,
                    prevPageLink: prevLink
                }
            };
            return httpResponse.Ok(res, ticketsFile);
        } catch (error) {
            logger.error(error)
            next(error)
        };
    } catch (error) {
        logger.error(error)
        next(error)
    };
};