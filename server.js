const express =  require("express");
const exphbs  = require('express-handlebars');
const bodyParser = require('body-parser');
require('dotenv').config({path:"./config/keys.env"});


const app = express();

//tells express to use mentioned third party modules as template engine
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
//to use all the static files such as css js images 
app.use(express.static("public"));

//this tells xpress to make form data available via req.body each req
app.use(bodyParser.urlencoded({ extended: false }))

//Import controller files
const generalController = require("./controllers/general");
const productController = require("./controllers/product");
const usersController = require("./controllers/users");

//Map controller with app object
app.use("/",generalController);
app.use("/product",productController);
app.use("/users",usersController);

// webserver setup
const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>{

    console.log('The webserver is up and running')
})