import { Strategy as GithubStrategy } from 'passport-github2';
import passport from 'passport';
import UserDao from '../persistence/daos/mongodb/usersDao.js';
import CartsDaoMongoDB from "../persistence/daos/mongodb/cartsDao.js";
import { generateToken } from '../jwt/auth.js';
import { ClientIDGithub, ClientSecretGithub } from '../config.js'
const userDao = new UserDao();
const cartDao = new CartsDaoMongoDB();

const strategyOptions = {
    clientID : ClientIDGithub,
    clientSecret: ClientSecretGithub,
    callbackURL:'http://localhost:8080/api/user/github-profile',
    origin: 'http://localhost:3000',
};

const registerOrLogin = async(accessToken, refreshToken, profile, done) => {
    try {
        const email = profile._json.email
        const user = await userDao.getUserByEmail(email);
        if(user) {
            const token = generateToken(user)
            return done(null, token)
        }else {
            const newCart = await cartDao.createCart()
            const cartId = newCart._id
            const newUser = await userDao.createUser({
                firstName : profile._json.name.split(' ')[0],
                lastName: profile._json.name.split(' ')[1],
                email: email,
                password: '',
                isGithub: true,
                cartId: cartId
            });
            const token = generateToken(newUser)
            return done(null, token)
        };
    } catch (error) {
        console.log(error)
    };
};

passport.use('github', new GithubStrategy(strategyOptions, registerOrLogin));

export const frontResponseGithub = (req, res, next) => {
    passport.authenticate('github', (err, user, info) => {
        res.header('Authorization', user)
        .redirect(`http://localhost:3000/github/${user}`)
    })(req, res, next);
};