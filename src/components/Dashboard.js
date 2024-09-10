import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { faCog, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileInvoice } from '@fortawesome/free-solid-svg-icons';
import { faHome } from '@fortawesome/free-solid-svg-icons';

export const Dashboard = () => {
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Function to check if JWT token is expired
  const isTokenExpired = () => {
    const expiryTime = localStorage.getItem("jwtExpiry");
    if (!expiryTime) return true; // If expiry time is not found, consider it expired
    return new Date().getTime() > expiryTime; // Check if the current time is past the expiry time
  };

  // Logout function to clear JWT and related data
  const logout = () => {
    setLoading(true);
    signOut(auth)
      .then(() => {
        localStorage.clear(); // Clear all local storage data
        navigate("/login"); // Redirect to login page
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false); // Stop loading spinner
      });
  };

  // Check JWT token expiry when component mounts
  useEffect(() => {
    if (isTokenExpired()) {
      alert("Session expired. Please login again.");
      logout(); // Call logout function if token is expired
    }
  }, []);

  return (
    <div className="dashboard-wrapper">
      <div className="side-nav">
        <div className="profile-info">
          <img src={localStorage.getItem("photoURL")} alt="Profile" />
          <div>
            <p>{localStorage.getItem("cName")}</p>
          </div>
          <button onClick={logout}>
            {isLoading ? (
              <FontAwesomeIcon icon={faSpinner} spin />
            ) : (
              "Logout"
            )}
          </button>
        </div>
        <hr />
        <div className="menu">
        <Link to="/dashboard/invoice" className="menu-link" style={{ padding: '12px 0' }}>
  <FontAwesomeIcon icon={faFileInvoice} style={{ marginRight: '8px' }} /> Invoice
</Link>

          <Link to="/dashboard/home" className="menu-link" style={{ padding: '12px 0' }}>
  <FontAwesomeIcon icon={faHome} style={{ marginRight: '8px' }} /> Home
</Link>

<Link to="/dashboard/newinvoice" className="menu-link" style={{ padding: '12px 0' }}>
  <FontAwesomeIcon icon={faFileInvoice} style={{ marginRight: '8px' }} />New Invoice
</Link>

<Link to="/dashboard/setting" className="menu-link" style={{ padding: '12px 0' }}>
        <FontAwesomeIcon icon={faCog} style={{ marginRight: '8px' }} /> Setting
      </Link>
        </div>
      </div>
      <div className="main-container">
        <Outlet />
      </div>
    </div>
  );
};
