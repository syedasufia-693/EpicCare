import React, { useState, useRef, useContext } from "react";
import { FiEye } from "react-icons/fi";
import { FiEyeOff } from "react-icons/fi";
import { FaArrowRightLong } from "react-icons/fa6";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import "./SignIn.css";
// import hero from '../../../public/assets/hero1.jpg'
import { Link } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../../AppContext";

const SignIn = () => {
  const initialState = {
    email: "",
    password: "",
  };
  const [showPassword, setShowPassword] = useState(false);
  const [formValue, setFormValue] = useState(initialState);
  const [userType, setUserType] = useState("");
  const [userTypeError, setUserTypeError] = useState("");
  const [loading, setLoading] = useState(false);
  const { baseBackendRoute, setCookie, setUserData, setDoctorData, doctorData, setTypeOfUser, setHospitalData, hospitalData } = useContext(AppContext);
  const email = useRef(null);
  const smallsEmail = useRef(null);
  const password = useRef(null);
  const smallsPass = useRef(null);
  const button = useRef(null);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(value + " " + name + " " + " " + userType);
    setFormValue({ ...formValue, [name]: value });
  };

  const handleBlur = (e, input) => {
    const { name, value } = e.target;
    if (input.current.name === "email") {
      if (!isEmail(input.current.value.trim())) {
        setErrorFor(input, "Please enter a valid e-mail", smallsEmail.current);
      } else {
        setSuccessFor(input);
      }
    }
    if (input.current.name === "password") {
      isPass(input);
    }
  };

  const handleSumit = async (e) => {
    checkInputs();
    console.log(typeof (userType));
    if (isEmail(email.current.value.trim()) && isPass2(password) && userType) {
      const { email, password } = formValue;
      console.log(email + " " + " " + password + " " + userType);
      setLoading(true);
      if (userType === "User") {
        console.log("entered");
        await axios.post(`${baseBackendRoute}/api/user/authentication/login`,
          {
            'email': email,
            'password': password
          }
        )
          .then((res) => {
            console.log(res);
            setTypeOfUser("User");
            setLoading(false);
            setUserData(res?.data?.data);
            setCookie('type', 'User');
            setCookie('token', res?.data?.jwt_token);
            navigate('/dashboard');
          })
          .catch((err) => {
            console.log(err);
            setLoading(false);
          })
      }
      else if (userType === 'Hospital') {
        axios.post(`${baseBackendRoute}/api/hospital/login`, {
          'email': email,
          'password': password
        })
          .then((res) => {
            console.log(res);
            setTypeOfUser("Hospital");
            setHospitalData(res?.data?.hospital_data);
            setLoading(false);
            setCookie('type', 'Hospital');
            setCookie('token', res?.data?.jwt_token);
            navigate('/dashboard');
          })
      }
      else if (userType === 'Doctor') {
        axios.post(`${baseBackendRoute}/api/doctor/login`, {
          'email': email,
          'password': password
        })
          .then((res) => {
            console.log(res);
            setTypeOfUser("Doctor");
            setDoctorData(res?.data?.data);
            setLoading(false);
            setCookie('type', 'Doctor');
            setCookie('token', res?.data?.jwt_token);
            navigate('/dashboard/patient_doc_list');
          })
      }
      else {
        setLoading(false);
      }
    }
  };

  function handleSelection(e) {
    setUserType(e.target.value);
  }


  const handleKeyUp = (e, input) => {
    const { name, value } = e.target;
    if (input.current.name === "email") {
      if (!isEmail(input.current.value.trim())) {
        setErrorFor(input, "Please enter a valid e-mail", smallsEmail.current);
      } else {
        setSuccessFor(input);
      }
    }
    if (input.current.name === "password") {
      isPass(input);
    }
  };

  function checkInputs() {
    const emailValue = email.current.value.trim();
    const passwordValue = password.current.value.trim();


    if (!userType) {
      setUserTypeError("Please select a user type");
      setLoading(false);
      return;
    } else {
      setUserTypeError("");
    }


    if (emailValue === "") {
      setErrorFor(
        email,
        "You cannot leave the email blank",
        smallsEmail.current
      );
    } else if (!isEmail(emailValue)) {
      setErrorFor(email, "Please enter a valid e-mail", smallsEmail.current);
      return;
    } else {
      setSuccessFor(email);
    }

    if (passwordValue === "") {
      setErrorFor(
        password,
        "Password must not be entered blank.",
        smallsPass.current
      );
      return;
    } else {
      isPass(password);
    }
  }

  function setErrorFor(input, message, small) {
    const formControl = input.current.parentElement;
    formControl.classList.remove("form__success");
    formControl.classList.add("form__error");
    small.innerHTML = message;
  }

  function setSuccessFor(input) {
    const formControl = input.current.parentElement;
    formControl.classList.remove("form__error");
    formControl.classList.add("form__success");
  }

  function isPass(password) {
    const isLowerCase = /(?=[a-z])/.test(password.current.value);
    const isUpperCase = /(?=[A-Z])/.test(password.current.value);
    const isNumber = /(?=\d)/.test(password.current.value);
    const isSpecialChar = /(?=\W)/.test(password.current.value);
    const isLongEnough = /.{8,}/.test(password.current.value);

    if (!isNumber) {
      setErrorForPass(
        password,
        "The field must contain numbers",
        smallsPass.current
      );
      return;
    } else {
      setSuccessForPass(password);
    }
    if (!isLowerCase) {
      setErrorForPass(
        password,
        "The field must contain lowercase",
        smallsPass.current
      );
      return;
    } else {
      setSuccessForPass(password);
    }
    if (!isUpperCase) {
      setErrorForPass(
        password,
        "The Field must Contain Capital Letters",
        smallsPass.current
      );
      return;
    } else {
      setSuccessForPass(password);
    }
    if (!isSpecialChar) {
      setErrorForPass(
        password,
        "The field must contain Special characters",
        smallsPass.current
      );
      return;
    } else {
      setSuccessForPass(password);
    }
    if (!isLongEnough) {
      setErrorForPass(
        password,
        "The field must contain more than 8 characters",
        smallsPass.current
      );
      return;
    } else {
      setSuccessForPass(password);
    }
  }

  function setErrorForPass(input, message, small) {
    const formControl = input.current.parentElement;
    formControl.classList.remove("form__success");
    formControl.classList.add("form__error");
    small.innerHTML = message;
  }

  function setSuccessForPass(input) {
    const formControl = input.current.parentElement;
    formControl.classList.remove("form__error");
    formControl.classList.add("form__success");
  }

  function isEmail(email) {
    return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      email
    );
  }

  function isPass2(password) {
    const isLowerCase = /(?=[a-z])/.test(password.current.value);
    const isUpperCase = /(?=[A-Z])/.test(password.current.value);
    const isNumber = /(?=\d)/.test(password.current.value);
    const isSpecialChar = /(?=\W)/.test(password.current.value);
    const isLongEnough = /.{8,}/.test(password.current.value);
    if (!isLowerCase) {
      return false;
    }
    if (!isUpperCase) {
      return;
    }
    if (!isNumber) {
      return false;
    }
    if (!isSpecialChar) {
      return;
    }
    if (!isLongEnough) {
      return false;
    }
    return true;
  }

  const handleTogglePassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <div className="signin">
      <div className="absolute top-5 left-5 md:left-32 z-10">
        <h1 className=" text-5xl font-bold text-[#217558] top-5 left-5 md:left-32 z-10">
          EPICCARE.
        </h1>
        <h2 className="text-md">
          <span className="font-semibold">Hospital Management System </span>{" "}
          <br />
          <span className="hidden md:inline-block">
            Easy to get analyst information about patients, doctors,and
            employees
          </span>
        </h2>
      </div>
      <img
        src="/assets/hero2.png"
        className="w-[80vw] rounded-3xl absolute md:static md:w-[50vw]"
      />
      <div className="container bg-blur bg-opacity-75 backdrop-filter backdrop-blur-md p-8 rounded-lg">
        <h2 className="container__header font-semibold text-xl text-[#217558]">
          Login
        </h2>
        {/* <form className="form" onSubmit={handleSumit}> */}
        <div className="form">
          <div className="form__group relative">
            <label htmlFor="userType" className="form__label">
              User Type
            </label>
            <div className="relative">
              <select
                onChange={handleSelection}
                className="register-inputs mt-5 bg-transparent"
                value={userType}
                style={{ width: '100%' }}

              >
                <option value="">Select your option</option>
                <option value="Doctor">Doctor</option>
                <option value="User">User</option>
                <option value="Hospital">Hospital</option>
              </select>
              {/* Custom select arrow */}
            </div>
          </div>
          {userTypeError && (
            <span className="text-red-500 -my-3 text-sm">{userTypeError}</span>
          )}
          <div className="form__group">
            <label htmlFor="email" className="form__label">
              Email
            </label>
            <input
              type="text"
              className="form__input form__username "
              name="email"
              id="username"
              placeholder="Enter Your Email"
              autoComplete="off"
              onChange={handleChange}
              onKeyUp={(e) => handleKeyUp(e, email)}
              onBlur={(e) => handleBlur(e, email)}
              ref={email}
            />
            <svg
              className="form__successicon"
              viewBox="0 0 512 512"
              width="100"
              title="check-circle"
            >
              <path d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z" />
            </svg>
            <svg
              className="form__erroricon"
              viewBox="0 0 512 512"
              width="100"
              title="exclamation-circle"
            >
              <path d="M504 256c0 136.997-111.043 248-248 248S8 392.997 8 256C8 119.083 119.043 8 256 8s248 111.083 248 248zm-248 50c-25.405 0-46 20.595-46 46s20.595 46 46 46 46-20.595 46-46-20.595-46-46-46zm-43.673-165.346l7.418 136c.347 6.364 5.609 11.346 11.982 11.346h48.546c6.373 0 11.635-4.982 11.982-11.346l7.418-136c.375-6.874-5.098-12.654-11.982-12.654h-63.383c-6.884 0-12.356 5.78-11.981 12.654z" />
            </svg>
            <p ref={smallsEmail} className="form__message"></p>
          </div>

          <div className="form__group relative">
            <label htmlFor="password" className="form__label">
              Password
            </label>
            {/* <div className="relative"> */}
            <input
              type={showPassword ? "text" : "password"}
              className="form__input form__password"
              name="password"
              id="form__password"
              placeholder="Enter your password"
              ref={password}
              onChange={handleChange}
              onBlur={(e) => handleBlur(e, password)}
              onKeyUp={(e) => handleKeyUp(e, password)}
              autoComplete="off"
            />
            <span
              className="form__password-toggle absolute right-10 top-4 cursor-pointer select-none"
              onClick={handleTogglePassword}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </span>
            {/* </div> */}
            <svg
              className="form__successicon"
              viewBox="0 0 512 512"
              width="100"
              title="check-circle"
            >
              <path d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z" />
            </svg>
            <svg
              className="form__erroricon"
              viewBox="0 0 512 512"
              width="100"
              title="exclamation-circle"
            >
              <path d="M504 256c0 136.997-111.043 248-248 248S8 392.997 8 256C8 119.083 119.043 8 256 8s248 111.083 248 248zm-248 50c-25.405 0-46 20.595-46 46s20.595 46 46 46 46-20.595 46-46-20.595-46-46-46zm-43.673-165.346l7.418 136c.347 6.364 5.609 11.346 11.982 11.346h48.546c6.373 0 11.635-4.982 11.982-11.346l7.418-136c.375-6.874-5.098-12.654-11.982-12.654h-63.383c-6.884 0-12.356 5.78-11.981 12.654z" />
            </svg>
            <p ref={smallsPass} className="form__message"></p>
          </div>

          <Link
            to={"/register"}
            className="-my-5 text-sm flex gap-3 transition-transform hover:translate-x-3"
          >
            Register as a new user{" "}
            <FaArrowRightLong className="mt-1 transition-transform hover:translate-x-3" />
          </Link>

          <button
            disabled={loading}
            ref={button}
            onClick={handleSumit}
            className={`form__button transition-colors flex justify-center gap-5 ${loading
              ? "cursor-not-allowed"
              : "cursor-pointer  hover:bg-emerald-600 hover:text-white"
              }`}
          >
            Login In{" "}
            {loading && (
              <AiOutlineLoading3Quarters className="animate-spin mt-1" />
            )}
          </button>
        </div>
        {/* </form> */}
      </div>
    </div>
  );
};

export default SignIn;
