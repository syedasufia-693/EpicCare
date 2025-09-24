import { config } from "dotenv";
import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import userRegisterRoute from "./routes/UserRegister.js";
import UserLoginRoute from "./routes/UserLogin.js";
import { IsAuthenticated } from "./middlewares/IsAuthenticated.js";
import HomeRoute from "./routes/Home.js";
import cookieParser from "cookie-parser";
import LogoutRoute from "./routes/Logout.js";
import { IsEmailAlreadyExist, IsValid } from "./middlewares/IsValid.js";
import PatientMedicalRecordRoutes from "./routes/PatientMedicalRecordRoutes.js";
import { CheckPassword } from "./middlewares/CheckPassword.js";
import PatientEditRoutes from "./routes/PatientEditRoutes.js";
import doctorRoutes from "./routes/DoctorRoutes.js";
import HospitalRoutes from "./routes/HospitalRoutes.js";
import multer from "multer";
import DoctorEditRoutes from "./routes/DoctorEditRoutes.js";
import chatRoutes from "./routes/ChatbotRoutes.js";
import UserRoute from "./routes/User.js";
import HospitalControlRoutes from "./routes/HospitalControlRoutes.js";
const upload = multer();

//UserRegistration
const app = express()
config({ path: "./.env" });
// middlewares
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use(cors({
    origin: "http://localhost:3000", // This will allow requests from any origin
    credentials: true // This will enable credentials (cookies, authorization headers, etc)
}));
mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log("database successfully connected!!");
}).catch((err) => {
    console.log("connection failed!!" + err);
})
app.use("/api/user/authentication", UserLoginRoute);
app.use("/api/user/authentication", userRegisterRoute);
app.use("/api/user/authentication", UserRoute);
app.use("/api/user/authentication", IsAuthenticated, LogoutRoute);
app.use("/api/home", IsAuthenticated, HomeRoute);
app.use("/api/medical_records", IsAuthenticated, PatientMedicalRecordRoutes);
app.use("/api/medical_records", IsAuthenticated, PatientEditRoutes);
app.use("/api/doctor", DoctorEditRoutes);
app.use("/api/doctor", doctorRoutes);
app.use("/api/hospital/control", HospitalControlRoutes);
app.use("/api/hospital", HospitalRoutes);
app.use("/api/chatbot", chatRoutes);
app.listen(process.env.PORT, () => {
    console.log(`Backend Server is Running on ${process.env.PORT}`);
});
