// var jwt = require('jsonwebtoken');
// const jwtSecret = "smile HaHa"
// const fetch = (req,res,next)=>{
//     // get the user from the jwt token and add id to req object
//     const token = req.header('auth-token');
//     if(!token){
//         res.status(401).send({error:"Invalid Auth Token"})

//     }
//     try {
//         const data = jwt.verify(token,jwtSecret);
//         req.user = data.user
//         next();
        
//     } catch (error) {
//         res.status(401).send({error:"Invalid Auth Token"})
//     }

// }
// module.exports = fetch


import jwt from "jsonwebtoken";

const jwtSecret = "HaHa";

const fetchdetails = (req, res, next) => {
  try {
    const token = req.header("auth-token");

    if (!token) {
      return res
        .status(401)
        .send({ success: false, error: "Authentication token missing" });
    }

    const data = jwt.verify(token, jwtSecret);

    req.user = data.user;
    next();
  } catch (error) {
    console.error("JWT Error:", error.message);
    res
      .status(401)
      .send({ success: false, error: "Invalid or expired token" });
  }
};

export default fetchdetails;
