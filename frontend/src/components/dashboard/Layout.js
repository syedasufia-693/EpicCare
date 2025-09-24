import React, { useContext, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { HiMenu } from "react-icons/hi";
import { MdOutlineMenuOpen } from "react-icons/md";
import './Layout.css'
import { IoGrid } from "react-icons/io5";
import { RiCalendarScheduleFill } from "react-icons/ri";
import { FaUserDoctor } from "react-icons/fa6";
import { FaUserNurse } from "react-icons/fa6";
import { MdMarkChatUnread } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { TbLogout2 } from "react-icons/tb";
import { Link } from "react-router-dom";
import { FaDisease } from "react-icons/fa6";
import { ImProfile } from "react-icons/im";
import { AppContext } from "../../AppContext";
import axios from "axios";
import { useEffect } from "react";

// import NavBar from "./NavBar";
// import SideBar from "./SideBar";


function Layout() {
  const [show, setShow] = useState(false);
  const [activeItem, setActiveItem] = useState("overview");
  const { baseBackendRoute, removeCookie, cookies, userData, doctorData, setDoctorData, setUserMedicalData, setUserData, setHospitalData, hospitalData } = useContext(AppContext);
  const type = cookies.type;
  const navigate = useNavigate();
  const handleLogout = async () => {
    if (cookies.type === 'User') {
      await axios.get(`${baseBackendRoute}/api/user/authentication/logout`, {
        headers: {
          Authorization: cookies.token
        }
      })
        .then((res) => {
          console.log(res);
          removeCookie('token');
          removeCookie('type');
        })
        .catch((err) => {
          console.log(err);
        })
    }
    else if (cookies.type === 'Hospital') {
      await axios.post(`${baseBackendRoute}/api/hospital/logout`, {
        headers: {
          Authorization: cookies.token
        }
      })
        .then((res) => {
          console.log(res);
          removeCookie('token');
          removeCookie('type');
        })
        .catch((err) => {
          console.log(err);
        })
    }
    else if (cookies.type === 'Doctor') {
      await axios.post(`${baseBackendRoute}/api/doctor/logout`, {
        headers: {
          Authorization: cookies.token
        }
      })
        .then((res) => {
          console.log(res);
          removeCookie('token');
          removeCookie('type');
        })
        .catch((err) => {
          console.log(err);
        })
    }
  }

  const handleItemClick = (item) => {
    setActiveItem(item);
  };

  const getMedicalData = async () => {
    if (cookies.type === 'User') {
      await axios.get(`${baseBackendRoute}/api/user/authentication/info`, {
        headers: {
          Authorization: cookies.token
        }
      })
        .then(async (res) => {
          console.log(res);
          setUserData(res?.data?.data);
          await axios.get(`${baseBackendRoute}/api/medical_records/get/${res?.data?.data?._id}`,
            {
              headers: {
                Authorization: cookies.token
              }
            }
          )
            .then((response) => {
              console.log(response);
              setUserMedicalData(response?.data?.getElement);
            })
            .catch((err) => {
              console.log(err);
            })

        })
        .catch((err) => {
          console.log(err);
        })
    }
    else if (cookies.type === 'Hospital') {
      await axios.get(`${baseBackendRoute}/api/hospital/hospital-info`, {
        headers: {
          Authorization: cookies.token
        }
      })
        .then(async (res) => {
          console.log(res);
          setHospitalData(res.data?.data);
        })
        .catch((err) => {
          console.log(err);
        })

    }
    else if (cookies.type === 'Doctor') {
      await axios.get(`${baseBackendRoute}/api/doctor/get-doctor-info`, {
        headers: {
          Authorization: cookies.token
        }
      })
        .then((res) => {
          console.log(res);
          setDoctorData(res.data?.data);
        })
        .catch((err) => {
          console.log(err);
        })
    }
  }

  useEffect(() => {
    getMedicalData();
  }, [])
  return (
    <div className="flex flex-col bg-slate-200">
      {/*whole layout */}
      <div className="bg-white shadow-md h-12 m-2 rounded-lg flex items-center justify-between px-5">
        <div className="flex gap-3 items-center">
          <button
            className="md:scale-0 md:absolute rounded-full hover:bg-slate-200 p-2 transition-all"
            onClick={() => setShow(!show)}
          >
            {show ? <MdOutlineMenuOpen size={20} /> : <HiMenu />}
          </button>
          <h1 className="font-bold text-xl text-emerald-700 transition-all">
            EPICCARE
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                {
                  cookies.type === 'User' ?
                    <img
                      alt="Tailwind CSS Navbar component"
                      src={`https://drive.google.com/thumbnail?id=${userData?.profile_img?.id}`}
                    />
                    :
                    cookies.type === 'Hospital' ?
                      <>
                        <img
                          alt="Tailwind CSS Navbar component"
                          src={`https://drive.google.com/thumbnail?id=${hospitalData?.logo_img?.id}`}
                        />
                      </>
                      :
                      cookies.type === 'Doctor' ?
                        <>
                          <img
                            alt="Tailwind CSS Navbar component"
                            src={`https://drive.google.com/thumbnail?id=${doctorData?.profile_img?.id}`}
                          />
                        </>
                        :
                        <></>
                }
              </div>
            </div>
            <ul
              tabIndex={0}
              className="mt-3 z-[1] p-2 shadow-md menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
            >
              <li>{
                cookies.type === 'User' ?

                  <a onClick={() => { navigate('/dashboard/user_information') }} className="justify-between">
                    Profile
                  </a>
                  :
                  cookies.type === 'Hospital' ?

                    <a onClick={() => { navigate('/dashboard') }} className="justify-between">
                      Profile
                    </a>
                    :
                    cookies.type === 'Doctor' ?

                      <a onClick={() => { navigate('/dashboard') }} className="justify-between">
                        Profile
                      </a>
                      :
                      <></>
              }
              </li>
              <li>
                <a onClick={handleLogout}>Logout</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="m-2 flex-1 flex gap-3 ">
        <div
          className={`absoulte rounded-2xl py-5 px-3 shadow-lg border bg-white md:w-[170px] md:translate-x-0 ${show ? "w-[170px]" : "w-0 -translate-x-96"
            } transition-all self-center h-[85vh] ml-5 flex flex-col `}
        >
          <ul className=" absoulte menu w-[110%]  min-h-full bg-white -ml-2  gap-2 text-emerald-700 menu-height">

            {
              cookies.type === 'Doctor' || cookies.type === 'Hospital' || cookies.type === 'User' ?
                <></>
                : <li
                  className={`${activeItem == "overview"
                    ? "text-black bg-gray-200 rounded-md"
                    : ""
                    }`}
                >
                  <Link to='/dashboard' onClick={() => handleItemClick("overview")}>
                    <IoGrid /> Overview
                  </Link>
                </li>
            }

            {
              cookies.type === 'Doctor' || cookies.type === 'Hospital' || cookies.type === 'User' ?
                <></>
                :
                <li
                  className={`${activeItem == "appointment"
                    ? "text-black bg-gray-200 rounded-md"
                    : ""
                    }`}
                >
                  <Link to='appointments' onClick={() => handleItemClick("appointment")}>
                    <RiCalendarScheduleFill /> Appointment
                  </Link>
                </li>
            }
            {
              type !== 'User' && type !== 'Doctor' ?
                <li
                  className={`${activeItem == "doctors"
                    ? "text-black bg-gray-200 rounded-md"
                    : ""
                    }`}
                >
                  <Link to='doctors' onClick={() => handleItemClick("doctors")}>
                    <FaUserDoctor /> Doctors
                  </Link>
                </li>
                :
                <></>
            }
            {
              type !== 'User' && type !== 'Hospital' && type !== 'Doctor' ?
                <li
                  className={`${activeItem == "nurses"
                    ? "text-black bg-gray-200 rounded-md"
                    : ""
                    }`}
                >
                  <Link to='nurses' onClick={() => handleItemClick("nurses")}>
                    <FaUserNurse /> Nurses
                  </Link>
                </li>
                :
                <></>
            }

            {
              type !== 'Hospital' && type !== 'Doctor' ?
                <li
                  className={`${activeItem == "chat" ? "text-black bg-gray-200 rounded-md" : ""
                    }`}
                >

                  <Link to='chats'
                    className="relative"
                    onClick={() => handleItemClick("chat")}
                  >
                    <MdMarkChatUnread />
                    Chat
                  </Link>
                </li>
                :
                <></>
            }

            {
              type !== 'Hospital' && type !== 'Doctor' ?
                <li
                  className={`${activeItem == "settings"
                    ? "text-black bg-gray-200 rounded-md"
                    : ""
                    }`}
                >
                  <Link to='settings' onClick={() => handleItemClick("settings")}>
                    <IoMdSettings />
                    SOS Feature
                  </Link>
                </li>
                :
                <></>

            }

            {
              type === 'Hospital' ?
                <li className="relative" >
                  <Link to="patients_list" onClick={() => { handleItemClick("patients_list") }}>
                    <FaUser />
                    Patients List
                  </Link>
                </li>
                :
                type === 'Doctor' ?
                  <li className="relative" >
                    <Link to="patient_doc_list" onClick={() => { handleItemClick("patient_doc_list") }}>
                      <FaUser />
                      Patients List
                    </Link>
                  </li>
                  :
                  <></>
            }

            {
              type !== 'Hospital' && type !== 'Doctor' ?
                <li className="relative" >
                  <Link to="disease_prediction" onClick={() => { handleItemClick("disease_prediction") }}>
                    <FaDisease />
                    Disease Prediction
                  </Link>
                </li>
                :
                <></>
            }

            {
              type !== 'Hospital' && type !== 'Doctor' ?

                <li className="relative" >
                  <Link to="user_information" onClick={() => { handleItemClick("user_information") }}>
                    <ImProfile />
                    User Information
                  </Link>
                </li>
                :
                <></>
            }
          </ul>
        </div>
        <div
          className={`flex-1 overflow-hidden no-scrollbar h-[85vh] rounded-md py-3 px-2 ${!show ? "-ml-14 md:-ml-0" : ""
            }`}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Layout;

