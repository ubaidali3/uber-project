const userModel=require('../models/user.model')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')


module.exports.authUser=async(req,res,next)=>{
  const token=req.cookies.token || req.headers.authorization.split(' ')[1]

  if(!token){
    return res.status(401).json({message:'Access denied. No token provided'})
  }
  const isBlacklisted=await userModel.findOne({token:token})
  if(isBlacklisted){
    return res.status(401).json({message:'Access denied. Token is blacklisted'})
  }
  try {
    const decodes=jwt.verify(token, process.env.JWT_SECRET)
    const user=await userModel.findById(decodes._id)

    req.user=user

    return next()
  } catch (error) {
     return res.status(401).json({message:'Unathrorized'})
  }
}