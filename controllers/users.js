const express =  require("express");
const router = express.Router();

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
// ^                                            Match the beginning of the string
// (?=.*[0-9])                                  Require that at least one digit appear anywhere in the string
// (?=.*[a-z])                                  Require that at least one lowercase letter appear anywhere in the string
// (?=.*[A-Z])                                  Require that at least one uppercase letter appear anywhere in the string
// (?=.*[*.!@$%^&(){}[]:;<>,.?~_+-=|\])        Require that at least one special character appear anywhere in the string
// .{8,32}                                      The password must be at least 8 characters long, but no more than 32
// $                                            Match the end of the string.
function passwordValidation(pword){
    //const regex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!@$%^&(){}[]:;<>,.?~_+-=|\]).{8,32}$/;
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
    console.log("true " + username);
        varError.push("you must the username")
    }
    //else{
    //console.log("false " + req.body.username);
    //}
    if(Upassword == ""){
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
        varError.push("you must enter your name")
    }
    //console.log(userNameValidation(req.body.username));
    if(username == ""){
        varError.push("you must enter username")
    } 
    else if(!userNameValidation(username))
    {
        varError.push("Username can contain characters (3-10), numbers, '-' and '_'. EX: Khush-16");
    }

    if(email == ""){
        varError.push("you must enter email")
    }

    if(address == ""){
        varError.push("you must enter address")
    }

    // console.log(passwordValidation(Upassword));
    // console.log(Upassword);

    if(Upassword == ""){
        varError.push("you must choose password")
    } 
    else if(!passwordValidation(Upassword)){
        varError.push('Require that at least one digit appear anywhere in the string')
    }
    if(Cpassword == ""){
        varError.push("you must enter confirm password")
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
        res.redirect("/");
    }
})

module.exports = router;