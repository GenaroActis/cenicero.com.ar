import mongoose from 'mongoose';

const CartsSchema = new mongoose.Schema({
    products: [
        { _id : { type: mongoose.Schema.Types.ObjectId, required:true, ref: 'products'},
        quantity: { type: Number, default: 1 } },
    ],
});

CartsSchema.pre('find', function(){
    this.populate('products');
});

export const CartsModel = mongoose.model(
    'carts',
    CartsSchema 
);