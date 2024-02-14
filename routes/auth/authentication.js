const express = require("express");
const { user_login, user_regiser, email_varification } = require("../../controllers/authentication");
const {reset_password_otp,password_verification, updatePassword} = require("../../controllers/resetPassword");
const router = express.Router();
const {user}=require("../../models/users")


router.get("/",async(req,res)=>{ 
   console.log("dklsdjk")
   const ans= await user.find({_id:"65ca15457a7ea9a89d089c8c"})
   res.json({massage:ans})
})

//login
router.post("/login",user_login)

//registration
router.post("/register",user_regiser)

//email verification
router.post("/verification/:id",email_varification)

//password change otp 
router.post("/password/password_reset_verify",reset_password_otp)

//password otp verify
router.post("/password/verify/:id",password_verification)

//password change
router.post("/password/update_password/:id",updatePassword)



module.exports = router;