import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import {signInStart, signInSuccess, signInFailure,} from "../redux/user/userSlice.js";
import Oauth from "../components/Oauth.jsx";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/toastStyles.css";

function SignIn() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { loading , error } = useSelector((state)=>state.user);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
   dispatch(signInStart());
    // Basic form validation
    if (!formData.email || !formData.password) {
      toast.error("All fields are required.");
      dispatch(signInFailure(error.message))
      return;
    }

    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success === false) {
        toast.error(data.message );
       dispatch(signInFailure(data.message));
        return;
      }
      toast.success("Sign In successful Welcome!");
      dispatch(signInSuccess(data));
      setTimeout(() => {
        navigate("/");
      }, 3000); // 2 seconds delay
      
    } catch (error) {
      toast.error("An error occurred. Please try again." );
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto h-screen">
      <h1 className=" text-3xl text-center font-semibold my-7">Sign In</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          id="email"
          className="border p-3 rounded-lg"
          onChange={handleChange}
          required
        />
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            id="password"
            className="border p-3 rounded-lg w-full"
            onChange={handleChange}
            required
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
          </button>
        </div>
        <button
   
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-90 disabled:opacity-80"
        >
          {loading ? "Loading..." : "Sign In"}
        </button>
        <Oauth/>
      </form>
      <div className="flex gap-2 mt-4">
        <p>Dont have an account?</p>
        <Link to={"/sign-up"}>
          <span className="text-blue-700 restunderline">Sign up</span>
        </Link>
      </div>
      <ToastContainer
        position="top-right"
        draggable
        autoClose={2000}
        hideProgressBar={false}
        className="font-normal"
      />
    </div>
  );
}

export default SignIn;
