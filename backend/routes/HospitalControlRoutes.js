import express from "express";
import { AddDoctorInHospital, DeletePatient, HospitalAddPatients, HospitalsList, SearchPatient, SpecificPatientTimeLine, UpdatePatientDetails, UserDetailsDischarge } from "../controllers/HospitalControl.js";
import { HospitalIsAuthenticated } from "../middlewares/HospitalIsAuthenticated.js";
import multer from "multer";
const HospitalControlRoutes = express();
const uploads = multer();
HospitalControlRoutes.put('/add-patient/:id', uploads.single('profile_img'), HospitalAddPatients);
HospitalControlRoutes.get('/get-patient-info/:aadhar', SearchPatient);
HospitalControlRoutes.post(`/add-doctor/:id`, AddDoctorInHospital);
HospitalControlRoutes.get("/patient-timeline/:hospital_id/:id", SpecificPatientTimeLine);
HospitalControlRoutes.put("/patient/update-details/:id/:patient_id", UpdatePatientDetails);
HospitalControlRoutes.put("/patient/discharge/:id/:patient_id", UserDetailsDischarge);
HospitalControlRoutes.delete("/patient/delete/:id/:patient_id", DeletePatient);
HospitalControlRoutes.get("/get-all-hospitals", HospitalsList);

export default HospitalControlRoutes;
