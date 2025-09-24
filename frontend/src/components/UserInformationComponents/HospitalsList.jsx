import { useContext } from "react"
import { AppContext } from "../../AppContext"
import { useEffect } from "react";

export const HospitalList = () => {
    const { userData } = useContext(AppContext);
    useEffect(() => {
        console.log(userData);
    }, [])
    return (
        <>
            {
                userData?.patient_visited_hospitals_list?.length === 0 ?
                    <>
                        <div className="bg-white rounded-box m-4">
                            <h3 className="text-black text-md p-4 font-bold text-center">
                                No information of Hospital visit yet!
                            </h3>
                        </div>
                    </>
                    :
                    userData?.patient_visited_hospitals_list?.map((data, index) => (
                        <div className="bg-white rounded-box m-4">
                            <p className="text-black text-md p-4 font-bold">Hospital: {data.name}</p>
                            <p className="text-black text-md p-4 font-bold">Date: {data.date.split("T")[0]}</p>
                        </div>
                    ))
            }

        </>
    )
}