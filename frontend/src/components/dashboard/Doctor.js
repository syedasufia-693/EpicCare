
import React, { useContext, useEffect } from "react";
import { MdOutlineMarkChatUnread } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../AppContext";
import axios from 'axios';
const Doctor = () => {
  const navigate = useNavigate();
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
  useEffect(() => {
    handleGetInformation();
  }, [])
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {
          hospitalData?.doctor_list?.map((data, index) => (
            <div
              key={index}
              className="flex flex-col space-y-2 items-center bg-white shadow-md rounded-md px-4 py-3 hover:shadow-lg"
            >
              <div className="flex items-center justify-center mb-2">
                <img
                  src={`https://drive.google.com/thumbnail?id=${data?.profile_img?.id}`}
                  alt="Doctor Avatar"
                  className="rounded-full w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 object-cover"
                />
              </div>
              <h3 className="text-lg font-semibold text-center md:text-left">{data.doctor_name}</h3>
              {
                data?.specialization?.map((tpData, ind) => (
                  <p className="text-gray-500 text-xs text-center md:text-left">{tpData}</p>
                ))
              }
            </div>
          ))}
      </div>
    </>
  );
};

export default Doctor;
