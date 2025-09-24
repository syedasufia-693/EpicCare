import mongoose from "mongoose";
const hospitalClinicInfoSchema = new mongoose.Schema({
    id: {
        type: Number
    },
    name: {
        type: String
    },
    registration_id: {
        type: String
    },
    certification: {
        type: String
    }
});
export default hospitalClinicInfoSchema;
