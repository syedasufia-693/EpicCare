import Doctor from "../models/Doctor.js";
import DoctorCounter from "../models/DoctorCounter.js";
import bcrypt from "bcrypt";
import { GoogleAuth } from "google-auth-library";
import { google } from "googleapis";
import stream from "stream";
import jwt from "jsonwebtoken";

const uploadToGoogleDrive = async (auth, fileObject, name) => {
    const bufferStream = new stream.PassThrough();
    bufferStream.end(fileObject.buffer);
    const response = await google.drive({ version: "v3", auth }).files.create({
        media: {
            mimeType: fileObject.mimeType,
            body: bufferStream,
        },
        requestBody: {
            name: name,
            parents: [process.env.GOOGLE_FOLDER_ID],
        },
        fields: "id,name",
    });
    console.log("done");
    console.log(response.data);
    return response.data;
};

export const DoctorRegistration = async (req, res) => {
    const { doctor_name, specialization, email, doctor_UID, password } = req.body;
    let doctor_counter = -1;
    try {
        await DoctorCounter.updateOne({ id: 1 }, { $inc: { count: 1 } });
        const doctor = await DoctorCounter.findOne({ id: 1 });
        doctor_counter = doctor.count
    }
    catch (err) {
        const doctorCounter = new DoctorCounter({
            'id': 1,
            'count': 100
        })
        const doctor = await doctorCounter.save();
        doctor_counter = doctor.count;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const doctor_id = doctor_counter;
    const KeyPath = process.env.KeyPath;
    console.log(req.file);
    const SCOPES = [process.env.SCOPES_0, process.env.SCOPES_1];
    const auth = new GoogleAuth({
        keyFile: KeyPath,
        scopes: SCOPES
    });
    console.log(auth);
    const new_profile_img = await uploadToGoogleDrive(auth, req.file, 'profile_image');
    console.log("doctor_id:" + doctor_id);
    const doctor_register = new Doctor({
        profile_img: new_profile_img,
        doctor_id: doctor_id,
        doctor_name: doctor_name,
        doctor_UID: doctor_UID,
        specialization: specialization,
        email: email,
        password: hashedPassword
    })
    const data = await doctor_register.save();
    console.log(data);
    await DoctorCounter.updateOne({ id: 1 }, { $inc: { count: 1 } });
    res.status(201).json({
        message: "Doctor Registration Successfull!",
        data
    })
}

export const DoctorLogin = async (req, res) => {
    const { email, password } = req.body;
    const temp_doctor_login = await Doctor.findOne({ email: email });
    if (temp_doctor_login) {
        if (bcrypt.compare(password, temp_doctor_login.password)) {
            const token = await jwt.sign({ _id: temp_doctor_login._id }, process.env.JWT_SECRET);
            res.status(200).cookie("token", token, {
                secure: true,
                maxAge: 90 * 24 * 60 * 60 * 1000,
            }).json({
                success: true,
                message: "Login successfull!!",
                temp_doctor_login,
                jwt_token: token
            });
        }
        else {
            res.status(400).json({
                error: "Incorrect Password!!"
            })
        }
    }
    else {
        res.status(400).json({
            error: "Email not found!!"
        })
    }
}


export const DoctorInformation = async (req, res) => {
    const { authorization } = req.headers;
    const decode = jwt.verify(authorization, process.env.JWT_SECRET);
    const data = await Doctor.findById(decode._id);
    console.log(data);
    res.status(200).json({
        data
    })
}

export const DoctorLogout = (req, res) => {
    try {
        res.status(200)
            .clearCookie("token")
            .json({
                "message": "Logout Successfull!!"
            });
    } catch (error) {
        res.status(400)
            .json({
                "message": "something went wrong!!"
            })
    }
}
