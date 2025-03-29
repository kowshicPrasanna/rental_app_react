import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import dayjs from "dayjs";

const BookingConfirmation = () => {
  const paymentlocation = useLocation();
  const navigate = useNavigate();
  const bookingDetails = paymentlocation.state;

  if (!bookingDetails) {
    return (
      <div className="text-center text-red-500">No booking details found!</div>
    );
  }

  const { modelName, vehicleType, vehicleNumber, location,rentalDate, returnDate, userName, userEmail, userPhone, price , vehicleId } = bookingDetails;

  // Calculate total price based on the number of days
  const startDate = dayjs(rentalDate);
  const endDate = dayjs(returnDate);
  const totalDays = endDate.diff(startDate, "day") || 1; // Avoid zero-day rentals
  const totalPrice = totalDays * price;

  const handleProceedToPayment = () => {
    navigate("/payment", { state: { ...bookingDetails, totalPrice, totalDays } });
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: "url('/booking_bg.jpg')" }}
    >
      <div className="bg-white bg-opacity-90 p-6 rounded-lg shadow-lg w-full max-w-4xl opacity-90">
        {/* Title */}
        <h2 className="text-3xl font-bold text-center mb-6">Booking Confirmation</h2>

        {/* Booking Details Container */}
        <div className="flex flex-col md:flex-row">
          {/* Left Section - Car Details */}
          <div className="w-full md:w-1/2 p-6 border-r border-gray-300">
            <h2 className="text-2xl font-bold text-center mb-4">Car Details</h2>
            <p><strong>Model:</strong> {modelName}</p>
            <p><strong>Type:</strong> {vehicleType}</p>
            <p><strong>Car Number:</strong> {vehicleNumber}</p>
            <p><strong>Location:</strong> {location}</p>
            <p><strong>Rental Date:</strong> {rentalDate}</p>
            <p><strong>Return Date:</strong> {returnDate}</p>
            <p className="text-lg font-bold mt-4">Price Per Day: ₹{price}</p>
          </div>

          {/* Right Section - User Details */}
          <div className="w-full md:w-1/2 p-6">
            <h2 className="text-2xl font-bold text-center mb-4">User Details</h2>
            <p><strong>Name:</strong> {userName}</p>
            <p><strong>Email ID:</strong> {userEmail}</p>
            <p><strong>Phone Number:</strong> {userPhone}</p>
            <p className="text-lg font-bold mt-4">Total Days: {totalDays} day(s)</p>
            
          </div>
        </div>
        <p className="text-lg flex justify-center font-bold">Total Price: ₹{totalPrice}</p>
        {/* Proceed to Payment Button (Centered Below) */}
        <div className="flex justify-center mt-6">
          <button
            onClick={handleProceedToPayment}
            className="bg-green-500 text-white py-3 px-6 rounded-md hover:bg-green-600 cursor-pointer"
          >
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
