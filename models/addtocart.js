const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var addToCartSchema = new Schema({
    user_id:{
        type: String,
        required: true
    },
    product_id: {
        type: String,
        required:true
    },
    product_name: {
        type: String,
        required:true
    },
    product_image: {
        type: String,
        required:true
    },
    product_price:{
        type: Number,
        required:true
    },
    product_qty:{
        type: Number,
        required:true
    },
    date_created:{
        type: Date,
        default: Date.now()
    }
})

const addToCartModel =  mongoose.model("addtocart", addToCartSchema);

module.exports = addToCartModel;