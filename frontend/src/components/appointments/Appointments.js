import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { BsSearch } from "react-icons/bs";
import { IoClose } from "react-icons/io5";
import { AppContext } from '../../AppContext';
import { useNavigate } from 'react-router-dom';
const Appointments = () => {

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [closeRecommend, setCloseRecommend] = useState(false);
  const [showRecommend, setShowRecommend] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [doctorList, setDoctorList] = useState();
  const [hospitalList, setHospitalList] = useState();
  const navigate = useNavigate();
  const { baseBackendRoute } = useContext(AppContext);
  const [doctorRecommendedList, setDoctorRecommendedList] = useState();


  const handleSearch = (e) => {
    setSearch(e.currentTarget.value);
    const value = e.currentTarget.value;
    if (value !== '') {
      setCloseRecommend(false)
      handleAllDoctor(value);
    }

  }

  const handleListClick = (e) => {
    setSearch(e.currentTarget.textContent);
    setCloseRecommend(true);
  }

  const handleClick = () => {
    if (search.length > 3) {
      setCloseRecommend(false);
    }
  };
  const handleCloseButton = () => {
    setSearch('');
    setCloseRecommend(true);
  }

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleAllDoctor = async (searchItem) => {

    if (searchItem !== '') {
      await axios.get(`${baseBackendRoute}/api/doctor/get-all-doctors`)
        .then(async (res) => {
          console.log(res);
          // setDoctorList(res.data.data);
          const drList = await res?.data?.data?.filter((item) => {
            console.log(item.doctor_name?.toLowerCase().startsWith('s'));
            if (item.doctor_name?.toLowerCase().startsWith(searchItem?.toLowerCase())) {
              return item;
            }
          })
          console.log(drList);
          setDoctorList(drList);
        })
        .then(async () => {
          await axios.get(`${baseBackendRoute}/api/hospital/control/get-all-hospitals`)
            .then(async (res) => {
              console.log(res);
              // setHospitalList(res.data.data);
              const hospList = await res?.data?.data?.filter((item) => {
                // console.log(item.hospital_name?.toLowerCase()?.startsWith('o'));
                if (item.hospital_name?.toLowerCase()?.startsWith(searchItem?.toLowerCase())) {
                  // console.log(item);
                  return item;
                }
              })
              // console.log(hospList);
              setHospitalList(hospList);

            })
            .catch((err) => {
              console.log(err);
            })
        })
        .catch((err) => {
          console.log(err);
        })
    }
  }

  useEffect(() => {
    handleAllDoctor();
  }, [])



  return (
    <>
      <div className="flex align-items-center justify-content-center">
        <div className="m-5 md:m-10 w-full">
          <label htmlFor="text" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Search Hospital / Doctor</label>
          <div class="relative">
            <div class="absolute inset-y-0 start-0 flex items-center ps-5 pointer-events-none">
              <BsSearch />
            </div>
            <input
              type="text"
              id="text"
              value={search}
              onChange={handleSearch}
              className={`block p-6 ps-14 bg-gray-50 mb-0 border ${isClicked ? 'border-black' : 'border-gray-300'} text-gray-900 text-xs md:text-sm rounded-lg focus:ring-blue-500 focus:border-white block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-white dark:focus:border-white rounded-[25px] height-[200px]`}
              onClick={handleClick}
              placeholder={search.length === 0 ? 'Search Doctors / Hospitals' : ''}
              style={{ WebkitBoxShadow: '0 0 0 1000px white inset', borderRadius: '25px' }}
            />
            {
              search.length > 0 ?
                <div class="absolute inset-y-0 end-10 flex items-center" style={{ cursor: 'pointer' }}>
                  <IoClose onClick={handleCloseButton} />
                </div>
                :
                <></>
            }
          </div>

          {
            search.length > 0 ?

              <div className={` ${closeRecommend ? "hidden" : ""} bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 p-10 rounded-tr-none rounded-tl-sm ml-2 mr-2 left-[30px] right-[28px] top-[178px] md:left-[250px] md:right-[48px] md:top-[200px] absolute`} style={{ WebkitBoxShadow: '0 0 0 1000px white inset', borderBottomLeftRadius: '25px', borderTop: 0, borderBottomRightRadius: '25px', borderRightWidth: '2px', borderRightStyle: 'solid', borderRightColor: 'black', borderLeftWidth: '2px', borderLeftStyle: 'solid', borderLeftColor: 'black', borderBottomWidth: '2px', borderBottomStyle: 'solid', borderBottomColor: 'black' }}>
                <hr className='m-4 mt-2 mb-2' style={{ borderWidth: '2px', borderStyle: 'solid' }} />
                {
                  <>
                    <h3 class="mb-2 text-lg font-semibold text-gray-900 dark:text-white p-2 pl-5">Doctors List</h3>
                    <ul class="text-gray-500 list-none list-inside dark:text-gray-400 p-4 w-full">
                      {
                        doctorList?.map((data, index) => (
                          <li onClick={handleListClick} className='hover:rounded-lg bg-white hover:bg-sky-300 hover:text-black pl-5 pt-2' style={{ cursor: 'pointer' }}>
                            {data.doctor_name}
                            <hr className='mt-3 mb-2' />
                          </li>
                        ))
                      }
                    </ul>


                    <h3 class="mb-2 text-lg font-semibold text-gray-900 dark:text-white p-2 pl-5">Hospitals List</h3>
                    <ul class="text-gray-500 list-none list-inside dark:text-gray-400 p-4 w-full">
                      {
                        hospitalList?.map((data, index) => (
                          <li onClick={handleListClick} className='hover:rounded-lg bg-white hover:bg-sky-300 hover:text-black pl-5 pt-2' style={{ cursor: 'pointer' }}>
                            {data.hospital_name}
                            <hr className='mt-3 mb-2' />
                          </li>
                        ))
                      }
                    </ul>
                  </>
                }

              </div>
              :
              <></>
          }
          <div className='flex items-center justify-center v-screen pt-20'>
            <button type="button" onClick={() => { navigate('/dashboard/hospital_doctors_list') }} className="px-6 py-3.5 text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 shadow-lg shadow-cyan-500/50 dark:shadow-lg dark:shadow-cyan-800/80 font-medium rounded-lg text-sm">Search</button>
          </div>
        </div>
      </div>

    </>
  )
}

export default Appointments