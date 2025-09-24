import { Fragment, useContext, useEffect, useState } from 'react'
import { SosList } from "./SosList";
import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { AppContext } from '../../AppContext';
export const Sos = () => {
    const { setDoctorsList, setDistance, distance, lat, setLat, long, setLong, setMethod, setStart, rows, setRows } = useContext(AppContext);
    const [activeTab, setActiveTab] = useState('Tab 1');

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };
    function classNames(...classes) {
        return classes.filter(Boolean).join(' ')
    }

    const handleClick = () => {
        setStart(true);
    }
    useEffect(() => {
        setStart(false);
    }, [])

    return (
        <>
            <div class="bg-white p-4 rounded-md shadow-sm h-70 w-60 flex flex-col items-center justify-between mb-10 mx-auto relative">
                <ul className="flex flex-wrap text-xs font-medium text-center text-gray-200 flex flex-col items-center dark:text-gray-400  mt-5 md:mt-10">
                    <li className="me-2">
                        <a href="#"
                            className={`inline-block px-4 py-3 rounded-lg ${activeTab === 'Tab 1' ? 'text-white bg-blue-600' : 'hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white'}`}
                            onClick={() => handleTabClick('Tab 1')}
                            aria-current={activeTab === 'Tab 1' ? 'page' : undefined}
                        >
                            Search manually
                        </a>
                    </li>
                    <li className="me-2">
                        <a href="#"
                            className={`inline-block px-4 py-3 rounded-lg ${activeTab === 'Tab 2' ? 'text-white bg-blue-600' : 'hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white'}`}
                            onClick={() => handleTabClick('Tab 2')}
                            aria-current={activeTab === 'Tab 2' ? 'page' : undefined}
                        >
                            Search automatically
                        </a>
                    </li>
                </ul>

                <div className="py-4">
                    {activeTab === 'Tab 2' && (
                        <>
                            <label for="small" class="block text-sm font-medium text-gray-900 dark:text-white mb-1">Select distance</label>
                            <select id="small" value={distance} onChange={(e) => { setDistance(e.target.value) }} class="block w-full px-3 py-2 mb-6 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                <option selected value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={15}>15</option>
                                <option value={20}>20</option>
                                <option value={25}>25</option>
                            </select>
                            <button type="button" onClick={() => { setMethod("method-1"); handleClick(); }} class="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2">
                                Search hospitals
                            </button>
                        </>
                    )}

                    {activeTab === 'Tab 1' && (

                        <div className="flex flex-col items-center">
                            <input type="text" placeholder={"latitude"} value={lat} onChange={(e) => { setLat(e.target.value) }} class="block w-full px-3 py-2 mb-6 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                            <input type="text" placeholder={"longitude"} value={long} onChange={(e) => { setLong(e.target.value) }} class="block w-full px-3 py-2 mb-6 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                            <select id="small" value={distance} onChange={(e) => { setDistance(e.target.value) }} class="block w-full px-3 py-2 mb-6 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                <option selected value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={15}>15</option>
                                <option value={20}>20</option>
                                <option value={25}>25</option>
                            </select>
                            <button type="button" onClick={() => { setMethod("method-2"); handleClick(); }} class="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2">
                                Search hospitals
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <div className="bg-white p-4 grid grid-cols-5 rounded-md shadow-sm">
                <div className='col-span-3'>
                    <p className="font-semibold text-md m-2 gaps-6">Nearby hospitals list</p>
                </div>
                <div className='col-span-2' style={{ display: 'flex' }}>
                    <label htmlFor="small" className="flex text-sm font-medium text-gray-900 dark:text-white mb-1 px-2 py-2" style={{ display: 'inline' }}>Rows</label>

                    <select
                        id="small"
                        value={rows}
                        onChange={(e) => { setRows(e.target.value) }}
                        className="flex w-full px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" style={{ display: 'inline' }} >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={15}>15</option>
                        <option value={20}>20</option>
                        <option value={25}>25</option>
                    </select>
                </div>
                <div className='col-span-5 mt-5'>
                    <SosList />
                </div>
            </div >

        </>
    );
};
