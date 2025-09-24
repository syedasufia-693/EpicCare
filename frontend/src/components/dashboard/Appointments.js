import React from 'react'
import '../register/Register.css'
import AppointmentItem from './Appoint';

const Appointments = () => {
  const data = [
    {
      img: "https://crowdytheme.com/html/info/info-demo/assets/imgs/doctor/2.png",
      name: "Abishek Sharma",
      specialization: "Neurologist",
      status: "Emergency",
      date: "Tue, Oct 31",
    },
    {
      img: "https://www.freepnglogos.com/uploads/doctor-png/doctor-bulk-billing-doctors-chapel-hill-health-care-medical-3.png",
      name: "Alex Welmon",
      specialization: "Neurologist",
      status: "Examination",
      date: "Tue, Oct 31",
    },
    {
      img: "https://crowdytheme.com/html/info/info-demo/assets/imgs/doctor/2.png",
      name: "Abishek Sharma",
      specialization: "Neurologist",
      status: "Emergency",
      date: "Tue, Oct 31",
    },
    {
      img: "https://www.freepnglogos.com/uploads/doctor-png/doctor-bulk-billing-doctors-chapel-hill-health-care-medical-3.png",
      name: "Alex Welmon",
      specialization: "Neurologist",
      status: "Examination",
      date: "Tue, Oct 31",
    },
    {
      img: "https://crowdytheme.com/html/info/info-demo/assets/imgs/doctor/2.png",
      name: "Abishek Sharma",
      specialization: "Neurologist",
      status: "Routine Checkup",
      date: "Tue, Oct 31",
    },
    {
      img: "https://crowdytheme.com/html/info/info-demo/assets/imgs/doctor/2.png",
      name: "Abishek Sharma",
      specialization: "Neurologist",
      status: "Routine Checkup",
      date: "Tue, Oct 31",
    },
    {
      img: "https://www.freepnglogos.com/uploads/doctor-png/doctor-bulk-billing-doctors-chapel-hill-health-care-medical-3.png",
      name: "Alex Welmon",
      specialization: "Neurologist",
      status: "Consultation",
      date: "Tue, Oct 31",
    },
  ];
  return (
    <div className="relative">
      <div className='mt-5 flex flex-col gap-2'>
        {data.map((e, i) => (
          <AppointmentItem
            date={e.date}
            imageUrl={e.img}
            name={e.name}
            status={e.status}
            key={i}
          />
        ))}
      </div>
    </div>
  );
}

export default Appointments