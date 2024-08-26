import React from "react";
import "./Dashboard.css";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";


export const Dashboard = () => {
  const navigate = useNavigate()
       const logout = () =>{
        signOut(auth).then(()=>{
        localStorage.clear()
        navigate('/login')
        }).catch((error) =>{
          console.log(error)
        });
       }
  return (
    <div className="dashboard-wrapper">
      <div className="side-nav">
        <div className="profile-info">
          <img src={localStorage.getItem("photoURL")} />
          <div>
            <p>{localStorage.getItem("cName")}</p>
          </div>
          <button onClick={logout}>logout</button>
        </div>
        <hr />
        <div className="menu">
          <Link to="/dashboard/invoice" className="menu-link">
            Invoice
          </Link>
          <Link to="/dashboard/home" className="menu-link">
            Home
          </Link>
          <Link to="/dashboard/newinvoice" className="menu-link">
            New Invoice
          </Link>
          <Link to="/dashboard/setting" className="menu-link">
            Setting
          </Link>
        </div>
      </div>
      <div className="main-container">
        <Outlet />
      </div>
    </div>
  );
};
