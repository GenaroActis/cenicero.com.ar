import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import './db/db.js';
import MongoStore from 'connect-mongo';
import cookieParser from 'cookie-parser';
import apiRouter from './routes/apiRouter.js'
import session from 'express-session';
import { errorHandler } from './middlewares/errorHandler.js';
import passport from 'passport';
import { MongoDBUrl } from './config.js';
import './passport/jwt.js';
import './passport/github.js';
import cors from 'cors';

const app = express();
const port = 8080;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(morgan('dev'));
app.use(cookieParser())
app.use(session({
    secret: 'sessionKey',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 25000
    },
        store : new MongoStore({
            mongoUrl: MongoDBUrl,
            ttl: 100,
        })
})
);

app.use(cors({
    credentials:true,
    origin: 'http://localhost:3000'
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/api', apiRouter);
app.use(errorHandler)

const httpServer = app.listen(port, ()=>{
    console.log('server ok en port', port);
});


