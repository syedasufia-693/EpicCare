import Slider from "react-slick"
import { FaEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { useState } from "react";
import { useContext } from "react";
import { AppContext } from "../../AppContext";
import axios from "axios";
export const AllergiesDisplay = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [substance, setSubstance] = useState("");
    const [reaction, setReaction] = useState("");
    const [editName, setEditName] = useState("");
    const [editId, setEditId] = useState("");
    const [openEdit, setOpenEdit] = useState(false);
    const [valid, setValid] = useState(true);

    const { setSuccess, userMedicalData, baseBackendRoute, userData, cookies, setUserData, setUserMedicalData } = useContext(AppContext);

    const handleAllergiesEdit = async (e) => {
        console.log(e.currentTarget.dataset.name);
        console.log(e.currentTarget.dataset.id);
        setEditName(e.currentTarget.dataset.name);
        setEditId(e.currentTarget.dataset.id);
        await axios.get(`${baseBackendRoute}/api/medical_records/records/attributes/fetch/${userData?._id}/?attribute=${e.currentTarget.dataset.name}&id=${e.currentTarget.dataset.id}`, {
            headers: {
                Authorization: cookies.token
            }
        })
            .then((res) => {
                console.log(res);
                setIsModalOpen(true);
                setOpenEdit(true);
                setSubstance(res.data.data[0].substance);
                setReaction(res.data.data[0].reactions);
            })
            .catch((err) => {
                console.log(err);
            })
    }


    const handleEditSubmit = async () => {
        setValid(false);

        await axios.patch(`${baseBackendRoute}/api/medical_records/sub_ele_edit/attribute/${userData?._id}/?attribute=${editName}&id=${editId}`, {
            'substance': substance,
            'reactions': reaction,
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



    const handleAllergiesDelete = async (e) => {
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







    const handleSubmit = async () => {
        setValid(false);
        if (substance && reaction) {
            await axios.put(`${baseBackendRoute}/api/medical_records/records/${userData?._id}`, {
                'allergies': {
                    'substance': substance,
                    'reaction': reaction
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
        setSubstance("");
        setReaction("");
    };

    var settings = {
        infinite: false,
        speed: 500,
        arrows: true,
        slidesToShow: 1,
        slidesToScroll: 1
    };
    return (
        <>
            {
                userMedicalData?.allergies?.length === 0 ?
                    <>
                        <div className="bg-white shadow-md md:w-full md:h-full w-full h-full col-span-1 rounded-box p-3 ">
                            <h3 className="text-md font-medium text-black dark:text-white text-center font-bold">No information regarding Allergies yet!</h3>
                        </div>
                    </>
                    :
                    <Slider {...settings}>
                        {
                            userMedicalData?.allergies?.map((data, index) => (
                                <div className="bg-white shadow-md md:w-full md:h-full w-full h-full col-span-1 rounded-box p-3">
                                    <span style={{ justifyContent: 'space-between' }} className="flex ml-2  items-center text-md text-black font-bold dark:text-white">
                                        Substance: {data.substance}
                                        <button type="button" data-name="allergies" data-id={data._id} onClick={handleAllergiesEdit} class="text-blue-700 border border-blue-700 hover:bg-blue-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center me-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:focus:ring-blue-800 dark:hover:bg-blue-500">
                                            <FaEdit className="text-md md:text-lg" />
                                        </button>
                                        <button type="button" data-name="allergies" data-id={data._id} onClick={handleAllergiesDelete} class="text-red-700 border border-red-700 hover:bg-red-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center me-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:focus:ring-red-800 dark:hover:bg-red-500">
                                            <MdDeleteOutline className="text-md md:text-lg" />
                                        </button>
                                    </span>
                                    <p className="text-md font-medium text-black dark:text-white m-2">Reactions: {data.reactions}</p>
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
                    Add new Allergy Info
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
                                {
                                    openEdit ?
                                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                            Update Allergies Info
                                        </h3>
                                        :
                                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                            Add Allergies
                                        </h3>}
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
                                            htmlFor="Substance"
                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                        >
                                            Substance
                                        </label>
                                        <input
                                            type="text"
                                            name="Substance"
                                            id="Substance"
                                            placeholder="Substance"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                            value={substance}
                                            onChange={(e) => { setSubstance(e.target.value) }}
                                        />

                                        {
                                            (substance || valid) ?
                                                <></>
                                                :
                                                <p style={{ color: 'red' }} className="text-md font-medium text-red dark:text-white m-2">The field can't be left empty</p>
                                        }
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="Reaction"
                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                        >
                                            Reaction
                                        </label>
                                        <input
                                            type="text"
                                            name="Reaction"
                                            id="Reaction"
                                            placeholder="Reaction"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                            value={reaction}
                                            onChange={(e) => { setReaction(e.target.value) }}
                                        />
                                        {
                                            (reaction || valid) ?
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
                                            Update Allergies
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