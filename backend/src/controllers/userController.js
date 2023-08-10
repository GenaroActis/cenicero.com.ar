import UsersDaoMongoDB from '../persistence/daos/mongodb/usersDao.js'
import CartsDaoMongoDB from "../persistence/daos/mongodb/cartsDao.js";
import { HttpResponse } from "../utils/httpResponse.js";
import { generateToken } from '../jwt/auth.js';

const cartDao = new CartsDaoMongoDB();
const userDao = new UsersDaoMongoDB(); 
const httpResponse = new HttpResponse();

export const register = async(req, res, next)=>{
    try {
        const { firstName, lastName, email, age, password } = req.body;
        const exist = await userDao.getUserByEmail(email);
        if(exist) return httpResponse.Conflict(res, 'EmailAlreadyRegistered')
        else{
            const newCart = await cartDao.createCart();
            const user = {firstName, lastName, email, age, password, cartId:newCart};
            if(firstName === 'admin'){user.role = 'admin'};
            const newUser = await userDao.createUser(user);
            const token = generateToken(newUser);
            return httpResponse.Ok(res, token);
        };
    } catch (error) {
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
                .json({msg: 'Login OK', accessToken})
            }
        }
    } catch (error) {
        next(error);
    };
};

export const logoutUserController = async (req, res, next) =>{
    try {
        req.session.destroy((err) => {
            if (err) {
                console.log(err);
            } else{
                res.redirect('/');
            };
        });
    } catch (error) {
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
        next(error)
    };
};

export const ensureIsAdminController = async (req, res, next) =>{
    try {
        if(req.user.role === "admin") 
        return httpResponse.Ok(res, 'Authorized user')
        else return httpResponse.Unauthorized(res, 'Unauthorized user')
    } catch (error) {
        next(error)
    };
};
