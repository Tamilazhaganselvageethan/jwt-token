import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errormiddleware.js";
import router from "./routes/userRoute.js";
import cookieParser from "cookie-parser";
dotenv.config() 
connectDB()

const PORT = 5000;
const app = express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

app.get('/',(req,res)=> {
 res.send("okay!")
})
app.get("/api",(req,res) => {
    throw new Error("something went wrong");
})
app.use("/api/user",router)
app.use(notFound)
app.use(errorHandler)

app.listen(PORT,console.log(`Server running on port${PORT}`));