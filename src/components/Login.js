import React, { useState } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
        localStorage.setItem("cName", user.displayName);
        localStorage.setItem("photoURL", user.photoURL);
        localStorage.setItem("email", user.email);
        localStorage.setItem("uid",user.uid);
        navigate("/dashboard");
      })
      .catch((error) => {
        console.log(error);
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
            />
            <input
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              className="login-input"
              type="password"
              placeholder="Password"
            />
            <input className="login-input login-btn" type="submit" />
          </form>
          <Link to="/register" className="register-link">
           <href>Create an Account</href> 
          </Link>
        </div>
      </div>
    </div>
  );
};
