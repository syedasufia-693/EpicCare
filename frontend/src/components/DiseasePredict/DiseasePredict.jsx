import { useEffect } from "react";
import { useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';
import { Fragment, useRef } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { useState } from "react";
import { useContext } from "react";
import { AppContext } from "../../AppContext";
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const inputStyle = { color: "black", WebkitBoxShadow: "0 0 0 1000px black inset", fontWeight: 'bold' };
const placeholderStyle = { fontWeight: 'bold', color: 'black' };
export const DiseasePredict = () => {
    const theme = useTheme();
    const { flaskBackendRoute } = useContext(AppContext);
    const [personName, setPersonName] = useState([]);
    const [loading, setLoading] = useState(false);
    const [disease, setDisease] = useState();
    const [open, setOpen] = useState(false)
    const [show, setShow] = useState(false);
    const anotherCancelButtonRef = useRef(null);
    const cancelButtonRef = useRef(null)

    const names = ["itching", "skin_rash", "nodal_skin_eruptions", "continuous_sneezing",
        "shivering", "chills", "joint_pain", "stomach_pain", "acidity",
        "ulcers_on_tongue", "muscle_wasting", "vomiting", "burning_micturition",
        "fatigue", "weight_gain", "anxiety", "cold_hands_and_feets", "mood_swings",
        "weight_loss", "restlessness", "lethargy", "patches_in_throat",
        "irregular_sugar_level", "cough", "high_fever", "sunken_eyes",
        "breathlessness", "sweating", "dehydration", "indigestion", "headache",
        "yellowish_skin", "dark_urine", "nausea", "loss_of_appetite",
        "pain_behind_the_eyes", "back_pain", "constipation", "abdominal_pain",
        "diarrhoea", "mild_fever", "yellow_urine", "yellowing_of_eyes",
        "acute_liver_failure", "fluid_overload", "swelling_of_stomach",
        "swelled_lymph_nodes", "malaise", "blurred_and_distorted_vision", "phlegm",
        "throat_irritation", "redness_of_eyes", "sinus_pressure", "runny_nose",
        "congestion", "chest_pain", "weakness_in_limbs", "fast_heart_rate",
        "pain_during_bowel_movements", "pain_in_anal_region", "bloody_stool",
        "irritation_in_anus", "neck_pain", "dizziness", "cramps", "bruising",
        "obesity", "swollen_legs", "swollen_blood_vessels", "puffy_face_and_eyes",
        "enlarged_thyroid", "brittle_nails", "swollen_extremeties",
        "excessive_hunger", "extra_marital_contacts", "drying_and_tingling_lips",
        "slurred_speech", "knee_pain", "hip_joint_pain", "muscle_weakness",
        "stiff_neck", "swelling_joints", "movement_stiffness", "spinning_movements",
        "loss_of_balance", "unsteadiness", "weakness_of_one_body_side",
        "loss_of_smell", "bladder_discomfort", "continuous_feel_of_urine",
        "passage_of_gases", "internal_itching", "toxic_look_(typhos)", "depression",
        "irritability", "muscle_pain", "altered_sensorium", "red_spots_over_body",
        "belly_pain", "abnormal_menstruation", "watering_from_eyes",
        "increased_appetite", "polyuria", "family_history", "mucoid_sputum",
        "rusty_sputum", "lack_of_concentration", "visual_disturbances",
        "receiving_blood_transfusion", "receiving_unsterile_injections", "coma",
        "stomach_bleeding", "distention_of_abdomen", "history_of_alcohol_consumption",
        "blood_in_sputum", "prominent_veins_on_calf", "palpitations",
        "painful_walking", "pus_filled_pimples", "blackheads", "scurring",
        "skin_peeling", "silver_like_dusting", "small_dents_in_nails",
        "inflammatory_nails", "blister", "red_sore_around_nose", "yellow_crust_ooze",
        "prognosis", "skin rash", "pus filled pimples", "mood swings", "weight loss",
        "fast heart rate", "excessive hunger", "muscle weakness",
        "abnormal menstruation", "muscle wasting", "patches in throat", "high fever",
        "extra marital contacts", "yellowish skin", "loss of appetite",
        "abdominal pain", "yellowing of eyes", "chest pain", "loss of balance",
        "lack of concentration", "blurred and distorted vision",
        "drying and tingling lips", "slurred speech", "stiff neck", "swelling joints",
        "painful walking", "dark urine", "yellow urine", "receiving blood transfusion",
        "receiving unsterile injections", "visual disturbances",
        "burning micturition", "bladder discomfort", "foul smell of urine",
        "continuous feel of urine", "irregular sugar level", "increased appetite",
        "joint pain", "skin peeling", "small dents in nails", "inflammatory nails",
        "swelling of stomach", "distention of abdomen", "history of alcohol consumption",
        "fluid overload", "pain during bowel movements", "pain in anal region",
        "bloody stool", "irritation in anus", "acute liver failure", "stomach bleeding",
        "back pain", "weakness in limbs", "neck pain", "mucoid sputum",
        "mild fever", "muscle pain", "family history", "continuous sneezing",
        "watering from eyes", "rusty sputum", "weight gain", "puffy face and eyes",
        "enlarged thyroid", "brittle nails", "swollen extremeties", "swollen legs",
        "prominent veins on calf", "stomach pain", "spinning movements", "sunken eyes",
        "silver like dusting", "swelled lymph nodes", "blood in sputum",
        "swollen blood vessels", "toxic look (typhos)", "belly pain",
        "throat irritation", "redness of eyes", "sinus pressure", "runny nose",
        "loss of smell", "passage of gases", "cold hands and feets",
        "weakness of one body side", "altered sensorium", "nodal skin eruptions",
        "red sore around nose", "yellow crust ooze", "ulcers on tongue",
        "spotting urination", "pain behind the eyes", "red spots over body",
        "internal itching",
    ];

    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        setPersonName(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    const handleSubmit = () => {
        // Simulate loading state
        console.log(personName);
        setLoading(true);
        axios.post(`${flaskBackendRoute}/disease-predict`, {
            'symptom_list': personName
        })
            .then((res) => {
                console.log(res);
                setLoading(false);
                setPersonName([]);
                setDisease(res.data);
            })
            .catch((err) => {
                console.log(err);
                setLoading(false);
                setPersonName([]);
            })
    };

    const selectHeight = Math.min(names.length * ITEM_HEIGHT + ITEM_PADDING_TOP, ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP);

    useEffect(() => {
        console.log(window.innerHeight);
        console.log(window.innerWidth);
    }, [])
    return (
        <div className="grid grid-cols-1 gap-4 overflow-hidden h-[80vh]">
            <div className="col-span-1 relative">
                <img
                    className="absolute inset-0 w-full h-full object-fill opacity-80 rounded-box"
                    src="/Images/temp-med.jpg"
                    alt="Background Image"
                    style={{ borderRadius: '30px' }}
                />
                <div className="z-10 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-8">
                    <h2 className="mb-4 text-center text-xl font-bold text-gray-900 dark:text-white">Disease Predictions</h2>
                    <FormControl sx={{ m: 1, width: '100%' }}>
                        <InputLabel id="demo-multiple-name-label" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" style={placeholderStyle}>Symptoms List</InputLabel>
                        <Select
                            labelId="demo-multiple-name-label"
                            id="demo-multiple-name"
                            multiple
                            value={personName}
                            onChange={handleChange}
                            inputProps={{ style: inputStyle }} InputProps={{ sx: { '&:focus-within fieldset, &:focus-visible fieldset': { border: '4px solid black!important' } } }}
                            input={<OutlinedInput label="Name" />}
                            MenuProps={{
                                PaperProps: {
                                    style: {
                                        maxHeight: selectHeight,
                                    },
                                },
                            }}
                            renderValue={(selected) => (
                                <div>
                                    {selected.map((value) => (
                                        <div key={value} style={{ margin: '2px', fontWeight: 'bold' }}>
                                            {value}
                                        </div>
                                    ))}
                                </div>
                            )}
                        >
                            {names.map((name) => (
                                <MenuItem key={name} value={name} style={{ fontWeight: 'bold' }}>
                                    {name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <div className="flex justify-center mt-8">
                        <button
                            className="px-6 py-2 bg-blue-500 text-white rounded-md flex items-center justify-center transition duration-300 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onClick={handleSubmit}
                            style={{ fontWeight: 'bold' }}
                        >
                            {loading ? (
                                <>
                                    <CircularProgress size={24} color="inherit" />
                                    <span className="ml-2">Submitting...</span>
                                </>
                            ) : (
                                'Submit'
                            )}
                        </button>
                    </div>
                    <br />
                    <br />
                    {disease ?
                        <h1 className="mb-4 text-center text-xl font-bold text-gray-900 dark:text-white" style={{ textAlign: 'center', color: 'black', fontWeight: 'bold' }}>Predicted disease: {disease?.disease}</h1>
                        :
                        <></>
                    }
                    <br />
                    <br />
                    {
                        disease ?
                            <div className="flex justify-between space-x-4">
                                <button
                                    type="button"
                                    onClick={() => { setOpen(true) }}
                                    className="flex items-center justify-center text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80 font-medium rounded-lg text-sm px-5 py-2.5"
                                    style={{ fontWeight: 'bold' }}
                                >
                                    Disease Description
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setShow(true) }}
                                    className="flex items-center justify-center text-white bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-yellow-300 dark:focus:ring-yellow-800 shadow-lg shadow-yellow-500/50 dark:shadow-lg dark:shadow-yellow-800/80 font-medium rounded-lg text-sm px-5 py-2.5"
                                    style={{ fontWeight: 'bold' }}
                                >
                                    Disease Precautions
                                </button>
                            </div>
                            :
                            <></>
                    }


                    <Transition.Root show={open} as={Fragment}>
                        <Dialog className="relative z-10" initialFocus={cancelButtonRef} onClose={setOpen}>
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                            </Transition.Child>

                            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                                    <Transition.Child
                                        as={Fragment}
                                        enter="ease-out duration-300"
                                        enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                        enterTo="opacity-100 translate-y-0 sm:scale-100"
                                        leave="ease-in duration-200"
                                        leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                        leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                    >
                                        <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                                <div className="sm:flex sm:items-start">
                                                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                                        <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                                                            {`${disease?.disease}`}
                                                        </Dialog.Title>
                                                        <div className="mt-2">
                                                            <p className="text-sm text-gray-500">
                                                                {disease?.disease_description}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                                <button
                                                    type="button"
                                                    className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                                                    onClick={() => setOpen(false)}
                                                >
                                                    Close
                                                </button>
                                            </div>
                                        </Dialog.Panel>
                                    </Transition.Child>
                                </div>
                            </div>
                        </Dialog>
                    </Transition.Root>




                    <Transition.Root show={show} as={Fragment}>
                        <Dialog className="relative z-10" initialFocus={anotherCancelButtonRef} onClose={setShow}>
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                            </Transition.Child>

                            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                                    <Transition.Child
                                        as={Fragment}
                                        enter="ease-out duration-300"
                                        enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                        enterTo="opacity-100 translate-y-0 sm:scale-100"
                                        leave="ease-in duration-200"
                                        leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                        leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                    >
                                        <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                                <div className="sm:flex sm:items-start">
                                                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                                        <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                                                            {`${disease?.disease_precautions?.Disease} Precautions`}
                                                        </Dialog.Title>
                                                        <div className="mt-2">
                                                            <ul>
                                                                {
                                                                    disease?.disease_precautions?.Precaution_1 !== 'nan' ?

                                                                        <li>
                                                                            {disease?.disease_precautions?.Precaution_1}
                                                                        </li>
                                                                        :
                                                                        <></>
                                                                }
                                                                {
                                                                    disease?.disease_precautions?.Precaution_2 !== 'nan' ?

                                                                        <li>
                                                                            {disease?.disease_precautions?.Precaution_2}
                                                                        </li>
                                                                        :
                                                                        <></>
                                                                }
                                                                {
                                                                    disease?.disease_precautions?.Precaution_3 !== 'nan' ?

                                                                        <li>
                                                                            {disease?.disease_precautions?.Precaution_3}
                                                                        </li>
                                                                        :
                                                                        <></>
                                                                }
                                                                {
                                                                    disease?.disease_precautions?.Precaution_4 !== 'nan' ?

                                                                        <li>
                                                                            {disease?.disease_precautions?.Precaution_4}
                                                                        </li>
                                                                        :
                                                                        <></>
                                                                }
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                                <button
                                                    type="button"
                                                    className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                                                    onClick={() => setShow(false)}
                                                >
                                                    Close
                                                </button>
                                            </div>
                                        </Dialog.Panel>
                                    </Transition.Child>
                                </div>
                            </div>
                        </Dialog>
                    </Transition.Root>

                </div>
            </div>
        </div>
    );
};
