import mongoose from "mongoose";
const patientSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true
    },
    profile_img: {
        id: {
            type: String
        },
        name: {
            type: String
        }
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    dob: {
        type: String
    },
    gender: {
        type: String,
        required: true
    },
    aadhar: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    patient_visited_hospitals_list: [
        {
            name: {
                type: String
            },
            date: {
                type: Date
            }

        }
    ],
    patient_doctors_list: [
        {
            name: {
                type: String
            },
            date: {
                type: Date
            }
        }
    ]



})
const Patient = mongoose.model("Patient", patientSchema);
export default Patient;