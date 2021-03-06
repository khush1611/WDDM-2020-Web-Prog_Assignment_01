// const product = {
//     productDB : [],
//     //method
//     // when this method will call, we will push following info into the array
//     initDB()
//     {
//         this.productDB.push({
//             title: "Gray Patterned Sofa",
//             description: "Lorem Ipsum is simply dummy text",
//             price: "$ 50",
//             featured: false,
//             imgPath: "sofa_1.jpg"
//         });

//         this.productDB.push({
//             title: "Black two set sofa",
//             description: "Lorem Ipsum is simply dummy text",
//             price: "$ 900",
//             featured: true,
//             imgPath: "sofa_2.jpg"
//         });

//         this.productDB.push({
//             title: "Lavender Sofa",
//             description: "Lorem Ipsum is simply dummy text",
//             price: "$ 900",
//             featured: true,
//             imgPath: "sofa_3.jpg"
//         });

//         this.productDB.push({
//             title: "Gray Wide Sofa",
//             description: "Lorem Ipsum is simply dummy text",
//             price: "$ 900",
//             featured: true,
//             imgPath: "sofa_4.jpg"
//         });
//     },

//     getAllProducts()
//     {
//         //calling the method
//         return this.productDB;
//     },

//     getFeaturedProducts()
//     {
//         // logic will create array that will only have featured product
//         // check to see each above element. if the featured = true then we put that into new array and return new array

//         featuredProductDB = [];

//         if(this.productDB.length > 0){
//             this.productDB.forEach(ele =>{
//                 if(ele.featured == true){
//                     featuredProductDB.push(ele);
//                 }
//             })
//         }

//         return featuredProductDB
//     }

// }


// // before we export we are calling the method
// // calling initDB
// // we do this cause we export object with array that is full with data
// product.initDB();

// // by writing this we made the above entire code as a module
// // exporting the DB
// module.exports = product;

// // here we did importing
// // we do exporting on starter file. server.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var productSchema = new Schema({
    product_name: {
        type: String,
        required: true
    },
    product_price:{
        type: Number,
        required: true
    },
    product_description: {
        type: String,
        required:true
    },
    product_category:{
        type: String,
        required: true
    },
    product_quantity:{
        type: Number,
        default: "0"
    },
    product_bestseller:{
        type: Boolean,
        default:false
    },
    product_image:{
        type:String
    },
    product_created_by:{
        type:String
    },
    date_created:{
        type: Date,
        default: Date.now()
    }
})

const productModel =  mongoose.model("product", productSchema);

module.exports = productModel;

