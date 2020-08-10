const express =  require("express");
const router = express.Router();
const path = require("path");

const productModel = require("../models/product");

// ./ to tell the browser that this is not third party package. in the above syntax we didnt mention cause its a third party package
// local module build by us
const product = require("../models/product");
const category = require("../models/category");
const userModel = require("../models/user");
const isAuthenticated = require("../middleware/auth");
const addtocartModel = require("../models/addtocart"); 
const { nextTick } = require("process");


//category
// router.get("/category",(req, res)=>{
//     res.render("category",{

//     })
// });

//product listing
router.get("/productListing",(req, res)=>{

    productModel.find().then((products)=>{
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

        res.render("product/productListing",{
            title: "All Products",
            data: productsListing
        })

    }).catch(err =>{
        console.log(`Error happended when pulling data from the Databse: ${err}`);
   });


    // res.render("product/productListing",{
    //     title: "Product Listing",
    //     // product is name of the variable we declared above.
    //     // const product
    //     //product listing injecting array call data here
    //     data: product.getAllProducts()   
    // })
});

//product description
router.get('/productDescription/:id',(req,res)=>{
    const errors =[];

    //get product details
    productModel.findById({_id:req.params.id})
    .then((product)=>{

        if(product != null){
            //Get the essential data 
            const {_id,product_name,product_price,product_description,product_category,product_quantity,product_bestseller,product_image} = product

            res.render("product/productDescription",{
                title: product_name,
                _id,
                product_name,
                product_price,
                product_description,
                product_category,
                product_quantity,
                product_bestseller,
                product_image
            })
        }
        else{
            console.log(`Error : Product id wrong: ${err}`);
            res.redirect('/product/allProducts');
        }
    })
    .catch(err =>{
        console.log(`Error : Product id wrong: ${err}`);
        res.redirect('/product/allProducts');
    });
});

//create product
router.get("/createProduct",isAuthenticated ,(req, res)=>{
    res.render("product/createProduct",{
        title: "Adding New Product",
    })
});
router.post("/createProduct",isAuthenticated, (req,res)=>{

    //get submitted values
    const newProduct = {
        product_name: req.body.pname,
        product_price: req.body.price,
        product_description: req.body.description,
        product_category: req.body.category,
        product_quantity: req.body.qty,
        product_bestseller: req.body.bestseller,        
        product_created_by:req.session.userInfo._id
    }

    const product = new productModel( newProduct);
    product.save().then((addedProduct)=>{
        //if success, save file uloaded and redirect to allProducts pages

        req.files.uploadfile.name = `product_pic_${addedProduct._id}${path.parse(req.files.uploadfile.name).ext}`;

        //uplaod file to external path
        req.files.uploadfile.mv(`public/images/products/${req.files.uploadfile.name}`)
        .then(()=>{
            
            productModel.updateOne({_id:addedProduct._id},{
                product_image:req.files.uploadfile.name
            })
            .then(()=>{
                res.redirect(`/users/dashboard`);
            })
            .catch(err =>{
                console.log(`Error happended when uploading image: ${err}`);
            });
        })
        .catch(err =>{
            console.log(`Error happended when uploading image: ${err}`);
        });

    }).catch(err =>{
         console.log(`Error happended when inserting in the Databse: ${err}`);
    });
})

//Product Description
router.get("/productDescription",(req, res)=>{
    res.render("product/productDescription",{
        title: "Product Description",
    })
});


//All Product
router.get("/allProducts",(req, res)=>{

    productModel.find().then((products)=>{
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

        res.render("product/allProducts",{
            title: "All Products",
            data: productsListing
        })

    }).catch(err =>{
        console.log(`Error happended when pulling data from the Databse: ${err}`);
   });
});

//Edit Product
router.get("/editProduct/:id",isAuthenticated,(req, res)=>{

    productModel.findById(req.params.id).then((product)=>{

        //if id valid, return object
        //if id invalid, return null

        console.log(product);
        
        //filter out the essential data only
        const {_id,product_name,product_description,product_price,product_quantity,product_bestseller,product_category} = product

        // console.log(product_name);
        // console.log(product_price);
        // console.log(product_bestseller);


        res.render("product/editProduct",{
            title: "Edit Products",
            _id,
            product_name,
            product_description,
            product_price,
            product_quantity,
            product_bestseller,
            product_category
        })

    }).catch(err =>{
        console.log(`Error happended when pulling data from the Databse: ${err}`);
   });
});

//we need to write middleware function (in entry point file) to process query string
router.put("/updateproduct/:id",isAuthenticated,(req,res)=>{

    //get submitted values
    const newProduct = {
        product_name: req.body.pname,
        product_price: req.body.price,
        product_description: req.body.description,
        product_category: req.body.category,
        product_quantity: req.body.qty,
        product_bestseller: req.body.bestseller
    }

    productModel.updateOne({_id:req.params.id},newProduct).then(()=>{
        //if success redirect to dashboard
        res.redirect("/users/dashboard");

    }).catch(err =>{
         console.log(`Error happended when updating in the Databse: ${err}`);
    });
});

