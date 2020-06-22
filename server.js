const express =  require("express");
const exphbs  = require('express-handlebars');
// ./ to tell the browser that this is not third party package. in the above syntax we didnt mention cause its a third party package
// local module build by us
const product = require("./models/product");
const category = require("./models/category");

const app = express();

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(express.static("public"))

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>{

    console.log('The webserver is up and running')
})