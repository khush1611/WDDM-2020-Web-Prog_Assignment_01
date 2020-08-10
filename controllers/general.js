const express =  require("express");
const router = express.Router();


// ./ to tell the browser that this is not third party package. in the above syntax we didnt mention cause its a third party package
// local module build by us
const productModel = require("../models/product");

const product = require("../models/product");
const category = require("../models/category");


//home
router.get("/",(req, res)=>{

    productModel.find({product_bestseller:true}).then((products)=>{
        //filter out the essential data only
        const productsListing = products.map(prod=>{
            return{
                id: prod._id,
                product_image:prod.product_image,
                product_name: prod.product_name,
                product_description: prod.product_description,
                product_price: prod.product_price,
                product_quantity: prod.product_quantity,
                product_category: prod.product_category,
                product_bestseller: prod.product_bestseller
            }
        });

        // console.log(productsListing);

        res.render("general/index",{
            title: "Amazon",
            data: category.getAllCategory(),
            featuredproducts: productsListing
        })

    }).catch(err =>{
        console.log(`Error happended when pulling data from the Databse: ${err}`);
   });
});

// //cart
// router.get("/cart",(req, res)=>{
//     res.render("general/cart",{
//         title: "Cart",
//     })
// });

// coming soon
router.get("/comingsoon",(req, res)=>{
    res.render("general/comingsoon",{
        title: "Deal Store"
    })
});

module.exports = router;
