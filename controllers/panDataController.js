async function panData(req,res){
    const {email,panData}=req.body
    try{
   const data=await user.findOne({email})
    if(!data){
        return res.status(404).json({success:false,message:"user not found"})
    }
   data.kyc.pan.pan_data=panData;
   data.kyc.pan.Validity_status=true;
   data.save()
   return res.status(200).json({success:true,message:"user Updated successful!!",data})
    }
    catch(err){
     console.log(err.message)
    }
}

module.exports={panData};