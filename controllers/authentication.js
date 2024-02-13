const bcrypt = require("bcrypt")
const { v4: uuidv4 } = require("uuid")
const jwt = require("jsonwebtoken");
const { user, ownerEmailverification } = require("../models/users");
const { mail } = require("../helper/mail/mail");
require('dotenv').config()


// login function 
async function user_login(req, res) {

    let { email, password } = req.body;

    email = email.trim();
    password = password.trim();

    if (email == "" || password == "") {

        res.status(404).json({
            status: "FAILED",
            massage: "Empty credentials!"
        })
    } else {

        const isUser = await user.find({ email });

        if (isUser.length) {

            const check_password = await bcrypt.compare(password, isUser[0].password)

            if (isUser[0].email == email) {
                if (check_password) {
                    
                    // create token of user credentials
                    const token = jwt.sign({user:isUser[0]},process.env.SECTRT_KEY,{ expiresIn: '1h' });

                    // sending token in cookies
                    res.cookie('token', token, { httpOnly: true, secure: false })
                    res.status(200).json({
                        status: "SUCCESS",
                        data:token,
                        massage: "Login successfull."
                    })

                } else {

                    res.status(400).json({
                        status: "FAILED",
                        massage: "Invalid credentials!"
                    })

                }
            } else {

                res.status(400).json({
                    status: "FAILED",
                    massage: "Invalid credentials!"
                })
            }
            
        } else {
            res.status(400).json({
                status: "FAILED",
                massage: "Invalid User!!"
            })

        }

    }

}


// function for register

async function user_regiser(req, res) {

    let { name, email, password } = req.body;
    
    name = name.trim();
    email = email.trim();
    password = password.trim();

    if (name == "" || email == "" || password == "") {

        res.json({
            status: "error",
            error: {
              code: "400",
              message: "empty Input feilds!"
            }
          })

    } else if (!/^[a-zA-Z ]*$/.test(name)) {

        res.json({
            status: "error",
            error: {
              code: "400",
              message: "invalid name entered!"
            }
          })

    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {

        res.json({
            status: "error",
            error: {
              code: "400",
              message: "Invalid email entered!"
            }
          })

    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(password)) {

        res.json({
            status: "error",
            error: {
              code: "400",
              message: "Invalid password format"
            }
          })
    } else {

        //send to database
        const isUser = await user.find({ email });

        if (isUser.length) {

            if (!isUser[0].is_varified) {

                let hasOtp = await ownerEmailverification.find({ owner: isUser[0]._id })

                if (hasOtp.length) {

                    if (hasOtp[0].date_expires < Date.now()) {

                        //deleting current otp document
                        const ans = await ownerEmailverification.findOneAndDelete({ _id: hasOtp[0]._id })

                        // creating new email document in model
                        //creating otp
                        const otp = String(parseInt(uuidv4().slice(0, 7), 16) % 900000 + 100000);
                        //hash otp
                        let salt = 10;
                        let hashedOtp = await bcrypt.hash(otp, salt)

                        // sending email
                        const result = await mail(isUser[0].email, isUser[0].name, otp)

                        if (result) {
                            let newEmailVerify = await ownerEmailverification({
                                owner: isUser[0]._id,
                                otp: hashedOtp,
                                date_created: Date.now(),
                                date_expires: Date.now() + 120000
                            })

                            // sending otp to new user and saving new hashed otp value in database
                            await newEmailVerify.save();

                            res.json({
                                    status: "success",
                                    message: "users already present but email is not varified. email is sent to your given eamil"
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

                        res.status(406).json({
                            status: "error",
                            error: {
                              code: "400",
                              message: "OTP already sent, session yet to expire"
                            }
                          })
                    }

                } else {

                    //generate otp
                    const otp = String(parseInt(uuidv4().slice(0, 6), 16) % 900000 + 100000);
                    //hash otp
                    let salt = 10;
                    let hashedOtp = await bcrypt.hash(otp, salt)

                    // sending email
                    const result = await mail(isUser[0].email, isUser[0].name, otp)

                    if (result) {
                        let newEmailVerify = await ownerEmailverification({
                            owner: isUser[0]._id,
                            otp: hashedOtp,
                            date_created: Date.now(),
                            date_expires: Date.now() + 120000,
                        })

                        // sending otp to new user and saving new hashed otp value in database
                        await newEmailVerify.save();

                        res.json({
                            status: "success",
                            message: "users already present but email is not varified. email is sent to your given eamil"
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

                }

            } else {

                res.json({
                    status: "error",
                    error: {
                      code: "401",
                      message: "users already present! kindly login"
                    }
                  })
            }
        } else {

            let salt = 10;
            let hashPassword = await bcrypt.hash(password, salt)

            //generate otp
            const otp = String(parseInt(uuidv4().slice(0, 6), 16) % 900000 + 100000);
            //hash otp
            let hashedOtp = await bcrypt.hash(otp, salt)


            // email sent for verification
            const result = await mail(email, name, otp)

            if (result) {

                let newUser = new user({
                    name,
                    email,
                    password: hashPassword,
                    date_created: `${Date.now()}`,
                })
                // creating new user
                let userData = await newUser.save();

                let newEmailVerify = await ownerEmailverification({
                    owner: userData._id,
                    otp: hashedOtp,
                    date_created: Date.now(),
                    date_expires: Date.now() + 120000,

                })
 
                //sending otp to new user and saving new hash ot p value in database
                await newEmailVerify.save();

                res.json({
                    status: "success",
                    message: "successfully user created"
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


        }
    }

}

async function email_varification(req, res) {
    const { id } = req.params
    const otp = req.body.otp
    try {
        const isUser = await ownerEmailverification.find({ owner: id })
       
        if (isUser.length) {

            if(isUser[0].date_expires < Date.now()){

                res.status(400).json({
                    status: "FAILED",
                    massage: "Session Timeout!"
                })
            }else{

                const same = await bcrypt.compare(otp, isUser[0].otp)
                if (same) {

                    // update user is verify
                    const update = await user.findOneAndUpdate({ _id: id }, { $set: { is_varified: true } },{new:true});

                    // delete otp document from model
                    await ownerEmailverification.findOneAndDelete({ owner: id })

                    res.status(200).json({
                        status: "SUCCESS",
                        data:update,
                        massage: "user is varified"
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






module.exports = { user_regiser, user_login, email_varification }