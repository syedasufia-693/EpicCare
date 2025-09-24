
import React, { useState, useContext } from "react";
import Doctor from "./Doctor";
import { FaUserDoctor } from "react-icons/fa6";
import axios from 'axios';
import { AppContext } from "../../AppContext";
const Doctors = () => {
  const [open, setOpen] = useState(false);
  const [doctorUID, setDoctorUID] = useState();
  const [valid, setValid] = useState(true);
  const { hospitalData, setHospitalData, baseBackendRoute, cookies } = useContext(AppContext);

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
  const handleSubmit = async () => {
    setValid(false);
    if (doctorUID) {
      await axios.post(`${baseBackendRoute}/api/hospital/control/add-doctor/${hospitalData?._id}`, {
        'doctor_UID': doctorUID
      })
        .then((res) => {
          console.log(res);
          setDoctorUID('');
          setOpen(false);
          handleGetInformation();
        })
        .catch((err) => {
          console.log(err);
        })
    }
  }
  return (
    <>
      <div className="relative w-full md:w-auto">
        <div className="flex justify-between">
          <div className="text-gray-600 font-semibold">Doctors</div>
          <div className="top-0 right-0 ">
            <button
              onClick={() => { setValid(true); setOpen(true); }}
              type="button"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              <FaUserDoctor className="w-3.5 h-3.5 me-2" />
              Add doctor
            </button>
          </div>
        </div>
        <div className="mt-4">
          <Doctor />
        </div>
      </div>

      {
        open ?
          <>
            <div
              id="default-modal"
              className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none"
            >
              <div className="relative w-full max-w-lg p-6 mx-auto bg-white rounded-lg shadow-lg md:max-w-xl lg:max-w-2xl">
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">Add doctor</h3>
                    <hr />
                    <button
                      onClick={() => { setOpen(false) }}
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
                        htmlFor="doctor_UID"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        doctor_UID
                      </label>
                      <input
                        type="text"
                        name="doctor_UID"
                        id="doctor_UID"
                        placeholder="doctor_UID"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                        value={doctorUID}
                        onChange={(e) => { setDoctorUID(e.target.value) }}
                      />
                      {
                        (doctorUID || valid) ?
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
                  <div className="flex justify-end mt-4">
                    <button
                      onClick={() => { setOpen(false) }}
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

          </>
          :
          <></>
      }
    </>
  )
};

export default Doctors;
