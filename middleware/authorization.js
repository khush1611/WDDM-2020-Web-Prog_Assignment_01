const userModel = require("../models/user");
const productModel = require("../models/product");

const dashBoardLoader = (req,res)=>{
    if(req.session.userInfo.user_admin)
    {
        const errors =[];
        userModel.findById(req.session.userInfo._id)
        .then((user)=>{
        
            if(user == null){
                console.log(`Error happended when pulling data from the Databse: ${err}`);
                errors.push({userValidity:"! Error occurred. Check your login credentials"})

                res.render("useraccount/login", {
                    title: "Login",
                    errorMessages: errors,
                    formValues: form
                });
            }
            else{
                 //All products for this user
                 productModel.find({product_created_by: user._id})
                 .then((products)=>{

                     const productsListing = products.map(prod=>{
                         return{
                             id: prod._id,
                             product_image:prod.product_image,
                             product_name: prod.product_name,
                             product_price: prod.product_price,
                             product_category: prod.product_category,
                             product_quantity: prod.product_quantity,
                             product_bestseller: prod.product_bestseller,
                             product_description: prod.product_description
                         }
                     });
                     //console.log(productsListing);

                     res.render("users/dashboard",{
                         title: "Dashboard",
                         errorMessages:"" ,
                         products: productsListing       
                     });
                 })
                 .catch(err =>{
                    
                     errors.push({userValidity:"! Error occurred. Check your login credentials"});
                     res.render("users/login", {
                         title: "Login",
                         errorMessages: errors,
                         formValues: form
                     });
                 });
                }       
        })
        .catch(err =>{
            console.log(`Error happended when pulling data from the Databse: ${err}`);
        });
    }
    else{
        res.redirect("/product/productListing");
    }
}

module.exports = dashBoardLoader;