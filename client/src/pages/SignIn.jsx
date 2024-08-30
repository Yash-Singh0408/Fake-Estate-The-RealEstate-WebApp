import { useState , useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import {signInStart, signInSuccess, signInFailure,} from "../redux/user/userSlice.js";
import Oauth from "../components/Oauth.jsx";
import { toast, ToastContainer } from "react-toastify";
import signinImage from "../images/signup1.jpg";
import signinImagemobiel from "../images/signup2.jpg";
import "react-toastify/dist/ReactToastify.css";
import "../styles/toastStyles.css";
import "../styles/signinStyles.css"

function SignIn() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { loading , error } = useSelector((state)=>state.user);
  const [showPassword, setShowPassword] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState(signinImage);
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
      }, 3000); 
      
    } catch (error) {
      toast.error("An error occurred. Please try again." );
      dispatch(signInFailure(error.message));
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setBackgroundImage(window.innerWidth <= 768
        ? signinImagemobiel
        : signinImage);
    };

    handleResize();
    
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  return (
    <div className="h-screen flex justify-center items-center " 
    style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          marginTop:"2px"
          
        }}>
      <div className="signup-container">
        <div className="signup-form">
          <h2 className="signup-title">Sign In to Your Account</h2>
          <p className="signup-subtitle">Welcome back! Please log in to continue.</p>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
              <input
                type="email"
                id="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
            <div className="input-group">
              <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} onClick={() => setShowPassword(!showPassword)} className="input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
            <button type="submit" className="signup-button" disabled={loading}>
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>
          <Oauth />
          <p className="signup-footer">
            Don&apos;t have an account? <Link className="restunderline" to="/sign-up">Sign Up</Link>
          </p>
        </div>
        <ToastContainer
        position="top-right"
        draggable
        autoClose={3000}
        hideProgressBar={false}
        className="font-normal"
      />
      </div>
    </div>
  );
  
}

export default SignIn;
