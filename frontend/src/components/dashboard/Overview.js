import React from "react";
import { FaRegClock } from "react-icons/fa6";
import DonutChart from "./graphs/DonutChart";
import AreaChart from "./graphs/AreaChart";
import PieChart from "./graphs/PieChart"
import Doctors from "./Doctors";
import '../register/Register.css'
import Appointments from "./Appointments";

const Overview = () => {
  return (
    <div class="grid grid-cols-4 gap-4">
      <div class="col-span-4 overflow-hidden ">
        <div class="bg-white p-4 rounded-md shadow-sm h-14 flex items-center justify-between">
          <div>
            <p className="font-semibold text-sm">Welcome John,</p>
            <p className="text-[10px] text-slate-500">
              How are you feeling today ?
            </p>
          </div>
          <p className="flex text-[10px] items-center gap-2 text-sm font-semibold text-slate-700">
            Appointment History <FaRegClock />{" "}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-3 col-span-4 sm:col-span-3 gap-3">
        <div class="col-span-3 sm:col-span-1 overflow-hidden">
          <div class="bg-white p-4 rounded-md shadow-sm h-40">
            <DonutChart />
          </div>
        </div>
        <div class="col-span-3 sm:col-span-1 overflow-hidden">
          <div class="bg-white p-4 rounded-md shadow-sm h-40">
            <AreaChart />
          </div>
        </div>
        <div class="col-span-3 sm:col-span-1 overflow-hidden">
          <div class="bg-white p-4 rounded-md shadow-sm h-40">
            <PieChart />
          </div>
        </div>
        <div class="col-span-3 overflow-x-auto">
          <div class="bg-white p-4 rounded-md shadow-sm h-[43vh] overflow-scroll no-scrollbar">
            <Doctors />
          </div>
        </div>
      </div>
      <div class="col-span-4 sm:col-span-1 overflow-scroll no-scrollbar">
        <div class="bg-white p-4 rounded-md shadow-sm h-[70vh] overflow-scroll no-scrollbar relative">
          <h1 className="absolute top-3 left-4 text-xs font-semibold text-slate-600">
            Appointments
          </h1>
          <Appointments />
        </div>
      </div>
    </div>
  );
};

export default Overview;
