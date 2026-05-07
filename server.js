require('dotenv').config();
const jwt = require('jsonwebtoken');
const express  = require('express');
const SECRET = process.env.SECRET_KEY;
const USER = { username: 'admin', password: '1234' };


app = express();
app.use(express.json());

app.get("/status",(req,res) => {
    let server ={
        status:"ok",
        desc:"Server Runing"
    }
    res.json(server)
});

app.post("/login",(req,res) => {
    const {username,password} = req.body;
    console.log(USER);
    if(username == USER.username && password == USER.password){
        const token = jwt.sign({username},SECRET,{expiresIn:"1h"});
        res.json({token});
    }else{
        res.status(401).json({message:"Invalid credentials",user:username,pass:password});
    }
})

app.get("/perfil",(req,res) => {
    const token = req.headers.authorization;
    if(!token){
        return res.status(401).json({message:"No token provided",token:token});
    }
    try {
        const decoded = jwt.verify(token,SECRET);
        res.json({message:"Perfil data", user:decoded.username,"token":token});
    } catch (error) {
        res.status(401).json({message:"Invalid token",token:token});
    }
});


app.listen(3001, (params) => {
    console.log("server start");
});
