const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {ObjectId}=mongoose.Schema;

const ProductCartSchema= new Schema({
    product:{
        type:ObjectId,
        ref:"Product"
    },
    name:String,
    count:Number,
    
})

const orderSchema = new Schema({
    products:[ProductCartSchema],
    transaction_id:{},
    amount:{
        type:Number
    },
    address:{
        type:String,
        maxlength:1000
    },
    status:{
        type:String,
        default:"Received",
        enum:["Cancelled","Delivered","Shipped","Processing","Received"]
    },  
    updated:Date,
    user: {
        type:ObjectId,
        ref:"User"
    }

},{timestamps:true});


const Order=mongoose.model("Order",orderSchema);
const ProductCart=mongoose.model("ProductCart",ProductCartSchema);


module.exports = {Order, ProductCart}