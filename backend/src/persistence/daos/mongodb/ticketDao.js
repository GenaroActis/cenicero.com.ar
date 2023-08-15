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
}