const express =  require("express");
const router = express.Router();

// ./ to tell the browser that this is not third party package. in the above syntax we didnt mention cause its a third party package
// local module build by us
const product = require("../models/product");
const category = require("../models/category");


//home
router.get("/",(req, res)=>{
    res.render("general/index",{
        title: "Amazon",
        data: category.getAllCategory(),
        featuredproducts: product.getFeaturedProducts()
    })
});

// coming soon
router.get("/comingsoon",(req, res)=>{
    res.render("general/comingsoon",{
        title: "Deal Store"
    })
});

module.exports = router;
