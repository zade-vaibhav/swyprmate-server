const nodemailer = require("nodemailer");
require('dotenv').config();

const register_mail = async (email, name, otp) => {

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
        html: `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
        <div style="margin:50px auto;width:70%;padding:20px 0">
          <div style="border-bottom:1px solid #eee">
            <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">SWYPEMATE</a>
          </div>
          <p style="font-size:1.1em">Hi, ${name}</p>
          <p>Thank you for choosing Swypemate. Use the following OTP to complete your Sign Up procedures. OTP is valid for 2 minutes</p>
          <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${otp}</h2>
          <p style="font-size:0.9em;">Regards,<br />Swypemate</p>
          <hr style="border:none;border-top:1px solid #eee" />
          <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
            <p>Brand Inc</p>
            <p>1600 Amphitheatre Parkway</p>
            <p>California</p>
          </div>
        </div>
      </div>`
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
        html: ` <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
        <div style="margin:50px auto;width:70%;padding:20px 0">
          <div style="border-bottom:1px solid #eee">
            <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">SWYPEMATE</a>
          </div>
          <p style="font-size:1.1em">Hi, ${name}</p>
          <p>This is your one-time OTP to Reset-Password by Swypemate. OTP is valid for 2 minutes</p>
          <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${otp}</h2>
          <p style="font-size:0.9em;">Regards,<br />Swypemate</p>
          <hr style="border:none;border-top:1px solid #eee" />
          <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
            <p>Brand Inc</p>
            <p>1600 Amphitheatre Parkway</p>
            <p>California</p>
          </div>
        </div>
      </div>
        `
    }

    return await transporter.sendMail(mailOption)

}


// greet massages

const register_greet = async (name,email) => {

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
        html: `<body style="font-family: Helvetica, Arial, sans-serif; min-width: 1000px; overflow: auto; line-height: 2; margin: 0; padding: 0;">

        <div style="margin: 50px auto; width: 70%; padding: 20px 0; border-bottom: 1px solid #eee;">
          <a href="#" style="font-size: 1.4em; color: #00466a; text-decoration: none; font-weight: 600;">SWYPEMATE</a>
        </div>
      
        <div style="margin: 50px auto; width: 70%; padding: 20px 0;">
          <p style="font-size: 1.1em;">Hi, ${name},</p>
          <p>Congratulations! Your registration with Swypemate was successful.</p>
          <p>You are now a part of our community. Enjoy exploring!</p>
          <p style="font-size: 0.9em;">Regards,<br />Swypemate Team</p>
        </div>
      
        <div style="margin: 50px auto; width: 70%; padding: 20px 0; border-top: 1px solid #eee;">
          <div style="float: right; padding: 8px 0; color: #aaa; font-size: 0.8em; line-height: 1; font-weight: 300;">
            <p>Brand Inc</p>
            <p>1600 Amphitheatre Parkway</p>
            <p>California</p>
          </div>
        </div>
      
      </body>`
    }

    return await transporter.sendMail(mailOption)

}


const verify_greet = async (name,email) => {

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
        html: `<body style="font-family: Helvetica, Arial, sans-serif; min-width: 1000px; overflow: auto; line-height: 2; margin: 0; padding: 0;">

        <div style="margin: 50px auto; width: 70%; padding: 20px 0; border-bottom: 1px solid #eee;">
          <a href="#" style="font-size: 1.4em; color: #00466a; text-decoration: none; font-weight: 600;">SWYPEMATE</a>
        </div>
      
        <div style="margin: 50px auto; width: 70%; padding: 20px 0;">
          <p style="font-size: 1.1em;">Hi, ${name},</p>
          <p>Congratulations! Your email has been successfully verified with Swypemate.</p>
          <p>Thank you for confirming your email address.</p>
          <p style="font-size: 0.9em;">Regards,<br />Swypemate Team</p>
        </div>
      
        <div style="margin: 50px auto; width: 70%; padding: 20px 0; border-top: 1px solid #eee;">
          <div style="float: right; padding: 8px 0; color: #aaa; font-size: 0.8em; line-height: 1; font-weight: 300;">
            <p>Brand Inc</p>
            <p>1600 Amphitheatre Parkway</p>
            <p>California</p>
          </div>
        </div>
      
      </body>`
    }

    return await transporter.sendMail(mailOption)

}


const password_updated = async (name,email) => {

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
        html: `<div style="font-family: Helvetica, Arial, sans-serif; min-width: 1000px; overflow: auto; line-height: 2">
        <div style="margin: 50px auto; width: 70%; padding: 20px 0">
          <div style="border-bottom: 1px solid #eee">
            <a href="" style="font-size: 1.4em; color: #00466a; text-decoration: none; font-weight: 600">SWYPEMATE</a>
          </div>
          <p style="font-size: 1.1em">Hi, ${name}</p>
          <p>Your Swypemate account password has been successfully updated. If you didn't make this change, please contact us immediately.</p>
          <h2 style="background: #00466a; margin: 0 auto; width: max-content; padding: 0 10px; color: #fff; border-radius: 4px;">Password Updated</h2>
          <p style="font-size: 0.9em;">If you have any questions or concerns, feel free to reach out to our support team.</p>
          <p style="font-size: 0.9em;">Regards,<br />Swypemate</p>
          <hr style="border: none; border-top: 1px solid #eee" />
          <div style="float: right; padding: 8px 0; color: #aaa; font-size: 0.8em; line-height: 1; font-weight: 300">
            <p>Brand Inc</p>
            <p>1600 Amphitheatre Parkway</p>
            <p>California</p>
          </div>
        </div>
      </div>
      `
    }

    return await transporter.sendMail(mailOption)

}


module.exports = {register_mail,reset_password_mail,register_greet,verify_greet,password_updated};