import express from "express";
//import usercontroller from '../controller/usercontroller.js'
import { createUser,
    login,
    logout,
    updateProfile,
    getProfile }
 from "../controller/usercontroller.js";
import { checkToken } from "../middleware/authmiddleware.js";
 const router = express.Router();

 router.post("/",createUser);
 router.get("/profile",checkToken,getProfile);
 router.post("/login",login);
 router.post("/logout",logout);
 router.put("/profile",checkToken,updateProfile)

 export default router;