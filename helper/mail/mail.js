const nodemailer = require("nodemailer");
require('dotenv').config();

const mail = async (email, name, otp) => {

    // email sent for verification
    //1 transfer protocal
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user:`${process.env.EMAIL}`,
            pass:`${process.env.PASSWORD}`
        }
    })

    const mailOption = {
        from:`${process.env.EMAIL}`,
        to: `${email}`,
        subject: "Swypemate",
        text: "",
        html: `<span><h3>${name}</h3> this is your one-time OTP for Emai-Verification by Swypemate</span><h4>${otp}</h4><p>This OTP is only valid for 10 min</p>`
    }

    return await transporter.sendMail(mailOption)


}


const reset_password_mail = async (email, name, otp) => {

    // email sent for verification
    //1 transfer protocal
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: `${process.env.EMAIL}`,
            pass: `${process.env.PASSWORD}`
        }
    })

    const mailOption = {
        from: `${process.env.EMAIL}`,
        to: `${email}`,
        subject: "Swypemate",
        text: "",
        html: `<span><h3>${name}</h3> this is your one-time OTP to reset-password by Swypemate</span><h4>${otp}</h4><p>This OTP is only valid for 10 min</p>`
    }

    return await transporter.sendMail(mailOption)

}

module.exports = {mail,reset_password_mail};