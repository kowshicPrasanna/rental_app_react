import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const Booking = () => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [availableCars, setAvailableCars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialEmail, setInitialEmail] = useState("");
  const [formValues, setFormValues] = useState(null); // to pass to Book Now
  const navigate = useNavigate();
  const searchSectionRef = useRef(null);

  useEffect(() => {
    const storedEmail = localStorage.getItem("user_email");
    if (storedEmail) {
      setInitialEmail(storedEmail);
    }
  }, []);

  const today = new Date().toISOString().split("T")[0];

  const validationSchema = Yup.object().shape({
    carType: Yup.string().required("Car type is required"),
    rentalDate: Yup.date()
      .required("Rental date is required")
      .min(today, "Rental date cannot be in the past"),
    returnDate: Yup.date()
      .required("Return date is required")
      .min(Yup.ref("rentalDate"), "Return date must be same or after rental date"),
    customerName: Yup.string().required("Name is required"),
    location: Yup.string().required("Location is required"),
    customerPhone: Yup.string()
      .matches(/^[6-9]\d{9}$/, "Enter valid phone number of 10 digit")
      .required("Phone number is required"),
    customerEmail: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
  });

  const handleSearch = async (values) => {
    if (searchSectionRef.current) {
      searchSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/vehicle/searchvehicles`, {
        params: {
          from: values.rentalDate,
          to: values.returnDate,
          type: values.carType,
          location: values.location,
        },
      });
      setAvailableCars(response.data);
      setFormValues(values); // save current form values for booking
    } catch (error) {
      console.error("Error fetching cars:", error);
    }
    setLoading(false);
  };

  const handleBooking = (car) => {
    if (!formValues) return;
    navigate("/booking-confirmation", {
      state: {
        vehicleId: car.vehicleId,
        modelName: car.modelName,
        vehicleType: car.vehicleType,
        vehicleNumber: car.vehicleNumber,
        location: car.location,
        rentalDate: formValues.rentalDate,
        returnDate: formValues.returnDate,
        userName: formValues.customerName,
        userEmail: formValues.customerEmail,
        userPhone: formValues.customerPhone,
        price: car.price,
        vehicleImage: car.vehicleImage,
      },
    });
  };

  return (
    <div>
      {/* Background Image Section */}
      <div
        className="relative min-h-screen flex justify-center items-center bg-cover bg-center"
        style={{ backgroundImage: "url('/booking_bg.jpg')" }}
      >
        <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-6 overflow-y-auto max-h-[90vh] opacity-85">
          <h2 className="text-2xl font-bold text-center mb-6 font-serif">
            Book your car now!!
          </h2>

          <Formik
            initialValues={{
              carType: "",
              rentalDate: "",
              returnDate: "",
              customerName: "",
              customerEmail: initialEmail || "",
              location: "",
              customerPhone: "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleSearch}
            enableReinitialize={true}
          >
            <Form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700">Car Type</label>
                  <Field
                    as="select"
                    name="carType"
                    className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-black"
                  >
                    <option value="">Select the type of vehicle</option>
                    <option value="Sedan">Sedan</option>
                    <option value="SUV">SUV</option>
                    <option value="Hatchback">Hatchback</option>
                  </Field>
                  <ErrorMessage name="carType" component="div" className="text-red-500 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700">Rental Date</label>
                  <Field
                    type="date"
                    name="rentalDate"
                    className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-black"
                  />
                  <ErrorMessage name="rentalDate" component="div" className="text-red-500 text-sm" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700">Return Date</label>
                  <Field
                    type="date"
                    name="returnDate"
                    className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-black"
                  />
                  <ErrorMessage name="returnDate" component="div" className="text-red-500 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700">Full Name</label>
                  <Field
                    type="text"
                    name="customerName"
                    placeholder="Enter your full name"
                    className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-black"
                  />
                  <ErrorMessage name="customerName" component="div" className="text-red-500 text-sm" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700">Location</label>
                  <Field
                    as="select"
                    name="location"
                    className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-black"
                  >
                    <option value="">Enter location</option>
                    <option value="Chennai">Chennai</option>
                    <option value="Trichy">Trichy</option>
                  </Field>
                  <ErrorMessage name="location" component="div" className="text-red-500 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700">Phone Number</label>
                  <Field
                    type="tel"
                    name="customerPhone"
                    placeholder="Enter your phone number"
                    className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-black"
                  />
                  <ErrorMessage name="customerPhone" component="div" className="text-red-500 text-sm" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700">Email Address</label>
                <Field
                  type="email"
                  name="customerEmail"
                  placeholder="Enter your email address"
                  className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-black"
                />
                <ErrorMessage name="customerEmail" component="div" className="text-red-500 text-sm" />
              </div>

              <div className="flex justify-center mt-6">
                <button
                  type="submit"
                  className="px-6 py-3 bg-black text-white font-semibold rounded-lg cursor-pointer shadow-md hover:bg-gray-400 focus:ring-2 focus:ring-black"
                >
                  Search Available Cars
                </button>
              </div>
            </Form>
          </Formik>
        </div>
      </div>

      {/* Car Results Section - OUTSIDE FORMIK */}
      <div ref={searchSectionRef} className="w-full bg-gray-100 py-12 px-4">
        {loading ? (
          <div className="text-center text-lg">Searching for available cars...</div>
        ) : availableCars.length > 0 ? (
          <div className="max-w-7xl mx-auto">
            <h3 className="text-2xl font-semibold mb-6 text-center font-serif">Pick your wheels here..</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableCars.map((car) => (
                <div
                  key={car._id}
                  className="p-6 bg-white rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
                >
                  <img
                    src={car.vehicleImage}
                    alt={car.vehicleId}
                    className="w-full h-48 object-cover rounded-t-lg mb-4 shadow-md"
                  />
                  <div className="flex flex-col gap-2">
                    <h4 className="text-xl font-semibold text-gray-800">{car.modelName}</h4>
                    <p className="text-sm text-gray-500">Type: {car.vehicleType}</p>
                    <p className="text-sm text-gray-500">Car Number: {car.vehicleNumber}</p>
                    <p className="text-sm text-gray-500">Location: {car.location}</p>
                    <p className="text-xl font-semibold text-black mt-2">₹ {car.price} per day</p>
                  </div>
                  <button
                    className="mt-4 w-full py-2 bg-black text-white font-semibold cursor-pointer rounded-md hover:bg-gray-400 transition-all duration-300 ease-in-out"
                    onClick={() => handleBooking(car)}
                  >
                    Book Now
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          formValues && (
            <div className="text-center text-gray-500">No cars available. Try a different search.</div>
          )
        )}
      </div>
    </div>
  );
};

export default Booking;
