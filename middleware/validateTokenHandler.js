const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');

const validateToken = asyncHandler(async (req, res, next) => {
    let token;
    let authHeader = req.headers.Authorization || req.headers.authorization;
    if(authHeader && authHeader.startsWith("Bearer")){
        token = authHeader.split(" ")[1];//splits on first occurence of " "
        jwt.verify(token,process.env.ACCESS_TOKE_SECRET,(err,decoded)=>{
            if(err){
                res.status(401);
                throw new Error("User is not authorized");
            }
            console.log(decoded);
            req.user = decoded.user;
            next();
        });
        if(!token){
            res.status(401);
            throw new Error("User is not authorized or invalid token")
        }
    }else{
        return res.status(401).json({message: "User is not authorized"})
    }
});

module.exports = validateToken;