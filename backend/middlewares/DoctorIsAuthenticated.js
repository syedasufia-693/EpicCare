import jwt from "jsonwebtoken";
import Doctor from "../models/Doctor.js";
export const DoctorIsAuthenticated = async (req, res, next) => {
    const authorization = req.body.headers.Authorization;
    if (!authorization) {
        res.status(400).json({
            "error": "No Login Found!! Please Login First!!"
        })
    }
    else {
        try {
            const decode = jwt.verify(authorization, process.env.JWT_SECRET);
            req.user = await Doctor.findById(decode._id);
            next();
        } catch (error) {
            res.status(400).json({
                "error": "something went wrong!!"
            })
        }
    }
}