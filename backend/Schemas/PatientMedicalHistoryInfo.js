import mongoose from "mongoose";
import patientContactSchema from "./PatientContact.js";
const patientMedicalHistoryInfoSchema = new mongoose.Schema({
    id: {
        type: Number
    },
    name: {
        type: String
    },
    dob: {
        type: Date
    },
    gender: {
        type: String
    },
    aadhar: {
        type: Number
    },
    contact: {
        type: patientContactSchema
    }
})
export default patientMedicalHistoryInfoSchema;