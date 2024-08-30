import React, { useState } from "react";
import emailjs from "emailjs-com";
import { useLocation, useNavigate } from "react-router-dom";
import { faSpinner } from '@fortawesome/free-solid-svg-icons'; // Import spinner icon
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const EmailForm = () => {
  const [isLoading,setLoading] = useState(false)
  const location = useLocation();
  const { data, downloadURL } = location.state || {}; // Get invoice data and URL from location state
  const [formValues, setFormValues] = useState({
    to_email: data.billedTo.email || "",
    subject: data.companyNamed || "",
    message: `Please find your invoice attached. You can also download it from the following link: ${downloadURL}`,
   
   
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
   setLoading(true)
    emailjs
      .send(
        "service_g2348sh",
        "template_ori725j",
        formValues,
        "ErJHgIM8qLrffa_RT"
      )
      .then((response) => {
        console.log("Email sent successfully!", response.status, response.text);
        alert("Email sent successfully!");
        navigate(-1); // Navigate back to the invoice details page
      })
      .catch((error) => {
        console.error("Failed to send email:", error);
        alert("Failed to send email.");
        setLoading(false)
      });
  };

  return (
    <div className="max-w-lg mx-auto p-4 bg-white shadow-md rounded-md mt-6">
      <h2 className="text-2xl font-semibold mb-4 text-center">Send Invoice via Email</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">To Email:</label>
          <input
            type="email"
            name="to_email"
            value={formValues.to_email}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Subject:</label>
          <input
            type="text"
            name="subject"
            value={formValues.subject}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          {/* <label className="block text-sm font-medium text-gray-700">Message:</label>
          <textarea
            name="message"
            value={formValues.message || formValues}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            rows="4"
          /> */}
        </div>
        <div className="flex justify-center">
          <button
            type="submit"
            className="w-full md:w-auto px-6 py-2 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {isLoading ? (
                <FontAwesomeIcon icon={faSpinner} spin /> // Show spinner when loading
              ) : (
                ""
              )}
            Send Email
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmailForm;
