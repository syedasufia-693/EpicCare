// import logo from './logo.svg';

import ReactDOM from "react-dom/client";
import { Routes, Route } from "react-router-dom";
import SignIn from "./components/sigin/SignIn";
import Register from "./components/register/Register";
import Layout from "./components/dashboard/Layout";
import Overview from "./components/dashboard/Overview";
import Settings from "./components/settings/Settings";
import Doctors from "./components/dashboard/Doctors";
import Nurses from "./components/nurses/Nurses";
import Chats from './components/chats/Chats'
import Appointments from "./components/appointments/Appointments";
import { DiseasePredict } from "./components/DiseasePredict/DiseasePredict";
import { AppContext } from "./AppContext";
import { useState } from "react";
import { UserInformation } from "./components/UserInformationComponents/UserInformation";
import { useCookies } from "react-cookie";
import { HomePage } from "./components/HomePage/HomePage";
import { PatientsList } from "./components/PatientsList/PatientsList";
import { PatientDocList } from "./components/DoctorComponents/PatientDocList";
import { PatientInformation } from "./components/DoctorComponents/PatientInformation";
import { HospitalOrDoctorList } from "./components/appointments/HospitalOrDoctorList";
const login = false
function App() {
  const flaskBackendRoute = 'http://127.0.0.1:5000';
  const baseBackendRoute = 'http://localhost:7000';
  const [doctorsList, setDoctorsList] = useState([]);
  const [cookies, setCookie, removeCookie] = useCookies(['token', 'type']);
  const [userData, setUserData] = useState();
  const [distance, setDistance] = useState(5);
  const [typeOfUser, setTypeOfUser] = useState();
  const [rows, setRows] = useState(5);
  const [method, setMethod] = useState("method-1");
  const [success, setSuccess] = useState(false);
  const [hospitalData, setHospitalData] = useState();
  const [doctorData, setDoctorData] = useState();
  const [userMedicalData, setUserMedicalData] = useState();
  const [start, setStart] = useState(false);
  const [lat, setLat] = useState();
  const [long, setLong] = useState();
  return (
    <AppContext.Provider value={{ lat, setLat, long, setLong, method, setMethod, hospitalData, doctorData, setDoctorData, setHospitalData, success, setSuccess, userMedicalData, typeOfUser, setTypeOfUser, setUserMedicalData, userData, setUserData, cookies, setCookie, removeCookie, distance, rows, setRows, start, setStart, setDistance, flaskBackendRoute, baseBackendRoute, doctorsList, setDoctorsList }}>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<HomePage />} />

        {cookies.type === 'Doctor' || cookies.type === 'User' || cookies.type === 'Hospital' ? (
          <Route
            path="/dashboard"
            element={
              cookies.token && cookies.token !== "undefined" ? <Layout /> : <SignIn />
            }
          >
            {cookies.type === 'Doctor' ? <Route index element={<PatientDocList />} /> : cookies.type === 'User' ? <Route index element={<UserInformation />} /> : cookies.type === 'Hospital' ? <Route index element={<PatientsList />} /> : <Route index element={<Overview />} />}
            <Route path="settings" element={<Settings />} />
            <Route path="doctors" element={<Doctors />} />
            <Route path="nurses" element={<Nurses />} />
            <Route path="chats" element={<Chats />} />
            <Route path="appointments" element={<Appointments />} />
            <Route path="hospital_doctors_list" element={<HospitalOrDoctorList />} />
            <Route path="disease_prediction" element={<DiseasePredict />} />
            <Route path="user_information" element={<UserInformation />} />
            <Route path="patients_list" element={<PatientsList />} />
            <Route path="patient_doc_list" element={<PatientDocList />} />
            <Route path="patient_info/:id" element={<PatientInformation />} />
          </Route>

        ) : (
          // If not a doctor, render the dashboard route
          <Route
            path="/dashboard"
            element={
              cookies.token && cookies.token !== "undefined" ? <Layout /> : <SignIn />
            }
          >
            <Route index element={<Overview />} />
            <Route path="settings" element={<Settings />} />
            <Route path="doctors" element={<Doctors />} />
            <Route path="nurses" element={<Nurses />} />
            <Route path="chats" element={<Chats />} />
            <Route path="appointments" element={<Appointments />}></Route>
            <Route path="hospital_doctors_list" element={<HospitalOrDoctorList />} />
            <Route path="disease_prediction" element={<DiseasePredict />} />
            <Route path="user_information" element={<UserInformation />} />
            <Route path="patients_list" element={<PatientsList />} />
            <Route path="patient_doc_list" element={<PatientDocList />} />
            <Route path="patient_info/:id" element={<PatientInformation />} />
          </Route>
        )}
      </Routes>
    </AppContext.Provider >
  );
}

export default App;
