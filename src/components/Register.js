import React, { useRef, useState } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import { auth, storage, db } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export const Register = () => {
  const inputlogo = useRef(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [file, setFile] = useState(null);
  const [imagUrl, setImageUrl] = useState(null);
  const [isLoading, setLoading] = useState(false);

  const navigate = useNavigate();

  const onSelectFile = (e) => {
    setFile(e.target.files[0]);
    setImageUrl(URL.createObjectURL(e.target.files[0]));
  };

  const submitHandler = (e) => {
    e.preventDefault();
    setLoading(true);

    createUserWithEmailAndPassword(auth, email, password)
      .then((newuser) => {
        const date = new Date().getTime();
        const storageRef = ref(storage, `${displayName}`);
        uploadBytesResumable(storageRef, file).then(() => {
          getDownloadURL(storageRef).then((downloadedUrl) => {
            updateProfile(newuser.user, {
              displayName: displayName,
              photoURL: downloadedUrl,
            });

            setDoc(doc(db, "users", newuser.user.uid), {
              uid: newuser.user.uid,
              displayName: displayName,
              email: email,
              photoURL: downloadedUrl,
            });

            newuser.user.getIdToken(true).then((token) => {
              console.log("JWT Token:", token);
              localStorage.setItem("jwtToken", token);
              localStorage.setItem("cName", displayName);
              localStorage.setItem("photoURL", downloadedUrl);
              localStorage.setItem("email", newuser.user.email);
              localStorage.setItem("uid", newuser.user.uid);

              const expiryTime =
                new Date().getTime() + 4 * 24 * 60 * 60 * 1000;
              localStorage.setItem("jwtExpiry", expiryTime);

              toast.success("Registration Successful!");
              navigate("/dashboard");
              setLoading(false);
            });
          });
        });
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);

        // Display error message if email already exists
        if (err.code === "auth/email-already-in-use") {
          toast.error("This email is already in use. Please try another one.", {
            position: "bottom-center",
            autoClose: 3000, // Auto close after 3 seconds
          });
        } else {
          toast.error("Registration failed. Please try again.");
        }
      });
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <div className="login-boxes login-left"></div>
        <div className="login-boxes login-right">
          <h1 className="login-heading">Create Your Account</h1>
          <form onSubmit={submitHandler}>
            <input
              onChange={(e) => setEmail(e.target.value)}
              className="login-input"
              type="text"
              placeholder="Email"
              required
            />
            <input
              onChange={(e) => setDisplayName(e.target.value)}
              className="login-input"
              type="text"
              placeholder="Company Name"
              required
            />
            <input
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
              type="password"
              placeholder="Password"
              required
            />
            <input
              onChange={onSelectFile}
              style={{ display: "none" }}
              className="login-input"
              type="file"
              ref={inputlogo}
            />
            <input
              className="login-input  hover:bg-blue-300"
              type="button"
              value="Select Your Logo"
              onClick={() => inputlogo.current.click()}
            />
            {imagUrl && <img className="image-preview" src={imagUrl} alt="preview" />}
            <button className="login-input login-btn" type="submit" disabled={isLoading}>
              {isLoading ? <FontAwesomeIcon icon={faSpinner} spin /> : ""}
              Submit
            </button>
          </form>
          <Link to="/login" className="register-link">
            Login With Your Account
          </Link>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};
