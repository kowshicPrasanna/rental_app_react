import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, Outlet } from "react-router-dom";
import axios from "axios";

import img1 from "/dashboard_car_1.jpg";
import img2 from "/dashboard_car_2.jpg";
import img3 from "/dashboard_car_3.jpg";

const carImages = [img1, img2, img3];

function Dashboard() {
  const navigate = useNavigate();
  const [currentImage, setCurrentImage] = useState(0);
  const [reviews, setReviews] = useState([]);

  //to check for active booking
  const [booking, setBooking] = useState(null);
  const email = localStorage.getItem("user_email");

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await axios.get(`https://rental-app-node.onrender.com/booking`, {
          params: { email },
        });
        if (response.data.length > 0) {
          setBooking(response.data[0]); // Assuming the first active booking is needed
        }
      } catch (error) {
        console.error("Error fetching booking:", error);
      }
    };

    if (email) fetchBooking();
  }, [email]);

  // Fetch reviews from backend
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get("https://rental-app-node.onrender.com/review"); // Adjust if needed
        setReviews(response.data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };
    fetchReviews();
  }, []);

  // Auto-slide background images every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % carImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Handle Logout
  const handleLogout = () => {
    // Clear token from localStorage
    localStorage.removeItem("carrental_app_token");
    localStorage.removeItem("user_email");
    localStorage.removeItem("user_role");
    // Navigate to login page
    navigate("/");
  };

  // Handle Book Now button click to route to /booking
  const handleBooking = () => {
    navigate("/booking"); // Navigate to the booking page
  };

  const handleDelete = async (bookingId) => {
    if (!bookingId) {
      console.error("booking ID is missing!");
      return;
    }
    try {
      const response = await axios.delete(`https://rental-app-node.onrender.com/booking/cancel`, {
        params: { bookingId },
      });
      if (response.status === 200) {
        alert("Booking cancelled successfully!");
        setBooking(null); 
      }
    } catch (err) {
      console.error("Error deleting vehicle:", err);
    }
  };

  return (
    <div className="flex flex-col">
      {/* Dynamic Background */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
        className="bg-cover bg-center h-screen"
        style={{ backgroundImage: `url(${carImages[currentImage]})` }}
      >
        {/* Navbar */}
        <nav className="w-[90%] mx-auto my-[3rem] flex justify-between ">
          <span className="text-white font-bold font-serif text-[3rem]">
            Zulu Cars
          </span>
          <button
            onClick={handleLogout} // Attach handleLogout function
            className="text-white font-bold font-serif text-[1.5rem] cursor-pointer"
          >
            Logout
          </button>
        </nav>

        {/* Centered Content */}
        <div className="flex flex-col items-center justify-center">
          <p className="lg:m-[10rem] text-white text-[5rem] text-center font-bold">
            Ride with style
          </p>
          <button
            onClick={handleBooking}
            className="bg-white rounded font-bold px-[2rem] py-[1rem] hover:bg-slate-200"
          >
            Book Now
          </button>
        </div>
      </motion.div>
      {/* Booking Section - After motion.div */}
      {booking && (
        <div className="w-[80%] mx-auto bg-white p-4 rounded-lg shadow-lg my-5 flex flex-col items-center">
          <h2 className="text-2xl font-bold pb-4">Your Upcoming Booking</h2>
          <div className=" py-2 flex flex-col items-center">
          <p>
            <strong>Car:</strong> {booking.modelName}
          </p>
          <p>
            <strong>Car Number:</strong> {booking.vehicleNumber}
          </p>
          <p>
            <strong>Pickup Date:</strong>{" "}
            {new Date(booking.rentalDate).toLocaleDateString()}
          </p>
          <p>
            <strong>Drop-off Date:</strong>{" "}
            {new Date(booking.returnDate).toLocaleDateString()}
          </p>
          </div>
          <button
            onClick={() => handleDelete(booking.bookingId)}
            className="px-4 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 cursor-pointer"
          >
            Cancel Booking
          </button>
        </div>
      )}

      <Outlet />
      {/* Customer Reviews Section */}
      <div className="flex flex-col items-center py-10 bg-gray-100 font-serif">
        <div className="mt-20 mb-10">
          <h1 className="flex flex-col items-center justify-center text-6xl font-bold">
            Customer Feedback
          </h1>
        </div>

        {/* Review Slider */}
        <div className="overflow-hidden w-[80%] md:w-[100%]">
          <motion.div
            className="flex gap-6"
            animate={{ x: [-100, 0, 100, 0] }}
            transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
          >
            {reviews.length === 0 ? (
              <p>No reviews yet.</p>
            ) : (
              reviews.map((review) => (
                <motion.div
                  key={review._id}
                  className="bg-white p-6 rounded-lg shadow-md w-80 min-h-[15rem] flex flex-col justify-between"
                  whileHover={{ scale: 1.05 }}
                >
                  <h3 className="font-bold">{review.name}</h3>
                  <p className="text-yellow-500">⭐ {review.rating}/5</p>
                  <p className="text-gray-600 whitespace-normal">
                    {review.description}
                  </p>
                </motion.div>
              ))
            )}
          </motion.div>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="bg-gray-900 text-white py-10">
        <div className="container mx-auto flex flex-wrap justify-between px-6">
          {/* Address Section */}
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h2 className="text-lg font-semibold mb-3">Zulu Cars</h2>
            <p>123 Main Street,</p>
            <p>Chennai, Tamil Nadu, 56789</p>
            <p>India</p>
          </div>

          {/* Contact Section */}
          <div className="w-full md:w-1/3 mb-6 md:mb-0 flex flex-col items-center">
            <h2 className="text-lg font-semibold mb-3">Contact Us</h2>
            <p>Phone: +123 456 7890</p>
            <p>Email: info@example.com</p>
            <p>Support: support@example.com</p>
          </div>

          {/* Links Section */}
          <div className="w-full md:w-1/3 flex flex-col items-end">
            <h2 className="text-lg font-semibold mb-3">Quick Links</h2>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-gray-400">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-400">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-400">
                  Services
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-400">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="text-center mt-6 border-t border-gray-700 pt-4">
          <p>
            &copy; {new Date().getFullYear()} Zulu Cars. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Dashboard;
