import {UserModel} from '../persistence/daos/mongodb/models/usersModel.js'
import logger from './logger.js';
const deleteInactiveUsers = async () => {
    try {
        const period = 5
        const limit = new Date(Date.now() - period)
        const deletedUsers = await UserModel.find({ lastActivity: { $lt: limit } })
        const res = await UserModel.deleteMany({lastActivity: {$lt: limit}})
        console.log(deletedUsers)
        return res
    } catch (error) {
        logger.error(error)
        throw new Error(error)
    }
};
export default deleteInactiveUsers