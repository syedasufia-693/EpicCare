import { useContext } from "react"
import { AppContext } from "../../AppContext"

export const PatientDoctorsList = () => {
    const { userData } = useContext(AppContext);

    return (
        <>
            {
                userData?.patient_doctors_list?.length === 0 ?
                    <>
                        <div className="bg-white rounded-box m-4">
                            <h3 className="text-black text-md p-4 font-bold text-center">
                                No information of Doctors visit yet!
                            </h3>
                        </div>
                    </>
                    :
                    userData?.patient_doctors_list?.map((data, index) => (
                        <div className="bg-white rounded-box m-4">
                            <p className="text-black text-md p-4 font-bold">Doctor: {data.name}</p>
                            <p className="text-black text-md p-4 font-bold">Date: {data.date}</p>
                        </div>
                    ))
            }
        </>
    )
}