const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt= require('bcryptjs');

var userSchema = new Schema({
    user_name: {
        type: String,
        required: true
    },
    user_username:{
        type: String,
        required: true
    },
    user_email: {
        type: String,
        required:true
    },
    user_address:{
        type: String,
        required: true
    },
    user_password:{
        type: String,
        required:true
    },
    user_admin:{
        type: Boolean,
        default: false
    },
    date_created:{
        type: Date,
        default: Date.now()
    }
})

//pre function for password encryption before save method

userSchema.pre("save",function(next){
    
    // salt is random gen characters or strings
    bcrypt.genSalt(10).then((salt)=>{

        bcrypt.hash(this.user_password, salt)
        .then((encryptedPassword)=>{
            this.user_password = encryptedPassword;

            next();
        })
        .catch( err=> console.log(`Error occured when hashing: ${err}`));
    })
    .catch(
        err=> console.log(`Error occured when salting: ${err}`)
        );

})

const userModel =  mongoose.model("user", userSchema);

module.exports = userModel;

