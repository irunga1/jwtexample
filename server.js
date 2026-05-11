const express  = require('express');
const cors = require('cors');
require('dotenv').config();
const jwt = require('jsonwebtoken');

const SECRET = process.env.SECRET_KEY;
const USER = { username: 'admin', password: '1234' };

const app = express();

// habilitar CORS para todas las rutas
app.use(cors());
app.use(express.json());

app.get("/status",(req,res) => {
    res.json({ status:"ok", desc:"Server Running" });
});

app.post("/login",(req,res) => {
    const {username,password} = req.body;
    console.log(req.body);
    if(username == USER.username && password == USER.password){
        const token = jwt.sign({username},SECRET,{expiresIn:"1h"});
        let status={"status":"ok","desc":"Login successful", "token":token};
        res.json({status});
    }else{
        res.status(401).json({message:"Invalid credentials"});
    }
});

app.get("/perfil",(req,res) => {
    const token = req.headers.authorization;
    if(!token){
        return res.status(401).json({message:"No token provided"});
    }
    try {
        const decoded = jwt.verify(token,SECRET);
        res.json({message:"Perfil data", user:decoded.username, token});
    } catch (error) {
        res.status(401).json({message:"Invalid token"});
    }
});

app.listen(3001, () => {
    console.log("server start");
});
