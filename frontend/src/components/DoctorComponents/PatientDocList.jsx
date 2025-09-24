import { MdOutlineMarkChatUnread } from "react-icons/md";
import { IoAddCircleOutline } from "react-icons/io5";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AppContext } from "../../AppContext";
import { useNavigate } from "react-router-dom";

export const PatientDocList = () => {
    const [aadhar, setAadhar] = useState("");
    const navigate = useNavigate();
    const { baseBackendRoute, doctorData, setDoctorData, cookies } = useContext(AppContext);
    const [valid, setValid] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [data, setData] = useState();
    const handleSearchInfo = async () => {
        await axios.put(`${baseBackendRoute}/api/doctor/edit/${doctorData._id}`, {
            'aadhar': Number(aadhar)
        })
            .then((res) => {
                console.log(res);
                setDoctorData(res.data?.data);
                getDoctorInfo();
                setModalOpen(false);
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
            })
            .catch((err) => {
                console.log(err);
            })
    }
    useEffect(() => {
        getDoctorInfo();
    }, [])
    return (
        <>
            <div className="flex justify-between mb-5 md:mb-10">
                <h1 className="text-gray-600 font-semibold ml-2">Patients List</h1>
                <button
                    type="button"
                    className="px-5 py-2.5 text-sm font-medium text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    onClick={() => setModalOpen(true)}
                >
                    <IoAddCircleOutline className="text-white mr-2" />
                    Add Patient
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-7 hover:bg-slate-100 items-center justify-center text-sm bg-white border border-slate-200 m-1 rounded-md px-4 py-1">
                {
                    doctorData?.patient_list?.map((data, index) => (
                        <>
                            <div className="flex flex-col items-center md:ml-4">
                                <img
                                    src={`https://drive.google.com/thumbnail?id=${data?.profile_img?.id}`}
                                    alt="Doctor Avatar"
                                    className="rounded-full w-8 text-xs mb-2 md:mb-0"
                                />
                            </div>

                            <div className="flex flex-col md:ml-4 text-center">
                                <h3 className="font-semibold text-xs mb-1">{"Name"}</h3>
                                <p className="text-gray-500 text-xs mb-1">{data?.patient_details?.name}</p>
                            </div>


                            <div className="flex flex-col md:ml-4 text-center">
                                <h3 className="font-semibold text-xs mb-1">{"Gender"}</h3>
                                <p className="text-gray-500 text-xs mb-1">{data?.patient_details?.gender}</p>
                            </div>

                            <div className="flex flex-col md:ml-4 text-center">
                                <h3 className="font-semibold text-xs mb-1">{"DOB"}</h3>
                                <p className="text-gray-500 text-xs mb-1">{data?.patient_details?.dob?.split("T")[0]}</p>
                            </div>

                            <div className="flex flex-col md:ml-4 text-center">
                                <h3 className="font-semibold text-xs mb-1">{"Aadhar"}</h3>
                                <p className="text-gray-500 text-xs mb-1">{data?.patient_details?.aadhar}</p>
                            </div>

                            <div className="flex flex-col md:ml-4 md:mb-0 mb-2 text-center mr-2">
                                <h3 className="font-semibold text-xs mb-1">{"Email"}</h3>
                                <p className="text-gray-500 text-xs mb-1">{data?.patient_details?.contact?.email}</p>
                            </div>


                            <div className="flex flex-col items-center md:mb-0 mb-2 md:ml-4">
                                <button
                                    className="bg-blue-500 hover:bg-blue-600 text-white text-xs py-2 px-4 rounded-md md:w-auto"
                                    onClick={() => {
                                        navigate(`/dashboard/patient_info/${data.id}`);
                                    }}
                                >
                                    View details
                                </button>
                            </div>
                        </>
                    ))
                }
            </div>
            {modalOpen && (
                <dialog id="my_modal_3" className="modal" open>
                    <div className="modal-box">

                        <form method="dialog">
                            <button onClick={() => { setModalOpen(false) }} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                        </form>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Add Patient
                        </h3>
                        <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 dark:text-gray-400  mt-5 md:mt-10 mb-3 md:mb-5">
                            <li className="me-2">
                                <a href="#"
                                    className={`inline-block px-4 py-3 rounded-lg text-white bg-blue-600`}

                                >
                                    Add with aadhar
                                </a>
                            </li>
                        </ul>
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
                                className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mt-5"
                            >
                                Search
                            </button>
                        </>
                    </div >
                </dialog >
            )}
        </>
    );
};
