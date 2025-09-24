import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

import { FaArrowRightLong } from "react-icons/fa6";

import "./Register.css";
import axios from "axios";
import { AppContext } from "../../AppContext";

const Register = () => {
  const [userType, setUserType] = useState("");
  const [userTypeError, setUserTypeError] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [imageResult, setImageResult] = useState("");
  const navigate = useNavigate();
  const { baseBackendRoute } = useContext(AppContext);
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      setFormData({
        ...formData,
        profileImage: e.target.files[0],
      });
      reader.onloadend = async () => {
        await setImageResult(reader.result);
      };
      console.log("file.......");
      reader.readAsDataURL(file);
    }
  };


  const [formData, setFormData] = useState({
    email: "",
    password: "",
    profileImage: "",
    dob: "",
    register: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    gender: "",
    name: "",
    id: "",
    specialization: "",
    aadharNumber: "",
    certification: "",
    registerId: "",
    address: "",
    phone: "",
    hospitalClinicInfo: "",
    residence_no: "",
    street: "",
    city: "",
    state: "",
    country: "",
    phone: "",
    hospitalClinicInfo: "",
  });
  const [errors, setErrors] = useState({});

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  function handleSelection(e) {
    setUserType(e.target.value);
    setFormData({
      ...formData,
      firstName: "",
      lastName: "",
      gender: "",
      registerId: "",
      name: "",
      profileImage: "",
      dob: "",
      aadharNumber: "",
      specialization: "",
      certification: "",
      residence_no: "",
      street: "",
      city: "",
      state: "",
      country: "",
      phone: "",
      hospitalClinicInfo: "",
    });
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let newErrors = {};
    let hasErrors = false;

    if (!userType) {
      setUserTypeError("Please select a user type");
      setLoading(false);
      return;
    } else {
      setUserTypeError("");
    }

    // Validate inputs
    if (!formData.email) {
      newErrors.email = "This field can't be left empty";
      hasErrors = true;
    }
    if (!formData.password) {
      newErrors.password = "This field can't be left empty";
      hasErrors = true;
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "This field can't be left empty";
      hasErrors = true;
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match";
      hasErrors = true;
    }

    if (userType === "User") {
      if (!formData.firstName) {
        newErrors.firstName = "This field can't be left empty";
        hasErrors = true;
      }
      if (!formData.lastName) {
        newErrors.lastName = "This field can't be left empty";
        hasErrors = true;
      }
      if (!formData.gender) {
        newErrors.gender = "This field can't be left empty";
        hasErrors = true;
      }
      if (!formData.profileImage) {
        newErrors.profileImage = "This field can't be left empty";
        hasErrors = true;
      }
      if (!formData.aadharNumber) {
        newErrors.aadharNumber = "This field can't be left empty";
        hasErrors = true;
      }
      else if (formData.aadharNumber.length !== 12) {
        newErrors.aadharNumber = "The Aadhar number should be exactly 12 digits";
        hasErrors = true;
      }
      if (!formData.dob) {
        newErrors.dob = "The date of birth field can't be left empty"
        hasErrors = true;
      }
      else {
        console.log(formData);
      }
    } else if (userType === "Doctor") {
      if (!formData.name) {
        newErrors.name = "This field can't be left empty";
        hasErrors = true;
      }
      if (!formData.registerId) {
        newErrors.registerId = "This field can't be left empty";
        hasErrors = true;
      }
      if (!formData.specialization) {
        newErrors.specialization = "This field can't be left empty";
        hasErrors = true;
      }
    } else if (userType === "Hospital") {
      if (!formData.name) {
        newErrors.name = "This field can't be left empty";
        hasErrors = true;
      }
      if (!formData.registerId) {
        newErrors.registerId = "This field can't be left empty";
        hasErrors = true;
      }
      if (!formData.specialization) {
        newErrors.specialization = "This field can't be left empty";
        hasErrors = true;
      }
      if (!formData.certification) {
        newErrors.certification = "This field can't be left empty";
        hasErrors = true;
      }
      if (!formData.residence_no) {
        newErrors.residence_no = "This field can't be left empty";
        hasErrors = true;
      }
      if (!formData.street) {
        newErrors.street = "This field can't be left empty";
        hasErrors = true;
      }
      if (!formData.state) {
        newErrors.state = "This field can't be left empty";
        hasErrors = true;
      }
      if (!formData.city) {
        newErrors.city = "This field can't be left empty";
        hasErrors = true;
      }

      if (!formData.country) {
        newErrors.country = "This field can't be left empty";
        hasErrors = true;
      }
      if (!formData.phone) {
        newErrors.phone = "This field can't be left empty";
        hasErrors = true;
      }
    }

    setErrors(newErrors);

    if (hasErrors) {
      setLoading(false);
    } else {
      const filteredData = Object.fromEntries(
        Object.entries(formData).filter(([key, value]) => value)
      );

      if (userType === "User") {

        const userFormData = new FormData();
        userFormData.append("profile_img", filteredData?.profileImage);
        userFormData.append("firstName", filteredData?.firstName);
        userFormData.append("lastName", filteredData?.lastName);
        userFormData.append("gender", filteredData?.gender);
        userFormData.append("aadhar", Number(filteredData?.aadharNumber));
        userFormData.append("email", filteredData?.email);
        userFormData.append("password", filteredData?.password);
        userFormData.append("dob", filteredData?.dob)

        await axios.post(`${baseBackendRoute}/api/user/authentication/register`, userFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data "
            }
          }
        )
          .then((res) => {
            console.log(res);
            navigate('/signin');
            setLoading(false);
          })
          .catch((err) => {
            console.log(err);
            setLoading(false);
          })
      }
      else if (userType === "Doctor") {
        const doctorFormData = new FormData();
        doctorFormData.append("email", filteredData?.email);
        doctorFormData.append("password", filteredData?.password);
        doctorFormData.append("doctor_name", filteredData?.name);
        doctorFormData.append("doctor_UID", filteredData?.registerId);
        doctorFormData.append("specialization", filteredData?.specialization?.split(","));
        doctorFormData.append("profile_img", filteredData?.profileImage);

        await axios.post(`${baseBackendRoute}/api/doctor/register`, doctorFormData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        })
          .then((res) => {
            console.log(res);
            navigate('/signin');
          })
          .catch((err) => {
            console.log(err);
          });
      }
      else if (userType === "Hospital") {

        const hospitalFormData = new FormData();
        hospitalFormData.append("email", filteredData?.email);
        hospitalFormData.append("password", filteredData?.password);
        hospitalFormData.append("hospital_name", filteredData?.name);
        hospitalFormData.append("specialization", filteredData?.specialization?.split(","));
        hospitalFormData.append("certifications", filteredData?.certification?.split(","));
        hospitalFormData.append("contact_no", filteredData?.phone);
        hospitalFormData.append("hospital_residence_no", filteredData?.residence_no);
        hospitalFormData.append("hospital_street", filteredData?.street);
        hospitalFormData.append("hospital_city", filteredData?.city);
        hospitalFormData.append("hospital_country", filteredData?.country);
        hospitalFormData.append("hospital_registration_id", filteredData?.registerId);
        hospitalFormData.append("logo_img", filteredData?.profileImage);

        await axios.post(`${baseBackendRoute}/api/hospital/register`, hospitalFormData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        })
          .then((res) => {
            console.log(res);
            navigate('/signin');
          })
          .catch((err) => {
            console.log(err);
          })
      }

      console.log("calling API register of", userType, filteredData);
    }
  };

  return (
    <div className="bg-opacity-15 bg h-screen flex justify-center items-center gap-20 relative">
      <div className="absolute top-5 left-5 md:left-32 z-10">
        <h1 className="text-2xl md:text-5xl font-bold text-[#217558] top-5 left-5 md:left-32 z-10">
          EPICCARE.
        </h1>
      </div>
      <img
        src="/assets/hero3.png"
        className="w-[80vw] absolute md:static md:w-[50vw] -z-20 blur-2xl md:blur-none"
      />
      <div className="bg-blur bg-opacity-10  w-[80vw] md:w-[40vw] md:border md:shadow-custom h-[80vh] p-10 rounded-2xl overflow-y-scroll overflow-hidden no-scrollbar z-10 mt-5">
        {userType ? (
          <h1 className="text-2xl text-[#217558]">Register as a {userType}</h1>
        ) : (
          <h1 className="md:text-2xl text-[#217558] font-semibold">
            Register Here
          </h1>
        )}
        <form
          className="flex flex-col gap-5 items-center"
          onSubmit={handleSubmit}
        >
          <select
            onChange={handleSelection}
            className="register-inputs mt-5 bg-transparent"
            value={userType}
          >
            <option value="" className="register-inputs">
              Select your option
            </option>
            <option className="register-inputs bg-transparent" value="Doctor">
              Doctor
            </option>
            <option className="register-inputs" value="User">
              User
            </option>
            <option className="register-inputs" value="Hospital">
              Hospital
            </option>
          </select>
          {userTypeError && (
            <span className="text-red-500 -my-3 text-sm">{userTypeError}</span>
          )}
          <input
            name="email"
            className="register-inputs"
            type="text"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && (
            <span className="text-red-500 -my-3 text-sm">{errors.email}</span>
          )}
          <div className="relative register-inputs">
            <input
              name="password"
              className="outline-none w-[90%]"
              type={passwordVisible ? "text" : "password"}
              placeholder="Enter Password"
              value={formData.password}
              onChange={handleChange}
            />

            <span
              className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
              onClick={togglePasswordVisibility}
            >
              {passwordVisible ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </span>
          </div>
          {errors.password && (
            <span className="text-red-500 -my-3 text-sm">
              {errors.password}
            </span>
          )}
          <div className="relative register-inputs">
            <input
              name="confirmPassword"
              className="outline-none w-[90%]"
              type={confirmPasswordVisible ? "text" : "password"}
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            {/* {errors.confirmPassword && (
              <span className="text-red-500">{errors.confirmPassword}</span>
            )} */}
            <span
              className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
              onClick={toggleConfirmPasswordVisibility}
            >
              {confirmPasswordVisible ? (
                <AiOutlineEyeInvisible />
              ) : (
                <AiOutlineEye />
              )}
            </span>
          </div>
          {errors.confirmPassword && (
            <span className="text-red-500 -my-3 text-sm">
              {errors.confirmPassword}
            </span>
          )}


          {userType === "Doctor" && (

            <> <input
              name="profileImage"
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e)}
              className="register-inputs"
            />
              {errors.profileImage && (
                <span className="text-red-500 -my-3 text-sm">
                  {errors.profileImage}
                </span>
              )}
              {/* Display the selected image preview */}
              {imageResult && (
                <img
                  src={imageResult}
                  alt="Selected profile"
                  className="rounded-full w-24 h-24"
                />
              )}
            </>
          )}
          {userType === "User" ? (
            <>
              <input
                name="profileImage"
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e)}
                className="register-inputs"
              />
              {errors.profileImage && (
                <span className="text-red-500 -my-3 text-sm">
                  {errors.profileImage}
                </span>
              )}
              {/* Display the selected image preview */}
              {imageResult && (
                <img
                  src={imageResult}
                  alt="Selected profile"
                  className="rounded-full w-24 h-24"
                />
              )}
              <input
                name="firstName"
                className="register-inputs"
                type="text"
                placeholder="Enter First Name"
                value={formData.firstName}
                onChange={handleChange}
              />
              {errors.firstName && (
                <span className="text-red-500 -my-3 text-sm">
                  {errors.firstName}
                </span>
              )}
              <input
                name="lastName"
                className="register-inputs"
                type="text"
                placeholder="Enter Last Name"
                value={formData.lastName}
                onChange={handleChange}
              />
              {errors.lastName && (
                <span className="text-red-500 -my-3 text-sm">
                  {errors.lastName}
                </span>
              )}

              <input
                name="dob"
                className="register-inputs"
                type="date"
                placeholder="Enter Date of birth"
                value={formData.dob}
                onChange={handleChange}
              />
              {errors.dob && (
                <span className="text-red-500 -my-3 text-sm">
                  {errors.dob}
                </span>
              )}


              <input
                name="aadharNumber"
                className="register-inputs"
                type="text"
                placeholder="Enter aadhar number"
                value={formData.aadharNumber}
                onChange={handleChange}
                onKeyDown={(e) => {
                  // Allow only digits
                  if (!/[0-9]/.test(e.key) && e.key !== "Backspace" && e.key !== "Delete" && e.key !== "ArrowLeft" && e.key !== "ArrowRight") {
                    e.preventDefault();
                  }
                }}
              />
              {errors.aadharNumber && (
                <span className="text-red-500 -my-3 text-sm">
                  {errors.aadharNumber}
                </span>
              )}


              <div className="flex">
                <button
                  type="button"
                  className={`gender-button ${formData.gender === "Male" ? "active" : ""
                    }`}
                  onClick={() => setFormData({ ...formData, gender: "Male" })}
                >
                  Male
                </button>
                <button
                  type="button"
                  className={`gender-button ${formData.gender === "Female" ? "active" : ""
                    }`}
                  onClick={() => setFormData({ ...formData, gender: "Female" })}
                >
                  Female
                </button>
              </div>
              {errors.gender && (
                <span className="text-red-500">{errors.gender}</span>
              )}
            </>
          ) : (
            userType && (
              <>
                <input
                  name="name"
                  className="register-inputs"
                  type="text"
                  placeholder="Enter Name"
                  value={formData.name}
                  onChange={handleChange}
                />
                {errors.name && (
                  <span className="text-red-500 -my-3 text-sm">
                    {errors.name}
                  </span>
                )}
                <input
                  name="registerId"
                  className="register-inputs"
                  type="text"
                  placeholder={userType === "Doctor" ? "Enter Doctor UID" : "Enter Registration Id"}
                  value={formData.registerId}
                  onChange={handleChange}
                />
                {errors.registerId && (
                  <span className="text-red-500 -my-3 text-sm">
                    {errors.registerId}
                  </span>
                )}
                <input
                  name="specialization"
                  className="register-inputs"
                  type="text"
                  placeholder="Enter Specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                />
                {errors.specialization && (
                  <span className="text-red-500 -my-3 text-sm">
                    {errors.specialization}
                  </span>
                )}
              </>
            )
          )}




          {userType === "Hospital" && (
            <>
              <input
                name="certification"
                className="register-inputs"
                type="text"
                placeholder="Enter Certification"
                value={formData.certification}
                onChange={handleChange}
              />
              {errors.certification && (
                <span className="text-red-500 -my-3 text-sm">
                  {errors.certification}
                </span>
              )}
              <input
                name="residence_no"
                className="register-inputs"
                type="text"
                placeholder="Enter residence_no"
                value={formData.residence_no}
                onChange={handleChange}
              />
              {errors.residence_no && (
                <span className="text-red-500 -my-3 text-sm">
                  {errors.residence_no}
                </span>
              )}

              <input
                name="profileImage"
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e)}
                className="register-inputs"
              />
              {errors.profileImage && (
                <span className="text-red-500 -my-3 text-sm">
                  {errors.profileImage}
                </span>
              )}
              {/* Display the selected image preview */}
              {imageResult && (
                <img
                  src={imageResult}
                  alt="Selected profile"
                  className="rounded-full w-24 h-24"
                />
              )}
              <input
                name="street"
                className="register-inputs"
                type="text"
                placeholder="Enter street"
                value={formData.street}
                onChange={handleChange}
              />
              {errors.street && (
                <span className="text-red-500 -my-3 text-sm">
                  {errors.street}
                </span>
              )}


              <input
                name="city"
                className="register-inputs"
                type="text"
                placeholder="Enter city"
                value={formData.city}
                onChange={handleChange}
              />
              {errors.city && (
                <span className="text-red-500 -my-3 text-sm">
                  {errors.city}
                </span>
              )}

              <input
                name="state"
                className="register-inputs"
                type="text"
                placeholder="Enter state"
                value={formData.state}
                onChange={handleChange}
              />
              {errors.state && (
                <span className="text-red-500 -my-3 text-sm">
                  {errors.state}
                </span>
              )}


              <input
                name="country"
                className="register-inputs"
                type="text"
                placeholder="Enter country"
                value={formData.country}
                onChange={handleChange}
              />
              {errors.country && (
                <span className="text-red-500 -my-3 text-sm">
                  {errors.country}
                </span>
              )}


              <input
                name="phone"
                className="register-inputs"
                type="text"
                placeholder="Enter Phone no"
                value={formData.phone}
                onChange={handleChange}
              />
              {errors.phone && (
                <span className="text-red-500 -my-3 text-sm">
                  {errors.phone}
                </span>
              )}
            </>
          )}
          <Link
            to={"/signin"}
            className="text-sm hover:font-semibold flex gap-3 transition-transform hover:translate-x-3"
          >
            Already have an account, Login <FaArrowRightLong className="mt-1" />
          </Link>

          <button
            disabled={loading}
            className={`border-2 border-emerald-700 rounded-md px-20 py-1 text-emerald-700 hover:bg-emerald-700 hover:text-white transition-all flex justify-center gap-5 ${loading
              ? "cursor-not-allowed"
              : "cursor-pointer  hover:bg-emerald-600 hover:text-white"
              }`}
          >
            Register
            {loading && (
              <AiOutlineLoading3Quarters className="animate-spin mt-1" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
