const { user } = require("../models/users")

async function userdata(req, res) {
    const {id}=req.body 
    try {

     const  isUser=await user.findOne({_id:id});
     if(!isUser){
        res.json({
            status: "error",
            error: {
                code: "404",
                message: "user not found!"
            }
        })
        return 
     }

     res.json({
        status: "success",
        user:isUser,
        message: "getting user data succesfully!!"
    })

    } catch (err) {
        res.json({
            status: "error",
            error: {
                code: "400",
                message: "invalid user!"
            }
        })
    }

}


module.exports={userdata}