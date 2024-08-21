import { useSelector, useDispatch } from "react-redux";
import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import {
  updateUSerStart,
  updateUserFailure,
  updateUserSuccess,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
} from "../redux/user/userSlice";

// Alerts
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/toastStyles.css";

function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [showPassword, setShowPassword] = useState(false);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [showListingError, setShowListingError] = useState(false);
  const [userListing, setUserListing] = useState([]);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const fileRef = useRef(null);

  useEffect(() => {
    if (file) {
      handelFileUpload(file);
    }
  }, [file]);

  // File Upload
  const handelFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };

  // Update User
  const handelChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // Update User
  const handelSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUSerStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        toast.error("Failed to update profile. Please try again.", {
          className: "custom-toast ",
        });
        return;
      }
      dispatch(updateUserSuccess(data));
      toast.success("Profile updated successfully!", {
        className: "custom-toast ",
      });
    } catch (error) {
      dispatch(updateUserFailure(error.message));
      toast.error("An error occurred. Please try again.");
    }
  };

  // Delete User
  const handleDeleteUser = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if (!confirmDelete) return;

    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
      toast.success("User deleted successfully!", {
        className: "custom-toast2",
      });
      setTimeout(() => {
        navigate("/sign-in");
      }, 3000); // 3 seconds delay
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
      toast.error("An error occurred. Please try again.");
    }
  };

  // Sign out
  const handleSignoutUser = async () => {
    const confirmSignOut = window.confirm("Are you sure you want to sign out?");
    if (!confirmSignOut) return;

    try {
      dispatch(deleteUserStart());

      const res = await fetch("/api/auth/signout");
      const data = await res.json();

      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }

      toast.success("Signed out successfully!", { className: "custom-toast2" });
      dispatch(deleteUserSuccess(data));
      setTimeout(() => {
        navigate("/sign-in");
      }, 3000); // 3 seconds delay
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
      toast.error("An error occurred. Please try again.");
    }
  };

  // Get User Listing
  const handelShowListing = async () => {
    try {
      setShowListingError(false);
      const res = await fetch(`/api/user/listing/${currentUser._id}`);
      const data = await res.json();

      if (data.success === false) {
        setShowListingError(true);
        return;
      }
      setUserListing(data);
    } catch (error) {
      setShowListingError(true);
    }
  };

  //Delete User Listing
  const handleDeleteListing = async (listingId) => {
    const userConfirmed = window.confirm(
      "Are you sure you want to delete this listing?"
    );

    if (userConfirmed) {
      try {
        const res = await fetch(`/api/listing/delete/${listingId}`, {
          method: "DELETE",
        });
        const data = await res.json();
        if (data.success === false) {
          console.log(data.message);
        }
        setUserListing((prev) =>
          prev.filter((listing) => listing._id !== listingId)
        );
        toast.success("Listing deleted successfully!", {
          className: "custom-toast ",
        });
      } catch (error) {
        console.error(error);
        toast.error("An error occurred. Please try again.");
      }
    }
  };

  // Update User Lisitng

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-center font-semibold text-3xl my-7">Profile</h1>
      <form onSubmit={handelSubmit} className="flex flex-col gap-4">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          hidden
          accept="image/*"
          type="file"
          ref={fileRef}
        />
        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser.avatar}
          alt="profileImage"
          className="h-24 w-24 object-cover rounded-full cursor-pointer self-center mt-2"
        />
        <p className="text-center">
          {fileUploadError ? (
            <span className="text-red-700 font-medium">
              Error uploading Image(Image must be less than 2 MB)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className="text-slate-700 font-medium">{` Uploading ${filePerc}% `}</span>
          ) : filePerc === 100 ? (
            <span className="text-green-700 font-medium">Image Uploaded</span>
          ) : null}
        </p>
        <input
          type="text"
          placeholder="Username"
          className="border p-3 rounded-lg w-full "
          id="username"
          defaultValue={currentUser.username}
          onChange={handelChange}
        />
        <input
          type="email"
          placeholder="Email"
          className="border p-3 rounded-lg w-full"
          id="email"
          defaultValue={currentUser.email}
          onChange={handelChange}
        />
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="border p-3 rounded-lg w-full"
            id="password"
            onChange={handelChange}
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
          disabled={loading}
          type="submit"
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-90 mt-4"
        >
          {loading ? "Loading..." : "Update"}
        </button>
        <Link
          className="bg-green-700 text-white text-center p-3 rounded-lg uppercase hover:opacity-90 "
          to="/create-listing"
        >
          Create Listing
        </Link>
      </form>
      <div className="flex justify-between font-bold mt-4">
        <span
          onClick={handleDeleteUser}
          className=" text-red-700 cursor-pointer"
        >
          Delete Account
        </span>
        <span
          onClick={handleSignoutUser}
          className=" text-red-700 cursor-pointer"
        >
          Sign Out
        </span>
      </div>
      <p className="text-red-700 mt-2">{error ? error : ""}</p>
      <button
        onClick={handelShowListing}
        className="font-bold text-green-700 w-full text-center"
      >
        Show Listing
      </button>
      <p className="text-red-700 mt-2">
        {showListingError ? showListingError : ""}
      </p>

      {userListing && userListing.length > 0 && (
        <div className="flex flex-col gap-4">
          <h1 className="text-center text-2xl mt-6 font-bold">Your Listing</h1>
          {userListing.map((listing) => (
            <div
              key={listing._id}
              className="flex p-3 border justify-between items-center gap-4"
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  className="h-20 w-20 object-contain hover:scale-110 transition-transform duration-200"
                  src={listing.imageUrls[0]}
                  alt="Listing Images"
                />
              </Link>
              <Link
                className="text-slate-700 font-semibold flex-1 hover:underline truncate"
                to={`/listing/${listing._id}`}
              >
                <p>{listing.name}</p>
              </Link>

              <div className="flex flex-col items-center">
                <button
                  onClick={() => handleDeleteListing(listing._id)}
                  className="text-red-700 uppercase font-bold cursor-pointer"
                >
                  Delete
                </button>

                <Link to={`/update-listing/${listing._id}`}>
                  <button className="text-green-700 uppercase font-bold cursor-pointer">
                    Edit
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      <ToastContainer
        position="top-right"
        draggable
        autoClose={3000}
        hideProgressBar={false}
        className="font-normal"
      />
    </div>
  );
}

export default Profile;
