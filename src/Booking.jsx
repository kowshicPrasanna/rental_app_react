import React, { useState,useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Booking = () => {
  const [carType, setCarType] = useState("");
  const [rentalDate, setRentalDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [location, setCustomerLocation] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [availableCars, setAvailableCars] = useState([]);
  const [loading, setLoading] = useState(false);
  //Add default use email
  useEffect(() => {
    const storedEmail = localStorage.getItem("user_email"); // Get email from localStorage
    if (storedEmail) {
      setCustomerEmail(storedEmail);
    }
  }, []);
  const navigate = useNavigate();
  const searchSectionRef = useRef(null);
  // Fetch available cars from backend
  const handleSearch = async () => {
    if (searchSectionRef.current) {
      searchSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
    setLoading(true);
    try {
      const response = await axios.get(
        `https://rental-app-node.onrender.com/vehicle/searchvehicles`,
        {
          params: {
            from: rentalDate,
            to: returnDate,
            type: carType,
            location: location,
          },
        }
      );
      setAvailableCars(response.data);
    } catch (error) {
      console.error("Error fetching cars:", error);
    }
    setLoading(false);
  };

  // Handle booking navigation
  const handleBooking = (car) => {
    navigate("/booking-confirmation", {
      state: {
        vehicleId: car.vehicleId,
        modelName: car.modelName,
        vehicleType: car.vehicleType,
        vehicleNumber:car.vehicleNumber,
        location: car.location,
        rentalDate,
        returnDate,
        userName: customerName,
        userEmail: customerEmail,
        userPhone: customerPhone,
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

          {/* Booking Form */}
          <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700">
                  Car Type
                </label>
                <select
                  className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-black"
                  value={carType}
                  onChange={(e) => setCarType(e.target.value)}
                >
                  <option value="">Select the type of vehicle</option>
                  <option value="Sedan">Sedan</option>
                  <option value="SUV">SUV</option>
                  <option value="Hatchback">Hatchback</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700">
                  Rental Date
                </label>
                <input
                  type="date"
                  className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-black"
                  value={rentalDate}
                  onChange={(e) => setRentalDate(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700">
                  Return Date
                </label>
                <input
                  type="date"
                  className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-black"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-black"
                  placeholder="Enter your full name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700">
                  Location
                </label>
                <input
                  type="text"
                  className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-black"
                  placeholder="Enter location"
                  value={location}
                  onChange={(e) => setCustomerLocation(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-black"
                  placeholder="Enter your phone number"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-black"
                placeholder="Enter your email address"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
              />
            </div>

            <div className="flex justify-center mt-6">
              <button
                type="button"
                onClick={handleSearch}
                className="px-6 py-3 bg-black text-white font-semibold rounded-lg cursor-pointer shadow-md hover:bg-gray-400 focus:ring-2 focus:ring-black"
              >
                Search Available Cars
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* New Section Below Background */}
      <div ref={searchSectionRef} className="w-full py-12 bg-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          {loading ? (
            <div className="text-center text-lg">
              Searching for available cars...
            </div>
          ) : availableCars.length > 0 ? (
            <div>
              <h3 className="text-2xl font-semibold mb-6 text-center font-serif py-7">
                Pick your wheels here..
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableCars.map((car) => (
                  <div
                    key={car._id}
                    className="p-6 bg-white rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
                  >
                    {/* Car Image */}
                    <img
                      src={car.vehicleImage}
                      alt={car.vehicleId}
                      className="w-full h-48 object-cover rounded-t-lg mb-4 shadow-md"
                    />

                    {/* Car Details */}
                    <div className="flex flex-col gap-2">
                      <h4 className="text-xl font-semibold text-gray-800">
                        {car.modelName}
                      </h4>
                      <p className="text-sm text-gray-500">
                        Type: {car.vehicleType}
                      </p>
                      <p className="text-sm text-gray-500">
                        Car Number : {car.vehicleNumber}
                      </p>
                      <p className="text-sm text-gray-500">
                        Location: {car.location}
                      </p>
                      <p className="text-xl font-semibold text-black mt-2">
                        ₹ {car.price} per day
                      </p>
                    </div>

                    {/* Book Now Button */}
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
            <div className="text-center text-gray-500">
              No cars available. Try a different search.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Booking;
