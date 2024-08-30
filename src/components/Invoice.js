import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, deleteDoc, doc, getDocs, query, where } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { faSpinner } from '@fortawesome/free-solid-svg-icons'; // Import spinner icon
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
export const Invoice = () => {
  const [invoice, setInvoice] = useState([]);
  const [isLoading,setLoading] =useState(false)
  const navigate = useNavigate();


  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {

    setLoading(true)
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 3000000);

    const q = query(collection(db, 'invoices'), where('uid', "==", localStorage.getItem('uid')));
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setInvoice(data);

    clearTimeout(timeout);
    setLoading(false)
  };

  const deleteInvoice = async (id) => {
    const isSure = window.confirm("Are you sure want to delete this invoice?");
    if (isSure) {
      try {
        await deleteDoc(doc(db, "invoices", id));
        getData();
      } catch {
        window.alert("Something went wrong");
      }
    }
  };

  return (
    <div className="invoice-container">
      <div style={{display:'flex',justifyContent:'center',alignItems:'center'}} className="myyy">
      {isLoading ? (
                <FontAwesomeIcon style={{fontSize:80}} icon={faSpinner} spin /> // Show spinner when loading
              ) : (
                " "
              )}
              </div>
      {invoice.map((data) => (
        <div className="invoice-box" key={data.id}>
          <div className="invoice-details">
            <p className="customer-name">{data.billedTo?.name || 'No Name Available'}</p>
            <p className="shipped-to-name">{data.shippedTo?.name || "No Name Provided"}</p>
            <p className="invoice-date">{new Date(data.date.seconds * 1000).toLocaleDateString()}</p>
            <p className="invoice-total">Rs. {data.grandTotal}</p>
          </div>
          <div className="invoice-actions">
            <button
              onClick={() => deleteInvoice(data.id)}
              className="delete-btn"
            >
              Delete
            </button>
            <button
              onClick={() => navigate("/dashboard/invoicedetail", { state: data })}
              className="view-btn"
            >
              View
            </button>
            <button
              onClick={() => navigate("/updatefile", { state: { invoice: data, isEdit: true } })}
              className="Edit-btn"
            >
              Edit
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
