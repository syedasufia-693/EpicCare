import mongoose from "mongoose";
import HospitalPatient from "../models/HospitalPatient.js";
import Patient from "../models/Patient.js";
import { GoogleAuth } from "google-auth-library";
import { google } from "googleapis";
import stream from "stream";
import Hospital from "../models/Hospital.js";
import Doctor from "../models/Doctor.js";


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
    console.log(response.data);
    return response.data;
};



export const HospitalAddPatients = async (req, res) => {
    try {
        const { hospitalControl, doctor, img_id, img_name, firstName, lastName, dob, color_code_zone, profile_img, reason, aadhar, date, color_code, email } = req.body;
        const id = req.params.id;
        const HospitalObjectId = new mongoose.Types.ObjectId(id);


        if (hospitalControl === 'custom') {
            const KeyPath = process.env.KeyPath;
            const SCOPES = [process.env.SCOPES_0, process.env.SCOPES_1];
            const auth = new GoogleAuth({
                keyFile: KeyPath,
                scopes: SCOPES
            });
            const tempData = await Hospital.findOne({ _id: HospitalObjectId });

            let new_profile_img = "";

            if (req.file) {
                new_profile_img = await uploadToGoogleDrive(auth, req.file, 'profile_image');
                new_profile_img = {
                    id: new_profile_img.id,
                    name: new_profile_img.name
                };
            }

            const hospitalPatient = new HospitalPatient({
                email: email,
                aadhar: aadhar,
                firstName: firstName,
                lastName: lastName,
                doctor: doctor,
                dob: dob,
                admission_date: Date.now(),
                profile_img: new_profile_img,
                color_code_zone_timeline: [{
                    date: Date.now(),
                    color_code: color_code,
                    reason: reason
                }],
                reason: reason
            });

            const data = await hospitalPatient.save();

            const updatedData = await Hospital.findOneAndUpdate(
                { _id: HospitalObjectId },
                { $push: { patients_list: data } },
                { new: true }  // Use `new` to return the updated document
            );

            res.status(200).json({
                message: 'Data added successfully!',
                updatedData: updatedData
            });
        }
        else {
            const hospitalPatient = new HospitalPatient({
                email: email,
                aadhar: aadhar,
                firstName: firstName,
                lastName: lastName,
                doctor: doctor,
                dob: dob,
                admission_date: Date.now(),
                profile_img: {
                    id: img_id,
                    name: img_name
                },
                color_code_zone_timeline: [{
                    date: Date.now(),
                    color_code: color_code,
                    reason: reason
                }],
                reason: reason
            });

            const data = await hospitalPatient.save();
            const tempHospitalData = await Hospital.findOne({ _id: HospitalObjectId });
            const updateHospital = await Patient.updateOne({
                'aadhar': aadhar
            }, {
                $push: {
                    'patient_visited_hospitals_list': {
                        name: tempHospitalData?.hospital_name,
                        date: Date.now()
                    }
                }
            })
            console.log(updateHospital);
            const updatedData = await Hospital.findOneAndUpdate(
                { _id: HospitalObjectId },
                { $push: { patients_list: data } },
                { new: true }
            );

            res.status(200).json({
                message: 'Data added successfully!',
                updatedData: updatedData
            });

        }
        console.log("image below");

    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Server side error!'
        });
    }
};


export const AddDoctorInHospital = async (req, res) => {
    const { doctor_UID } = req.body;
    const { id } = req.params;
    const objectId = new mongoose.Types.ObjectId(id);
    const data = await Doctor.findOne({ 'doctor_UID': doctor_UID })
    if (data) {
        const updatedData = await Hospital.findOneAndUpdate(
            { _id: objectId },
            { $push: { doctor_list: data } },
            { new: true }
        );
        res.status(200).json({
            updatedData
        })
    }
    else {
        res.status(400).json({
            message: 'no data found with doctor UID'
        })
    }
}


