import React, { useState } from "react";
import { db } from "../firebase";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export const NewInvoice = () => {
  const [invoiceNo, setInvoiceNo] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [placeOfSupply, setPlaceOfSupply] = useState("");
  const [invoiceMonth, setInvoiceMonth] = useState("");
  const [companyName, setCompanyName] = useState ("");
  const [companyAddress ,setCompanyAddress] =useState("");
  const [companyEmail ,setCompanyEmail] =useState("");
  const [companyContact ,setCompanyContact] =useState("");
  const [companyGstin ,setCompanyGstin] = useState("");
  const [yourInvoise , setYourInvoice] =useState("");

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
  const [taxRate, setTaxRate] = useState(""); // Default 18% GST
  const [taxableAmount, setTaxableAmount] = useState(0);
  const [totalTax, setTotalTax] = useState(0);
  const [terms, setTerms] = useState("1. Interest @ 18% p.a. will be charged if the payment is not made within the stipulated time. \n2. Subject to 'Delhi' Jurisdiction only.");

  const navigate = useNavigate();

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
      yourInvoise,
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
   
    await addDoc(collection(db, "invoices"), data);

    navigate("/dashboard/invoice");
  };
  
  return (
    <div className="p-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">New Invoice</h2>
        <button onClick={saveData} className="bg-blue-500 text-white px-4 py-2 rounded">Save Data</button>
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
          <input onChange={(e) => setYourInvoice(e.target.value)} placeholder="What do you want to create an invoice for (Exampel: Resources/Items/Products...." value={yourInvoise} className="border p-2" />
          <input  type="number" onChange={(e) => setTaxRate(e.target.value)} placeholder="Add Your GST Charges" value={taxRate} className="border p-2"/>
        </div>

        <h3 className="text-md font-medium">Billing Information</h3>
        <div className="grid grid-cols-3 gap-4">
          <input onChange={(e) => setBilledToName(e.target.value)} placeholder="Billed to (Name)" value={billedToName} className="border p-2" />
          <input onChange={(e) => setBilledToAddress(e.target.value)} placeholder="Billed to (Address)" value={billedToAddress} className="border p-2" />
          <input onChange={(e) => setBilledToGSTIN(e.target.value)} placeholder="Billed to (GSTIN)" value={billedToGSTIN} className="border p-2" />
        </div>

        <h3 className="text-md font-medium">Shipping Information</h3>
        <div className="grid grid-cols-3 gap-4">
          <input onChange={(e) => setShippedToName(e.target.value)} placeholder="Shipped to (Name)" value={shippedToName} className="border p-2" />
          <input onChange={(e) => setShippedToAddress(e.target.value)} placeholder="Shipped to (Address)" value={shippedToAddress} className="border p-2" />
          <input onChange={(e) => setShippedToGSTIN(e.target.value)} placeholder="Shipped to (GSTIN)" value={shippedToGSTIN} className="border p-2" />
        </div>
 
        <h3 className="text-md font-medium">Product Details</h3>
        <div className="grid grid-cols-2 gap-4">
          <input onChange={(e) => setResource(e.target.value)} placeholder="Resource" value={resource} className="border p-2" />
          <input onChange={(e) => setAmount(e.target.value)} placeholder="Amount" value={amount} className="border p-2" />
         
        </div>
        <button type="button" onClick={addProduct} className="bg-green-500 text-white px-4 py-2 mt-2 rounded">Add Resource</button>

        {products.length > 0 && (
          <div className="mt-4">
            <h3 className="text-md font-medium">Added Resources</h3>
            <div className="grid grid-cols-4 gap-4 mt-2">
              {products.map((product, index) => (
                <div key={index} className="flex justify-between border p-2">
                  <p>{index + 1}. {product.resource}</p>
                  <p>₹{product.amount}</p>
                </div>
              ))}
            </div>
            <div className="mt-2">
              <p><strong>Total Taxable Amount:</strong> ₹{taxableAmount}</p>
              <p><strong>GST ({taxRate}%):</strong> ₹{totalTax}</p>
              <p><strong>Grand Total:</strong> ₹{taxableAmount + totalTax}</p>
            </div>
          </div>
        )}

        <div className="mt-4">
          <h3 className="text-md font-medium">Additional Information</h3>
          <input onChange={(e) => setHsnSacCode(e.target.value)} placeholder="HSN/SAC Code" value={hsnSacCode} className="border p-2 w-full" />
          <textarea onChange={(e) => setTerms(e.target.value)} placeholder="Terms & Conditions" value={terms} className="border p-2 w-full mt-2"></textarea>
        </div>
      </form>
    </div>
  );
};