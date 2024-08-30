import React, { useState } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons'; // Import spinner icon
export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading,setLoading] = useState(false)
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    setLoading(true)
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
        localStorage.setItem("cName", user.displayName);
        localStorage.setItem("photoURL", user.photoURL);
        localStorage.setItem("email", user.email);
        localStorage.setItem("uid",user.uid);
        navigate("/dashboard");
        setLoading(false)
      })
      .catch((error) => {
        console.log(error);
        setLoading(false)
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
            <button className="login-input login-btn" type="submit" disabled={isLoading}>
            {isLoading ? (
                <FontAwesomeIcon icon={faSpinner} spin /> // Show spinner when loading
              ) : (
                "Submit"
              )}
               </button>

          </form>
          <Link to="/register" className="register-link">
           <href>Create an Account</href> 
          </Link>
        </div>
      </div>
    </div>
  );
};
