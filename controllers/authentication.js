const bcrypt = require("bcrypt")
const { v4: uuidv4 } = require("uuid")
const jwt = require("jsonwebtoken");
const { user, ownerEmailverification } = require("../models/users");
const { register_mail, register_greet, verify_greet } = require("../helper/mail/mail");
const { idToToken, userToToken, verifyId, verifyUser, refreshToken } = require("../helper/token/token");
require('dotenv').config()


// login function 
async function user_login(req, res) {

    let { email, password } = req.body;

    email = email.trim();
    password = password.trim();

    if (email == "" || password == "") {

        res.status(404).json({
            status: "error",
            error: {
                code: "401",
                message: "empty credentials"
            }
        }
        )
    } else {

        const isUser = await user.findOne({ email });

        if (isUser) {

            const check_password = await bcrypt.compare(password, isUser.password)

            if (isUser.email == email) {
                if (check_password) {
                
                  //accesstoken
                  const access_token = await idToToken({id:isUser._id})
                  // sending access-token in cookies
                  // res.cookie('access_token', access_token, { httpOnly: true, secure: false })

                  //accesstoken
                  const refresh_token = await refreshToken({id:isUser._id})
                  // sending access-token in cookies
                  // res.cookie('refresh_token', refresh_token, { httpOnly: true, secure: false })


                    
                    res.json({
                        status: "success",
                        user: {
                            access_token: access_token,
                            refresh_token: refresh_token,
                            name: isUser.name,
                            email: isUser.email
                        },
                        message: "Login successfull."
                    })

                } else {

                    res.json({
                        status: "error",
                        error: {
                            code: "401",
                            message: "Invalid credentials"
                        }
                    }
                    )

                }
            } else {

                res.json({
                    status: "error",
                    error: {
                        code: "401",
                        message: "Invalid credentials"
                    }
                }
                )
            }

        } else {
            res.json({
                status: "error",
                error: {
                    code: "401",
                    message: "Invalid user!!"
                }
            }
            )

        }

    }

}


// function for register

async function user_regiser(req, res) {

    let { name, email, password, phone } = req.body;

    name = name.trim();
    email = email.trim();
    password = password.trim();
    phone = phone.trim()


    if (name == "" || email == "" || password == "" || phone == "") {

        res.json({
            status: "error",
            error: {
                code: "400",
                message: "empty Input feilds!"
            }
        })

    }
    else if (!/^[a-zA-Z ]*$/.test(name)) {

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
    } else if (phone.length < 10 || phone.length > 10) {

        res.json({
            status: "error",
            error: {
                code: "400",
                message: "Invalid phone format"
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
                        const result = await register_mail(isUser[0].email, isUser[0].name, otp)

                        if (result) {
                            let newEmailVerify = await ownerEmailverification({
                                owner: isUser[0]._id,
                                otp: hashedOtp,
                                date_created: Date.now(),
                                date_expires: Date.now() + 120000
                            })

                            // sending otp to new user and saving new hashed otp value in database
                            await newEmailVerify.save();

                            // creating token
                            const token = idToToken(isUser[0]._id)

                            res.json({
                                status: "success",
                                user: {
                                    id: token,

                                },
                                message: "email is sent to your given eamil"
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

                } else {

                    //generate otp
                    const otp = String(parseInt(uuidv4().slice(0, 6), 16) % 900000 + 100000);
                    //hash otp
                    let salt = 10;
                    let hashedOtp = await bcrypt.hash(otp, salt)

                    // sending email
                    const result = await register_mail(isUser[0].email, isUser[0].name, otp)

                    if (result) {
                        let newEmailVerify = await ownerEmailverification({
                            owner: isUser[0]._id,
                            otp: hashedOtp,
                            date_created: Date.now(),
                            date_expires: Date.now() + 120000,
                        })

                        // sending otp to new user and saving new hashed otp value in database
                        await newEmailVerify.save();

                        // creating token
                        const token = idToToken(isUser[0]._id)

                        res.json({
                            status: "success",
                            user: {
                                id: token,

                            },
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
            const result = await register_mail(email, name, otp)

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

                // creating token
                const token = idToToken(userData._id)

                //sending greet massage
                await register_greet(name, email)

                res.json({
                    status: "success",
                    user: {
                        id: token,

                    },
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
    const token = req.headers.authorization.split(" ")[1]
    const otp = req.body.otp
    try {

        const tokenData = await verifyId(token)

        const isUser = await ownerEmailverification.find({ owner: tokenData.user })

        if (isUser.length) {

            if (isUser[0].date_expires < Date.now()) {

                res.json({
                    status: "error",
                    error: {
                        code: "404",
                        message: "Session Timeout!!"
                    }
                })
            } else {

                const same = await bcrypt.compare(otp, isUser[0].otp)
                if (same) {

                    // update user is verify
                    const update = await user.findOneAndUpdate({ _id: tokenData.user }, { $set: { is_varified: true } }, { new: true });

                    // delete otp document from model
                    await ownerEmailverification.findOneAndDelete({ owner: tokenData.user })

                    //sending greet massage 
                    console.log(update)
                    // await verify_greet(update.name, update.email)

                    res.json({
                        status: "success",
                        massage: "user is varified"
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

        } else {
            res.json({
                status: "error",
                error: {
                    code: "400",
                    message: "invalid request!"
                }
            })
        }
    } catch (err) {
        console.log(err);
        res.json({
            status: "error",
            error: {
                code: "400",
                message: "server error!"
            }
        })
    }


}


// userData

async function userData(req, res) {
    const token = req.headers.authorization.split(" ")[1]
    console.log(token,"vaibhav")
    try {

        const tokenData = await verifyUser(token)
        console.log(tokenData)
        if (tokenData) {

            res.json({
                status: "success",
                data: {
                    user: {
                        id:tokenData.user.id
                    }
                }
            }
            )
        } else {

            res.json({
                status: "error",
                error: {
                    code: "400",
                    message: "invalid token!"
                }
            })
        }


    } catch (err) {
        res.json({
            status: "error",
            error: {
                code: "400",
                message: "invalid token!"
            }
        })
    }

}


// checking user is already login and token is not ecpired

async function checkLogin(req, res) {
    const token = req.headers.authorization.split(" ")[1]

    try {
        // Decode the token without verifying the signature
        const decodedToken = jwt.decode(token, { complete: true })
        if (decodedToken && decodedToken.payload.exp) {
            const expirationTimestamp = decodedToken.payload.exp;
            const currentTimestamp = Math.floor(Date.now() / 1000); // Convert milliseconds to seconds

            if (currentTimestamp < expirationTimestamp) {
                res.json({
                    status: "success",
                    massage: "Token is not expired."
                })
            } else {
                res.json({
                    status: "error",
                    error: {
                        code: "400",
                        message: 'Token has expired.'
                    }
                })
            }
        } else {
            res.json({
                status: "error",
                error: {
                    code: "400",
                    message: 'Invalid token or missing expiration claim.'
                }
            })
        }
    } catch (error) {

        res.json({
            status: "error",
            error: {
                code: "400",
                message: err
            }
        })
    }
}






module.exports = { user_regiser, user_login, email_varification, userData, checkLogin }; 