import Hospital from "../models/Hospital.js";
export const IsHospitalExist = async (req, res, next) => {
    const data = await Hospital.findOne({ hospital_id: req.body.hospital_clinic_info.id });
    console.log(data);
    next();
}