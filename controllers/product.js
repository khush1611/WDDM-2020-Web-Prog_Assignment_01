const express =  require("express");
const router = express.Router();

// ./ to tell the browser that this is not third party package. in the above syntax we didnt mention cause its a third party package
// local module build by us
const product = require("../models/product");
const category = require("../models/category");


//category
// router.get("/category",(req, res)=>{
//     res.render("category",{

//     })
// });

//product listing
router.get("/productListing",(req, res)=>{
    res.render("product/productListing",{
        title: "Product Listing",
        // product is name of the variable we declared above.
        // const product
        //product listing injecting array call data here
        data: product.getAllProducts()   
    })
});

//create product
router.get("/createProduct",(req, res)=>{
    res.render("product/createProduct",{
        title: "Adding New Product",
    })
});

//Product Description
router.get("/productDescription",(req, res)=>{
    res.render("product/productDescription",{
        title: "Product Description",
    })
});

//All Product
router.get("/allProducts",(req, res)=>{
    res.render("product/allProducts",{
        title: "All Products",
    })
});

//Edit Product
router.get("/editProduct",(req, res)=>{
    res.render("product/editProduct",{
        title: "Edit Products",
    })
});




module.exports = router;