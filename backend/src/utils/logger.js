import winston from 'winston'
import 'winston-mongodb'
import { MongoDBUrl } from '../config.js';

export const logger = () =>{
    const logConfig ={
        level:'info',
        transports: [
            new winston.transports.MongoDB({
                options:{ useUnifiedTopology: true },
                db: MongoDBUrl,
                collection: "logs",
                tryReconnect: true,
                level: "error"
            }),
            new winston.transports.Console({ level: "silly" })
        ]
    };
    const log = wiston.createLogger(logConfig)
};