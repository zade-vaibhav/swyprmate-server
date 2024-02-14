const jwt = require("jsonwebtoken");
require('dotenv').config()


const idToToken=(id)=>{
    const token = jwt.sign({ user: id }, process.env.SECTRT_KEY, { expiresIn: '1h' });
    return token;
}

const verifyId=(token)=>{
    const tokenData = jwt.verify(token, process.env.SECTRT_KEY);
    return tokenData;
}

const userToToken=(id)=>{
    const token = jwt.sign({ user: id }, process.env.SECTRT_KEY, { expiresIn: '7d' });
    return token;
}

const verifyUser=(token)=>{
    const tokenData = jwt.verify(token, process.env.SECTRT_KEY);
    return tokenData;
}


module.exports={idToToken,userToToken,verifyId,verifyUser};