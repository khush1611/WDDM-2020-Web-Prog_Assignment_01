const express =  require("express");
const router = express.Router();

// login
router.get("/login",(req, res)=>{
    res.render("users/login",{
        title: "login"
    })
});

//login-form submission
router.post('/login-form',(req,res)=>{

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
        res.render("users/login", {
            title: "login",
            errorMessages: varError
        });
    }
    else{
        res.redirect("/");
    }
})

//singup 
router.get("/signup",(req, res)=>{
    res.render("users/signup",{
        title: "signup"
    })
});

//signup-form submission
router.post('/signup-form',(req,res)=>{

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
        res.render("users/signup", {
            title: "signup",
            errorMessages: varError
        });
    }
    else{
        res.redirect("/");
    }
})

module.exports = router;