const express = require("express");
const { user_login, user_regiser, email_varification } = require("../../controllers/authentication");
const {reset_password_otp,password_verification, updatePassword} = require("../../controllers/resetPassword");
const router = express.Router();
const {user}=require("../../models/users")



//login
router.post("/login",user_login)

//registration
router.post("/register",user_regiser)

//email verification
router.post("/verification",email_varification)

//password change otp 
router.post("/password/password_reset_verify",reset_password_otp)

//password otp verify
router.post("/password/verify",password_verification)

//password change
router.post("/password/update_password",updatePassword)



module.exports = router;