const {reset_password_mail}=require("../helper/mail/mail");
const {user,passwordEmailverification}=require("../models/users")
const { v4: uuidv4 } = require("uuid")
const bcrypt=require("bcrypt")
const {idToToken, userToToken, verifyId} = require("../helper/token/token");

async function reset_password_otp(req,res){

    const email=req.body.email;

    try{
        const isUser=await user.find({email});
        if(isUser.length){

            const hasOtp=await passwordEmailverification.find({owner:isUser[0]._id})

            if(hasOtp.length){

                if (hasOtp[0].date_expires < Date.now()) {

                    //deleting current otp document
                    const ans = await passwordEmailverification.findOneAndDelete({ _id: hasOtp[0]._id })

                    // creating new email document in model
                    const otp = String(parseInt(uuidv4().slice(0, 7), 16) % 900000 + 100000);
                    //hash otp
                    let salt = 10;
                    let hashedOtp = await bcrypt.hash(otp, salt)

                    // sending email
                    const result = await reset_password_mail(isUser[0].email, isUser[0].name, otp)

                    if (result) {
                        let passwordEmailVerify = await passwordEmailverification({
                            owner: isUser[0]._id,
                            otp: hashedOtp,
                            date_created: Date.now(),
                            date_expires: Date.now() + 120000
                        })

                        // sending otp to new user and saving new hashed otp value in database
                        await passwordEmailVerify.save();

                         // create token of user credentials
                    const token=idToToken(isUser[0].id)

                        res.json({
                            status: "success",
                            data:{
                                id:token
                            },
                            massage: "otp is sent to your given eamil successfully"
                        })

                    } else {

                        res.json({
                            status: "error",
                            error: {
                                code: "400",
                                message: "Trouble sending email!"
                            }
                        })

                    }

                } else {

                    res.json({
                        status: "error",
                        error: {
                            code: "400",
                            message: "OTP already sent, session yet to expire"
                        }
                    })
                }
            
            }
             else{

            //generate otp
            const otp = String(parseInt(uuidv4().slice(0, 4), 16) % 900000 + 100000);
            
            //hashed otp
            const salt=10;
            const hashedOtp=await bcrypt.hash(otp,salt)
 
            //sending mail
           const result= await reset_password_mail(isUser[0].email, isUser[0].name, otp)


           if (result) {

            let passwordEmailVerify = await passwordEmailverification({
                owner: isUser[0]._id,
                otp: hashedOtp,
                date_created: Date.now(),
                date_expires: Date.now() + 120000
            })

            // sending otp to user for creating new password
            await passwordEmailVerify.save();

             // create token of user credentials
             const token=userToToken(isUser[0]._id)

            res.json({
                status: "success",
                data:{
                    id:token
                },
                massage: "otp sent for resseting password success fully"
            })

        }else{

            res.json({
                status: "error",
                error: {
                    code: "400",
                    message: "Trouble sending email!"
                }
            })

        }
    }
        }else{

            res.json({
                status: "error",
                error: {
                    code: "400",
                    message: "invalid user!"
                }
            })

        }
    }catch(err){

        res.json({
            status: "error",
            error: {
                code: "400",
                message:err
            }
        })

    }   

}


// password_verification 

async function password_verification(req,res){
    const { token } = req.params
    const otp = req.body.otp
    try {
        // verify token
        const tokenData=await verifyId(token)
        const isUser = await passwordEmailverification.find({ owner: tokenData.user })
       
        if (isUser.length) {

            if(isUser[0].date_expires < Date.now()){

                res.json({
                    status: "error",
                    error: {
                        code: "404",
                        message: "Session Timeout!!"
                    }
                })
            }else{
                const same = await bcrypt.compare(otp, isUser[0].otp)
                if (same) {
     

                    // delete otp document from model
                    await passwordEmailverification.findOneAndDelete({ owner: tokenData.user})

                    res.json({
                        status: "success",
                        data:{
                            id:token
                        },
                        massage: "email is varified"
                    })
                } else {

                    res.json({
                        status: "error",
                        error: {
                            code: "400",
                            message: "invalid OTP!"
                        }
                    })
                }

            }
           
        }else{

            res.json({
                status: "error",
                error: {
                    code: "400",
                    message: "invalid request!"
                }
            })
        }
    } catch (err) {

        res.json({
            status: "error",
            error: {
                code: "400",
                message: "server error! "+err
            }
        })
    }

   
    }


// update password

async function updatePassword(req,res){
    const { token } = req.params
let password =req.body.password;


if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(password)) {

    res.json({
        status: "error",
        error: {
            code: "400",
            message: "Invalid password format"
        }
    })
}else{

    // encrypt password
    const salt=10;
    const hashedPassword=await bcrypt.hash(password,salt)

    //getting id from token
    const tokenData=await verifyId(token)
    const responce=await user.findByIdAndUpdate({_id:tokenData.user},{$set:{password:hashedPassword}},{new:true})
    if(responce){
        res.json({
            status: "success",
            message: "password update successfull."
        })
    }else{

        res.json({
            status: "error",
            error: {
                code: "404",
                message: "Trouble updating password!!"
            }
    })
    }
}

}

module.exports={reset_password_otp,password_verification,updatePassword}; 