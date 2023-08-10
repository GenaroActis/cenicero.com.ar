// // path
import { dirname } from 'path';
import { fileURLToPath } from 'url';
export default dirname(fileURLToPath(import.meta.url));

// bcrypt
import bcrypt from 'bcrypt';
export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const isValidPassword = (password, user) => bcrypt.compareSync(password, user.password);

// response
export const createResponse = (res, statusCode, data) => {
    return res.status(statusCode).json({data})
};

// uuid
import { v4 as uuidv4 } from 'uuid'
export const generateCodeTicket = () =>{
    return uuidv4();
};

// faker.js
import { faker } from '@faker-js/faker'
faker.local = "es";
export const generateProducts = () =>{
    return {
        title: faker.commerce.product(),
        description: faker.commerce.productDescription(),
        price: faker.number.int({ max: 10000, min:4000}),
        stock: faker.number.int({ max:15, min:2 }),
        code: faker.string.uuid(),
        category: faker.commerce.productAdjective(),
        size: faker.number.int({ max:44, min:0 }).toString()
    }
}
