import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { storage } from "../firebase.js"; // import Firebase storage
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import emailjs from "emailjs-com"; // import EmailJS

export const InvoiceDetails = () => {
  const location = useLocation();
  const { state } = location;
  const [data, setData] = useState(null);
  const invoiceRef = useRef(null);

  useEffect(() => {
    const fetchInvoiceData = async () => {
      try {
        if (state) {
          const invoiceData = state;
          const userUid = localStorage.getItem("uid");

          if (invoiceData.uid === userUid) {
            setData(invoiceData);
          } else {
            console.log("This invoice does not belong to the current user.");
          }
        } else {
          console.log("No invoice data found!");
        }
      } catch (error) {
        console.error("Error fetching invoice data: ", error);
      }
    };

    fetchInvoiceData();
  }, [state]);

  if (!data) {
    return <p>No data found</p>;
  }

  const subtotal = data.products.reduce(
    (acc, product) => acc + product.amount,
    0
  );
  const grandTotal = subtotal + data.totalTax;

  // Function to convert number to words (same as before)
  const numberToWords = (num) => {
    const a = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];
    const b = [
      "",
      "",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];
    const g = [
      "",
      "Thousand",
      "Million",
      "Billion",
      "Trillion",
      "Quadrillion",
      "Quintillion",
    ];

    if (typeof num !== "number" || num < 0) return "Invalid input";

    if (num === 0) return "Zero";

    let words = "";
    let number = num.toString();
    let start = number.length;
    let chunks = [];

    while (start > 0) {
      const end = Math.max(start - 3, 0);
      chunks.unshift(number.slice(end, start));
      start = end;
    }

    for (let i = 0; i < chunks.length; i++) {
      let chunk = parseInt(chunks[i]);

      if (chunk) {
        let chunkWords = "";

        if (chunk > 99) {
          chunkWords += a[Math.floor(chunk / 100)] + "  ";
          chunk %= 100;
        }
        if (chunk > 19) {
          chunkWords += b[Math.floor(chunk / 10)] + " ";
          chunk %= 10;
        }

        if (chunk > 0) {
          chunkWords += a[chunk] + " ";
        }

        words += chunkWords + g[chunks.length - 1 - i] + " ";
      }
    }

    return words.trim() + " Only";
  };

  const printInvoice = () => {
    const input = invoiceRef.current;
    html2canvas(input).then((canvas) => {
      const imageData = canvas.toDataURL("image/png", 1.0);
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: [612, 792],
      });
      pdf.internal.scaleFactor = 1;
      const imageProps = pdf.getImageProperties(imageData);
      const pdfwidth = pdf.internal.pageSize.getWidth();
      const pdfHight = (imageProps.height * pdfwidth) / imageProps.width;

      pdf.addImage(imageData, "PNG", 0, 0, pdfwidth, pdfHight);
      pdf.save("invoice" + new Date());
    });
  };

  const sendEmailWithInvoice = () => {
    const input = invoiceRef.current;
    html2canvas(input).then((canvas) => {
      const imageData = canvas.toDataURL("image/png", 1.0);
      const storageRef = ref(storage, `invoices/${data.invoiceNo}.png`);

      uploadString(storageRef, imageData, "data_url")
        .then(() => {
          return getDownloadURL(storageRef);
        })
        .then((downloadURL) => {
      
          const emailParams = {
            to_email: data.billedTo.email, 
            from_name: data.companyName,
            subject: `Invoice #${data.invoiceNo}`,
            message: `Please find your invoice attached. You can also download it from the following link: ${downloadURL}`,
          };

          
          emailjs
            .send(
              "service_g2348sh",
              "template_ori725j", 
              emailParams,
              "ErJHgIM8qLrffa_RT"
            )
            .then((response) => {
              console.log(
                "Email sent successfully!",
                response.status,
                response.text
              );
              alert("Email sent Succesfully");
            })
            .catch((error) => {
              console.error("Failed to send email:", error);
            });
        })
        .catch((error) => {
          console.error("Error uploading image to Firebase:", error);
        });
    });
  };

  return (
    <div>
      <div className="invoice-top-header" >
        <button onClick={printInvoice} className="print-btn" style={{margin:5}}>
          Print
        </button>
        <button onClick={sendEmailWithInvoice} className="email-btn print-btn" style={{margin:5}}>
          Send Email
        </button>
      </div>
      <div
        ref={invoiceRef}
        className="p-6 max-w-4xl mx-auto border border-black bg-white "
      >
        <div className="border border-black">
          <div className="flex justify-between">
            <img
              className="company-logo "
              alt="logo"
              src={localStorage.getItem("photoURL")}
            />
            <span className="font-bold text-lg mx-2">
              GSTIN:{data.companyGstin}
            </span>
            <p>Original Copy</p>
          </div>
          <div className="text-center mb-6 ">
            <h1 className="text-xm font-bold underline uppercase">
              Tax Invoice
            </h1>
            <span className="font-bold text-2xl m-5"> {data.companyName}</span>
            <p></p>
            <span className="font-bold"> {data.companyAddress}</span>
            <p></p>
            <span className="font-bold">
              Emali:- {data.companyEmail} +91{data.companyContact}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 border border-black">
          <div className=" border-black border-r h-full p-5">
            <div className="flex justify-start gap-10">
              <span className="font-semibold">Invoice No.</span>
              <span>: {data.invoiceNo}</span>
            </div>
            <div className="flex justify-start gap-3">
              <span className="font-semibold">Date of Invoice</span>
              <span>
                : {new Date(data.date.seconds * 1000).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-start gap-2">
              <span className="font-semibold">Place of Supply</span>
              <span>: {data.placeOfSupply}</span>
            </div>
            <div className="flex justify-start gap-4">
              <span className="font-semibold">Invoice Month</span>
              <span>: {data.invoiceMonth}</span>
            </div>
          </div>

          <div className="flex flex-col justify-between p-5">
            <div className="flex justify-start">
              <span className="font-semibold">GR/RR No. :</span>
              <span></span>
            </div>
            <div className="flex justify-start flex-col">
              <span className="font-semibold">Transport</span>
              <span>Vehicle No.</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 border border-black">
          <div className="border-black border-r h-full p-5">
            <h2 className="font-semibold mb-2">Billed To:</h2>
            <p>{data.billedTo.name}</p>
            <p>{data.billedTo.address}</p>
            <p className="mt-5">
              {" "}
              <span className="font-bold">GSTIN:</span> {data.billedTo.GSTIN}
            </p>
          </div>
          <div className="p-5">
            <h2 className="font-semibold mb-2">Shipped To:</h2>
            <p>{data.shippedTo.name}</p>
            <p>{data.shippedTo.address}</p>
            <p className="mt-5">
              {" "}
              <span className="font-bold">GSTIN:</span> {data.shippedTo.GSTIN}
            </p>
          </div>
        </div>

        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="border-x border-b border-black px-6 py-2 text-left w-5">
                S.N
              </th>
              <th className="border-r border-b border-black px-6 py-2 text-left ">
                {data.yourInvoise}
              </th>
              <th className="border-r border-b border-black px-6 py-2 w-96 text-center">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {data.products.map((product, index) => (
              <tr key={index}>
                <td className="border-x border-b border-black px-6 py-2">
                  {index + 1}
                </td>
                <td className="border-r border-b border-black px-6 py-2">
                  {product.resource}
                </td>
                <td className="border-r border-b border-black px-6 py-2 text-center">
                  ₹{product.amount}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td
                colSpan="2"
                className="border-x border-b border-black px-6 py-2 text-right"
              >
                SubTotal
              </td>
              <td className="border-r border-b border-black px-6 py-2 text-center">
                ₹{subtotal}
              </td>
            </tr>
            <tr>
              <td
                colSpan="2"
                className="border-x border-b border-black px-6 py-2 text-right"
              >
                GST
              </td>
              <td className="border-r border-b border-black px-6 py-2 text-center">
                ₹{data.totalTax}
              </td>
            </tr>
            <tr>
              <td
                colSpan="2"
                className="border-x border-b border-black px-6 py-2 text-right "
              >
                <div className="flex items-start gap-4">
                  <div className="flex items-start flex-col">
                    <p className="font-semibold">HSN/SAC Code</p>
                    <p>{data.hsnSacCode}</p>
                  </div>
                  <div className="flex items-start flex-col">
                    <p className="font-semibold">Tax Rate</p>
                    <p>{data.taxRate}%</p>
                  </div>
                  <div className="flex items-start flex-col">
                    <p className="font-semibold">Taxable Amount</p>
                    <p>₹{data.taxableAmount}</p>
                  </div>
                  <div className="flex items-start flex-col">
                    <p className="font-semibold">Total Tax</p>
                    <p>₹{data.totalTax}</p>
                  </div>
                </div>
                <div className="flex item-start mt-5">
                  <p className="font-semibold">{numberToWords(grandTotal)}</p>
                </div>
              </td>
              <td className="flex items-center flex-col">
                <span className="flex items-start flex-col font-bold">
                  Grand Total
                </span>
                ₹{grandTotal}
              </td>
            </tr>
          </tfoot>
        </table>

        <div className="grid grid-cols-2 gap-4 border border-black">
          <div className="border-black border-r h-full p-5">
            <h2 className="font-semibold mb-2">Terms & Conditions</h2>
            <p>{data.terms}</p>
          </div>
          <div className="p-5 font-semibold text-right">
            <h2 className="mb-2 text-left">Receivers Signature</h2>
            <p className="underline">FOR:- {data.companyName}</p>
            <p className="mx-4">Authorized </p>
            <p className="text-left">Signatory</p>
          </div>
        </div>

        <div className="text-center mt-6">
          <p className="text-sm italic underline">
            *This is a computer generated invoice, signature and stamp not
            required
          </p>
        </div>
      </div>
    </div>
  );
};
