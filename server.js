const express =  require("express");
const exphbs  = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const fileupload = require('express-fileupload');
const session = require('express-session');

require('dotenv').config({path:"./config/keys.env"});


const app = express();

//tells express to use mentioned third party modules as template engine
app.engine('handlebars', exphbs(
    {
        helpers:{

            //ref https://stackoverflow.com/questions/41423727/handlebars-registerhelper-serverside-with-expressjs
            ifeq: function(a, b, options){
                if (a === b) {
                    // console.log("true");
                    return options.fn(this);
                }
                //   console.log("false");
                return options.inverse(this);
            }
        }
    }
));
app.set('view engine', 'handlebars');
//to use all the static files such as css js images 
app.use(express.static("public"));

//this tells xpress to make form data available via req.body each req
app.use(bodyParser.urlencoded({ extended: false }))

//tie fileuplaod with express 
app.use(fileupload());

//session middleware
app.use(session({
    secret: `${process.env.SESSION_SECRET_KEY}`,
    resave: false,
    saveUninitialized: true
  }))

app.use((req,res,next)=>{

    res.locals.sessioninfo= req.session.userInfo;

    next();
});
  

//Import controller files
const generalController = require("./controllers/general");
const productController = require("./controllers/product");
const usersController = require("./controllers/users");
const fileUpload = require("express-fileupload");

//middleware function to allow specific forms and/or links that were 
//submitted to send PUT & DELETE requests resp.

app.use((req,res,next)=>{

    if(req.query.method =="PUT")
    {
        req.method="PUT";
    }
    else if(req.query.method=="DELETE")
    {
        req.method="DELETE";
    }

    next();
});


//Map controller with app object
app.use("/",generalController);
app.use("/product",productController);
app.use("/users",usersController);

//Connect to Mongoose DB

mongoose.connect(process.env.CONNECTION_STRING_MONGODB,{useNewUrlParser: true, useUnifiedTopology: true}).then(()=>{
    console.log("Connected to Mongoose Database");
}).catch(err=>{
    console.log(`Error occured when connecting to MongoosDB: ${err}`);

});

// webserver setup
const PORT = process.env.PORT;
app.listen(PORT, ()=>{

    console.log('The webserver is up and running')
})