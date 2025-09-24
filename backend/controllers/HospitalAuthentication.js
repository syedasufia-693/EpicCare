import Hospital from "../models/Hospital.js";
import HospitalCounter from "../models/HospitalCounter.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { GoogleAuth } from "google-auth-library";
import { google } from "googleapis";
import stream from "stream";

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


export const HospitalRegistration = async (req, res) => {
    const { hospital_residence_no, hospital_street, contact_no, hospital_city, hospital_state, hospital_country, hospital_name, specialization, email, password, certifications, address, hospital_registration_id } = req.body;
    let hospital_id = -1;
    try {
        await HospitalCounter.updateOne({ id: 1 }, { $inc: { count: 1 } });
        const hospital_counter = await HospitalCounter.findOne({ id: 1 });
        hospital_id = hospital_counter.count;
    }
    catch (err) {
        const hospitalCounter = new HospitalCounter({
            'id': 1,
            'count': 100
        })
        const hospital_counter = await hospitalCounter.save();
        hospital_id = hospital_counter.count;
        console.log("hospital_id:" + hospital_id);
    }
    const KeyPath = process.env.KeyPath;
    const SCOPES = [process.env.SCOPES_0, process.env.SCOPES_1];
    const auth = new GoogleAuth({
        keyFile: KeyPath,
        scopes: SCOPES
    });
    console.log(req.file);
    console.log(req.files);
    const new_profile_img = await uploadToGoogleDrive(auth, req.file, 'logo_img');
    const hashedPassword = await bcrypt.hash(password, 10);
    const hospital_register = new Hospital({
        hospital_id: hospital_id,
        hospital_name: hospital_name,
        specialization: specialization,
        email: email,
        logo_img: {
            id: new_profile_img?.id,
            name: new_profile_img?.name
        },
        password: hashedPassword,
        certifications: certifications,
        contact_no: contact_no,
        address: {
            'residence_no': hospital_residence_no,
            'street': hospital_street,
            'city': hospital_city,
            'state': hospital_state,
            'country': hospital_country
        },
        hospital_registration_id: hospital_registration_id,
        patients_list: [],
        doctor_list: []
    })
    await hospital_register.save();
    res.status(200).json({
        message: "Registration Completed!!",
        hospital_register
    })
}

export const HospitalLogin = async (req, res) => {
    const { email, password } = req.body;
    const hospital_data = await Hospital.findOne({ email: email });
    if (hospital_data) {
        if (bcrypt.compare(hospital_data.password, password)) {
            const jwt_token = await jwt.sign({ _id: hospital_data._id }, process.env.JWT_SECRET);
            res.status(200).cookie("token", jwt_token, {
                secure: true,
                maxAge: 90 * 24 * 60 * 60 * 1000,
            }).json({
                message: "Login Successfull",
                hospital_data,
                jwt_token: jwt_token
            })
        }
        else {
            res.status(400).json({
                error: "Invalid Password!!"
            })
        }
    }
    else {
        res.status(400).json({
            error: "Email not found!!"
        })
    }
}

export const HospitalInformation = async (req, res) => {
    const { authorization } = req.headers;
    const decode = jwt.verify(authorization, process.env.JWT_SECRET);
    const data = await Hospital.findById(decode._id);
    console.log(data);
    res.status(200).json({
        data
    })
}

export const HospitalLogout = async (req, res) => {
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