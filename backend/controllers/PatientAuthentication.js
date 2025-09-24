import Patient from "../models/Patient.js";
import PatientCounter from "../models/PatientCounter.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import PatientMedicalHistory from "../models/PatientMedicalHistory.js";
import { GoogleAuth } from "google-auth-library";
import { google } from "googleapis";
import mongoose from "mongoose";
import stream from "stream";
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });



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
    return response.data;
};


export const UserRegistration = async (req, res, next) => {
    try {
        const { firstName, profile_img, lastName, gender, email, dob, aadhar, password } = req.body;
        let patient_id = -1;
        try {
            await PatientCounter.updateOne({ id: 1 }, { $inc: { count: 1 } });
            const patient_counter = await PatientCounter.findOne({ id: 1 });
            patient_id = patient_counter.count;
        }
        catch (err) {
            const patientCounter = new PatientCounter({
                'id': 1,
                'count': 100
            })
            const patient_counter = await patientCounter.save();
            patient_id = patient_counter.count;
            console.log("patient_id:" + patient_id);
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const KeyPath = process.env.KeyPath;
        const SCOPES = [process.env.SCOPES_0, process.env.SCOPES_1];
        const auth = new GoogleAuth({
            keyFile: KeyPath,
            scopes: SCOPES
        });
        const new_profile_img = await uploadToGoogleDrive(auth, req.files[0], firstName);
        const newUser = new Patient({
            id: patient_id,
            firstName,
            profile_img: {
                id: new_profile_img.id,
                name: new_profile_img.name
            },
            lastName,
            gender,
            aadhar,
            dob,
            email,
            password: hashedPassword
        })
        await newUser.save();
        const fullName = firstName + " " + lastName;
        const newPatientRecord = new PatientMedicalHistory({
            lastUpdatedAt: Date.now(),
            profile_img: {
                id: new_profile_img.id,
                name: new_profile_img.name
            },
            patient_details: {
                id: patient_id,
                name: fullName,
                aadhar: aadhar,
                gender: gender,
                dob: dob,
                contact: {
                    email: email
                }
            },
            id: newUser._id
        });
        await newPatientRecord.save();
        await PatientCounter.updateOne({ id: 1 }, { $inc: { count: 1 } })
            .then((response) => {
                console.log(response);
            })
            .catch((err) => {
                console.log(err);
            })
        res.status(201).json('Registered successfully!');

    }
    catch (err) {
        console.log(err);
    }
}

export const UserLogin = async (req, res) => {
    const { email, password } = req.body;
    const data = await Patient.findOne({ email: email })
    if (!data) {
        res.status(400).send("No email Found!!");
    }
    else {
        const matching = await bcrypt.compare(password, data.password);
        if (matching) {
            try {
                const token = await jwt.sign({ _id: data._id }, process.env.JWT_SECRET);

                res.status(200).cookie("token", token).
                    json({
                        success: true,
                        message: "Login successful!!",
                        data,
                        jwt_token: token
                    });
            }
            catch (error) {
                res.status(400).json({
                    "error": error,
                    "message": "something went wrong!!"
                });
            }
        }
        else {
            res.status(400).send("Incorrect Password!!");
        }
    }
}

export const UserInformation = async (req, res) => {
    const { authorization } = req.headers;
    const decode = jwt.verify(authorization, process.env.JWT_SECRET);
    const data = await Patient.findById(decode._id);
    console.log(data);
    res.status(200).json({
        data
    })
}

export const DoctorUserInformation = async (req, res) => {
    const { id } = req.params;
    const objectId = new mongoose.Types.ObjectId(id);
    const data = await Patient.findById(objectId);
    console.log(data);
    res.status(200).json({
        data
    })
}

export const UserLogout = (req, res) => {
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