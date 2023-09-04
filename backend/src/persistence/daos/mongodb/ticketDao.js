import { TicketModel } from "./models/ticketModel.js";
import logger from '../../../utils/logger.js'
export default class TicketDaoMongoDB {
    async getTicketByCode(code) {
        try {
            const response = await TicketModel.findOne({ code: code }).populate('products._id');
            return response;
        } catch (error) {
            logger.error(error)
            throw new Error(error);
        };
    };
    async getTicketById(id) {
        try {
            const response = await TicketModel.findById(id);
            return response;
        } catch (error) {
        logger.error(error)
        throw new Error(error);
        };
    };
    async createTicket(obj) {
        try {
            obj.purchaseDataTime = new Date()
            const response = await TicketModel.create(obj);
            return response;
        } catch (error) {
            logger.error(error)
            throw new Error(error);
        };
    };
    async deleteTicket(id) {
        try {
            const response = await TicketModel.findByIdAndDelete(id);
            return response;
        } catch (error) {
            logger.error(error)
            throw new Error(error);
        };
    };
    async getAllTickets(page = 1, limit = 5, key, value, sortField = 'price', sortOrder = 'desc') {
        try {
        const query = {};
        if (key && value ) {
            query[key] = value;
        };
        const options = {page, limit, sort: {}}
        if (sortField && sortOrder) {
            options.sort[sortField] = sortOrder;
        };
        const response = await TicketModel.paginate(query, options);
        return response;
        } catch (error) {
        logger.error(error)
        throw new Error(error);
        };
    };
}