export const UserDetailsDischarge = async (req, res) => {
    const { reason, color_code } = req.body;
    const id = req.params.id;
    const objectId = new mongoose.Types.ObjectId(id);
    const patientId = new mongoose.Types.ObjectId(req.params.patient_id);
    try {
        const data = await Hospital.findOneAndUpdate({
            _id: objectId,
            "patients_list._id": patientId
        }, {
            $set: {
                "patients_list.$.discharged_date": Date.now()
            }
        }, { new: true })

        console.log(data);


        res.status(200).json(
            {
                message: 'Data Updated successfully!!',
                data
            }
        )
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'error! something went wrong',
        })
    }
}


export const SpecificPatientTimeLine = async (req, res) => {
    const id = req.params.id;
    const hospital_id = req.params.hospital_id;
    const hospitalId = new mongoose.Types.ObjectId(hospital_id);
    const timeLineId = new mongoose.Types.ObjectId(id);
    try {
        const data = await Hospital.findOne({ _id: hospitalId });
        const tp = await data['patients_list'];
        const filteredData = await data['patients_list'].filter(item => String(item._id) === String(timeLineId));
        const finalData = await filteredData[0].color_code_zone_timeline;
        res.status(200).json({
            'message': 'data Success',
            finalData
        })
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'data failure',
            err
        })
    }
}


export const HospitalsList = async (req, res) => {
    const data = await Hospital.find({});
    res.status(200).json({
        message: 'data successfully retrieved',
        data
    })
}


export const DeletePatient = async (req, res) => {
    const objectId = new mongoose.Types.ObjectId(req.params.id);
    const patientId = new mongoose.Types.ObjectId(req.params.patient_id);
    try {
        const data = await Hospital.updateOne({
            _id: objectId,
        },
            {
                $pull: { patients_list: { _id: patientId } }
            }
        )
        console.log(data);
        res.status(200).json({
            'message': "deletion success",
            data
        })
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'error! something went wrong',
        })
    }
}

export const UpdatePatientDetails = async (req, res) => {
    const { reason, color_code, doctor } = req.body;
    const id = req.params.id;
    const objectId = new mongoose.Types.ObjectId(id);
    const patientId = new mongoose.Types.ObjectId(req.params.patient_id);
    try {
        const data = await Hospital.findOneAndUpdate({
            _id: objectId,
            "patients_list._id": patientId
        }, {
            $set: {
                'doctor': doctor
            },
            $push: {
                "patients_list.$.color_code_zone_timeline": {
                    'date': Date.now(),
                    'color_code': color_code,
                    'reason': reason
                }
            }
        }, { new: true })
        console.log("doctor:" + doctor);
        const tpData = await Hospital.findOne({
            _id: objectId,
            "patients_list._id": patientId
        },
            {
                "patients_list.$": 1
            });
        console.log("result below...");
        console.log(tpData);
        const tempData = await Hospital.findOneAndUpdate({
            _id: objectId,
            "patients_list._id": patientId
        },
            {
                $set: {
                    "patients_list.$": {
                        "profile_img": tpData?.patients_list[0]?.profile_img,
                        "firstName": tpData?.patients_list[0]?.firstName,
                        "lastName": tpData?.patients_list[0]?.lastName,
                        "email": tpData?.patients_list[0]?.email,
                        "dob": tpData?.patients_list[0]?.dob,
                        "reason": tpData?.patients_list[0]?.reason,
                        "aadhar": tpData?.patients_list[0]?.aadhar,
                        "admission_date": tpData?.patients_list[0]?.admission_date,
                        "color_code_zone_timeline": tpData?.patients_list[0]?.color_code_zone_timeline,
                        "discharged_date": tpData?.patients_list[0]?.discharged_date,
                        "doctor": doctor
                    }
                }
            },
            {
                new: true
            })

        console.log("data Below,,,,,");
        res.status(200).json(
            {
                message: 'Data Updated successfully!!',
                data
            }
        )
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'error! something went wrong',
        })
    }
}


export const SearchPatient = async (req, res) => {
    // const { aadhar } = req.body;
    try {
        // console.log(aadhar);
        const data = await Patient.findOne({ 'aadhar': Number(req.params.aadhar) });
        if (data) {
            res.status(200).json({
                'message': 'Data found!',
                'data': data
            })
        }
        else {
            res.status(400).json({
                'message': "No data found!"
            })
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            'message': 'Server side error!'
        })
    }
}