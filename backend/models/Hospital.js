import mongoose from "mongoose";
import hospitalLocationSchema from "../Schemas/HospitalLocation.js";
import doctorListSchema from "../Schemas/DoctorList.js";
import hospitalPatientSchema from "../Schemas/HospitalPatient.js";
import { doctorSchema } from "./Doctor.js";
const hospitalSchema = new mongoose.Schema({
    hospital_id: {
        type: Number
    },
    hospital_name: {
        type: String
    },
    logo_img: {
        id: {
            type: String
        },
        name: {
            type: String
        }
    },
    hospital_registration_id: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    certifications: [
        {
            type: String
        }
    ],
    contact_no: {
        type: String
    },
    address: {
        type: hospitalLocationSchema
    },
    patients_list: [
        {
            type: hospitalPatientSchema
        }
    ],
    doctor_list: [
        {
            type: doctorSchema
        }
    ]
})
const Hospital = new mongoose.model("Hospital", hospitalSchema);
export default Hospital;