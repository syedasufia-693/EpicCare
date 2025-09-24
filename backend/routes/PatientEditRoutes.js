import express from "express";
import { PatientMedicalRecordSubToSubElementDelete, PatientMedicalRecordAttributeSubElementArrayUpdate, PatientMedicalRecordAttributeSubElementUpdate, PatientMedicalRecordSubElementDelete, PatientMedicalRecordSubElementUpdate, PatientMediccalHistoryRecord, PatientMedicalRecordAttributeSubElementArrayUpdateDiagnosis, PatientMedicalRecordAttributeVaccinationUpdate, PatientMedicalRecordAttributeValueUpdate } from "../controllers/PatientMedicalRecord.js";
import multer from "multer";
const upload = multer();
const PatientEditRoutes = express.Router();
PatientEditRoutes.patch("/edit/:id", PatientMedicalRecordSubElementUpdate);
PatientEditRoutes.put("/sub_edit/:id", upload.array("diagnosis_reports_images"), PatientMedicalRecordAttributeSubElementUpdate);
PatientEditRoutes.delete("/delete/:id", PatientMedicalRecordSubElementDelete);
PatientEditRoutes.delete("/delete/sub_ele/:id", PatientMedicalRecordSubToSubElementDelete);
PatientEditRoutes.get("/get/:id", PatientMediccalHistoryRecord);
PatientEditRoutes.patch("/sub_ele_edit/prescriptions/:id", upload.single("diagnosis_reports_images"), PatientMedicalRecordAttributeSubElementArrayUpdate);
PatientEditRoutes.patch("/sub_ele_edit/diagnosis/:id", upload.single("diagnosis_reports_image"), PatientMedicalRecordAttributeSubElementArrayUpdateDiagnosis);
PatientEditRoutes.patch("/sub_ele_edit/vaccination/:id", PatientMedicalRecordAttributeVaccinationUpdate);
PatientEditRoutes.patch("/sub_ele_edit/attribute/:id", PatientMedicalRecordAttributeValueUpdate);

export default PatientEditRoutes;
