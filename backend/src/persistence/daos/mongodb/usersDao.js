import {UserModel} from './models/usersModel.js'
import { createHash, isValidPassword } from '../../../utils/utils.js';
import logger from '../../../utils/logger.js'
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
                return newUser
            };
        } catch (error) {
            logger.error(error)
            throw new Error(error)
        };
    };
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
                    else return userSearch
                }
            } else{
                return false
            };
        } catch (error) {
            logger.error(error)
            throw new Error(error)
        }
    };
};