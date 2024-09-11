import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, deleteDoc, doc, getDocs, query, where } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export const Invoice = () => {
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [invoicesPerPage] = useState(10);

  const navigate = useNavigate();

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    filterInvoices();
  }, [invoices, searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const getData = async () => {
    setLoading(true);
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 3000000);

    const q = query(collection(db, 'invoices'), where('uid', "==", localStorage.getItem('uid')));
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setInvoices(data);

    clearTimeout(timeout);
    setLoading(false);
  };

  const filterInvoices = () => {
    if (!searchTerm) {
      setFilteredInvoices(invoices);
    } else {
      const lowercasedTerm = searchTerm.toLowerCase();
      const filtered = invoices.filter(data =>
        data.billedTo?.name.toLowerCase().includes(lowercasedTerm) ||
        data.shippedTo?.name.toLowerCase().includes(lowercasedTerm)
      );
      setFilteredInvoices(filtered);
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedInvoices(filteredInvoices.map(invoice => invoice.id));
    } else {
      setSelectedInvoices([]);
    }
  };

  const handleSelectInvoice = (e, id) => {
    if (e.target.checked) {
      setSelectedInvoices([...selectedInvoices, id]);
    } else {
      setSelectedInvoices(selectedInvoices.filter(selectedId => selectedId !== id));
    }
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

  const deleteSelectedInvoices = async () => {
    const isSure = window.confirm("Are you sure you want to delete selected invoices?");
    if (isSure) {
      try {
        for (const id of selectedInvoices) {
          await deleteDoc(doc(db, "invoices", id));
        }
        setSelectedInvoices([]);
        getData();
      } catch {
        window.alert("Something went wrong");
      }
    }
  };

  const downloadPDF = async () => {
    const element = document.getElementById("invoice-content");
    if (!element) {
      console.error("Element with id 'invoice-content' not found.");
      return;
    }
    try {
      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      const imgWidth = 210; 
      const imgHeight = (canvas.height * imgWidth) / canvas.width; 
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save('invoice.pdf');
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  const indexOfLastInvoice = currentPage * invoicesPerPage;
  const indexOfFirstInvoice = indexOfLastInvoice - invoicesPerPage;
  const currentInvoices = filteredInvoices.slice(indexOfFirstInvoice, indexOfLastInvoice);

  const totalPages = Math.ceil(filteredInvoices.length / invoicesPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6 flex justify-between items-center bg-gradient-to-r from-teal-400 to-blue-500 p-4 rounded-lg shadow-md">
        <input
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-teal-500"
        />
        <button 
          onClick={deleteSelectedInvoices} 
          className="ml-4 bg-pink-500 text-white px-4 py-2 rounded-md hover:bg-pink-400 transition duration-200"
          disabled={selectedInvoices.length === 0}
        >
          Delete Selected
          
        </button>
        <p>&nbsp;</p>
        <button 
          onClick={downloadPDF}
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-200"
        >
          Download PDF
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center">
          <FontAwesomeIcon className="text-blue-600 text-4xl" icon={faSpinner} spin />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-teal-100 to-blue-100 py-3 px-4 rounded-t-lg font-semibold text-gray-700 grid grid-cols-12 gap-4">
            <div className="col-span-1 flex items-center justify-center">
              <input 
                type="checkbox" 
                checked={selectedInvoices.length === filteredInvoices.length} 
                onChange={handleSelectAll} 
              />
            </div>
            <div className="col-span-1 flex items-center justify-center">S.No.</div>
            <div className="col-span-3 flex items-center justify-center">Billed To</div>
            <div className="col-span-3 flex items-center justify-center">Shipped To</div>
            <div className="col-span-2 flex items-center justify-center">Payment</div>
            <div className="col-span-2 flex items-center justify-center">Date</div>
          </div>

          <div id="invoice-content">
            {currentInvoices.map((data, index) => (
              <div key={data.id} className="bg-white shadow-lg rounded-lg overflow-hidden grid grid-cols-12 gap-4 items-center py-4 px-4 hover:shadow-xl transition-shadow duration-200">
                <div className="col-span-1 flex items-center justify-center">
                  <input 
                    type="checkbox" 
                    checked={selectedInvoices.includes(data.id)} 
                    onChange={(e) => handleSelectInvoice(e, data.id)} 
                  />
                </div>
                <div className="col-span-1 text-center font-semibold text-gray-700">
                  {indexOfFirstInvoice + index + 1}
                </div>
                <div className="col-span-3 flex flex-col items-center">
                  <p className="text-lg font-bold text-gray-800">{data.billedTo?.name || 'No Name Available'}</p>
                </div>
                <div className="col-span-3 flex flex-col items-center">
                  <p className="text-lg font-bold text-gray-800">{data.shippedTo?.name || "No Name Provided"}</p>
                </div>
                <div className="col-span-2 flex items-center justify-center">
                  <p className="text-lg font-bold text-gray-800">₹ {data.grandTotal}</p>
                </div>
                <div className="col-span-2 flex items-center justify-center">
                  <p className="text-base font-bold text-gray-800">{new Date(data.date.seconds * 1000).toLocaleDateString()}</p>
                </div>
                <div className="col-span-12 flex justify-end space-x-3 mt-4">
                  <button 
                    onClick={() => deleteInvoice(data.id)} 
                    className="bg-pink-500 text-white px-4 py-2 rounded-md hover:bg-pink-600 transition duration-200"
                  >
                    Delete
                  </button>
                  <button 
                    onClick={() => navigate("/dashboard/invoicedetail", { state: data })} 
                    className="bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600 transition duration-200"
                  >
                    View
                  </button>
                  <button 
                    onClick={() => navigate("/updatefile",{ state: { invoice: data, isEdit: true } })}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200"
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center py-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600 transition duration-200"
            >
              Previous
            </button>
            <div className="text-gray-700">
              Page {currentPage} of {totalPages}
            </div>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600 transition duration-200"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};