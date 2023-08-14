import winston from 'winston'
import 'winston-mongodb'
import { MongoDBUrl } from '../config.js';

const logLevels = {
    debug: 0,
    http: 1,
    info: 2,
    warning: 3,
    error: 4,
    fatal: 5
};

const logConfig ={
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
const logger = winston.createLogger(logConfig)
export default logger;
// logger.debug('mensaje con nivel debug');
// logger.http('mensaje con nivel http');
// logger.info('mensaje con nivel info');
// logger.warning('mensaje con nivel warning');
// logger.error('mensaje con nivel error');
// logger.fatal('mensaje con nivel fatal');
