const User = require('../models/userModel');
const bcrypt =  require('bcrypt')
const jwt = require('jsonwebtoken')
const {
    validateName,
    validateEmail,
    validatePassword
  } = require('../utils/validate')

function genrateToken(id,premium){
    return jwt.sign({ UserId : id,premium },"44d210c98f36c60b0b0a336bd537fdd0305cefee41aa7e8d73aca3f150ab8f38265bb32731c2c3a296327027ce4ddf4a569d2aa9e5e9494badcb6e9eb66899ad")
}

exports.createNewUser = async (req, res) => {
    try{
        const{name,email,password} = req.body;
        console.log(name,email,password)

        const user =  await User.findOne({
            where:{
                email
            }
        })
        
        const Epassword = await bcrypt.hash(password,10)
        if(!validateName(name)){
            res.json({success:false,message:"Invalid name plese enter a valid name"})
          }
      
          if(!validateEmail(email)){
            res.json({success:false,message:"Invalid Email plese enter a valid email"})
          }
      
          if(!validatePassword(password)){
            res.json({success:false,message:"Invalid Password plese enter a valid password"})
          }else{
            if(!user){
                User.create({
                    name,
                    email,
                    password: Epassword
                }).then(() => {
                    res.json({success:true,message:"Account Created Successfully"})
                }).catch((err) => console.log(err))
            }else{
                res.json({success:false,message:"Email Already Exist Please Login"})
            }
          }
        
        
 
    }
    catch(err){
        console.error(err);
    }
}



exports.authenticateUser = async (req,res) => {
    try {
        const user = await User.findOne({
            where:{
                email:req.body.email
            }
        });
        if(!user){
            res.json({success:false,message:"User not found please Signup"})
        }else{
            const passwordMatch = await bcrypt.compare(req.body.password,user.password)
            if(passwordMatch){
                // res.redirect("http://localhost:4000/expense/add-expense")   
                res.json({success:"Successfully logged In", token : genrateToken(user.id,user.premium)})
                //console.log(user.id)
            }else{
                res.json({success:false,message:"Wrong Email or Password"})
            }
        }

    } catch (error) {
        console.log(error);
    }
}