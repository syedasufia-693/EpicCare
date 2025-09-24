import "@fontsource/poppins";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { PrecautionsDisplay } from "./PrecautionsDisplay";
import { DiagnosisDisplay } from "./DiagnosisDisplay";
import { VaccinationDisplay } from "./VaccinationDisplay";
import { AllergiesDisplay } from "./AllergiesDisplay";
import { SurgeriesDisplay } from "./SurgeriesDisplay";
import { HospitalList } from "./HospitalsList";
import { DoctorsList } from "./DoctorsList";
import { useContext, useState } from "react";
import { AppContext } from "../../AppContext";
import { useEffect } from "react";
import { SnackbarProvider, useSnackbar } from 'notistack';
import axios from "axios";
import { Button } from "@mui/material";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Fade from '@mui/material/Fade';
import Slide from '@mui/material/Slide';
import Grow from '@mui/material/Grow';


export const UserInformation = () => {
    const { userData, setUserMedicalData, baseBackendRoute, cookies, typeOfUser, success, setSuccess } = useContext(AppContext);

    function SlideTransition(props) {
        return <Slide {...props} direction="left" />;
    }

    const handleClick = () => {
        setSuccess(true);
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSuccess(false);

    };

    useEffect(() => {
        console.log(userData);
        console.log(typeOfUser);
    }, [])
    return (

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full w-full">
            <Snackbar anchorOrigin={{ vertical: "bottom", horizontal: "right" }} open={success} autoHideDuration={6000} onClose={handleClose} SlideTransition TransitionComponent={SlideTransition}>
                <Alert
                    onClose={handleClose}
                    severity="success"
                    variant="filled"
                    sx={{ width: '100%', fontWeight: 'bold' }}
                >
                    The data has been updated successfully!
                </Alert>
            </Snackbar>
            {/* Personal Information Section */}
            <div className="bg-white md:p-4 p-2 rounded-box text-sm">
                <h1 className="text-black text-lg m-4 tracking-wide text-center">Personal Information</h1>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
                    <div className="col-span-2 md:col-span-1">
                        <img
                            src={`https://drive.google.com/thumbnail?id=${userData?.profile_img?.id}`}
                            alt="profile"
                            className="rounded-box max-w-full h-auto object-cover"
                        />

                    </div>
                    <div className="col-span-2 md:col-span-4">
                        <p className="text-black font-bold text-center md:text-left">{userData?.firstName} {userData?.lastName}</p>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                            <p className="text-black font-bold">Aadhar</p>
                            <p className="text-black">{(userData?.aadhar)?.toString().replace(/(\d{4})(?=\d)/g, '$1 ')}</p>
                            <p className="text-black font-bold">Gender</p>
                            <p className="text-black">{userData?.gender}</p>
                        </div>
                        <p className="text-gray-400 mt-4 text-center md:text-left">{userData?.email}</p>
                    </div>
                </div>

                <div className="bg-gray-200 rounded-box mt-4 p-4 h-60 md:h-60 overflow-auto md:overflow-scroll md:no-scrollbar relative">
                    <h3 className="text-black text-lg m-2 text-center sticky top-0 bg-gray-200">Hospitals visited yet</h3>
                    <HospitalList />
                </div>


                <div className="bg-gray-200 rounded-box mt-4 p-4 h-60 md:h-60 overflow-auto md:overflow-scroll md:no-scrollbar md:relative">
                    <h3 className="text-black text-lg m-2 text-center sticky top-0 bg-gray-200">Doctors visited yet</h3>
                    <DoctorsList />
                </div>

            </div>

            <div className="bg-white p-4 md:p-4 rounded-box text-sm md:overflow-scroll md:no-scrollbar">
                <h1 className="text-black text-lg m-4 tracking-wide text-center">Medical history</h1>

                <div className="bg-gray-200 col-span-3 p-4 gap-4  mb-4  rounded-box">
                    <h3 className="text-black text-lg m-4 tracking-widetext-center">Prescriptions</h3>

                    <PrecautionsDisplay />
                </div>

                <div className="bg-gray-200 col-span-3 p-4 mb-4 gap-4 rounded-box">
                    <h3 className="text-black text-lg m-4 tracking-wide text-center">Diagnosis</h3>
                    <DiagnosisDisplay />
                </div>

                <div className="bg-gray-200 col-span-3 p-4 mb-4 gap-4 rounded-box">
                    <h3 className="text-black text-lg m-4 tracking-wide text-center">Vaccination</h3>
                    <VaccinationDisplay />
                </div>

                <div className="bg-gray-200 col-span-3 p-4 mb-4 gap-4 rounded-box">
                    <h3 className="text-black text-lg m-4 tracking-wide text-center">Allergies</h3>
                    <AllergiesDisplay />
                </div>


                <div className="bg-gray-200 col-span-3 p-4 mb-4 gap-4 rounded-box">
                    <h3 className="text-black text-lg m-4 tracking-wide text-center">Surgeries</h3>
                    <SurgeriesDisplay />
                </div>

            </div>
        </div>
    );
};
