import mongoose from "mongoose";
const hospitalPatientSchema = new mongoose.Schema({
    profile_img: {
        id: {
            type: String,
            default: undefined
        },
        name: {
            type: String,
            default: undefined
        }
    },
    firstName: {
        type: String,
        default: undefined
    },
    doctor: {
        type: String,
        default: undefined
    },
    lastName: {
        type: String,
        default: undefined
    },
    email: {
        type: String,
        default: undefined
    },
    dob: {
        type: Date
    },
    reason: {
        type: String
    },
    aadhar: {
        type: Number
    },
    color_code_zone: {
        type: String,
        default: undefined
    },
    admission_date: {
        type: Date
    },
    discharged_date: {
        type: Date
    },
    color_code_zone_timeline: [
        {
            date: {
                type: Date
            },
            color_code: {
                type: String
            },
            reason: {
                type: String
            }
        }
    ]
})

export default hospitalPatientSchema;