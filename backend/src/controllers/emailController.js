import { createTransport,  } from 'nodemailer';
import { ShippingEmail, ShippingPass } from '../config.js'
import TicketDaoMongoDB from '../persistence/daos/mongodb/ticketDao.js'
import { HttpResponse } from "../utils/httpResponse.js";

const httpResponse = new HttpResponse();
const ticketDao = new TicketDaoMongoDB();

export const sendConfirmationEmailController = async (req, res) =>{
    try {
        const { ticketCode } = req.params
        const ticket = await ticketDao.getTicketByCode(ticketCode)
        const transporter = createTransport({
            service: 'gmail',
            port: 465,
            scure: true,
            auth: {
                user: ShippingEmail,
                pass: ShippingPass
            }
        }); 
        // // //
        const gmailOptions = {
            from: ShippingEmail,
            to: req.user.email,
            subject: 'Compra realizada con exito!!',
            html: `
            <div class='card'>
                <h1>Ticket de compra</h1>
                <p><strong>Nombre del cliente: ${ticket.purchaser.fullName}</strong></p>
                <p><strong>Fecha: ${ticket.purchaseDataTime} </strong> </p>
                <p><strong>Total a pagado: ${ticket.totalPrice} </strong> $</p>
            </div>
            `
        }
        const response = await transporter.sendMail(gmailOptions)
        if(!response) httpResponse.ServerError(res, response)
        else httpResponse.Ok(res, response)
    } catch (error) {
        console.log(error)
        throw new Error(error)
    }
};
