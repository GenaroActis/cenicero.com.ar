import UsersDaoMongoDB from '../persistence/daos/mongodb/usersDao.js'
import CartsDaoMongoDB from "../persistence/daos/mongodb/cartsDao.js";
import { HttpResponse } from "../utils/httpResponse.js";
import { generateToken } from '../jwt/auth.js';
import logger from "../utils/logger.js";
const cartDao = new CartsDaoMongoDB();
const userDao = new UsersDaoMongoDB(); 
const httpResponse = new HttpResponse();

export const register = async(req, res, next)=>{
    try {
        const { firstName, lastName, email, age, password, role } = req.body;
        const exist = await userDao.getUserByEmail(email);
        if(exist) return httpResponse.Conflict(res, 'EmailAlreadyRegistered')
        else{
            const newCart = await cartDao.createCart();
            const user = {firstName, lastName, email, age, password, cartId:newCart, role};
            if(firstName === 'admin'){user.role = 'admin'};
            const newUser = await userDao.createUser(user);
            return httpResponse.Ok(res, newUser);
        };
    } catch (error) {
        logger.error(error)
        next(error);
    };
};
export const login = async(req, res, next)=>{
    try {
        const { email, password } = req.body;
        const user = await userDao.loginUser({email, password});
        if(!user) return httpResponse.Unauthorized(res, 'invalid credentials');
        else{
            if(user === 'isGithub') return httpResponse.Conflict(res, 'isGithub')
                else{
                const accessToken = generateToken(user)
                res
                .status(200)
                .header('Authorization', accessToken)
                .json({message: 'Login OK', accessToken})
            }
        }
    } catch (error) {
        logger.error(error)
        next(error);
    };
};
export const getAllUsersController = async (req, res, next) =>{
    try {
        const { page, limit, key, value, sortField, sortOrder } = req.query;
        const allUsers = await userDao.getAllUsers(page, limit, key, value, sortField, sortOrder);
        const nextLink = allUsers.hasNextPage ? `http://localhost:3000/users/page=${allUsers.nextPage}` : null
        const prevLink = allUsers.hasPrevPage ? `http://localhost:3000/users/page=${allUsers.prevPage}` : null
        const userData = req.user
        const usersFile = {
            results: allUsers.docs,
            userData: userData,
            info: {
                count: allUsers.totalDocs,
                pages: allUsers.totalPages,
                actualPage: allUsers.page,
                hasPrevPage: allUsers.hasPrevPage,
                hasNextPage: allUsers.hasNextPage,
                nextPageLink: nextLink,
                prevPageLink: prevLink
            }
        };
        return httpResponse.Ok(res, usersFile);
    } catch (error) {
        logger.error(error)
        next(error)
    };
};
export const recoverPasswordController = async(req, res, next)=>{
    try {
        const { email, newPassword } = req.body;
        const recoverPass = await userDao.recoverPassword({email, newPassword});
        if(recoverPass === 'thePasswordsAreTheSame') return httpResponse.Conflict(res, 'thePasswordsAreTheSame')
        if(recoverPass === 'passwordUpdated') return httpResponse.Ok(res, 'passwordUpdated')
    } catch (error) {
        logger.error(error)
        next(error);
    };
};
export const logoutUserController = async (req, res, next) =>{
    try {
        await userDao.updateLastActivity(req.user._id)
        req.session.destroy((error) => {
            if (error) {
                logger.error(error)
            } else{
                res.redirect('/');
            };
        });
    } catch (error) {
        logger.error(error)
        next(error)
    };
};
export const renderProfile = async(req, res, next) =>{
    try {
        const userData = req.user
        if(!userData){
            return httpResponse.Unauthorized(res, 'Unauthorized');
        }else{
            return httpResponse.Ok(res, userData);
        };
    } catch (error) {
        logger.error(error)
        next(error)
    };
};
export const ensureIsAdminController = async (req, res, next) =>{
    try {
        if(req.user.role === "admin") 
        return httpResponse.Ok(res, 'Authorized user')
        else return httpResponse.Unauthorized(res, 'Unauthorized user')
    } catch (error) {
        logger.error(error)
        next(error)
    };
};
export const ensureIsAdmOrPremController = async (req, res, next) =>{
    try {
        const userRole = req.user.role
        if(userRole === "admin"  || userRole === "premium" ) 
        return httpResponse.Ok(res, 'Authorized user')
        else return httpResponse.Unauthorized(res, 'Unauthorized user')
    } catch (error) {
        logger.error(error)
        next(error)
    };
};
export const checkAuthToRecoverPassController = async (req, res, next) =>{
    try {
        return httpResponse.Ok(res, req.email)
    } catch (error) {
        logger.error(error)
        next(error)
    };
};
export const convertToPremiumController = async (req, res, next) =>{
    try {
        const userId = req.params.userId;
        if(req.user.role === "admin") {
            await userDao.convertToPremium(userId)
            return httpResponse.Ok(res, "User role update to premium")
        }
        else return httpResponse.Unauthorized(res, 'Unauthorized user')
    } catch (error) {
        logger.error(error)
        next(error)
    };
};
export const convertToUserController = async (req, res, next) =>{
    try {
        const userId = req.params.userId;
        if(req.user.role === "admin") {
            await userDao.convertToUser(userId)
            return httpResponse.Ok(res, "User role update to user")
        }
        else return httpResponse.Unauthorized(res, 'Unauthorized user')
    } catch (error) {
        logger.error(error)
        next(error)
    };
};
export const newDocumentController = async(req, res, next)=>{
    try {
        console.log(req.file)
        httpResponse.Ok(res, 'ok')
    } catch (error) {
        logger.error(error)
        next(error)
    }
}
