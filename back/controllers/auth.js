const User = require("../models/user")
const {check, validationResult} = require('express-validator')
const jwt = require("jsonwebtoken")
const expressJwt  = require("express-jwt")


// Signup Controller
exports.signup= (req, res)=>{

        const errors =validationResult(req)
        if(!errors.isEmpty()){
            return res.status(422).json({
                error:errors.array()[0].msg
            })
        }


    console.log("Req body", req.body)
    const user = new User(req.body)
    user.save((err,user)=>{
        if(err){
            return res.status(400).json({
                err:"not able to save user in db"
            })
        }
        res.json(user);
    });
}
// Signin Controller
exports.signin = (req,res)=>{
    const {email, password} =req.body;
   

    const errors =validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({
                error:errors.array()[0].msg
            })
        }
    User.findOne({email}, (err, user)=>{
        if(err || !user){
           // console.log(user);
           return res.status(400).json({
                error:"user doesn't exist in our database"
            })
        }
        if(!user.authenticate(password)){
            return res.status(401).json({
                error:"Email and password do not match"
            })
        }
        // Create token
        const token =jwt.sign({_id: user._id},process.env.SECRET)
        //putting token to the cookie
        res.cookie("token", token,{expire:new Date()+9999});

        // Sending res to frontend
        const {_id,name, email,role} = user;
        return res.json({token,user: {
            _id,
            name,
            email,
            role
        }})
    })
};

// Signout Controller

exports.signout = (req,res)=>{
    res.clearCookie("token");
    res.json({
        "message": " SignOut Successful"
    })
};

// protected Routes
exports.isSignedIn = expressJwt({
    secret:process.env.SECRET,
    userProperty:"auth",

})



//Custom middlewares
exports.isAuthenticated = (req,res,next)=>{
    let checker = req.profile && req.auth && req.profile._id ==req.auth._id

    if(!checker){
        return res.status(403).json({
            error:"Access Denied"
        })
    }
    next();
}

exports.isAdmin = (req,res,next)=>{
    if(req.profile.role===0){
        return res.json({
            error:"Access denied, you are not an admin"
        });
    }
    next();
}