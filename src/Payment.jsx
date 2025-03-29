import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const Payment = () => {
  const paymentlocation = useLocation();
  const navigate = useNavigate();
  const bookingDetails = paymentlocation.state;

  if (!bookingDetails) {
    return (
      <div className="text-center text-red-500">No booking details found!</div>
    );
  }

  // Function to initiate Razorpay payment
  const handleRazorpayPayment = async () => {
    try {
      const amountInPaise = Math.round(bookingDetails.totalPrice * 1.13);

      console.log("Requesting order creation with amount:", amountInPaise);

      // 1️⃣ Call Backend API to Create Order
      const response = await axios.post(
        "https://rental-app-node.onrender.com/payment/create-order",
        { amount: amountInPaise }
      );

      console.log("Full API response:", response);

      const { data } = response;
      console.log("Data from API:", data);

      if (!data || !data.order || !data.order.id) {
        console.error("Missing order data in response:", data);
        alert("Payment Initialization Failed: Order ID missing");
        return;
      }

      // 2️⃣ Setup Razorpay Payment Options
      const options = {
        key: data.key, // Razorpay Key from Backend
        amount: data.order.amount, // Amount in paise
        currency: "INR",
        name: "kowshic",
        description: `Payment for booking ${bookingDetails.modelName}`,
        order_id: data.order.id,
        handler: async function (response) {
          alert(
            `Payment successful! Payment ID: ${response.razorpay_payment_id}`
          );
          try {
            const verifyResponse = await axios.post(
              "https://rental-app-node.onrender.com/payment/verify-payment",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                bookingDetails: bookingDetails,
              }
            );

            if (verifyResponse.data.success) {
              alert("Payment verification successful!");
              const storedRole = localStorage.getItem("user_role");

              if (storedRole === "customer") {
                navigate("/dashboard/customer", { replace: true });
              } else if (storedRole === "owner") {
                navigate("/dashboard/owner", { replace: true });
              }
            } else {
              alert("Payment verification failed!");
            }
          } catch (error) {
            console.error("Payment verification error:", error);
            alert("Error verifying payment. Please contact support.");
          }
        },
        prefill: {
          name: bookingDetails.userName,
          email: bookingDetails.userEmail,
          contact: bookingDetails.userPhone,
        },
        theme: {
          color: "#3399cc",
        },
      };

      console.log("Opening Razorpay Checkout:", options);
      if (!window.Razorpay) {
        alert(
          "Razorpay SDK failed to load. Make sure you have an active internet connection."
        );
        return;
      }
      // 3️⃣ Open Razorpay Checkout
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Error initializing payment:", error);
      alert("Payment Initialization Failed");
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: "url('/booking_bg.jpg')" }}
    >
      <div className="bg-white bg-opacity-90 p-6 rounded-lg shadow-lg w-full max-w-xl">
        <h2 className="text-2xl font-bold text-center mb-4">Payment Page</h2>
        <div>
          <p>{bookingDetails.userName}</p>
          <p>{bookingDetails.userEmail}</p>
          <p>{bookingDetails.userPhone}</p>
        </div>
        <hr></hr>
        <div>
          <div className="flex justify-between">
            <span className="flex flex-col">
              <p>
                <strong>Car Model:</strong> {bookingDetails.modelName}
              </p>
              <p>
                <strong>Car Number:</strong> {bookingDetails.vehicleNumber}
              </p>
              <p>
                <strong>Car Location:</strong> {bookingDetails.location}
              </p>
            </span>
            <span className="flex flex-col">
              <strong>Rent Date :</strong> {bookingDetails.rentalDate}
              <strong>Return Date :</strong> {bookingDetails.returnDate}
            </span>
          </div>
          <hr />
          <div className="flex flex-col items-center justify-center">
            <p>
              <strong>Price for {bookingDetails.totalDays} day(s): </strong> ₹{" "}
              {bookingDetails.totalPrice} + ₹{" "}
              {(bookingDetails.totalPrice * 0.13).toFixed(2)} GST
            </p>
            <p>
              <strong>Total Price (incl GST):</strong> ₹{" "}
              {(bookingDetails.totalPrice * 1.13).toFixed(2)}
            </p>
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <button
            className=" bg-blue-500 text-white py-3 px-6 rounded-md cursor-pointer hover:bg-blue-600"
            onClick={handleRazorpayPayment}
          >
            Pay with Razorpay
          </button>
        </div>
      </div>
    </div>
  );
};

export default Payment;
