import mongoose from "mongoose";
import medicalRecordSchema from "./Medical_Records.js";
const doctorListSchema = new mongoose.Schema({
    doctor_id: {
        type: Number
    },
    doctor_name: {
        type: String
    },
    doctor_UID: {
        type: Number
    },
    specialization: [
        {
            type: String
        }
    ],
    patientList: [
        {
            type: [medicalRecordSchema]
        }
    ]
});
export default doctorListSchema;