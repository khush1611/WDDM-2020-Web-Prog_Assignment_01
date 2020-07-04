const express =  require("express");
const exphbs  = require('express-handlebars');
const bodyParser = require('body-parser');
// ./ to tell the browser that this is not third party package. in the above syntax we didnt mention cause its a third party package
// local module build by us
const product = require("./models/product");
const category = require("./models/category");

const app = express();

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.use(express.static("public"))

app.use(bodyParser.urlencoded({ extended: false }))


app.get("/",(req, res)=>{
    res.render("index",{
        title: "Amazon",
        data: category.getAllCategory(),
        featuredproducts: product.getFeaturedProducts()
    })
});

app.get("/productListing",(req, res)=>{
    res.render("productListing",{
        title: "Product Listing",
        // product is name of the variable we declared above.
        // const product
        //product listing injecting array call data here
        data: product.getAllProducts()   
    })
});

app.get("/comingsoon",(req, res)=>{
    res.render("comingsoon",{
        title: "Deal Store"
    })
});

// app.get("/category",(req, res)=>{
//     res.render("category",{

//     })
// });

app.get("/login",(req, res)=>{
    res.render("login",{
        title: "login"
    })
});

app.get("/signup",(req, res)=>{
    res.render("signup",{
        title: "signup"
    })
});

//signup-form
app.post('/signup-form',(req,res)=>{

    const varError =[];
    
    if(req.body.name == ""){
        varError.push("you must enter your name")
    }

    if(req.body.username == ""){
        varError.push("you must enter username")
    }

    if(req.body.email == ""){
        varError.push("you must enter email")
    }

    if(req.body.address == ""){
        varError.push("you must enter address")
    }

    if(req.body.password == ""){
        varError.push("you must choose password")
    }

    if(req.body.Cpassword == ""){
        varError.push("your password doesnt match")
    }

    if(varError.length > 0){
        res.render("signup", {
            title: "signup",
            errorMessages: varError
        });
    }
    else{
        res.redirect("/");
    }
})

//login-form
app.post('/login-form',(req,res)=>{

    const varError =[];
    
    if(req.body.username == ""){
    console.log("true " + req.body.username);
        varError.push("you must the username")
    }
    //else{
    //console.log("false " + req.body.username);
    //}
    if(req.body.password == ""){
        varError.push("you must enter password")
    }
    if(varError.length > 0){
        res.render("login", {
            title: "login",
            errorMessages: varError
        });
    }
    else{
        res.redirect("/");
    }
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>{

    console.log('The webserver is up and running')
})