const {reset_password_mail}=require("../helper/mail/mail");
const {user,passwordEmailverification}=require("../models/users")
const { v4: uuidv4 } = require("uuid")
const bcrypt=require("bcrypt")

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

                        res.status(406).json({
                            status: "SUCCESS",
                            data:isUser[0]._id,
                            massage: "otp is sent to your given eamil successfully"
                        })

                    } else {

                        res.status(400).json({
                            status: "FAILED",
                            massage: "Trouble sending email"
                        })

                    }

                } else {

                    res.status(406).json({
                        status: "FAILED",
                        massage: "users already present but email is not varified. we already sent you otp for this session make sure session has expire for next otp"
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

            res.status(406).json({
                status: "SUCCESS",
                data:isUser[0]._id,
                massage: "otp sent for resseting password success fully"
            })

        }else{

            res.status(400).json({
                status: "FAILED",
                massage: "Trouble sending email"
            })

        }
    }
        }else{

            res.status(404).json({
                status: "FAILED",
                massage: "user not found"
            })

        }
    }catch(err){

        res.status(404).json({
            status: "FAILED",
                massage:err
           })

    }   

}


// password_verification 

async function password_verification(req,res){
    const { id } = req.params
    const otp = req.body.otp
    try {
        const isUser = await passwordEmailverification.find({ owner: id })
       
        if (isUser.length) {

            if(isUser[0].date_expires < Date.now()){

                res.status(400).json({
                    status: "FAILED",
                    massage: "Session Timeout!"
                })
            }else{
                console.log("otp",otp)
                const same = await bcrypt.compare(otp, isUser[0].otp)
                if (same) {
                    // delete otp document from model
                    await passwordEmailverification.findOneAndDelete({ owner: id })

                    res.status(200).json({
                        status: "SUCCESS",
                        data:{user_Id:id},
                        massage: "email is varified"
                    })
                } else {

                    res.status(400).json({
                        status: "FAILED",
                        massage: "invalid OTP!"
                    })
                }

            }
           
        }
    } catch (err) {
        res.status(404).json({
            status: "FAILED",
            massage: err
        })
    }

   
    }


// update password

async function updatePassword(req,res){
console.log(req.body.password)

}

module.exports={reset_password_otp,password_verification,updatePassword};