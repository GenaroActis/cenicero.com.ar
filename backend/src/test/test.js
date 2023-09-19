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

let token = undefined
let userCartId = undefined
let prodId = undefined

describe('Integral test of an ecommerce.', ()=>{
    // beforeEach(async()=>{
    //     await mongoose.connection.collection('products').drop();
    // })

    // User Test
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
        userCartId = res.body.data.cartId

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
        const message = res.body.message
        token = res.body.accessToken
        const statusCode = res.statusCode;
        expect(message).toEqual('Login OK')
        expect(token).toBeDefined()
        expect(statusCode).toBe(200)
    })
    test('[GET], /api/admin/only', async()=>{
        const res = await request(app).get('/api/admin/only')
        .set('Authorization', `Bearer ${token}`)
        const message = res.body.message
        const data = res.body.data
        const statusCode = res.statusCode;
        if(user.role === 'admin'){
            expect(message).toEqual('Success')
            expect(data).toEqual('Authorized user')
            expect(statusCode).toBe(200)
        } else{
            expect(message).toEqual('Unauthorized')
            expect(statusCode).toBe(401)
        }
    })

    // Products Test
    test('[POST], /api/products', async()=>{
        const res = await request(app).post('/api/products').send(product)
        .set('Authorization', `Bearer ${token}`);
        const message = res.body.message;
        const data = res.body.data;
        const statusCode = res.statusCode;
        if(user.role === "admin"  || user.role === "premium" ) {
            prodId = res.body.data._id
            expect(message).toEqual('Success')
            expect(typeof data).toBe('object')
            expect(statusCode).toBe(200)
        } else{
            expect(message).toEqual('Unauthorized')
            expect(statusCode).toBe(401)
        }
    })
    test('[GET] /api/products', async()=>{
        const res = await request(app).get('/api/products')
        .set('Authorization', `Bearer ${token}`);
        const message = res.body.message
        const data = res.body.data
        const statusCode = res.statusCode;
        expect(message).toEqual('Success')
        expect(typeof data).toBe('object')
        expect(statusCode).toBe(200)
    })
    test('[DELETE] /api/products/:prodId', async() =>{
        const res = await request(app).delete(`/api/products/${prodId}`)
        .set('Authorization', `Bearer ${token}`);
        const message = res.body.message;
        const data = res.body.data;
        const statusCode = res.statusCode;
        if(user.role === "admin"  || user.role === "premium" ) {
            expect(message).toEqual('Success')
            expect(typeof data).toBe('object')
            expect(statusCode).toBe(200)
        } else{
            expect(message).toEqual('Unauthorized')
            expect(statusCode).toBe(401)
        }
    })
    test('[POST], /api/products', async()=>{
        const res = await request(app).post('/api/products').send(product)
        .set('Authorization', `Bearer ${token}`);
        const message = res.body.message;
        const data = res.body.data;
        const statusCode = res.statusCode;
        if(user.role === "admin"  || user.role === "premium" ) {
            prodId = res.body.data._id
            expect(message).toEqual('Success')
            expect(typeof data).toBe('object')
            expect(statusCode).toBe(200)
        } else{
            expect(message).toEqual('Unauthorized')
            expect(statusCode).toBe(401)
        }
    })

    // Cart Test
    test('[PUT] /api/carts/:prodId', async() =>{
        const res = await request(app).put(`/api/carts/${prodId}`)
        .set('Authorization', `Bearer ${token}`);
        const message = res.body.message;
        const data = res.body.data;
        const statusCode = res.statusCode;
        expect(message).toEqual('Success')
        expect(typeof data).toBe('object')
        expect(statusCode).toBe(200)
    })
    test('[PUT] /api/carts/quantity/:prodId', async() =>{
        const newQuantityExpected = {quantity:5}
        const res = await request(app).put(`/api/carts/quantity/${prodId}`).send(newQuantityExpected)
        .set('Authorization', `Bearer ${token}`);
        const message = res.body.message;
        const data = res.body.data;
        const statusCode = res.statusCode;
        const newQuantityRes = {quantity: res.body.data.products[0].quantity}
        expect(newQuantityRes).toEqual(newQuantityExpected)
        expect(message).toEqual('Success')
        expect(typeof data).toBe('object')
        expect(statusCode).toBe(200)
    })
    test('[DELETE] /api/carts', async() =>{
        const res = await request(app).delete('/api/carts')
        .set('Authorization', `Bearer ${token}`);
        const message = res.body.message;
        const data = res.body.data;
        const statusCode = res.statusCode;
        expect(message).toEqual('Success')
        expect(data).toEqual(`cart with id ${userCartId} successfully products removed`)
        expect(statusCode).toBe(200)
        console.log(res.body)
    })
})
