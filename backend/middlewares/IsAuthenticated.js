import jwt from "jsonwebtoken";
import Patient from "../models/Patient.js";
export const IsAuthenticated = async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        res.status(400).json({
            "error": "No Login Found!! Please Login First!!"
        })
    }
    else {
        try {
            const decode = jwt.verify(authorization, process.env.JWT_SECRET);
            req.user = await Patient.findById(decode._id);
            next();
        } catch (error) {
            res.status(400).json({
                "error": "something went wrong!!"
            })
        }
    }
}