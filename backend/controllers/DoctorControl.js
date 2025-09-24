import mongoose from "mongoose";
import Doctor from "../models/Doctor.js";
import PatientMedicalHistory from "../models/PatientMedicalHistory.js";
import Patient from "../models/Patient.js";
export const DoctorPatientAdd = async (req, res) => {
    const { aadhar } = req.body;
    const id = new mongoose.Types.ObjectId(req.params.id);
    const tempData = await PatientMedicalHistory.findOne({ 'patient_details.aadhar': aadhar });
    if (tempData) {

        const tempDoctorData = await Doctor.findOne({ _id: id });
        const tpData = await Patient.updateOne({
            'aadhar': aadhar
        }, {
            $push: {
                'patient_doctors_list': {
                    name: tempDoctorData.doctor_name,
                    date: Date.now()
                }
            }
        })
        console.log(tpData);
        const data = await Doctor.updateOne({ _id: id }, {
            $push: {
                patient_list: tempData
            }
        }, { new: true });
        console.log(data);
        res.status(200).json({
            message: 'data found successfully',
            data
        })
    }
    else {
        res.status(400).json({
            message: 'no data found'
        })
    }
}

export const DoctorsList = async (req, res) => {
    const data = await Doctor.find({});
    res.status(200).json({
        message: 'Data fetched successfully!',
        data
    })
}

export const DoctorEditPatientMedicalHistory = async (req, res) => {
    const doctor_id = new mongoose.Types.ObjectId(req.params.id);
    const patient_id = new mongoose.Types.ObjectId(req.query.patient_id);
    const checkExistence = await PatientMedicalHistory.find({ id: patient_id });
    const { medical_records } = req.body;
    if (checkExistence.length > 0) {
        let newRecord = "";
        if (medical_records === undefined) {
            console.log("Entered !!");
            newRecord = await PatientMedicalHistory.findOneAndUpdate({ id: patient_id }, { $push: req.body }, { new: true });
            newRecord = await PatientMedicalHistory.findOneAndUpdate({ id: patient_id }, { $set: { lastUpdatedAt: Date.now() } }, { new: true });
        }
        else {
            console.log("entering!!");
            newRecord = await PatientMedicalHistory.findOneAndUpdate({ id: patient_id }, { $set: req.body }, { new: true });
        }

    }
    const patientUpdatedRecord = await PatientMedicalHistory.findOne({ id: patient_id });
    const doctorUpdate = await Doctor.updateOne({ _id: doctor_id, "patient_list.id": patient_id }, {
        $set: {
            "patient_list.$.lastUpdatedAt": patientUpdatedRecord?.lastUpdatedAt,
            "patient_list.$.profile_img": patientUpdatedRecord?.profile_img,
            "patient_list.$.patient_details": patientUpdatedRecord?.patient_details,
            "patient_list.$.id": patientUpdatedRecord?.id,
            "patient_list.$.medical_records": patientUpdatedRecord?.medical_records,
            "patient_list.$.allergies": patientUpdatedRecord?.allergies,
            "patient_list.$.surgeries": patientUpdatedRecord?.surgeries
        }
    }, { new: true });
    res.status(200).json({
        message: "updation Completed",
        doctorUpdate
    })
}

export const DoctorSubElementEditPatientMedicalHistory = async (req, res) => {
    const doctor_id = new mongoose.Types.ObjectId(req.params.id);
    const patient_id = new mongoose.Types.ObjectId(req.query.patient_id);
    const update_attribute_name = req.query.attribute_name;
    const update_attribute_id = new mongoose.Types.ObjectId(req.query.attribute_id);
    const newAttribute = `${update_attribute_name}._id`;
    const valueNewAttribute = `${update_attribute_name}.$`
    const checkAttribute = await PatientMedicalHistory.findOneAndUpdate({ id: patient_id, [newAttribute]: update_attribute_id }, { $set: { [valueNewAttribute]: req.body } }, { new: true });
    const patientUpdatedRecord = await PatientMedicalHistory.findOne({ id: patient_id });
    const doctorUpdate = await Doctor.findOneAndUpdate({ _id: doctor_id, "patient_list.id": patient_id }, {
        $set: {
            "patient_list.$.lastUpdatedAt": patientUpdatedRecord?.lastUpdatedAt,
            "patient_list.$.profile_img": patientUpdatedRecord?.profile_img,
            "patient_list.$.patient_details": patientUpdatedRecord?.patient_details,
            "patient_list.$.id": patientUpdatedRecord?.id,
            "patient_list.$.medical_records": patientUpdatedRecord?.medical_records,
            "patient_list.$.allergies": patientUpdatedRecord?.allergies,
            "patient_list.$.surgeries": patientUpdatedRecord?.surgeries
        }
    }, { new: true });
    res.status(200).json({
        message: "updation Completed",
        checkAttribute,
        doctorUpdate
    })
}

export const DoctorSubElementDeletePatientMedicalHistory = async (req, res) => {
    const doctor_id = new mongoose.Types.ObjectId(req.params.id);
    const patient_id = new mongoose.Types.ObjectId(req.query.patient_id);
    const attribute_name = req.query.attribute_name;
    const attribute_id = new mongoose.Types.ObjectId(req.query.attribute_id);
    const checkExistence = await PatientMedicalHistory.findOne({ id: patient_id });
    checkExistence[attribute_name] = checkExistence[attribute_name].filter(item => String(item._id) !== String(attribute_id));
    await checkExistence.save();
    const patientUpdatedRecord = await PatientMedicalHistory.findOne({ id: patient_id });
    const doctorUpdate = await Doctor.findOneAndUpdate({ _id: doctor_id, "patient_list.id": patient_id }, {
        $set: {
            "patient_list.$.lastUpdatedAt": patientUpdatedRecord?.lastUpdatedAt,
            "patient_list.$.profile_img": patientUpdatedRecord?.profile_img,
            "patient_list.$.patient_details": patientUpdatedRecord?.patient_details,
            "patient_list.$.id": patientUpdatedRecord?.id,
            "patient_list.$.medical_records": patientUpdatedRecord?.medical_records,
            "patient_list.$.allergies": patientUpdatedRecord?.allergies,
            "patient_list.$.surgeries": patientUpdatedRecord?.surgeries
        }
    }, { new: true });
    res.status(200).json({
        message: "updation Completed",
        checkExistence,
        doctorUpdate
    })

}
