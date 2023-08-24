import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const productsSchema = new mongoose.Schema({
    title: { type: String, required: true, index: true },
    description: { type: String, required: true },
    price: { type:Number, required: true },
    stock: { type:Number, required: true },
    code: { type:String, required: true, unique: true},
    category: { type:String, required: true, index: true},
    size: { type:String, required:true, index: true},
    owner:{ type: String, default:'admin'}
});

productsSchema.plugin(mongoosePaginate);

export const ProductsModel = mongoose.model(
    'products',
    productsSchema 
);