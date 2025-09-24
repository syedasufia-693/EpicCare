import mongoose from "mongoose";
import { GoogleAuth } from "google-auth-library";
import { google } from "googleapis";
import stream from "stream";
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });
import PatientMedicalHistory from "../models/PatientMedicalHistory.js";
import { AsyncLocalStorage } from "async_hooks";
export const PatientMedicalRecord = async (req, res) => {
    const id = req.params.id;
    console.log("id=" + id + " " + typeof (id));
    try {
        const objectIdTemp = new mongoose.Types.ObjectId(id);
        console.log(typeof (objectIdTemp));
        const checkExistence = await PatientMedicalHistory.find({ id: objectIdTemp });
        console.log(checkExistence.length);
        const { medical_records } = req.body;
        console.log(medical_records);
        if (checkExistence.length > 0) {
            let newRecord = "";
            if (medical_records === undefined) {
                console.log("Entered !!");
                newRecord = await PatientMedicalHistory.findOneAndUpdate({ id: objectIdTemp }, { $push: req.body }, { new: true });
                newRecord = await PatientMedicalHistory.findOneAndUpdate({ id: objectIdTemp }, { $set: { lastUpdatedAt: Date.now() } }, { new: true });
            }
            else {
                console.log("entering!!");
                newRecord = await PatientMedicalHistory.findOneAndUpdate({ id: objectIdTemp }, { $set: req.body }, { new: true });
            }
            res.status(200).json({
                message: "Record Updated succesfully!!",
                newRecord
            })
        }
        else {
            res.status(400).json({
                message: "No record found with following ID"
            })
        }
    } catch (err) {
        console.log(err);
    }
}

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

export const PatientProfileImageUpdate = async (req, res) => {
    const id = req.params.id;
    try {
        const objectIdTemp = new mongoose.Types.ObjectId(id);
        console.log(typeof (objectIdTemp));
        const data = await PatientMedicalHistory.findOne({ id: objectIdTemp });
        if (data) {
            const KeyPath = process.env.KeyPath;
            console.log(req.file);
            const SCOPES = [process.env.SCOPES_0, process.env.SCOPES_1];
            const auth = new GoogleAuth({
                keyFile: KeyPath,
                scopes: SCOPES
            });
            console.log(auth);
            const new_profile_img = await uploadToGoogleDrive(auth, req.file, 'profile_image');
            let newRecord = await PatientMedicalHistory.findOneAndUpdate({ id: objectIdTemp }, { $set: { profile_img: new_profile_img } }, { new: true });
            res.status(200).json({
                message: "Record Updated succesfully!!",
                newRecord
            })
        }

    }
    catch (err) {
        console.log(err);
        res.send("something went wrong");
    }
}

export const PatientMedicalRecordSubElementUpdate = async (req, res) => {
    console.log(req.query);
    const id = req.params.id;
    const idInstantiation = new mongoose.Types.ObjectId(id);
    const attribute_name = req.query.attribute;
    const attribute_element_id = req.query.id;
    const newID = new mongoose.Types.ObjectId(attribute_element_id);
    const checkExistence = await PatientMedicalHistory.find({ id: idInstantiation });
    console.log(checkExistence[0][attribute_name]);
    const newAttribute = `${attribute_name}._id`;
    const valueNewAttribute = `${attribute_name}.$`
    if (checkExistence.length > 0) {
        let checkAttribute = await PatientMedicalHistory.findOneAndUpdate({ id: idInstantiation, [newAttribute]: newID }, { $set: { [valueNewAttribute]: req.body } }, { returnDocument: 'after' });
        console.log(checkAttribute);
        res.status(200).json({
            checkAttribute
        })
    }
}