//Delete product
router.delete("/deleteproduct/:id",isAuthenticated,(req,res)=>{

    productModel.deleteOne({_id:req.params.id}).then(()=>{
        //if success redirect to dashboard
        res.redirect("/users/dashboard");
    }).catch(err =>{
        console.log(`Error happended when updating in the Databse: ${err}`);
   });
});

//add to cart

router.post("/addtocart/:id",isAuthenticated, (req,res)=>{

    var product_id= req.params.id;
    var req_qty= req.body.req_qty;

    const errors =[];

    //find the product
    productModel.findById(product_id)
    .then((product)=>{ 

        if(product != null)
        {
            const {_id,product_image,product_name,product_price,product_quantity} = product

            if((product_quantity>0))
            {
                if(0 < req_qty <= product_quantity)
                {
                    const newProduct = {
                        user_id:req.session.userInfo._id,
                        product_id: product_id,
                        product_name : product_name,
                        product_image:product_image,
                        product_qty: req_qty,
                        product_price: product_price
                    }

                    const addtocart = new addtocartModel( newProduct);

                    addtocart.save()
                    .then((prod)=>{

                        res.redirect(`/product/productListing`);

                    })
                    .catch(err =>{
                        console.log(`Error happended when pulling data from the Databse: ${err}`);
                        res.redirect(`/product/productDescription/${product_id}`);
                    });
                }
            }
            else{
                errors.push({prod_qty_err: "Please check quantity."});
                res.redirect(`/product/productDescription/${product_id}`);
            }
        }
        else{
            console.log(`Error happended when pulling data from the Databse for product edit: ${err}`);
            res.redirect(`/product/productDetail/${product_id}`);
        }
    })
    .catch(err =>{
        console.log(`Error happended when pulling data from the Databse: ${err}`);
        res.redirect(`/product/productDetail/${product_id}`);
    });
});

// get cart details
router.get("/orderSummary",isAuthenticated,(req,res)=>{

    var errors=[];
    var total=0;

    addtocartModel.find({user_id: req.session.userInfo._id})
    .then((products)=>{

        //filter
        const addToCartProducts = products.map(prod=>{

            var product_price = prod.product_qty * prod.product_price;
            total = total + product_price;
            return{
                id: prod._id,
                product_id:prod.product_id,
                product_image: prod.product_image,
                product_name:prod.product_name,
                product_quantity: prod.product_qty,
                product_price: prod.product_price,
                product_total: product_price
            }
        });            

        res.render("general/cart",{
            title: "Cart",
            errorMessages:"" ,
            cartProducts: addToCartProducts,
            cartTotal: total
        });
    })
    .catch(err =>{
        errors.push(`Error happended when pulling data from the Databse: ${err}`);
        console.log(err);
        res.redirect(`/product/productListing`);
    });
});

//place order
router.post("/placeorder",isAuthenticated,(req,res,next)=>{
    
    //console.log("delete module");
    var email;
    var name;

    userModel.findById(req.session.userInfo._id)
    .then((user)=>{
        email= user.user_email;
        name= user.user_name;
    })
    .catch(err=>{
        console.log("error fetching user details");
    })

    //get products 
    addtocartModel.find({user_id: req.session.userInfo._id})
    .then((products)=>{

        console.log(products);
        if(products != null)
        {
            //if success, send email

            const sgMail = require('@sendgrid/mail');
            sgMail.setApiKey(process.env.SEND_GRID_API_KEY);

            const msg = {
                to: email,
                from: 'khushboo.umrigar11@gmail.com',
                subject: 'Order Place',
                html:   `<strong>Hi ${name},</strong>
                        <p>Thanks for placing your order.</p><br>
                        <p>For any further queary you can always contact our customer service.</p>
                    <p>Cheers, <br/>Amazon Family</p>`,
                };

            sgMail.send(msg)
            .then(()=>{
                //Update quantity
                for (let index = 0; index < products.length; index++) {
                    // console.log(products[index]);

                    //find the product and decrease the qty from product table
                    productModel.findById(products[index].product_id)
                    .then((product)=>{ 
                        if(product != null){
        
                            var new_qty= product.product_quantity-products[index].product_qty;
            
                            productModel.updateOne({_id:products[index].product_id}, {product_quantity: new_qty})
                            .then(()=>{
                                // console.log("Quantity updated");
                                next();
                            })
                            .catch(err =>{
                                res.redirect('/product/productListing');
                            });                                
                        }
                        else
                        {
                            res.redirect('/product/productListing');
                        }
                    })
                    .catch(err =>{
                        res.redirect('/product/productListing');
                    });
                }
            })
            .catch(err =>{
                res.redirect('/product/productListing');
            }); 
        }           
    })
    .catch(err=>{
        res.redirect('/product/productListing');
    });   
    
     //delete product
     addtocartModel.deleteMany({user_id:req.session.userInfo._id})
     .then(()=>{
         res.redirect('/product/productListing');
     })
     .catch(err =>{
         res.redirect('/product/productListing');
     });
});

module.exports = router;