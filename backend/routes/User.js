import express from "express";
import { UserInformation } from "../controllers/PatientAuthentication.js";
const UserRoute = express.Router();
UserRoute.get("/info", UserInformation);
export default UserRoute;