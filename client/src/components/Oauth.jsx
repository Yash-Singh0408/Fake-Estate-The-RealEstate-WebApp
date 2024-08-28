import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/toastStyles.css";

export default function Oauth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handelGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);

      // fetching user information from results
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
      });
      const data = await res.json();
      dispatch(signInSuccess(data));
      toast.success("Signup successful Welcome!");
      // Delay the redirect to allow the toast to be visible
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (error) {
      console.log("Could not sign in with google", error);
    }
  };

  return (
    <>
      <button
        onClick={handelGoogleClick}
        type="button"
        className="bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-90"
      >
        Continue With Google
      </button>
      <ToastContainer
        position="top-right"
        draggable
        autoClose={2000}
        hideProgressBar={false}
        className="font-normal"
      />
    </>
  );
}
