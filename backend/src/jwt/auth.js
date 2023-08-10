import jwt from 'jsonwebtoken';
import UserDao from '../persistence/daos/mongodb/usersDao.js';
import { PrivateKeyJWT } from '../config.js'
const userDao = new UserDao();

export const generateToken = (user) =>{
    const payload = {
        userId: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        age: user.age,
        cartId: user.cartId
    };
    const token = jwt.sign(payload, PrivateKeyJWT, {
        expiresIn: '15m'
    });
    return token;
};

export const checkAuth = async (req, res, next) => {
    const authHeader = req.get('Authorization');
    if(!authHeader) return res.status(401).json({ msg: 'Unauthorized' });
    try {
        const token = authHeader.split(' ')[1];
        const decode = jwt.verify(token, PrivateKeyJWT);
        const user = await userDao.getUserById(decode.userId);
        if(!user) return res.status(401).json({ msg: 'Unauthorized' });
        req.user = user;
        next();
    } catch (error) {
    console.log(error)
    return res.status(404).json({ msg: 'Unauthorized' })
    }
}