import React, { useState } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons"; // Import spinner icon
import { ToastContainer, toast } from "react-toastify"; // Import ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS
export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    setLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;

        // Retrieve the JWT token from the user
        user
          .getIdToken(true) // true forces a refresh to get the latest token
          .then((token) => {
            localStorage.setItem("jwtToken", token);
            localStorage.setItem("email", user.email);
            localStorage.setItem("photoURL", user.photoURL);
            localStorage.setItem("cName", user.displayName);

            // Set an expiry time for the token (4 days from now)
            const expiryTime =
              new Date().getTime() + 4 * 24 * 60 * 60 * 1000; // 4 days in milliseconds
            localStorage.setItem("jwtExpiry", expiryTime);

            navigate("/dashboard");
          })
          .catch((error) => {
            console.error("Error getting JWT token:", error);
          });

        setLoading(false);
      })
      .catch((error) => {
        console.error("Login error:", error);
        toast.error("Email or password does not match. Please try again.", {
          position: "bottom-center",
          autoClose: 3000, // Auto close after 3 seconds
        });
        setLoading(false);
      });
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <div className="login-boxes login-left"></div>
        <div className="login-boxes login-right">
          <h1 className="login-heading">Login</h1>
          <form onSubmit={submitHandler}>
            <input
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              className="login-input"
              type="text"
              placeholder="Email"
              required
            />
            <input
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              className="login-input"
              type="password"
              placeholder="Password"
              required
            />
            <button
              className="login-input login-btn"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? <FontAwesomeIcon icon={faSpinner} spin /> : ""}
              Login
            </button>
          </form>
          <Link to="/register" className="register-link ">
            <href >Create an Account</href>
          </Link>
        </div>

      </div>
      <ToastContainer />
    </div>
  );
};
