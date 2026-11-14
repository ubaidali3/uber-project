const mongoose=require('mongoose')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')


const userSchema=new mongoose.Schema({
  fullname:{
    firstname:{
      type:String,
      required:true,
      minlength:[3,'First name must be at least 3 characters long']
    },
    lastname:{
      type:String,
      minlength:[3,'last name must be at least 3 characters long']
    },

  },
  email:{
    type:String,
    required:true,
    unique:true,
    minlength:[5,"Email must be at least 5 characters long"]
  },
  password:{
    type:String,
    required:true,
    select:false

  },
  socketId:{
    type:String,
  }
})

userSchema.methods.generateAuthToken=function (){
  const token= jwt.sign({_id:this._id},process.env.JWT_SECRET,{expiresIn:'24h'});
  return token
  
}
userSchema.methods.comparePassword=async function(password){
  return await bcrypt.compare(password,this.password)
}
userSchema.statics.hashPassword = async function(password) {
    return await bcrypt.hash(password, 10);
};


const userModel=mongoose.model('user',userSchema)

module.exports=userModel

// auth.controller.js
// const userModel = require('./user.model');

// module.exports.loginUser = async (req, res, next) => {
//     const { email, password } = req.body;

//     const user = await userModel.findOne({ email }).select('+password');

//     if (!user) {
//         return res.status(401).json({ message: 'Invalid email or password' });
//     }

//     const isMatch = await user.comparePassword(password);

//     if (!isMatch) {
//         return res.status(401).json({ message: 'Invalid email or password' });
//     }

//     const token = user.generateAuthToken();

//     res.status(200).json({ token, user });
// }

// auth.routes.js
// const express = require('express');
// const router = express.Router();
// const authController = require('./auth.controller');

// router.post('/login', authController.loginUser);

// module.exports = router;