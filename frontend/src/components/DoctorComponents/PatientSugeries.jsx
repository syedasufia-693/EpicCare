import Slider from "react-slick"
import { FaEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { useEffect, useState } from "react";
import { useContext } from "react";
import { AppContext } from "../../AppContext";
import axios from "axios";
import { useParams } from "react-router-dom";
export const PatientSurgeries = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [date, setDate] = useState();
    const [procedure, setProcedure] = useState("");
    const [doctor, setDoctor] = useState("");
    const [hospital, setHospital] = useState("");
    const [editId, setEditId] = useState("");
    const [editName, setEditName] = useState("");
    const [openEdit, setOpenEdit] = useState(false);
    const [valid, setValid] = useState(true);
    const { id } = useParams();
    const { setSuccess, userMedicalData, baseBackendRoute, setDoctorData, userData, cookies, setUserData, setUserMedicalData } = useContext(AppContext);

    const handleSurgeriesEdit = async (e) => {
        console.log(e.currentTarget.dataset.name);
        console.log(e.currentTarget.dataset.id);
        setEditId(e.currentTarget.dataset.id);
        setEditName(e.currentTarget.dataset.name);
        await axios.get(`${baseBackendRoute}/api/medical_records/records/attributes/fetch/${userData?._id}/?attribute=${e.currentTarget.dataset.name}&id=${e.currentTarget.dataset.id}`, {
            headers: {
                Authorization: cookies.token
            }
        })
            .then((res) => {
                console.log(res);
                setIsModalOpen(true);
                setOpenEdit(true);
                setDate(new Date(res.data.data[0].date)?.toISOString().split('T')[0]);
                setProcedure(res.data.data[0].procedure);
                setDoctor(res.data.data[0].doctor);
                setHospital(res.data.data[0].hospital);
            })
            .catch((err) => {
                console.log(err);
            })
    }

    const getMedicalData = async () => {

        await axios.get(`${baseBackendRoute}/api/doctor/get-doctor-user-info/${id}`)
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



    const handleSurgeriesDelete = async (e) => {
        console.log(e.currentTarget.dataset.name);
        console.log(e.currentTarget.dataset.id);
        if (e.currentTarget.dataset.name !== undefined && e.currentTarget.dataset.id !== undefined) {
            await axios.delete(`${baseBackendRoute}/api/medical_records/records/attributes/delete/${userData?._id}/?attribute=${e.currentTarget.dataset.name}&id=${e.currentTarget.dataset.id}`, {
                headers: {
                    Authorization: cookies.token
                }
            })
                .then((res) => {
                    console.log(res);
                    getMedicalData();
                    setSuccess(true);
                })
                .catch((err) => {
                    console.log(err);
                })
        }
    }


    const handleEditSubmit = async () => {
        setValid(false);

        await axios.patch(`${baseBackendRoute}/api/medical_records/sub_ele_edit/attribute/${userData?._id}/?attribute=${editName}&id=${editId}`, {
            'date': date,
            'procedure': procedure,
            'doctor': doctor,
            'hospital': hospital
        }, {
            headers: {
                Authorization: cookies.token
            }
        })
            .then((res) => {
                console.log(res);
                toggleModal();
                getMedicalData();
                setSuccess(true);
            })
            .catch((err) => {
                console.log(err);
            })

    }


    const getDoctorInfo = async () => {
        await axios.get(`${baseBackendRoute}/api/doctor/get-doctor-info`, {
            headers: {
                Authorization: cookies.token
            }
        })
            .then((res) => {
                console.log(res);
                setDoctorData(res.data?.data);
                setDoctor(res.data?.data?.doctor_name);
                console.log(res.data?.data?.doctor_name);
            })
            .catch((err) => {
                console.log(err);
            })
    }


    const handleSubmit = async () => {
        setValid(false);
        if (cookies.type === 'Doctor') {
            getDoctorInfo();
            console.log(doctor);
        }
        else {

        }
        console.log(doctor);
        if (date && procedure && doctor && hospital) {
            await axios.put(`${baseBackendRoute}/api/medical_records/records/${userData?._id}`, {
                'surgeries': {
                    'date': date,
                    'procedure': procedure,
                    'doctor': doctor,
                    'hospital': hospital
                }
            }, {
                headers: {
                    Authorization: cookies.token
                }
            })
                .then((res) => {
                    console.log(res);
                    setSuccess(true);
                    setIsModalOpen(false);
                    getMedicalData();
                })
                .catch((err) => {
                    console.log(err);
                })
        }
    }
    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
        setDate();
        setProcedure("");
        setDoctor("");
        setHospital("");
    };

    var settings = {
        infinite: false,
        speed: 500,
        arrows: true,
        slidesToShow: 1,
        slidesToScroll: 1
    };
    useEffect(() => {
        if (cookies.type === 'Doctor') {
            getDoctorInfo();
            console.log(doctor);
        }
        else {

        }
    }, [])
    return (
        <>
            {
                userMedicalData?.surgeries?.length === 0 ?
                    <>
                        <div className="bg-white shadow-md md:w-full md:h-full w-full h-full col-span-1 rounded-box p-3 ">
                            <h3 className="text-md font-medium text-black dark:text-white text-center font-bold">No information regarding Allergies yet!</h3>
                        </div>
                    </>
                    :
                    <Slider {...settings}>

                        {
                            userMedicalData?.surgeries?.map((data, index) => (
                                <div className="bg-white shadow-md md:w-full md:h-full w-full h-full col-span-1 rounded-box p-3">
                                    <span style={{ justifyContent: 'space-between' }} className="flex ml-2 items-center text-md text-black font-bold dark:text-white">
                                        Date: {data.date.split("T")[0]}
                                        <button type="button" data-name="surgeries" data-id={data._id} onClick={handleSurgeriesEdit} class="text-blue-700 border border-blue-700 hover:bg-blue-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center me-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:focus:ring-blue-800 dark:hover:bg-blue-500">
                                            <FaEdit className="text-md md:text-lg" />
                                        </button>
                                        <button type="button" data-name="surgeries" data-id={data._id} onClick={handleSurgeriesDelete} class="text-red-700 border border-red-700 hover:bg-red-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center me-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:focus:ring-red-800 dark:hover:bg-red-500">
                                            <MdDeleteOutline className="text-md md:text-lg" />
                                        </button>
                                    </span>
                                    <p className="text-md font-medium text-black dark:text-white m-2">Procedure: {data.procedure}</p>
                                    <p className="text-md font-medium text-black dark:text-white m-2">Doctor: {data.doctor}</p>
                                    <p className="text-md font-medium text-black dark:text-white m-2">Hospital: {data.hospital}</p>
                                </div>
                            ))
                        }
                    </Slider>
            }
            <div className="flex justify-center">
                <button
                    onClick={toggleModal}
                    className="block m-4 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    type="button"
                >
                    Add new Surgery Info
                </button>
            </div>

            {/* Main modal */}
            {isModalOpen && (
                <div
                    id="authentication-modal"
                    tabIndex={-1}
                    aria-hidden="true"
                    className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-gray-900 bg-opacity-50"
                >
                    <div className="relative w-full max-w-md p-4 bg-white rounded-lg shadow-md dark:bg-gray-700">
                        <div className="relative h-96 overflow-y-auto">
                            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    Add Surgery
                                </h3>
                                <button
                                    onClick={toggleModal}
                                    type="button"
                                    className="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                >
                                    <svg
                                        className="w-3 h-3"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 14 14"
                                    >
                                        <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                        />
                                    </svg>
                                    <span className="sr-only">Close modal</span>
                                </button>
                            </div>
                            <div className="p-4 md:p-5">
                                <div className="space-y-4">

                                    <div>
                                        <label
                                            htmlFor="Surgery date"
                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                        >
                                            Surgery date
                                        </label>
                                        <input
                                            type="date"
                                            name="Surgery date"
                                            id="Surgery date"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                            value={date}
                                            onChange={(e) => { setDate(e.target.value) }}
                                        />

                                        {
                                            (date || valid) ?
                                                <></>
                                                :
                                                <p style={{ color: 'red' }} className="text-md font-medium text-red dark:text-white m-2">The field can't be left empty</p>
                                        }
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="Procedure name"
                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                        >
                                            Procedure name
                                        </label>
                                        <input
                                            type="text"
                                            name="Procedure name"
                                            id="Procedure name"
                                            placeholder="Procedure name"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                            value={procedure}
                                            onChange={(e) => { setProcedure(e.target.value) }}
                                        />
                                        {
                                            (procedure || valid) ?
                                                <></>
                                                :
                                                <p style={{ color: 'red' }} className="text-md font-medium text-red dark:text-white m-2">The field can't be left empty</p>
                                        }
                                    </div>
                                    {
                                        cookies.type === 'Doctor' ?
                                            <></>
                                            :
                                            <div>
                                                <label
                                                    htmlFor="Doctor name"
                                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                >
                                                    Doctor name
                                                </label>
                                                <input
                                                    type="text"
                                                    name="Doctor name"
                                                    id="Doctor name"
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

                                    }


                                    <div>
                                        <label
                                            htmlFor="Hospital name"
                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                        >
                                            Hospital name
                                        </label>
                                        <input
                                            type="text"
                                            name="Hospital name"
                                            id="Hospital name"
                                            placeholder="Hospital name"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                            value={hospital}
                                            onChange={(e) => { setHospital(e.target.value) }}
                                        />
                                        {
                                            (hospital || valid) ?
                                                <></>
                                                :
                                                <p style={{ color: 'red' }} className="text-md font-medium text-red dark:text-white m-2">The field can't be left empty</p>
                                        }
                                    </div>


                                    {
                                        openEdit ?
                                            <button
                                                type="submit"
                                                onClick={handleEditSubmit}
                                                className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                            >
                                                Update surgery info
                                            </button>
                                            :
                                            <button
                                                type="submit"
                                                onClick={handleSubmit}
                                                className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                            >
                                                Submit
                                            </button>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}


        </>
    )
}