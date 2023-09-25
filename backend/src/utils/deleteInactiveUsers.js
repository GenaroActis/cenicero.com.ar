import {UserModel} from '../persistence/daos/mongodb/models/usersModel.js'
import logger from './logger.js';
import cron from 'node-cron';
import { NodeEnv } from '../config.js';
import { sendEmailDeletedAccountController } from '../controllers/emailController.js'

const deleteInactiveUsers = async () => {
    try {
        const millisecondsInADay = 24 * 60 * 60 * 1000;
        const period = millisecondsInADay * 7
        const limit = new Date(Date.now() - period)
        const deletedUsers = await UserModel.find({ lastActivity: { $lt: limit } })
        const res = await UserModel.deleteMany({lastActivity: {$lt: limit}})
        deletedUsers.map((user) =>{
            sendEmailDeletedAccountController(user.email)
        })
        return res
    } catch (error) {
        logger.error(error)
        throw new Error(error)
    }
};

if(NodeEnv === 'production') {
    cron.schedule('0 12 * * 1', () => {
        deleteInactiveUsers()
    });
}else{
    deleteInactiveUsers()
}