export const PatientMedicalRecordSubElementDelete = async (req, res) => {
    const id = req.params.id;
    const idInstantiation = new mongoose.Types.ObjectId(id);
    const attribute_name = req.query.attribute;
    const attribute_element_id = req.query.id;
    const newID = new mongoose.Types.ObjectId(attribute_element_id);

    try {
        let checkExistence = await PatientMedicalHistory.findOne({ id: idInstantiation });
        console.log("idinsta=" + newID);
        if (!checkExistence) {
            return res.status(404).json({ error: 'Patient not found' });
        }
        const attributePath = `medical_records.${attribute_name}`;
        const record = checkExistence.medical_records[attribute_name].find(item => String(item._id) === String(newID));
        if (!record) {
            return res.status(404).json({ error: 'Record not found' });
        }
        checkExistence.medical_records[attribute_name] = checkExistence.medical_records[attribute_name].filter(item => String(item._id) !== String(newID));
        await checkExistence.save();
        res.status(200).json({
            success: true,
            message: 'Attribute deleted successfully',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


export const PatientMedicalHistoryRecordsAttributeInfo = async (req, res) => {
    const id = req.params.id;
    const idInstantiation = new mongoose.Types.ObjectId(id);
    const attribute_name = req.query.attribute;
    const attribute_element_id = req.query.id;
    const newID = new mongoose.Types.ObjectId(attribute_element_id);

    try {
        let checkExistence = await PatientMedicalHistory.findOne({ id: idInstantiation });
        console.log("idinsta=" + newID);
        if (!checkExistence) {
            return res.status(404).json({ error: 'Patient not found' });
        }
        const attributePath = `${attribute_name}`;
        const record = checkExistence[attribute_name].find(item => String(item._id) === String(newID));
        if (!record) {
            return res.status(404).json({ error: 'Record not found' });
        }
        const data = await checkExistence[attribute_name].filter(item => String(item._id) === String(newID));
        res.status(200).json({
            success: true,
            data,
            message: 'Data returning!!1',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

}


export const PatientMedicalRecordSubElementInfo = async (req, res) => {
    const id = req.params.id;
    const idInstantiation = new mongoose.Types.ObjectId(id);
    const attribute_name = req.query.attribute;
    const attribute_element_id = req.query.id;
    const newID = new mongoose.Types.ObjectId(attribute_element_id);

    try {
        let checkExistence = await PatientMedicalHistory.findOne({ id: idInstantiation });
        console.log("idinsta=" + newID);
        if (!checkExistence) {
            return res.status(404).json({ error: 'Patient not found' });
        }
        const attributePath = `medical_records.${attribute_name}`;
        const record = checkExistence.medical_records[attribute_name].find(item => String(item._id) === String(newID));
        if (!record) {
            return res.status(404).json({ error: 'Record not found' });
        }
        const data = await checkExistence.medical_records[attribute_name].filter(item => String(item._id) === String(newID));
        // await checkExistence.save();
        res.status(200).json({
            success: true,
            data,
            message: 'Data returning!!1',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}





export const PatientMedicalHistoryPrescription = async (req, res) => {
    console.log(req.params.id);
    const id = req.params.id;
    try {
        const { date, doctor, medication, dosage, frequency, notes } = req.body;
        const objectIdTemp = new mongoose.Types.ObjectId(id);
        console.log(typeof (objectIdTemp));
        const data = await PatientMedicalHistory.findOne({ id: objectIdTemp });
        let newRecord = "";
        if (data) {
            const KeyPath = process.env.KeyPath;
            console.log(req.file);
            const SCOPES = [process.env.SCOPES_0, process.env.SCOPES_1];
            const auth = new GoogleAuth({
                keyFile: KeyPath,
                scopes: SCOPES
            });
            console.log(auth);
            const new_prescription_img = await uploadToGoogleDrive(auth, req.file, String(date));
            newRecord = await PatientMedicalHistory.findOneAndUpdate({ id: objectIdTemp }, {
                $push:
                {
                    'medical_records.prescriptions': {
                        date,
                        doctor,
                        'diagnosis_reports_images': {
                            'id': new_prescription_img?.id,
                            'name': new_prescription_img?.name,
                        },
                        medication,
                        dosage,
                        frequency,
                        notes
                    }
                }
            }, { new: true });
            newRecord = await PatientMedicalHistory.findOneAndUpdate({ id: objectIdTemp }, { $set: { lastUpdatedAt: Date.now() } }, { new: true });

        }
        res.status(200).json({
            message: "Record Updated succesfully!!",
            newRecord
        })
    }
    catch (err) {
        console.log(err);
    }
}

export const PatientMedicalHistoryAttributesDeletion = async (req, res) => {
    console.log("deletion!!");
    const id = req.params.id;
    const idInstantiation = new mongoose.Types.ObjectId(id);
    const attribute_name = req.query.attribute;
    const attribute_element_id = req.query.id;
    const newID = new mongoose.Types.ObjectId(attribute_element_id);

    try {
        let checkExistence = await PatientMedicalHistory.findOne({ id: idInstantiation });
        console.log("idinsta=" + newID);
        if (!checkExistence) {
            return res.status(404).json({ error: 'Patient not found' });
        }
        const attributePath = `medical_records.${attribute_name}`;
        const record = checkExistence[attribute_name].find(item => String(item._id) === String(newID));
        if (!record) {
            return res.status(404).json({ error: 'Record not found' });
        }
        checkExistence[attribute_name] = checkExistence[attribute_name].filter(item => String(item._id) !== String(newID));
        await checkExistence.save();
        res.status(200).json({
            success: true,
            message: 'Attribute deleted successfully',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

}


export const PatientMedicalHistoryVaccination = async (req, res) => {
    console.log(req.params.id);
    const id = req.params.id;
    try {
        const { date, name } = req.body;
        const objectIdTemp = new mongoose.Types.ObjectId(id);
        console.log(typeof (objectIdTemp));
        const data = await PatientMedicalHistory.findOne({ id: objectIdTemp });
        let newRecord = "";
        if (data) {
            newRecord = await PatientMedicalHistory.findOneAndUpdate({ id: objectIdTemp }, {
                $push:
                {
                    'medical_records.vaccinations': {
                        date,
                        name
                    }
                }
            }, { new: true });
            newRecord = await PatientMedicalHistory.findOneAndUpdate({ id: objectIdTemp }, { $set: { lastUpdatedAt: Date.now() } }, { new: true });

        }
        res.status(200).json({
            message: "Record Updated succesfully!!",
            newRecord
        })
    }
    catch (err) {
        console.log(err);
    }
}




export const PatientMedicalHistoryDiagnosis = async (req, res) => {
    console.log(req.params.id);
    const id = req.params.id;
    try {
        const { hospital_or_diagnosis_center_name, report_result } = req.body;
        const objectIdTemp = new mongoose.Types.ObjectId(id);
        console.log(typeof (objectIdTemp));
        const data = await PatientMedicalHistory.findOne({ id: objectIdTemp });
        let newRecord = "";
        if (data) {
            const KeyPath = process.env.KeyPath;
            console.log(req.file);
            const SCOPES = [process.env.SCOPES_0, process.env.SCOPES_1];
            const auth = new GoogleAuth({
                keyFile: KeyPath,
                scopes: SCOPES
            });
            console.log(auth);
            const new_diagnosis_img = await uploadToGoogleDrive(auth, req.file, `diagnosis-${hospital_or_diagnosis_center_name}`);
            newRecord = await PatientMedicalHistory.findOneAndUpdate({ id: objectIdTemp }, {
                $push:
                {
                    'medical_records.diagnosis': {
                        hospital_or_diagnosis_center_name,
                        'diagnosis_reports_image': {
                            'id': new_diagnosis_img?.id,
                            'name': new_diagnosis_img?.name,
                        },
                        report_result
                    }
                }
            }, { new: true });
            newRecord = await PatientMedicalHistory.findOneAndUpdate({ id: objectIdTemp }, { $set: { lastUpdatedAt: Date.now() } }, { new: true });

        }
        res.status(200).json({
            message: "Record Updated succesfully!!",
            newRecord
        })
    }
    catch (err) {
        console.log(err);
    }
}


export const PatientMediccalHistoryRecord = async (req, res) => {
    console.log(req.params.id);
    const id = req.params.id;
    const idInstantiation = new mongoose.Types.ObjectId(id);
    try {
        const getElement = await PatientMedicalHistory.findOne({ id: idInstantiation });
        console.log(getElement);
        if (getElement) {
            res.status(200).json({
                "message": "Task Done",
                getElement
            })
        }
        else {
            res.status(400).json({
                "message": "no user found with the fowllowing ID"
            })
        }
    }
    catch (err) {
        console.log("something went wrong");
        res.status(400).json({
            "message": "Something Went Wrong!!"
        })
    }
}

export const PatientMedicalRecordSubToSubElementDelete = async (req, res) => {
    console.log(req.params.id);
    console.log(req.query.attribute);
    console.log(req.query.attribute_id);
    console.log(req.query.internal_id);
    console.log(req.query.internal_attribute);
    const collection_id = new mongoose.Types.ObjectId(req.params.id);
    const attribute_sub_element_id = new mongoose.Types.ObjectId(req.query.internal_id);
    const projection = `${req.query.attribute}.$[].${req.query.internal_attribute}`;
    const filteredData = await PatientMedicalHistory.updateOne({ id: collection_id }, { $pull: { [projection]: { _id: attribute_sub_element_id } } })
    console.log(filteredData);
    res.status(200).json({
        message: "Completed",
        filteredData
    });
}

export const PatientMedicalRecordAttributeSubElementArrayUpdate = async (req, res) => {
    try {
        const { date, doctor, medication, dosage, frequency, notes, diagnosis_reports_images } = req.body;
        console.log("date=" + doctor)
        console.log(req.query);
        console.log("files below");
        console.log(req.files);
        const id = req.params.id;
        const idInstantiation = new mongoose.Types.ObjectId(id);
        const attribute_name = req.query.attribute;
        const attribute_element_id = req.query.id;
        const newID = new mongoose.Types.ObjectId(attribute_element_id);
        const checkExistence = await PatientMedicalHistory.find({ id: idInstantiation });
        console.log(checkExistence[0][attribute_name]);
        const newAttribute = `medical_records.${attribute_name}._id`;
        const valueNewAttribute = `medical_records.${attribute_name}.$`
        let temp = "";
        const SCOPES = [process.env.SCOPES_0, process.env.SCOPES_1];
        const auth = new GoogleAuth({
            keyFile: process.env.KeyPath,
            scopes: SCOPES
        });
        console.log("gfiles....");
        console.log(req.file);
        if (req.file !== undefined) {
            const new_diagnosis_img = await uploadToGoogleDrive(auth, req.file, `${date}`);
            temp = {
                'date': date,
                'medication': medication,
                'doctor': doctor,
                'dosage': dosage,
                'frequency': frequency,
                'notes': notes,
                'diagnosis_reports_images': new_diagnosis_img
            }
            console.log(temp);
        }
        else {
            temp = {
                'date': date,
                'medication': medication,
                'doctor': doctor,
                'dosage': dosage,
                'frequency': frequency,
                'notes': notes,
                'diagnosis_reports_images': diagnosis_reports_images
            }
        }
        console.log("body...");

        console.log(temp);
        if (checkExistence.length > 0) {
            let checkAttribute = await PatientMedicalHistory.findOneAndUpdate({ id: idInstantiation, [newAttribute]: newID }, {
                $set: {
                    [valueNewAttribute]: temp
                }
            }, { returnDocument: 'after' });
            console.log(checkAttribute);
            res.status(200).json({
                checkAttribute
            })
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json(
            {
                message: 'Server side error!'
            }
        )
    }
}


export const PatientMedicalRecordAttributeSubElementArrayUpdateDiagnosis = async (req, res) => {
    try {
        const { hospital_or_diagnosis_center_name, report_result, diagnosis_reports_image } = req.body;
        console.log(req.query);
        console.log("files below");
        console.log(req.files);
        const id = req.params.id;
        const idInstantiation = new mongoose.Types.ObjectId(id);
        const attribute_name = req.query.attribute;
        const attribute_element_id = req.query.id;
        const newID = new mongoose.Types.ObjectId(attribute_element_id);
        const checkExistence = await PatientMedicalHistory.find({ id: idInstantiation });
        console.log(checkExistence[0][attribute_name]);
        const newAttribute = `medical_records.${attribute_name}._id`;
        const valueNewAttribute = `medical_records.${attribute_name}.$`
        let temp = "";
        const SCOPES = [process.env.SCOPES_0, process.env.SCOPES_1];
        const auth = new GoogleAuth({
            keyFile: process.env.KeyPath,
            scopes: SCOPES
        });
        console.log("gfiles....");
        console.log(req.file);
        if (req.file !== undefined) {
            const new_diagnosis_img = await uploadToGoogleDrive(auth, req.file, `diagnosis-${hospital_or_diagnosis_center_name}`);
            temp = {
                'hospital_or_diagnosis_center_name': hospital_or_diagnosis_center_name,
                'diagnosis_reports_image': new_diagnosis_img,
                'report_result': report_result
            }
            console.log(temp);
        }
        else {
            temp = {
                'hospital_or_diagnosis_center_name': hospital_or_diagnosis_center_name,
                'diagnosis_reports_image': diagnosis_reports_image,
                'report_result': report_result
            }
        }
        console.log("body...");

        console.log(temp);
        if (checkExistence.length > 0) {
            let checkAttribute = await PatientMedicalHistory.findOneAndUpdate({ id: idInstantiation, [newAttribute]: newID }, {
                $set: {
                    [valueNewAttribute]: temp
                }
            }, { returnDocument: 'after' });
            console.log(checkAttribute);
            res.status(200).json({
                checkAttribute
            })
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json(
            {
                message: 'Server side error!'
            }
        )
    }
}


export const PatientMedicalRecordAttributeVaccinationUpdate = async (req, res) => {
    try {
        console.log(req.query);
        const id = req.params.id;
        const idInstantiation = new mongoose.Types.ObjectId(id);
        const attribute_name = req.query.attribute;
        const attribute_element_id = req.query.id;
        const newID = new mongoose.Types.ObjectId(attribute_element_id);
        const checkExistence = await PatientMedicalHistory.find({ id: idInstantiation });
        console.log(checkExistence[0][attribute_name]);
        const newAttribute = `medical_records.${attribute_name}._id`;
        const valueNewAttribute = `medical_records.${attribute_name}.$`
        if (checkExistence.length > 0) {
            let checkAttribute = await PatientMedicalHistory.findOneAndUpdate({ id: idInstantiation, [newAttribute]: newID }, {
                $set: {
                    [valueNewAttribute]: req.body
                }
            }, { returnDocument: 'after' });
            console.log(checkAttribute);
            res.status(200).json({
                checkAttribute
            })
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json(
            {
                message: 'Server side error!'
            }
        )
    }
}


export const PatientMedicalRecordAttributeValueUpdate = async (req, res) => {
    try {
        console.log(req.query);
        const id = req.params.id;
        const idInstantiation = new mongoose.Types.ObjectId(id);
        const attribute_name = req.query.attribute;
        const attribute_element_id = req.query.id;
        const newID = new mongoose.Types.ObjectId(attribute_element_id);
        const checkExistence = await PatientMedicalHistory.find({ id: idInstantiation });
        console.log(checkExistence[0][attribute_name]);
        const newAttribute = `${attribute_name}._id`;
        const valueNewAttribute = `${attribute_name}.$`
        if (checkExistence.length > 0) {
            let checkAttribute = await PatientMedicalHistory.findOneAndUpdate({ id: idInstantiation, [newAttribute]: newID }, {
                $set: {
                    [valueNewAttribute]: req.body
                }
            }, { returnDocument: 'after' });
            console.log(checkAttribute);
            res.status(200).json({
                checkAttribute
            })
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json(
            {
                message: 'Server side error!'
            }
        )
    }
}



export const PatientMedicalRecordAttributeSubElementUpdate = async (req, res) => {
    console.log(req.params.id);
    console.log(req.query.id);
    console.log(req.query.internal_id);
    console.log(req.query.internal_attribute);
    console.log(req.query.sub_internal_attribute);
    console.log(req.file);
    const KeyPath = process.env.KeyPath;
    console.log(req.file);
    const SCOPES = [process.env.SCOPES_0, process.env.SCOPES_1];
    const auth = new GoogleAuth({
        keyFile: KeyPath,
        scopes: SCOPES
    });
    const collection_id = new mongoose.Types.ObjectId(req.params.id);
    const attribute_element_id = new mongoose.Types.ObjectId(req.query.id);
    const checkExistence = await PatientMedicalHistory.find({ id: collection_id });
    const collectionElementAttribute = `${req.query.attribute_name}._id`;
    console.log(collectionElementAttribute);
    const collectionSubElementAttribute = `${req.query.attribute_name}.${req.query.internal_attribute}._id`;
    const projectionElementAttribute = `${req.query.attribute_name}.$[attribute].${req.query.internal_attribute}.$[element].${req.query.sub_internal_attribute}`;
    console.log(collectionSubElementAttribute);
    console.log(projectionElementAttribute);
    const attribute_sub_element_id = new mongoose.Types.ObjectId(req.query.internal_id);
    let updatedData;
    if (checkExistence.length > 0) {
        await req.files.map(async (file) => {
            const tempResult = await uploadToGoogleDrive(auth, file);
            console.log("tempRes");
            console.log(tempResult);
            updatedData = await PatientMedicalHistory.findOneAndUpdate({ id: collection_id, [collectionElementAttribute]: attribute_element_id, [collectionSubElementAttribute]: attribute_sub_element_id }, { $push: { [projectionElementAttribute]: tempResult } }, { arrayFilters: [{ "attribute._id": attribute_element_id }, { "element._id": attribute_sub_element_id }] }, { returnDocument: 'after' });
            console.log(updatedData);
        })
        await res.status(200).json({
            message: "Updation Successfull!!"
        })
    }
    else {
        res.status(400).json({
            message: "error!! something went wrong!!"
        })
    }
}