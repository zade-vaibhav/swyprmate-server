const { user } = require("../models/users");


 async function adharData(req,res){
    const {email,adharData}=req.body
    try{

   const data=await user.findOne({email})
    if(!data){
        return res.status(404).json({message:"user not found"})
    }
   data.kyc.aadhar.aadhar_data=adharData;
   data.kyc.aadhar.Validity_status=true;
   data.save()
   return res.status(200).json({message:"user Updated successful!!",data})
    }
    catch(err){

    }
}

module.exports={adharData};