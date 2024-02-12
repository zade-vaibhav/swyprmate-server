const express = require("express");
const mongodb=require("./config/database")
const cors = require("cors")
require("dotenv").config()
const auth = require("./routes/auth/authentication")

const app = express();

mongodb();

app.use(cors());
app.use(express.json())

app.use("/api/v1/auth", auth);

try {
    app.listen(process.env.PORT, () => {
        console.log("server is running in port : ", process.env.PORT)
    })
}
catch (err) {
    console.log(err);
}


