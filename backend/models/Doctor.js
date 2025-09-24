import mongoose from "mongoose";
import hospitalClinicInfoSchema from "../Schemas/HospitalClinicInfo.js";
import medicalRecordSchema from "../Schemas/Medical_Records.js";
import PatientMedicalHistory from "./PatientMedicalHistory.js";
import { patientMedicalSchema } from "./PatientMedicalHistory.js";
export const doctorSchema = new mongoose.Schema({
    doctor_name: {
        type: String
    },
    visible: {
        type: Boolean,
        default: false
    },
    profile_img: {
        id: {
            type: String
        },
        name: {
            type: String
        }
    },
    doctor_id: {
        type: Number,
    },
    doctor_UID: {
        type: String
    },
    specialization: [
        {
            type: String
        }
    ],
    email: {
        type: String
    },
    password: {
        type: String
    },
    patient_list: [
        {
            type: patientMedicalSchema
        }
    ]
})
const Doctor = new mongoose.model("Doctor", doctorSchema);
export default Doctor;