import Slider from "react-slick";
import { useState } from "react";
import { FaEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { useContext } from "react";
import { AppContext } from "../../AppContext";
import { useEffect } from "react";
import axios from 'axios';

export const PrecautionsDisplay = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [date, setDate] = useState();
    const [doctor, setDoctor] = useState();
    const [diagnosisImage, setDiagnosisImage] = useState();
    const [medication, setMedication] = useState();
    const [dosage, setDosage] = useState();
    const [frequency, setFrequency] = useState();
    const [editName, setEditName] = useState("");
    const [editId, setEditId] = useState("");
    const [editImage, setEditImage] = useState();
    const [notes, setNotes] = useState();
    const [valid, setValid] = useState(true);
    const [openEdit, setOpenEdit] = useState(false);
    const { baseBackendRoute } = useContext(AppContext);

    const { userMedicalData, userData, setUserData, setUserMedicalData, cookies, setSuccess } = useContext(AppContext);

    const handleEditSubmit = async () => {
        setOpenEdit(false);
        setValid(false);
        if (diagnosisImage) {
            const formData = new FormData();
            formData.append("date", date);
            formData.append("doctor", doctor);
            formData.append("diagnosis_reports_images", diagnosisImage);
            formData.append("medication", medication);
            formData.append("dosage", dosage);
            formData.append("frequency", frequency);
            formData.append("notes", notes);
            await axios.patch(`${baseBackendRoute}/api/medical_records/sub_ele_edit/prescriptions/${userData?._id}/?attribute=${editName}&id=${editId}`, formData, {
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
        else {
            await axios.patch(`${baseBackendRoute}/api/medical_records/sub_ele_edit/prescriptions/${userData?._id}/?attribute=${editName}&id=${editId}`, {
                'date': date,
                'medication': medication,
                'doctor': doctor,
                'dosage': dosage,
                'frequency': frequency,
                'notes': notes,
                'diagnosis_reports_images': editImage
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
    const handleSubmit = async () => {
        setOpenEdit(false);
        setValid(false);
        if (date && doctor && dosage && diagnosisImage && frequency && notes && medication) {
            const formData = new FormData();
            formData.append("date", date);
            formData.append("doctor", doctor);
            formData.append("diagnosis_reports_images", diagnosisImage);
            formData.append("medication", medication);
            formData.append("dosage", dosage);
            formData.append("frequency", frequency);
            formData.append("notes", notes);
            await axios.put(`${baseBackendRoute}/api/medical_records/records/prescription/${userData?._id}`, formData, {
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

    const handlePrescriptionEdit = async (e) => {
        console.log(e.currentTarget.dataset.name);
        console.log(e.currentTarget.dataset.id);
        setEditName(e.currentTarget.dataset.name);
        setEditId(e.currentTarget.dataset.id);
        await axios.get(`${baseBackendRoute}/api/medical_records/records/element/fetch/${userData?._id}/?attribute=${e.currentTarget.dataset.name}&id=${e.currentTarget.dataset.id}`, {
            headers: {
                Authorization: cookies.token
            }
        })
            .then((res) => {
                console.log(res);
                setIsModalOpen(true);
                setOpenEdit(true);
                setDate(new Date(res.data.data[0].date)?.toISOString().split('T')[0]);
                setEditImage(res.data.data[0].diagnosis_reports_images);
                setDoctor(res.data.data[0].doctor);
                setDosage(res.data.data[0].dosage);
                setNotes(res.data.data[0].notes);
                setFrequency(res.data.data[0].frequency);
                setMedication(res.data.data[0].medication);
            })
            .catch((err) => {
                console.log(err);
            })
    }


    const handlePrescriptionDelete = async (e) => {
        console.log(e.currentTarget.dataset.name);
        console.log(e.currentTarget.dataset.id);
        await axios.delete(`${baseBackendRoute}/api/medical_records/delete/${userData?._id}/?attribute=${e.currentTarget.dataset.name}&id=${e.currentTarget.dataset.id}`, {
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

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
        setDate("");
        setDiagnosisImage();
        setDoctor("");
        setDosage("");
        setNotes("");
        setFrequency("");
        setMedication("");
        setValid(true);
    };

    var settings = {
        infinite: false,
        speed: 500,
        arrows: true,
        slidesToShow: 1,
        slidesToScroll: 1
    };

    const getMedicalData = async () => {

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


    useEffect(() => {

        getMedicalData();
        console.log(userMedicalData);
    }, [])

    return (
        <>
            {
                userMedicalData?.medical_records?.prescriptions?.length === 0 ?
                    <>
                        <div className="bg-white shadow-md md:w-full md:h-full w-full h-full col-span-1 rounded-box p-3 ">
                            <h3 className="text-md font-medium text-black dark:text-white text-center font-bold">No information regarding Prescriptions yet!</h3>
                        </div>
                    </>
                    :
                    <Slider {...settings}>
                        {
                            userMedicalData?.medical_records?.prescriptions?.map((data, index) => (
                                <div className="bg-white shadow-md md:w-full md:h-full w-full h-full col-span-1 rounded-box p-3 ">
                                    <span style={{ justifyContent: 'space-between' }} className="flex  items-center text-md text-black font-bold dark:text-white">
                                        Date: {data.date.split("T")[0]}
                                        <button type="button" data-name="prescriptions" data-id={data._id} onClick={handlePrescriptionEdit} className="text-blue-700 border border-blue-700 hover:bg-blue-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center me-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:focus:ring-blue-800">
                                            <FaEdit className="text-md md:text-lg" />
                                        </button>
                                        <button type="button" data-name="prescriptions" data-id={data._id} onClick={handlePrescriptionDelete} className="text-red-700 border border-red-700 hover:bg-red-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center me-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:focus:ring-red-800">
                                            <MdDeleteOutline className="text-md md:text-lg" />
                                        </button>
                                    </span>
                                    <p className="text-md font-medium text-black dark:text-white">Doctor: {data.doctor}</p>
                                    <p className="text-md font-medium text-black dark:text-white">Diagnosis Images: </p>
                                    <div className="mt-5 md:w-full md:h-60 md:mt-5">
                                        <img src={`https://drive.google.com/thumbnail?id=${data?.diagnosis_reports_images?.id}`} alt="diag-rep-1" className="md:w-70 md:h-60 w-full h-full" />
                                    </div>
                                    <p className="text-md font-medium text-black dark:text-white m-2">Medication: {data?.medication}</p>
                                    <p className="text-md font-medium text-black dark:text-white m-2">Dosage: {data?.dosage}</p>
                                    <p className="text-md font-medium text-black dark:text-white m-2">Frequency: {data?.frequency}</p>
                                    <p className="text-md font-medium text-black dark:text-white m-2">Notes: {data?.notes}</p>
                                </div>
                            ))
                        }
                    </Slider>
            }

            <div className="flex justify-center">
                <button
                    onClick={() => { toggleModal(); setOpenEdit(false) }}
                    className="block m-4 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    type="button"
                >
                    Add new Prescription
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
                                {
                                    openEdit ?
                                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                            Update Prescription
                                        </h3>
                                        :
                                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                            Add Prescription
                                        </h3>
                                }
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
                                            htmlFor="date"
                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                        >
                                            Date
                                        </label>
                                        <input
                                            type="date"
                                            name="date"
                                            id="date"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                            placeholder="dd-mm-yyyy"
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


                                    {
                                        cookies.type === 'Doctor' ?
                                            <></>
                                            :
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
                                                    placeholder="Dr. John Doe"
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
                                        {
                                            openEdit ?
                                                <>
                                                    <label
                                                        htmlFor="diagnosisImages"
                                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                    >
                                                        Diagnosis Image
                                                    </label>
                                                    <img src={`https://drive.google.com/thumbnail?id=${editImage?.id}`} alt="diag-rep-1" className="md:w-70 md:h-60 w-full h-full" />

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
                                            htmlFor="medication"
                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                        >
                                            Medication
                                        </label>
                                        <input
                                            type="text"
                                            name="medication"
                                            id="medication"
                                            placeholder="Ibuprofen"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                            value={medication}
                                            onChange={(e) => { setMedication(e.target.value) }}
                                        />
                                        {
                                            (medication || valid) ?
                                                <></>
                                                :
                                                <p style={{ color: 'red' }} className="text-md font-medium text-red dark:text-white m-2">The field can't be left empty</p>
                                        }
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="dosage"
                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                        >
                                            Dosage
                                        </label>
                                        <input
                                            type="text"
                                            name="dosage"
                                            id="dosage"
                                            placeholder="400 mg"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                            value={dosage}
                                            onChange={(e) => { setDosage(e.target.value) }}
                                        />
                                        {
                                            (dosage || valid) ?
                                                <></>
                                                :
                                                <p style={{ color: 'red' }} className="text-md font-medium text-red dark:text-white m-2">The field can't be left empty</p>
                                        }
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="frequency"
                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                        >
                                            Frequency
                                        </label>
                                        <input
                                            type="text"
                                            name="frequency"
                                            id="frequency"
                                            placeholder="Every 6 hours"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                            value={frequency}
                                            onChange={(e) => { setFrequency(e.target.value) }}
                                        />
                                        {
                                            (frequency || valid) ?
                                                <></>
                                                :
                                                <p style={{ color: 'red' }} className="text-md font-medium text-red dark:text-white m-2">The field can't be left empty</p>
                                        }
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="notes"
                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                        >
                                            Notes
                                        </label>
                                        <textarea
                                            name="notes"
                                            id="notes"
                                            rows={3}
                                            placeholder="Additional notes..."
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                            value={notes}
                                            onChange={(e) => { setNotes(e.target.value) }}
                                        />
                                        {
                                            (notes || valid) ?
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
    );
};
