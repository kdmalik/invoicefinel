import React, { useRef, useState } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import { auth, storage, db } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons'; // Import spinner icon

export const Register = () => {
  const inputlogo = useRef(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [file, setFile] = useState(null);
  const [imagUrl,setImageUrl] =useState(null)
  const [isLoading,setLoading] =useState(false)

  const navigate = useNavigate();

  const onSelectFile = (e) =>{
    setFile(e.target.files[0])
    setImageUrl(URL.createObjectURL(e.target.files[0]))
  }

  const submitHandler = (e) => {
    e.preventDefault();
    setLoading(true);
    console.log(email, password);
  
    createUserWithEmailAndPassword(auth, email, password)
      .then((newuser) => {
        console.log(newuser);
        const date = new Date().getTime();
        const storageRef = ref(storage, `${displayName + date}`); // Corrected line
        uploadBytesResumable(storageRef, file).then((res) => {
          console.log(res);
          getDownloadURL(storageRef).then((downloadedUrl) => {
            console.log(downloadedUrl);
  
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

           newuser.user.getIdToken().then((token) => {
              console.log("JWT Token:", token);

              // JWT Token ko local storage me save karo
              localStorage.setItem("token", token);
              localStorage.setItem("cName", displayName);
              localStorage.setItem("photoURL", downloadedUrl);
              localStorage.setItem("email", newuser.user.email);
              localStorage.setItem("uid", newuser.user.uid);

              navigate("/dashboard");
              setLoading(false);
            });
          });
        });
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
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
                setDisplayName(e.target.value);
              }}
              className="login-input"
              type="text"
              placeholder="Company Name"
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
            <input
              
              onChange={(e) => {
                onSelectFile(e)
              }}
              style={{ display: "none" }}
              className="login-input"
              type="file"
              ref={inputlogo}
            />
            <input
              className="login-input"
              type="button"
              value="Select Your Logo"
              onClick={() => {
                inputlogo.current.click();
              }}
              
            />
            {imagUrl != null && <img className="image-preview" src={imagUrl} alt="preview" />}
            <button className="login-input login-btn" type="submit" disabled={isLoading} >
            {isLoading? (
                <FontAwesomeIcon icon={faSpinner} spin /> // Show spinner when loading
              ) : (
                ""
              )}
                Submit
              </button>
          </form>
          <Link to="/login" className="register-link">
            Login With Your Account
          </Link>
        </div>
      </div>
    </div>
  );
};