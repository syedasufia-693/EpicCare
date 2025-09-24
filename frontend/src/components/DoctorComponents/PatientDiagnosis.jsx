import Slider from "react-slick"
import { FaEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { useState } from "react";
import { useContext } from "react";
import { AppContext } from "../../AppContext";
import { useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
export const PatientDiagnosis = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [centerName, setCenterName] = useState("");
    const [diagnosisImage, setDiagnosisImage] = useState();
    const [reportRes, setReportRes] = useState("");
    const [valid, setValid] = useState(true);
    const [openEdit, setOpenEdit] = useState(false);
    const [editImage, setEditImage] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [editName, setEditName] = useState("");
    const [editId, setEditId] = useState("");
    const { id } = useParams();
    const { userMedicalData, baseBackendRoute, setSuccess, setUserData, setUserMedicalData, userData, cookies } = useContext(AppContext);

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
        setValid(true);
        setOpenEdit(false);
        setCenterName("");
        setReportRes("");
    };

    const handleEditSubmit = async () => {
        setOpenEdit(false);
        setValid(false);
        if (diagnosisImage) {
            const formData = new FormData();
            formData.append("hospital_or_diagnosis_center_name", centerName);
            formData.append("report_result", reportRes);
            formData.append("diagnosis_reports_image", diagnosisImage);
            await axios.patch(`${baseBackendRoute}/api/medical_records/sub_ele_edit/diagnosis/${userData?._id}/?attribute=${editName}&id=${editId}`, formData, {
                headers: {
                    Authorization: cookies.token
                }
            })
                .then((res) => {
                    console.log(res);
                    getMedicalData();
                    setSuccess(true);
                    toggleModal();
                })
                .catch((err) => {
                    console.log(err);
                })

        }
        else {
            await axios.patch(`${baseBackendRoute}/api/medical_records/sub_ele_edit/prescriptions/${userData?._id}/?attribute=${editName}&id=${editId}`, {
                'hospital_or_diagnosis_center_name': centerName,
                'report_result': reportRes,
                'diagnosis_reports_image': editImage
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
    }

    const handleDiagnosisEdit = async (e) => {
        console.log(e.currentTarget.dataset.name);
        console.log(e.currentTarget.dataset.id);
        setEditName(e.currentTarget.dataset.name)
        setEditId(e.currentTarget.dataset.id)
        await axios.get(`${baseBackendRoute}/api/medical_records/records/element/fetch/${userData?._id}/?attribute=${e.currentTarget.dataset.name}&id=${e.currentTarget.dataset.id}`, {
            headers: {
                Authorization: cookies.token
            }
        })
            .then((res) => {
                console.log(res);
                setIsModalOpen(true);
                setOpenEdit(true);
                setCenterName(res.data.data[0].hospital_or_diagnosis_center_name);
                setEditImage(res.data.data[0].diagnosis_reports_image?.id);
                setReportRes(res.data.data[0].report_result);
            })
            .catch((err) => {
                console.log(err);
            })
    }

    const handleSubmit = async () => {
        setValid(false);
        const formData = new FormData();
        formData.append("hospital_or_diagnosis_center_name", centerName);
        formData.append("diagnosis_reports_image", diagnosisImage);
        formData.append("report_result", reportRes);
        if (!centerName && !valid && !diagnosisImage && !reportRes) {
            setIsLoading(true);
        }
        await axios.put(`${baseBackendRoute}/api/medical_records/records/diagnosis/${userData?._id}`, formData, {
            headers: {
                Authorization: cookies.token
            }
        })
            .then((res) => {
                console.log(res);
                getMedicalData();
                toggleModal();
                setIsLoading(false);
                setSuccess(true);
            })
            .catch((err) => {
                console.log(err);
                setIsLoading(false);
            })
    }


    const handleDiagnosisDelete = async (e) => {
        console.log(e.target.dataset.name);
        console.log(e.target.dataset.id);
        await axios.delete(`${baseBackendRoute}/api/medical_records/delete/${userData?._id}/?attribute=${e.target.dataset.name}&id=${e.target.dataset.id}`, {
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


    var settings = {
        infinite: false,
        speed: 500,
        arrows: true,
        slidesToShow: 1,
        slidesToScroll: 1
    };

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


    useEffect(() => {
        console.log(userMedicalData);
        getMedicalData();
    }, [])
    return (
        <>
            {
                userMedicalData?.medical_records?.diagnosis?.length === 0 ?
                    <>


                        <div className="bg-white shadow-md md:w-full md:h-full w-full h-full col-span-1 rounded-box p-3 ">
                            <h3 className="text-md font-medium text-black dark:text-white text-center font-bold">No information regarding Diagnosis yet!</h3>
                        </div>
                    </>
                    :
                    <Slider {...settings}>
                        {
                            userMedicalData?.medical_records?.diagnosis?.map((data, index) => (

                                <div className="bg-white shadow-md md:w-full md:h-full w-full h-full col-span-1 rounded-box p-3">
                                    <span style={{ justifyContent: 'space-between' }} className="flex ml-2 items-center text-md text-black font-bold dark:text-white">
                                        Diagnostic center: {data?.hospital_or_diagnosis_center_name}
                                        <button type="button" data-name="diagnosis" data-id={data._id} onClick={handleDiagnosisEdit} class="text-blue-700 border border-blue-700 hover:bg-blue-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center me-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:focus:ring-blue-800 dark:hover:bg-blue-500">
                                            <FaEdit className="text-md md:text-lg" />
                                        </button>
                                        <button type="button" data-name="diagnosis" data-id={data._id} onClick={handleDiagnosisDelete} class="text-red-700 border border-red-700 hover:bg-red-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center me-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:focus:ring-red-800 dark:hover:bg-red-500">
                                            <MdDeleteOutline className="text-md md:text-lg" />
                                        </button>
                                    </span>
                                    <div className="mt-5 md:w-full md:h-60 md:mt-5">
                                        <img src={`https://drive.google.com/thumbnail?id=${data?.diagnosis_reports_image?.id}`} alt="diag-rep-3" className="md:w-70 md:h-60 w-full h-full" />
                                    </div>
                                    <p className="text-md font-medium text-black dark:text-white m-2">Report result: {data?.report_result}</p>
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
                    Add new Diagnosis Info
                </button>
            </div>
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
                                    Add Diagnosis
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
                                            htmlFor="Hospital/Diagnosis Name"
                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                        >
                                            Hospital/Diagnosis Name
                                        </label>
                                        <input
                                            type="text"
                                            name="Hospital/Diagnosis Name"
                                            id="Hospital/Diagnosis Name"
                                            placeholder="Viajaya diagnosis"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                            value={centerName}
                                            onChange={(e) => { setCenterName(e.target.value) }}
                                        />

                                        {
                                            (centerName || valid) ?
                                                <></>
                                                :
                                                <p style={{ color: 'red' }} className="text-md font-medium text-red dark:text-white m-2">The field can't be left empty</p>
                                        }
                                    </div>
                                    <div>
                                        {
                                            openEdit ?
                                                <>
                                                    <label
                                                        htmlFor="diagnosisImages"
                                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                    >
                                                        Diagnosis Image
                                                    </label>
                                                    <img src={`https://drive.google.com/thumbnail?id=${editImage}`} alt="diag-rep-1" className="md:w-70 md:h-60 w-full h-full" />

                                                    <input
                                                        type="file"
                                                        name="diagnosisImages"
                                                        id="diagnosisImages"
                                                        accept="image/*"
                                                        className="m-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                                        onChange={(e) => { setDiagnosisImage(e.target.files[0]) }}
                                                    />
                                                </>
                                                :
                                                <>
                                                    <label
                                                        htmlFor="diagnosisImages"
                                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                    >
                                                        Diagnosis Images
                                                    </label>
                                                    <input
                                                        type="file"
                                                        name="diagnosisImages"
                                                        id="diagnosisImages"
                                                        accept="image/*"
                                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                                        onChange={(e) => { setDiagnosisImage(e.target.files[0]) }}
                                                    />
                                                </>
                                        }
                                        {
                                            (diagnosisImage || valid) ?
                                                <></>
                                                :
                                                <p style={{ color: 'red' }} className="text-md font-medium text-red dark:text-white m-2">The field can't be left empty</p>
                                        }
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="diagnosis report result"
                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                        >
                                            Diagnosis Report Result
                                        </label>
                                        <textarea
                                            name="diagnosis report result"
                                            id="diagnosis report result"
                                            rows={3}
                                            placeholder="diagnosis report result..."
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                            value={reportRes}
                                            onChange={(e) => { setReportRes(e.target.value) }}
                                        />
                                        {
                                            (reportRes || valid) ?
                                                <></>
                                                :
                                                <p style={{ color: 'red' }} className="text-md font-medium text-red dark:text-white m-2">The field can't be left empty</p>
                                        }
                                    </div>
                                    {openEdit ?
                                        <button
                                            onClick={handleEditSubmit}
                                            type="submit"
                                            className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                        >
                                            Save Changes
                                        </button>
                                        :
                                        <button
                                            onClick={handleSubmit}
                                            type="submit"
                                            className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                        >
                                            Submit
                                        </button>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}



        </>
    )
}