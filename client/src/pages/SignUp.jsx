import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faUser, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import Oauth from "../components/Oauth";
import { toast, ToastContainer } from "react-toastify";
import signinImage from "../images/signup1.jpg";
import signinImagemobiel from "../images/signup2.jpg";
import "react-toastify/dist/ReactToastify.css";
import "../styles/toastStyles.css";
import "../styles/signupStyles.css";  


function SignUp() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState(null);
  console.log(error);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); 
  const [backgroundImage, setBackgroundImage] = useState(signinImage);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const validatePassword = (password) => {
    const hasNumber = /\d/;
    const hasLetter = /[a-zA-Z]/;
    if (
      password.length < 8 ||
      !hasNumber.test(password) ||
      !hasLetter.test(password)
    ) {
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Basic form validation
    if (
      !formData.username ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setLoading(false);
      toast.error("All fields are required.");
      return;
    }

    // Password validation
    if (!validatePassword(formData.password)) {
      setLoading(false);
      toast.error(
        "Password must be at least 8 characters long and contain both numbers and letters."
       
      );

      return;
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      setLoading(false);
      toast.error("Passwords do not match.");

      return;
    }

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success === false) {
        setLoading(false);
        toast.error(data.message);
        return;
      }
      setLoading(false);
      toast.success("Signup successful! Redirecting to sign-in...");
      // Delay the redirect to allow the toast to be visible
      setTimeout(() => {
        navigate("/sign-in");
      }, 3000); 
    } catch (error) {
      setLoading(false);
      toast.error("An error occurred. Please try again.");
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
    <div className=" h-screen flex justify-center items-center " 
    style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          marginTop:"2px",
          
        }}>
    <div className="signup-container">
    <div className="signup-form">
      <h2 className="signup-title">Create Your Account</h2>
      <p className="signup-subtitle">Join us and find your dream home!</p>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <FontAwesomeIcon icon={faUser} className="input-icon" />
          <input
            type="text"
            id="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="input-field"
          />
        </div>
        <div className="input-group">
          <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
          <input
            type="email"
            id="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="input-field"
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
          />
        </div>
        <div className="input-group">
          <FontAwesomeIcon icon={showConfirmPassword ? faEye : faEyeSlash} onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="input-icon" />
          <input
            type={showConfirmPassword ? "text" : "password"}
            id="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="input-field"
          />
        </div>
        <button type="submit" className="signup-button" disabled={loading}>
          {loading ? "Signing Up..." : "Sign Up"}
        </button>
      </form>
      <Oauth />
      <p className="signup-footer">
        Already have an account? <Link className="restunderline" to="/sign-in">Sign In</Link>
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

export default SignUp;
