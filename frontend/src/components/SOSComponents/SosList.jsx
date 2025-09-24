import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../AppContext";
import axios from "axios";

export const SosList = () => {
    const { distance, start, rows, lat, long, method, setLat, setLong } = useContext(AppContext);
    const [hospitalsList, setHospitalsList] = useState([]);
    const [modalOpen, setModalOpen] = useState(false); // Define modalOpen state variable
    const [aadhar, setAadhar] = useState(''); // Define aadhar state variable
    const [valid, setValid] = useState(true);
    const [specificHospitalData, setSpecificHospitalData] = useState();

    useEffect(() => {
        const handleDoctorsList = async () => {
            if (method === "method-1") {
                console.log(distance);
                console.log(typeof (distance));
                console.log(start);
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(async (position) => {
                        const latitude = position.coords.latitude;
                        const longitude = position.coords.longitude;
                        console.log(latitude);
                        console.log(longitude);
                        const url = `https://api.geoapify.com/v2/places?categories=healthcare.hospital&filter=circle:${longitude},${latitude},5000&bias=proximity:${longitude},${latitude}&limit=${rows}&apiKey=84c373446dfe42929064813c0ddbf131`;

                        await axios
                            .get(url)
                            .then((response) => {
                                console.log(response.data);
                                setHospitalsList(response.data.features);
                            })
                            .catch((error) => {
                                console.error("Error:", error);
                            });
                    });
                } else {
                    console.error("Geolocation is not supported by this browser.");
                }
            }
            else {
                const url = `https://api.geoapify.com/v2/places?categories=healthcare.hospital&filter=circle:${long},${lat},5000&bias=proximity:${long},${lat}&limit=${rows}&apiKey=84c373446dfe42929064813c0ddbf131`;

                await axios
                    .get(url)
                    .then((response) => {
                        console.log(response.data);
                        setHospitalsList(response.data.features);
                        setLat('');
                        setLong('');
                    })
                    .catch((error) => {
                        console.error("Error:", error);
                    });
            }
        }
        handleDoctorsList();
    }, [distance, start, rows, method])

    const handleSearchInfo = async (e) => {
        const id = e.currentTarget.id;
        const data = await hospitalsList?.filter(item => String(id) === String(item.properties.place_id))
        console.log(data);
        setSpecificHospitalData(data[0].properties);
        setModalOpen(true);
    }

    const openModal = () => {
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    return (
        <>
            {start ?
                hospitalsList?.map((data, index) => (
                    data?.properties?.name ?
                        <>
                            <div className="py-3 px-1 rounded-lg bg-gray-100 hover:bg-gray-200 mb-4">
                                <div className="flex items-center space-x-4">
                                    <div className="flex-grow">
                                        <div className="text-xs font-semibold px-2 py-2">{data?.properties?.name}</div>
                                    </div>
                                    <div className="flex">
                                        <button type="button" id={data?.properties?.place_id} onClick={handleSearchInfo} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">View Details</button>
                                    </div>
                                </div>
                            </div>
                        </>
                        :
                        <></>
                ))
                :
                <></>
            }

            {modalOpen && (
                <dialog id="my_modal_3" className="modal" open>
                    <div className="modal-box">

                        <form method="dialog">
                            <button onClick={() => { setModalOpen(false) }} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                        </form>
                        <div className='p-5'>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Hospital Info</h3>
                            <p className="text-md font-medium text-black dark:text-white m-2">Hospital Name: {specificHospitalData?.address_line1}</p>
                            <p className="text-md font-medium text-black dark:text-white m-2">Hospital Address: {specificHospitalData?.address_line2}</p>
                        </div>
                        <button
                            onClick={() => { setModalOpen(false) }}
                            type="submit"
                            className="w-full text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800 mt-5"
                        >
                            Close
                        </button>
                    </div >
                </dialog >
            )}

        </>
    )
}
