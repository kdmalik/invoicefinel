import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { addDoc, collection, Timestamp, doc, updateDoc } from "firebase/firestore";
import { useNavigate, useLocation } from "react-router-dom";

export const UpdateFile = () => {
  const [invoiceNo, setInvoiceNo] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [placeOfSupply, setPlaceOfSupply] = useState("");
  const [invoiceMonth, setInvoiceMonth] = useState("");
  const [companyName, setCompanyName] = useState ("");
  const [companyAddress ,setCompanyAddress] =useState("");
  const [companyEmail ,setCompanyEmail] =useState("");
  const [companyContact ,setCompanyContact] =useState("");
  const [companyGstin ,setCompanyGstin] = useState("");
  

  const [billedToName, setBilledToName] = useState("");
  const [billedToAddress, setBilledToAddress] = useState("");
  const [billedToGSTIN, setBilledToGSTIN] = useState("");

  const [shippedToName, setShippedToName] = useState("");
  const [shippedToAddress, setShippedToAddress] = useState("");
  const [shippedToGSTIN, setShippedToGSTIN] = useState("");

  const [resource, setResource] = useState("");
  const [amount, setAmount] = useState("");
  const [products, setProducts] = useState([]);

  const [hsnSacCode, setHsnSacCode] = useState("");
  const [taxRate, setTaxRate] = useState(18); // Default 18% GST
  const [taxableAmount, setTaxableAmount] = useState(0);
  const [totalTax, setTotalTax] = useState(0);
  const [terms, setTerms] = useState("1. Interest @ 18% p.a. will be charged if the payment is not made within the stipulated time. \n2. Subject to 'Delhi' Jurisdiction only.");

  const navigate = useNavigate();
  const location = useLocation();
  const invoiceData = location.state?.invoice; // Access invoice from state
  const isEdit = location.state?.isEdit || false; // Check if it's for edit

  useEffect(() => {
    if (isEdit && invoiceData) {
      // Populate fields with existing data for editing
      setInvoiceNo(invoiceData.invoiceNo || "");
      setInvoiceDate(invoiceData.invoiceDate || "");
      setPlaceOfSupply(invoiceData.placeOfSupply || "");
      setInvoiceMonth(invoiceData.invoiceMonth || "");
      setCompanyName(invoiceData.companyName || "");
      setCompanyAddress(invoiceData.companyAddress || "");
      setCompanyEmail(invoiceData.companyEmail || "");
      setCompanyContact(invoiceData.companyContact ||"");
      setCompanyGstin(invoiceData.companyGstin || "");
      

      setBilledToName(invoiceData.billedTo?.name || "");
      setBilledToAddress(invoiceData.billedTo?.address || "");
      setBilledToGSTIN(invoiceData.billedTo?.GSTIN || "");

      setShippedToName(invoiceData.shippedTo?.name || "");
      setShippedToAddress(invoiceData.shippedTo?.address || "");
      setShippedToGSTIN(invoiceData.shippedTo?.GSTIN || "");

      setProducts(invoiceData.products || []);
      setTaxableAmount(invoiceData.taxableAmount || 0);
      setTotalTax(invoiceData.totalTax || 0);
      setHsnSacCode(invoiceData.hsnSacCode || "");
      setTaxRate(invoiceData.taxRate || 18);
      setTerms(invoiceData.terms || "");
    }
  }, [invoiceData, isEdit]);

  const addProduct = () => {
    if (resource === "" || amount === "") {
      alert("Please fill in all the product fields.");
      return;
    }

    const productAmount = parseFloat(amount);
    const taxAmount = productAmount * (taxRate / 100);
    const grandTotal = productAmount + taxAmount;

    setProducts([...products, { id: products.length, resource, amount: productAmount }]);
    setTaxableAmount(prev => prev + productAmount);
    setTotalTax(prev => prev + taxAmount);

    setResource("");
    setAmount("");
  };

  const saveData = async () => {
    if (invoiceNo === "" || billedToName === "" || products.length === 0) {
      alert("Please fill in all fields before saving.");
      return;
    }

    const data = {
      invoiceNo,
      invoiceDate,
      placeOfSupply,
      invoiceMonth,
      companyName,
      companyAddress,
      companyEmail,
      companyContact,
      companyGstin,
      
      billedTo: {
        name: billedToName,
        address: billedToAddress,
        GSTIN: billedToGSTIN,
      },
      shippedTo: {
        name: shippedToName,
        address: shippedToAddress,
        GSTIN: shippedToGSTIN,
      },
      products,
      taxableAmount,
      totalTax,
      grandTotal: taxableAmount + totalTax,
      hsnSacCode,
      taxRate,
      terms,
      uid: localStorage.getItem("uid"),
      date: Timestamp.fromDate(new Date()),
    };

    if (isEdit && invoiceData && invoiceData.id) {
      // Update existing invoice
      await updateDoc(doc(db, "invoices", invoiceData.id), data);
    } else {
      // Add new invoice
      await addDoc(collection(db, "invoices"), data);
    }

    navigate("/dashboard/invoice");
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Update Any Details</h2>
        <button onClick={saveData} className="bg-blue-500 text-white px-4 py-2 rounded">Udate Data</button>
      </div>
      <form className="space-y-4 mt-4">
        <div className="grid grid-cols-2 gap-4">
          <input onChange={(e) => setInvoiceNo(e.target.value)} placeholder="Invoice No" value={invoiceNo} className="border p-2" />
          <input onChange={(e) => setInvoiceDate(e.target.value)} placeholder="Date of Invoice" value={invoiceDate} className="border p-2" />
          <input onChange={(e) => setPlaceOfSupply(e.target.value)} placeholder="Place of Supply" value={placeOfSupply} className="border p-2" />
          <input onChange={(e) => setInvoiceMonth(e.target.value)} placeholder="Invoice Month" value={invoiceMonth} className="border p-2" />
          <input onChange={(e) => setCompanyName(e.target.value)} placeholder="Company Name" value={companyName} className="border p-2" />
          <input onChange={(e) => setCompanyAddress(e.target.value)} placeholder="Company Address" value={companyAddress} className="border p-2" />
          <input onChange={(e) => setCompanyEmail(e.target.value)} placeholder="Company Email" value={companyEmail} className="border p-2" />
          <input onChange={(e) => setCompanyContact(e.target.value)} placeholder="Company Contact" value={companyContact} className="border p-2" />
          <input onChange={(e) => setCompanyGstin(e.target.value)} placeholder="Company GSTIN" value={companyGstin} className="border p-2" />
        </div>
        
        <h3 className="text-md font-semibold mt-4">Billed To</h3>
        <input onChange={(e) => setBilledToName(e.target.value)} placeholder="Name" value={billedToName} className="border p-2 w-full" />
        <input onChange={(e) => setBilledToAddress(e.target.value)} placeholder="Address" value={billedToAddress} className="border p-2 w-full" />
        <input onChange={(e) => setBilledToGSTIN(e.target.value)} placeholder="GSTIN" value={billedToGSTIN} className="border p-2 w-full" />
        
        <h3 className="text-md font-semibold mt-4">Shipped To</h3>
        <input onChange={(e) => setShippedToName(e.target.value)} placeholder="Name" value={shippedToName} className="border p-2 w-full" />
        <input onChange={(e) => setShippedToAddress(e.target.value)} placeholder="Address" value={shippedToAddress} className="border p-2 w-full" />
        <input onChange={(e) => setShippedToGSTIN(e.target.value)} placeholder="GSTIN" value={shippedToGSTIN} className="border p-2 w-full" />
        
        {/* <h3 className="text-md font-semibold mt-4">Products</h3>
        <div className="flex gap-2">
          <input onChange={(e) => setResource(e.target.value)} placeholder="Product Resource" value={resource} className="border p-2 w-full" />
          <input onChange={(e) => setAmount(e.target.value)} placeholder="Amount" value={amount} className="border p-2 w-full" />
          <button onClick={(e) => { e.preventDefault(); addProduct(); }} className="bg-green-500 text-white px-4 py-2 rounded">Add Product</button>
        </div> */}
        
        {/* <div className="mt-4">
          <table className="w-full border-collapse border">
            <thead>
              <tr>
                <th className="border p-2">Resource</th>
                <th className="border p-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id}>
                  <td className="border p-2">{product.resource}</td>
                  <td className="border p-2">{product.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-2">Taxable Amount: Rs. {taxableAmount.toFixed(2)}</p>
          <p>Total Tax: Rs. {totalTax.toFixed(2)}</p>
          <p className="font-bold">Grand Total: Rs. {(taxableAmount + totalTax).toFixed(2)}</p>
        </div> */}
        
        {/* <input onChange={(e) => setHsnSacCode(e.target.value)} placeholder="HSN/SAC Code" value={hsnSacCode} className="border p-2 w-full mt-4" />
        <input onChange={(e) => setTaxRate(e.target.value)} type="number" placeholder="Tax Rate (%)" value={taxRate} className="border p-2 w-full mt-4" />
        <textarea onChange={(e) => setTerms(e.target.value)} placeholder="Terms & Conditions" value={terms} className="border p-2 w-full mt-4" /> */}
      </form>
    </div>
  );
};
