import express from "express";
import { UserRegistration } from "../controllers/PatientAuthentication.js";
import { IsEmailAlreadyExist, IsValid } from "../middlewares/IsValid.js";
import { CheckPassword } from "../middlewares/CheckPassword.js";
import multer from "multer";
const upload = multer();
const userRegisterRoute = express.Router();
userRegisterRoute.post("/register", upload.any('profile_img'), IsValid, IsEmailAlreadyExist, UserRegistration);
export default userRegisterRoute;