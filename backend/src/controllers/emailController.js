import { createTransport,  } from 'nodemailer';
import { ShippingEmail, ShippingPass } from '../config.js'
import TicketDaoMongoDB from '../persistence/daos/mongodb/ticketDao.js'
import UsersDaoMongoDB from '../persistence/daos/mongodb/usersDao.js';
import { HttpResponse } from "../utils/httpResponse.js";
import logger from "../utils/logger.js";
import { generateTokenToRecoverPass } from '../jwt/auth.js'
const httpResponse = new HttpResponse();
const ticketDao = new TicketDaoMongoDB();
const userDao = new UsersDaoMongoDB();

export const sendConfirmationEmailController = async (req, res, next) =>{
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
        if(!response) {
            logger.warning('error sent email')
            httpResponse.ServerError(res, response)
        } else httpResponse.Ok(res, response)
    } catch (error) {
        logger.error(error)
        next(error)
    };
};

export const sendRecoverPasswordEmailController = async (req, res, next) =>{
    try {
        const userEmail = req.body.email
        const existenceValidation = await userDao.getUserByEmail(userEmail)
        if(!existenceValidation) return httpResponse.NotFound(res, 'theMailIsNotRegistered')
        if(existenceValidation.isGithub === true) return httpResponse.Conflict(res, 'isGithub')
        const validateToken = generateTokenToRecoverPass(req.body)
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
            to: userEmail,
            subject: 'Recupera tu contraseña!!',
            html: `
            <div class='card'>
                <h1>Si no has solicitado el cambio de contraseña ignora este email</h1>
                <a href="http://localhost:3000/recover">Recuperar Contraseña</a>
            </div>
            `
        };
        const response = await transporter.sendMail(gmailOptions)
        if(!response) {
            logger.error('error sent recover email')
            httpResponse.ServerError(res, response)
        } else res
        .status(200)
        .header('Authorization', validateToken)
        .json({msg: 'Recover email OK', validateToken})
    } catch (error) {
        logger.error(error)
        next(error)
    };
};

export const sendEmailDeletedAccountController = async (userEmail) =>{
    try {
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
            to: userEmail,
            subject: 'Cuenta eliminada por inactividad!!',
            html: `
            <div class='card'>
                <h1>Si quieres volver a registrarte reingresa</h1>
                <a href="http://localhost:3000/">Registrarse</a>
            </div>
            `
        };
        const response = await transporter.sendMail(gmailOptions)
        if(!response) {
            logger.error('error sent deleted account email')
        } else return 'sent'
    } catch (error) {
        logger.error(error)
    };
};