const express =  require("express");
const router = express.Router();
const bcrypt= require('bcryptjs');


const userModel = require("../models/user");
const productModel = require("../models/product");
const isAuthenticated = require("../middleware/auth");
const dashBoardLoader = require("../middleware/authorization");


//fucntions for server-side validations
//https://www.regextester.com/104030
// ^                                            Match the beginning of the string
// a-zA-z                                       capital or small character a-5
// _-                                           should have _-
// {3-10}                                       checks for the length b/w 3-10
function userNameValidation(uName){
    const regex = /^[a-zA-Z0-9_-]{3,10}$/;
    return regex.test(uName);
}

//https://www.ocpsoft.org/tutorials/regular-expressions/password-regular-expression/
function passwordValidation(pword){
    //const regex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!@$%^&(){}[]:;<>,.?~_+-=|\]).{8,32}$/;
    //https://www.regextester.com/95029
    const regex = /^[A-Za-z0-9]+/;
    return regex.test(pword);
}

// login
router.get("/login",(req, res)=>{
    res.render("users/login",{
        title: "login"
    })
});

//login-form submission
router.post('/login-form',(req,res)=>{

    const varError =[];
    const {username, Upassword} = req.body;

    if(username == ""){
        //console.log("true " + username);
        varError.push("To login, you must enter username")
    }
    //else{
    //console.log("false " + req.body.username);
    //}
    if(Upassword == ""){
        varError.push("To login, you must enter password")
    }
    if(varError.length > 0){
        res.render("users/login", {
            title: "login",
            errorMessages: varError
        });
    }
    else{

    userModel.findOne({user_username:username})
    .then((user)=>{

        if(user == null)
        {
            varError.push("User not found. Check your login credentials")
            res.render("users/login", {
                title: "login",
                errorMessages: varError
            });
        }
        else
        {
            // console.log(`User found : ${user}`);
            //compare password 
            //https://medium.com/javascript-in-plain-english/how-bcryptjs-works-90ef4cb85bf4
            bcrypt.compare(Upassword, user.user_password)
            .then(isEqual=>{

                if(isEqual)
                {
                    req.session.userInfo = user;

                    //check if user is admin
                    if(user.user_admin)
                    {

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

                            // res.render("users/dashboard",{
                            //     title: "Dashboard",
                            //     errorMessages:"" ,
                            //     products: productsListing       
                            // });
                            res.redirect('/users/dashboard');
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
                    else
                    {
                        res.redirect("/product/productListing");
                    }
    
                }
                else
                {
                    res.render("users/login", {
                        title: "Login",
                        errorMessages: errors,
                        formValues: form
                    });
                }
            })
            .catch(err =>
                {
                    console.log(`Password is not matching: ${err}`);
                    varError.push("Password incorrect. Check your login credentials")
                    res.render("users/login", {
                        title: "login",
                        errorMessages: varError
                    });
                });
        }
    })
    .catch(err =>{
        console.log(`Error happended when pulling data from the Databse: ${err}`);
        varError.push("Password incorrect. Check your login credentials")
        res.render("users/login", {
            title: "login",
            errorMessages: varError
        });
    });

    }
});

//singup 
router.get("/signup",(req, res)=>{
    res.render("users/signup",{
        title: "signup"
    })
});

//signup-form submission
router.post('/signup-form',(req,res)=>{

    const varError =[];
    // get form fields in a variable
    const {name,username,email,address,Upassword, Cpassword} = req.body;

    var form = {
        nameHolder: req.body.name, 
        usernameHolder: req.body.username,
        emailHolder: email,
        addressHolder: req.body.address,
    }
    //console.log(form);
    
    if(name == ""){
        varError.push("Name field can not be null")
    }
    //console.log(userNameValidation(req.body.username));
    if(username == ""){
        varError.push("Username Field can not be null")
    } 
    else if(!userNameValidation(username))
    {
        varError.push("Username can contain characters (3-10), numbers, '-' and '_'. EX: Khush-16");
    }

    if(email == ""){
        varError.push("Email field can not be null")
    }

    // console.log(passwordValidation(Upassword));
    // console.log(Upassword);

    if(Upassword == ""){
        varError.push("Password field can not be null")
    } 
    else if(!passwordValidation(Upassword)){
        varError.push('Require that at least one digit appear anywhere in the string')
    }
    if(Cpassword == ""){
        varError.push("Confirm password can not be null")
    }
    if(Upassword !== Cpassword){
        // console.log("not match");
        varError.push("password doesn't match")
    }
    if(varError.length > 0){
        res.render("users/signup", {
            title: "signup",
            errorMessages: varError,
            formValues: form
    });
    }
    else{

        //register successfull
        //Add user to db

        //get submitted values
        const newUser = {
            user_name: req.body.name,
            user_username: req.body.username,
            user_email: req.body.email,
            user_address: req.body.address,
            user_password: req.body.Upassword
        }
        const user = new userModel( newUser);// here it will call pre method fro encryption

        user.save().then(()=>{
            //if success, send welcome email & redirect to login page
            // using Twilio SendGrid's v3 Node.js Library
            // https://github.com/sendgrid/sendgrid-nodejs
            const sgMail = require('@sendgrid/mail');

            sgMail.setApiKey(process.env.SEND_GRID_API_KEY);
            
            const msg = {
            to: email,
            from: 'khushboo.umrigar11@gmail.com',
            subject: 'Welcome to Amazon family',
            html:   `<strong>Hi ${name},</strong>
                    <p>Welcome to the amazon family.</p>
                    <p>We are pleased that you joined.<br/> 
                    We make sure that our customer get the best experience and quality products.<br/>
                    We have the number one customer service and we serve our customers with proper guidance. <br/>
                    Hope you find everything good.<br/>
                    For any further queary you can always contact our customer service.
                </p>

                <p>Here is the information you've provided.
                    <strong>Name: ${name}</strong>
                    <strong>Username: ${username}</strong>
                    <strong>Email: ${email}</strong>
                    <strong>Address: ${address}</strong>
                    //how to add if condition here
                </p>
                <p>Cheers, <br/>Amazon Family</p>`,
            };

            //
            sgMail.send(msg).then(()=>{

                res.render("users/login");
            }).catch(err=>{
                // console.log(`Error: ${err}`);
                // err will store the error which wil be generated by sendgrid

                console.log(`Error happended when sending welcome email: ${err}`);

            })
        }).catch(err =>{
            console.log(`Error happended when inserting in the Databse: ${err}`);
        });        
    }
});

// Dashboard
// router.get("/dashboard",(req, res)=>{
//     res.render("users/dashboard",{
//         title: "Dashboard"
//     })
// });

router.get('/dashboard',isAuthenticated,dashBoardLoader);


//logout 
router.get('/logout',(req,res)=>{

    //destroy the session
    req.session.destroy();

    res.redirect('/users/login');
});

module.exports = router;
