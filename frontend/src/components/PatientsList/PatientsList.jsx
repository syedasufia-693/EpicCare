import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { IoAddCircleOutline } from "react-icons/io5";
import { AppContext } from '../../AppContext';

export const PatientsList = () => {
    const [activeTab, setActiveTab] = useState('Tab 1');
    const [reaction, setReaction] = useState("");
    const [substance, setSubstance] = useState("");
    const [email, setEmail] = useState("");
    const [aadhar, setAadhar] = useState("");
    const [deleteId, setDeleteId] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [doctor, setDoctor] = useState("");
    const [dob, setDob] = useState("");
    const [reason, setReason] = useState("");
    const [visiblePatientModal, setVisiblePatientModal] = useState(false);
    const [isOpenDetails, setIsOpenDetails] = useState(false);
    const [date, setDate] = useState("");
    const [openDelete, setOpenDelete] = useState(false);
    const [timeLineOpen, setTimeLineOpen] = useState(false);
    const [timeLineData, setTimeLineData] = useState();
    const [code, setCode] = useState("");
    const [detailsValue, setDetailsValue] = useState();
    const [profileImg, setProfileImg] = useState();
    const [searchAadhar, setSearchAadhar] = useState(false);
    const [searchedData, setSearchedData] = useState();
    const { baseBackendRoute, cookies, hospitalData, setHospitalData } = useContext(AppContext);
    const [valid, setValid] = useState(true);
    const [tempImage, setTempImage] = useState();
    const [toggle, setToggle] = useState(false);
    const [tempName, setTempName] = useState("");
    const [tempAdmissionDate, setTempAdmissionDate] = useState("");
    const [tempDischargeDate, setTempDischargeDate] = useState("");

    const [isOpen, setIsOpen] = useState(false);

    const handleOpenDelete = (e) => {
        setDeleteId(e.currentTarget.id);
        setOpenDelete(true);
    }

    const handleDeletePatient = async () => {
        await axios.delete(`${baseBackendRoute}/api/hospital/control/patient/delete/${hospitalData?._id}/${deleteId}`)
            .then((res) => {
                console.log(res);
                handleGetInformation();
            })
            .catch((err) => {
                console.log(err);
            })

    }


    const handleDetailsDischarge = async (e) => {
        await axios.put(`${baseBackendRoute}/api/hospital/control/patient/discharge/${hospitalData?._id}/${e.currentTarget.id}`)
            .then((res) => {
                console.log(res);
                handleGetInformation();
            })
            .catch((err) => {
                console.log(err);
            })
    }


    const handleDetailsSubmit = async () => {
        setValid(false);
        if (doctor && reason && code) {
            await axios.put(`${baseBackendRoute}/api/hospital/control/patient/update-details/${hospitalData?._id}/${detailsValue}`, {
                'doctor': doctor,
                'reason': reason,
                'color_code': code
            })
                .then((res) => {
                    console.log(res);
                    setIsOpenDetails(false);
                    handleGetInformation();
                    toggleCloseDetails();
                    setDoctor('');
                    setReason('');
                    setCode('');
                })
                .catch((err) => {
                    console.log(err);
                })
        }
    }


    const toggleOpenDetails = (e) => {
        setDetailsValue(e.currentTarget.id);
        setValid(true);
        setIsOpenDetails(!isOpenDetails);
    }

    const toggleCloseDetails = () => {
        setValid(false);
        setIsOpenDetails(false);
    }

    const toggleModalOpen = () => {
        setValid(true);
        setIsOpen(!isOpen);
    };

    const closeModal = () => {
        setValid(true);
        setIsOpen(false);
    };



    const toggleModal = () => {
        setToggle(!toggle);
        if (toggle) {
            document.getElementById('my_modal_3').showModal()
        }
    }

    const handleSearchInfo = async () => {
        setValid(false)
        if (aadhar) {
            console.log(aadhar)
            await axios.get(`${baseBackendRoute}/api/hospital/control/get-patient-info/${aadhar}`)
                .then((res) => {
                    console.log(res);
                    setSearchAadhar(true);
                    setSearchedData(res.data.data);
                })
                .catch((err) => {
                    console.log(err);
                })
        }
    }

    const handleTimeLineInfo = async (e) => {
        await axios.get(`${baseBackendRoute}/api/hospital/control/patient-timeline/${hospitalData?._id}/${e.currentTarget.id}`)
            .then((res) => {
                console.log(res);
                setTimeLineData(res?.data?.finalData);
                toggleModalOpen();
            })
            .catch((err) => {
                console.log(err);
            })
    }

    const handleAadharSubmit = async () => {
        setValid(false);
        const picData = {
            'id': searchedData.id,
            'name': searchedData.name
        }
        const formData = new FormData();
        formData.append('email', searchedData.email);
        formData.append('hospitalControl', 'User');
        formData.append('doctor', doctor);
        formData.append('firstName', searchedData.firstName);
        formData.append('lastName', searchedData.lastName);
        formData.append('dob', searchedData.dob);
        formData.append('img_id', searchedData.profile_img.id);
        formData.append('img_name', searchedData.profile_img.name);
        formData.append('aadhar', searchedData.aadhar);
        formData.append('color_code', code);
        formData.append('reason', reason);

        await axios.put(`${baseBackendRoute}/api/hospital/control/add-patient/${hospitalData?._id}`, formData, {
            headers: {
                Authorization: cookies.token
            }
        })
            .then((res) => {
                console.log(res);
                handleGetInformation();
            })
            .catch((err) => {
                console.log(err);
            })
    }


    const handleSubmit = async () => {
        setValid(false);
        if (email && doctor && firstName && lastName && dob && profileImg && aadhar && code && reason) {
            const formData = new FormData();
            formData.append('email', email);
            formData.append('hospitalControl', 'custom');
            formData.append('doctor', doctor);
            formData.append('firstName', firstName);
            formData.append('lastName', lastName);
            formData.append('dob', dob);
            formData.append('profile_img', profileImg);
            formData.append('aadhar', aadhar);
            formData.append('color_code', code);
            formData.append('reason', reason);

            await axios.put(`${baseBackendRoute}/api/hospital/control/add-patient/${hospitalData?._id}`, formData, {
                headers: {
                    Authorization: cookies.token
                }
            })
                .then((res) => {
                    console.log(res);
                    handleGetInformation();
                    setAadhar('');
                    setCode('');
                    setDob('');
                    setProfileImg();
                    setDoctor('');
                    setFirstName('');
                    setLastName('');
                    setEmail('');
                    setReason('');
                    setVisiblePatientModal(false);
                })
                .catch((err) => {
                    console.log(err);
                })
        }
    }

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const handleGetInformation = async () => {
        await axios.get(`${baseBackendRoute}/api/hospital/hospital-info`, {
            headers: {
                Authorization: cookies.token
            }
        })
            .then((res) => {
                console.log(res);
                setHospitalData(res?.data?.data);
            })
            .catch((err) => {
                console.log(err);
            })
    }

    useEffect(() => {
        console.log(hospitalData);
        handleGetInformation();
    }, [])

    return (
        <>
            <div
                className={`bg-white gap-4 h-full md:h-full p-10 ${isOpen ? 'bg-gray-500' : ''}`}
            >
                <div className="flex justify-between">
                    <h1 className="text-center font-bold">Patients List</h1>
                    <button
                        type="button"
                        className="px-5 py-2.5 text-sm font-medium text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        onClick={() => { setVisiblePatientModal(true); setValid(true) }}
                    >
                        <IoAddCircleOutline className="text-white mr-2" />
                        Add Patient
                    </button>
                </div>
                <div className="bg-gray-100 gap-2 overflow-y-auto h-[60vh] overflow-x-hidden md:h-[60vh] p-5 rounded-lg mt-5 flex flex-col items-center">

                    {hospitalData?.patients_list?.map((data, index) => (
                        <div
                            key={index}
                            className={`${data.color_code_zone_timeline[data.color_code_zone_timeline.length - 1]?.color_code === 'yellow'
                                ? 'bg-yellow-300'
                                : data.color_code_zone_timeline[data.color_code_zone_timeline.length - 1]?.color_code === 'red'
                                    ? 'bg-red-400' :
                                    data.color_code_zone_timeline[data.color_code_zone_timeline.length - 1]?.color_code === 'green'
                                        ? 'bg-green-400'
                                        : 'bg-white'
                                } rounded-lg p-5 m-3 w-full`}
                        >
                            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                                <div className="w-10 rounded-full flex-shrink-0">
                                    <img
                                        src={`https://drive.google.com/thumbnail?id=${data.profile_img?.id}`}
                                        className="w-20 rounded-lg"
                                        alt="profile-img"
                                    />

                                </div>
                                <div className="text-center md:text-left" style={{ fontSize: '0.8rem' }}>
                                    <div className="font-bold">Name</div>
                                    <div>{data.firstName} {data.lastName}</div>
                                </div>
                                <div className="text-center md:text-left" style={{ fontSize: '0.8rem' }}>
                                    <div className="font-bold">Email</div>
                                    <div>{data.email}</div>
                                </div>
                                <div className="text-center md:text-left" style={{ fontSize: '0.8rem' }}>
                                    <div className="font-bold">Doctor</div>
                                    <div>{data.doctor}</div>
                                </div>
                                <div className="text-center md:text-left" style={{ fontSize: '0.8rem' }}>
                                    <div className="font-bold">DOB</div>
                                    <div>{data?.dob ? data?.dob.split("T")[0] : "N/A"}</div>
                                </div>
                                <div className="text-center md:text-left" style={{ fontSize: '0.8rem' }}>
                                    <div className="font-bold">Reason</div>
                                    <div>{data.reason}</div>
                                </div>
                                <div className="text-center md:text-left" style={{ fontSize: '0.8rem' }}>
                                    <div className="font-bold">Admission Date</div>
                                    <div>{data.admission_date ? data.admission_date.split("T")[0] : "N/A"}</div>
                                </div>
                                <div className="text-center md:text-left" style={{ fontSize: '0.8rem' }}>
                                    <div className="font-bold">Discharged date</div>
                                    <div>{data.discharged_date ? data.discharged_date.split("T")[0] : 'N/A'}</div>
                                </div>
                            </div>
                            <div className="mt-4 flex justify-between flex-wrap">
                                <button
                                    id={data._id}
                                    type="button"
                                    className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-400 dark:text-blue-400 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-900 sm:mb-0"
                                    onClick={handleTimeLineInfo}
                                >
                                    Timeline
                                </button>
                                {
                                    data.discharged_date ?
                                        <></>
                                        :
                                        <button
                                            id={data._id}
                                            onClick={toggleOpenDetails}
                                            type="button"
                                            className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-400 dark:text-blue-400 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-900 sm:mb-0"
                                        >
                                            Update Details
                                        </button>
                                }

                                {
                                    data.discharged_date ?
                                        <></>
                                        :
                                        <button
                                            id={data._id}
                                            onClick={handleDetailsDischarge}
                                            type="button"
                                            className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-400 dark:text-blue-400 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-900 sm:mb-0"
                                        >
                                            Update Discharge
                                        </button>
                                }

                                <button
                                    id={data._id}
                                    type="button"
                                    className="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-red-400 dark:text-red-400 dark:hover:text-white dark:hover:bg-red-500 dark:focus:ring-red-900 sm:mb-0"
                                    onClick={(e) => { setTempImage(data.profile_img?.id); setTempName(data.firstName + data.lastName); setTempAdmissionDate(data.admission_date ? data.admission_date.split("T")[0] : "N/A"); setTempDischargeDate(data.discharged_date ? data.discharged_date.split("T")[0] : "N/A"); handleOpenDelete(e); }}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>


            {
                openDelete && (
                    <div id="popup-modal" tabindex="-1" class="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full flex">
                        <div class="relative p-4 w-full max-w-md max-h-full">
                            <div class="relative bg-white rounded-lg shadow dark:bg-gray-700" onClick={() => { setOpenDelete(false) }}>
                                <button type="button" class="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="popup-modal">
                                    <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                    </svg>
                                    <span class="sr-only">Close modal</span>
                                </button>
                                <div class="p-4 md:p-5 text-center">
                                    <svg class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                    </svg>
                                    <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Are you sure you want to delete this patient with the details as follows?</h3>
                                    <img
                                        src={`https://drive.google.com/thumbnail?id=${tempImage}`} alt="Selected profile"
                                        className="mx-auto rounded-full w-24 h-24"
                                    />
                                    <h3 class="mb-5 text-md font-normal text-gray-500 dark:text-gray-400">Name: {tempName}</h3>
                                    <h3 class="mb-5 text-md font-normal text-gray-500 dark:text-gray-400">Admission Date: {tempAdmissionDate}</h3>
                                    <h3 class="mb-5 text-md font-normal text-gray-500 dark:text-gray-400">Discharge Date: {tempDischargeDate}</h3>


                                    <button data-modal-hide="popup-modal" onClick={handleDeletePatient} type="button" class="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center">
                                        Yes, I'm sure
                                    </button>
                                    <button onClick={() => { setOpenDelete(false) }} data-modal-hide="popup-modal" type="button" class="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">No, cancel</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }


            {
                visiblePatientModal && (

                    <dialog id="my_modal_3" className="modal" open>
                        <div className="modal-box">

                            <form method="dialog">
                                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={() => { setValid(false); setVisiblePatientModal(false) }}>✕</button>
                            </form>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Add Patient
                            </h3>
                            <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 dark:text-gray-400  mt-5 md:mt-10">
                                <li className="me-2">
                                    <a href="#"
                                        className={`inline-block px-4 py-3 rounded-lg ${activeTab === 'Tab 1' ? 'text-white bg-blue-600' : 'hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white'}`}
                                        onClick={() => handleTabClick('Tab 1')}
                                        aria-current={activeTab === 'Tab 1' ? 'page' : undefined}
                                    >
                                        Add manually
                                    </a>
                                </li>
                                <li className="me-2">
                                    <a href="#"
                                        className={`inline-block px-4 py-3 rounded-lg ${activeTab === 'Tab 2' ? 'text-white bg-blue-600' : 'hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white'}`}
                                        onClick={() => handleTabClick('Tab 2')}
                                        aria-current={activeTab === 'Tab 2' ? 'page' : undefined}
                                    >
                                        Add with aadhar
                                    </a>
                                </li>
                            </ul>
                            <div className="py-4">
                                {activeTab === 'Tab 1' && (
                                    <>
                                        <div className="relative h-96 overflow-y-auto">

                                            <div className="p-4 md:p-5">
                                                <div className="space-y-4">

                                                    <div>
                                                        <label
                                                            htmlFor="email"
                                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                        >
                                                            Email
                                                        </label>
                                                        <input
                                                            type="email"
                                                            name="email"
                                                            id="email"
                                                            placeholder="email"
                                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                                            value={email}
                                                            onChange={(e) => { setEmail(e.target.value) }}
                                                        />

                                                        {
                                                            (email || valid) ?
                                                                <></>
                                                                :
                                                                <p style={{ color: 'red' }} className="text-md font-medium text-red dark:text-white m-2">The field can't be left empty</p>
                                                        }
                                                    </div>
                                                    <div>
                                                        <label
                                                            htmlFor="aadhar"
                                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                        >
                                                            Aadhar
                                                        </label>
                                                        <input
                                                            type="text"
                                                            name="aadhar"
                                                            id="aadhar"
                                                            placeholder="aadhar number"
                                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                                            value={aadhar}
                                                            onChange={(e) => { setAadhar(e.target.value) }}
                                                        />
                                                        {
                                                            (aadhar || valid) ?
                                                                <></>
                                                                :
                                                                <p style={{ color: 'red' }} className="text-md font-medium text-red dark:text-white m-2">The field can't be left empty</p>
                                                        }
                                                    </div>


                                                    <div>
                                                        <label
                                                            htmlFor="firstName"
                                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                        >
                                                            First Name
                                                        </label>
                                                        <input
                                                            type="text"
                                                            name="firstName"
                                                            id="firstName"
                                                            placeholder="First name"
                                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                                            value={firstName}
                                                            onChange={(e) => { setFirstName(e.target.value) }}
                                                        />
                                                        {
                                                            (firstName || valid) ?
                                                                <></>
                                                                :
                                                                <p style={{ color: 'red' }} className="text-md font-medium text-red dark:text-white m-2">The field can't be left empty</p>
                                                        }
                                                    </div>

                                                    <div>
                                                        <label
                                                            htmlFor="lastName"
                                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                        >
                                                            Last Name
                                                        </label>
                                                        <input
                                                            type="text"
                                                            name="lastName"
                                                            id="lastName"
                                                            placeholder="Last name"
                                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                                            value={lastName}
                                                            onChange={(e) => { setLastName(e.target.value) }}
                                                        />
                                                        {
                                                            (lastName || valid) ?
                                                                <></>
                                                                :
                                                                <p style={{ color: 'red' }} className="text-md font-medium text-red dark:text-white m-2">The field can't be left empty</p>
                                                        }
                                                    </div>


                                                    <div>
                                                        <label
                                                            htmlFor="profileImg"
                                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                        >
                                                            Profile Image
                                                        </label>
                                                        <input
                                                            type="file"
                                                            name="profileImg"
                                                            id="profileImg"
                                                            accept="image/*"
                                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                                            onChange={(e) => { setProfileImg(e.target.files[0]) }}
                                                        />

                                                        {
                                                            (profileImg || valid) ?
                                                                <></>
                                                                :
                                                                <p style={{ color: 'red' }} className="text-md font-medium text-red dark:text-white m-2">The field can't be left empty</p>
                                                        }
                                                    </div>

                                                    <div>
                                                        <label
                                                            htmlFor="doctor"
                                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                        >
                                                            Doctor
                                                        </label>
                                                        <input
                                                            type="text"
                                                            name="doctor"
                                                            id="doctor"
                                                            placeholder="Doctor name"
                                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                                            value={doctor}
                                                            onChange={(e) => { setDoctor(e.target.value) }}
                                                        />
                                                        {
                                                            (doctor || valid) ?
                                                                <></>
                                                                :
                                                                <p style={{ color: 'red' }} className="text-md font-medium text-red dark:text-white m-2">The field can't be left empty</p>
                                                        }
                                                    </div>


                                                    <div>
                                                        <label
                                                            htmlFor="DOB"
                                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                        >
                                                            DOB
                                                        </label>
                                                        <input
                                                            type="date"
                                                            name="DOB"
                                                            id="DOB"
                                                            placeholder="Date of birth"
                                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                                            value={dob}
                                                            onChange={(e) => { setDob(e.target.value) }}
                                                        />
                                                        {
                                                            (dob || valid) ?
                                                                <></>
                                                                :
                                                                <p style={{ color: 'red' }} className="text-md font-medium text-red dark:text-white m-2">The field can't be left empty</p>
                                                        }
                                                    </div>


                                                    <div>
                                                        <label
                                                            htmlFor="reason"
                                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                        >
                                                            Reason
                                                        </label>
                                                        <input
                                                            type="text"
                                                            name="reason"
                                                            id="reason"
                                                            placeholder="Reason"
                                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                                            value={reason}
                                                            onChange={(e) => { setReason(e.target.value) }}
                                                        />
                                                        {
                                                            (reason || valid) ?
                                                                <></>
                                                                :
                                                                <p style={{ color: 'red' }} className="text-md font-medium text-red dark:text-white m-2">The field can't be left empty</p>
                                                        }
                                                    </div>

                                                    <div>
                                                        <label
                                                            htmlFor="color_code"
                                                            className="block mt-4 mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                        >
                                                            Select Color Code
                                                        </label>
                                                        <select
                                                            name="color_code"
                                                            id="color_code"
                                                            className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:text-white }`}
                                                            value={code}
                                                            onChange={(e) => setCode(e.target.value)}
                                                        >
                                                            <option value="">Select Color</option>
                                                            <option value="red" className="m-2 text-black">Red</option>
                                                            <option value="yellow" className="m-2 text-black">Yellow</option>
                                                            <option value="green" className="m-2 text-black">Green</option>
                                                            <option value="normal" className="m-2 text-black">Normal</option>

                                                        </select>

                                                        {
                                                            (code || valid) ?
                                                                <></>
                                                                :
                                                                <p style={{ color: 'red' }} className="text-md font-medium text-red dark:text-white m-2">The field can't be left empty</p>
                                                        }

                                                    </div>


                                                    <button
                                                        onClick={handleSubmit}
                                                        type="submit"
                                                        className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                                    >
                                                        Submit
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                                {activeTab === 'Tab 2' && (
                                    <div className="relative h-96 overflow-y-auto">

                                        <div className="p-4 md:p-5">
                                            <div className="space-y-4">
                                                {
                                                    searchAadhar ?
                                                        <>
                                                            <div>
                                                                <label
                                                                    htmlFor="reason"
                                                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                                >
                                                                    Reason
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    name="reason"
                                                                    id="reason"
                                                                    placeholder="Reason"
                                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                                                    value={reason}
                                                                    onChange={(e) => { setReason(e.target.value) }}
                                                                />
                                                                {
                                                                    (reason || valid) ?
                                                                        <></>
                                                                        :
                                                                        <p style={{ color: 'red' }} className="text-md font-medium text-red dark:text-white m-2">The field can't be left empty</p>
                                                                }
                                                            </div>

                                                            <div>
                                                                <label
                                                                    htmlFor="doctor"
                                                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                                >
                                                                    Doctor
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    name="doctor"
                                                                    id="doctor"
                                                                    placeholder="Doctor name"
                                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                                                    value={doctor}
                                                                    onChange={(e) => { setDoctor(e.target.value) }}
                                                                />
                                                                {
                                                                    (doctor || valid) ?
                                                                        <></>
                                                                        :
                                                                        <p style={{ color: 'red' }} className="text-md font-medium text-red dark:text-white m-2">The field can't be left empty</p>
                                                                }
                                                            </div>

                                                            <div>
                                                                <label
                                                                    htmlFor="color_code"
                                                                    className="block mt-4 mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                                >
                                                                    Select Color Code
                                                                </label>
                                                                <select
                                                                    name="color_code"
                                                                    id="color_code"
                                                                    className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:text-white }`}
                                                                    value={code}
                                                                    onChange={(e) => setCode(e.target.value)}
                                                                >
                                                                    <option value="">Select Color</option>
                                                                    <option value="red" className="m-2 text-black">Red</option>
                                                                    <option value="yellow" className="m-2 text-black">Yellow</option>
                                                                    <option value="green" className="m-2 text-black">Green</option>
                                                                    <option value="normal" className="m-2 text-black">Normal</option>

                                                                </select>

                                                                {
                                                                    (code || valid) ?
                                                                        <></>
                                                                        :
                                                                        <p style={{ color: 'red' }} className="text-md font-medium text-red dark:text-white m-2">The field can't be left empty</p>
                                                                }

                                                            </div>


                                                            <button
                                                                onClick={handleAadharSubmit}
                                                                type="submit"
                                                                className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                                            >
                                                                Submit
                                                            </button>

                                                        </>
                                                        :
                                                        <>
                                                            <div>
                                                                <label
                                                                    htmlFor="aadhar"
                                                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                                >
                                                                    Aadhar
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    name="aadhar"
                                                                    id="aadhar"
                                                                    placeholder="aadhar number"
                                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                                                    value={aadhar}
                                                                    onChange={(e) => { setAadhar(e.target.value) }}
                                                                />
                                                                {
                                                                    (aadhar || valid) ?
                                                                        <></>
                                                                        :
                                                                        <p style={{ color: 'red' }} className="text-md font-medium text-red dark:text-white m-2">The field can't be left empty</p>
                                                                }
                                                            </div>

                                                            <button
                                                                onClick={handleSearchInfo}
                                                                type="submit"
                                                                className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                                            >
                                                                Search
                                                            </button>
                                                        </>
                                                }
                                            </div>
                                        </div>
                                    </div>

                                )}
                            </div>
                        </div>
                    </dialog>
                )
            }


            {isOpenDetails && (
                <div
                    id="default-modal"
                    className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none"
                >
                    <div className="relative w-full max-w-lg p-6 mx-auto bg-white rounded-lg shadow-lg md:max-w-xl lg:max-w-2xl">
                        <div className="relative">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-semibold text-gray-900">Update details</h3>
                                <hr />
                                <button
                                    onClick={toggleCloseDetails}
                                    type="button"
                                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg w-8 h-8 flex items-center justify-center"
                                    data-modal-hide="default-modal"
                                >
                                    <svg
                                        className="w-4 h-4"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 14 14"
                                    >
                                        <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                        />
                                    </svg>
                                    <span className="sr-only">Close modal</span>
                                </button>
                            </div>
                            <div className="space-y-4 overflow-x-auto">

                                <div>
                                    <label
                                        htmlFor="reason"
                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                    >
                                        Reason
                                    </label>
                                    <input
                                        type="text"
                                        name="reason"
                                        id="reason"
                                        placeholder="Reason"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                        value={reason}
                                        onChange={(e) => { setReason(e.target.value) }}
                                    />
                                    {
                                        (reason || valid) ?
                                            <></>
                                            :
                                            <p style={{ color: 'red' }} className="text-md font-medium text-red dark:text-white m-2">The field can't be left empty</p>
                                    }
                                </div>

                                <div>
                                    <label
                                        htmlFor="doctor"
                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                    >
                                        Doctor
                                    </label>
                                    <input
                                        type="text"
                                        name="doctor"
                                        id="doctor"
                                        placeholder="Doctor name"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                        value={doctor}
                                        onChange={(e) => { setDoctor(e.target.value) }}
                                    />
                                    {
                                        (doctor || valid) ?
                                            <></>
                                            :
                                            <p style={{ color: 'red' }} className="text-md font-medium text-red dark:text-white m-2">The field can't be left empty</p>
                                    }
                                </div>
                                <div>
                                    <label
                                        htmlFor="color_code"
                                        className="block mt-4 mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                    >
                                        Select Color Code
                                    </label>
                                    <select
                                        name="color_code"
                                        id="color_code"
                                        className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:text-white }`}
                                        value={code}
                                        onChange={(e) => setCode(e.target.value)}
                                    >
                                        <option value="">Select Color</option>
                                        <option value="red" className="m-2 text-black">Red</option>
                                        <option value="yellow" className="m-2 text-black">Yellow</option>
                                        <option value="green" className="m-2 text-black">Green</option>
                                        <option value="normal" className="m-2 text-black">Normal</option>

                                    </select>

                                    {
                                        (code || valid) ?
                                            <></>
                                            :
                                            <p style={{ color: 'red' }} className="text-md font-medium text-red dark:text-white m-2">The field can't be left empty</p>
                                    }

                                </div>


                                <button
                                    onClick={handleDetailsSubmit}
                                    type="submit"
                                    className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                >
                                    Submit
                                </button>

                            </div>
                            <div className="flex justify-end mt-4">
                                <button
                                    onClick={toggleCloseDetails}
                                    data-modal-hide="default-modal"
                                    type="button"
                                    className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}








            {isOpen && (
                <div
                    id="default-modal"
                    className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none"
                >
                    <div className="relative w-full max-w-lg p-6 mx-auto bg-white rounded-lg shadow-lg md:max-w-xl lg:max-w-2xl">
                        <div className="relative">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-semibold text-gray-900">Timeline</h3>
                                <button
                                    onClick={closeModal}
                                    type="button"
                                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg w-8 h-8 flex items-center justify-center"
                                    data-modal-hide="default-modal"
                                >
                                    <svg
                                        className="w-4 h-4"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 14 14"
                                    >
                                        <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                        />
                                    </svg>
                                    <span className="sr-only">Close modal</span>
                                </button>
                            </div>
                            <div className="space-y-4 overflow-x-auto">
                                <ul className="timeline">
                                    {
                                        timeLineData?.map((data, index) => (<>

                                            {
                                                index % 2 === 0 ?
                                                    <li>
                                                        {index > 0 ? <hr /> : <></>}
                                                        <div className={`timeline-start timeline-box text-center ${data?.color_code === 'yellow' ? 'bg-yellow-300' : data?.color_code === 'red' ? 'bg-red-400' : data?.color_code === 'green' ? 'bg-green-400' : ''} `}>
                                                            {data.date.split("T")[0]}
                                                            <br />

                                                            {data?.color_code}
                                                            <br />
                                                            {data.reason}
                                                        </div>
                                                        <div className="timeline-middle">
                                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
                                                        </div>
                                                        {index === timeLineData.length - 1 ? <></> : <hr />}
                                                    </li>
                                                    :
                                                    <li>
                                                        <hr />
                                                        <div className={`timeline-middle`} >
                                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
                                                        </div>
                                                        <div className={`timeline-end timeline-box ${data?.color_code === 'yellow' ? 'bg-yellow-300' : data?.color_code === 'red' ? 'bg-red-400' : data?.color_code === 'green' ? 'bg-green-400' : ''} `}>

                                                            {data.date.split("T")[0]}
                                                            <br />

                                                            {data?.color_code}
                                                            <br />
                                                            {data.reason}
                                                        </div>

                                                        {index === timeLineData.length - 1 ? <></> : <hr />}
                                                    </li>
                                            }
                                        </>
                                        ))


                                    }
                                </ul>
                            </div>
                            <div className="flex justify-end mt-4">
                                <button
                                    onClick={closeModal}
                                    data-modal-hide="default-modal"
                                    type="button"
                                    className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}


        </>
    );
};

