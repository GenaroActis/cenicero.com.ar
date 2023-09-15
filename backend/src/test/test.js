import app from '../server.js';
import request from 'supertest';
import mongoose from 'mongoose';
import { fakerES as faker } from '@faker-js/faker';

const product = {
    title: faker.commerce.product(),
    description: faker.commerce.productDescription(),
    price: faker.commerce.price({ min: 1000, max: 20000 }) ,
    stock: faker.number.int({ min: 5, max: 10 }),
    category: faker.commerce.productAdjective() ,
    size: faker.word.adjective()
}

const user = {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    age: faker.number.int({ min: 18, max: 90 }),
    password: faker.string.uuid(),
    role: 'admin',
}

// let token = undefined

describe('Integral test of an ecommerce.', ()=>{
    // beforeEach(async()=>{
    //     await mongoose.connection.collection('products').drop();
    // })
    test('[POST] /api/user/register', async()=>{
        const res = await request(app).post('/api/user/register').send(user)
        
        const id = res.body.data._id;
        const firstNameRes = res.body.data.firstName;
        const firstNameExpected = user.firstName;
        const lastNameRes = res.body.data.lastName;
        const lastNameExpected = user.lastName;
        const emailRes = res.body.data.email;
        const emailExpected = user.email;
        const roleRes = res.body.data.role;
        const roleExpected = user.role;
        const statusCode = res.statusCode;

        expect(id).toBeDefined()
        expect(firstNameRes).toEqual(firstNameExpected)
        expect(lastNameRes).toEqual(lastNameExpected)
        expect(emailRes).toEqual(emailExpected)
        expect(roleRes).toEqual(roleExpected)
        expect(statusCode).toBe(200)
    })
    test('[POST], /api/user/login', async()=>{
        const userLogin = {
            email: user.email,
            password: user.password
        } 
        const res = await request(app).post('/api/user/login').send(userLogin)
        token = res.body.accessToken
    })
    // test('[POST] /api/products', async()=>{
    //     // console.log(product)
    //     const res = await request(app)
    //     .post('/api/products').send(product)
    //     .set('Authorization', authToken);
    //     // console.log(res.body)
    // })
})
