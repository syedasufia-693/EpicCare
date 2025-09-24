import React from "react";
import { FaEllipsisV } from "react-icons/fa";

const AppointmentItem = ({ name, date, status, imageUrl }) => {
  return (
    <div className="flex items-center py-3 px-1 rounded-lg  bg-gray-100 hover:bg-gray-200 space-x-4 w-full">
      <img src={imageUrl} alt={name} className="w-8 rounded-full" />
      <div className="flex-grow">
        <div className="text-xs font-semibold">{name}</div>
        <div className="text-xs text-blue-600">{status}</div>
      </div>
      <div className="flex">
        <div className="text-[10px] text-gray-500 mt-5">{date}</div>
        <FaEllipsisV className="text-gray-500 -mt-1 hover:text-gray-800 cursor-pointer" size={12} />
      </div>
    </div>
  );
};

export default AppointmentItem;
