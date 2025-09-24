import express from "express";
import { DoctorEditPatientMedicalHistory, DoctorPatientAdd, DoctorSubElementDeletePatientMedicalHistory, DoctorSubElementEditPatientMedicalHistory } from "../controllers/DoctorControl.js";
const DoctorEditRoutes = express();
DoctorEditRoutes.put("/edit/:id", DoctorPatientAdd);
DoctorEditRoutes.put("/edit/base/:id", DoctorEditPatientMedicalHistory);
DoctorEditRoutes.put("/edit/sub_edit/:id", DoctorSubElementEditPatientMedicalHistory);
DoctorEditRoutes.delete("/delete/sub_edit/:id", DoctorSubElementDeletePatientMedicalHistory);
export default DoctorEditRoutes;