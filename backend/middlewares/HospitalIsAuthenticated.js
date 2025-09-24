import jwt from "jsonwebtoken";
import Hospital from "../models/Hospital.js";
export const HospitalIsAuthenticated = async (req, res, next) => {
    const authorization = req.body.headers.Authorization;
    if (!authorization) {
        res.status(400).json({
            "error": "No Login Found!! Please Login First!!"
        })
    }
    else {
        try {
            const decode = jwt.verify(authorization, process.env.JWT_SECRET);
            req.user = await Hospital.findById(decode._id);
            next();
        } catch (error) {
            res.status(400).json({
                "error": "something went wrong!!"
            })
        }
    }
}