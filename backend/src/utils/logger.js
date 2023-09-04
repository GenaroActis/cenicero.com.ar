import winston from 'winston'
import 'winston-mongodb'
import { MongoDBUrl, NodeEnv } from '../config.js';

const logLevels = {
    debug: 0,
    http: 1,
    info: 2,
    warning: 3,
    error: 4,
    fatal: 5
};

let logConfig = undefined

if(NodeEnv === 'production'){
    logConfig ={
        levels: logLevels,
        transports: [
            new winston.transports.MongoDB({
                options:{ useUnifiedTopology: true },
                db: MongoDBUrl,
                collection: "logs",
                tryReconnect: true,
                level: "error"
            }),
            new winston.transports.Console({ level: "debug" }),
            new winston.transports.File({
                filename: "./logs/logs.log",
                level: "info", 
            }),
        ]
    };
}
if(NodeEnv === 'development'){
    logConfig ={
        levels: logLevels,
        transports: [
            new winston.transports.Console({ level: "debug" }),
        ]
    };
}
if(NodeEnv !== 'development' && NodeEnv !== 'production'){
    logConfig ={
        levels: logLevels,
        transports: [
            new winston.transports.Console({ level: "debug" }),
        ]
    };
}

const logger = winston.createLogger(logConfig)
export default logger;
