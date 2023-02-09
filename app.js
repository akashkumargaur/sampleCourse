import express from "express";
import {config} from "dotenv"
import ErrorMiddlerware from "./middleware/Error.js"
import cookie_Parser from "cookie-parser"
import cors from "cors"

config({
    path:"./config/config.env"
})
const app=express()
const corsOptions ={
    origin:'http://localhost:3000', 
    credentials:true,
    methods:["GET","POST","PUT","DELETE"],
    // Access-Control-Allow-Credentials: true,
    optionSuccessStatus:200,
 }
 app.use(cors(corsOptions))
//using middleware
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookie_Parser())


//importing and using all routes
import course from "./routes/courseRoutes.js"
import user from "./routes/userRoutes.js"
import other from "./routes/otherRoutes.js"

app.use("/app/v1",course)
app.use("/app/v1",user)
app.use("/app/v1",other)

export default app;

app.get('/',(req,res)=>res.send(`<h1>server is working at</h1>`))

//last
app.use(ErrorMiddlerware)
