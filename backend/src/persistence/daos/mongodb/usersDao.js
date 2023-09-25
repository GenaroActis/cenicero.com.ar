import {UserModel} from './models/usersModel.js'
import { createHash, isValidPassword } from '../../../utils/utils.js';
import logger from '../../../utils/logger.js'
import nonSensitiveUserData from '../../dtos/nonSensitiveUserData.js'
export default class UsersDaoMongoDB {
    async getUserByEmail(email){
        try {
            const response = await UserModel.findOne({email});
            if(!response) {
                return false
            } else{
                return response
            };
        } catch (error) {
            logger.error(error)
            throw new Error(error)
        };
    };
    async getUserById(id){
        try {
            const response = await UserModel.findById(id).populate('cartId');
            if(!response){
                return false
            } else{
                return response
            };
        } catch (error) {
            logger.error(error)
            throw new Error(error)
        };
    };
    async createUser (userData) {
        try {
            const password = userData.password
            const email = userData.email
            const existUser = await UserModel.findOne({email});
            if(existUser){
                return false
            } else {
                const newUser = await UserModel.create({...userData, password: createHash(password)});
                const newUserDtoRes = new nonSensitiveUserData(newUser)
                return newUserDtoRes
            };
        } catch (error) {
            logger.error(error)
            throw new Error(error)
        };
    };
    async updateLastActivity (userId) {
        try {
            await UserModel.findByIdAndUpdate(userId, {lastActivity: new Date()})
        } catch (error) {
            logger.error(error)
            throw new Error(error)
        }
    }
    async loginUser (userData) {
        try {
            const email = userData.email
            const password = userData.password
            const userSearch = await UserModel.findOne({email}); 
            if(userSearch){
                if(userSearch.isGithub){
                    return 'isGithub'
                } else {
                    const passwordValidate = isValidPassword(password, userSearch)
                    if(!passwordValidate) return false
                    else {
                        this.updateLastActivity(userSearch._id)
                        return userSearch
                    }
                }
            } else{
                return false
            };
        } catch (error) {
            logger.error(error)
            throw new Error(error)
        }
    };
    async getAllUsers(page = 1, limit = 5, key, value, sortField = 'price', sortOrder = 'desc') {
        try {
        const query = {};
        if (key && value ) {
            query[key] = value;
        };
        const options = {page, limit, sort: {}}
        if (sortField && sortOrder) {
            options.sort[sortField] = sortOrder;
        };
        const response = await UserModel.paginate(query, options);
        const usersDTO = response.docs.map(user => new nonSensitiveUserData(user))
        response.docs = usersDTO
        return response;
        } catch (error) {
        logger.error(error)
        throw new Error(error);
        };
    };
    async recoverPassword (userData) {
        try {
            const email = userData.email
            const password = userData.newPassword
            const userSearch = await UserModel.findOne({email}); 
            const passwordValidate = isValidPassword(password, userSearch)
            if(passwordValidate) {
                return 'thePasswordsAreTheSame'
            } else {
                const newPassword = createHash(password);
                await UserModel.findByIdAndUpdate(userSearch._id, { password: newPassword });
                return 'passwordUpdated';
            }
        } catch (error) {
            logger.error(error)
            throw new Error(error)
        }
    };
    async convertToPremium (userId) {
        try {
            const res = await UserModel.updateOne(
                { _id: userId },
                { $set: { role: 'premium' } }
            );
            if(res) return res
            else return false
        } catch (error) {
            logger.error(error)
            throw new Error(error)
        }
    };
    async convertToUser (userId) {
        try {
            const res = await UserModel.updateOne(
                { _id: userId },
                { $set: { role: 'user' } }
            );
            if(res) return res
            else return false
        } catch (error) {
            logger.error(error)
            throw new Error(error)
        }
    };
    async deleteInactiveUsers (){
        try {
            const period = 0.01
            const limit = new Date(date.now() - period)
            const res = await UserModel.deleteMany({lastActivity: {$lt: limit}})
            return res
        } catch (error) {
            logger.error(error)
            throw new Error(error)
        }
    }
};