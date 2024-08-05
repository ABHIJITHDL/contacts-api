const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User=require('../models/userModel')
//@desc Register the user
//@route GET /api/users/register
//@access Public
const registerUser =asyncHandler(async (req,res)=>{
    const {username,email,password}=req.body;
    if(!username || !email || !password )
    {
        res.status(404)
       throw new Error("All fields are mandatory")
    }
    const userAvailabel = await User.findOne({email})
    if(userAvailabel){
        res.status(400)
        throw new Error("User already registered");
    }
    //Hash password
    const hashedPassword = await bcrypt.hash(password,10);
    console.log(hashedPassword)
    const user = await User.create({
        username,email,password:hashedPassword
    })
    if(user){
        res.status(201).json({_id:user.id,email:user.email});
    }else{
        res.status(400)
        throw new Error("Invalid user");
    }
    
});

//@desc Login the user
//@route GET /api/users/login
//@access Public
const loginUser =asyncHandler(async (req,res)=>{
    const {email,password}=req.body;
    if(!email || !password){
        res.status(400)
        throw new Error("All Login fields are mandatory")
    }
    const user = await User.findOne({email});
    if(user && (await bcrypt.compare(password,user.password))){
        const accessToken = jwt.sign({
            user:{
                username:user.username,
                email:user.email,
                id:user.id
            }
        },
        process.env.ACCESS_TOKE_SECRET,
        {expiresIn:"15m"}
        )
        res.status(200).json({accessToken});
    }else{
        res.status(401)
        throw new Error("Invalid Credentials")
    }
});

//@desc Current user
//@route GET /api/users/current
//@access Private
const currentUser =asyncHandler(async (req,res)=>{
    res.json(req.user)
});

module.exports = {registerUser,loginUser,currentUser}