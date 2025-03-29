import { useEffect, useState } from "react";
import axios from "axios";

function BookingHistory() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  // const userEmail = localStorage.getItem("userEmail"); // Retrieve user email from local storage

  // useEffect(() => {
  //   if (!userEmail) return;

  //   const fetchBookings = async () => {
  //     try {
  //       console.log("Fetching all bookings...");
  //       const response = await axios.get(
  //         `http://localhost:3000/booking/history?email=${userEmail}`
  //       );
  //       setBookings(response.data);
  //     } catch (error) {
  //       console.error("Error fetching booking history:", error);
  //     }
  //   };

  //   fetchBookings();
  // }, []);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const email = localStorage.getItem("user_email");
        if (!email) {
          throw new Error("No booking parameter found in localStorage");
        }
        const response = await axios.get(
          `https://rental-app-node.onrender.com/booking/history`,
          {
            params: { email: email },
          }
        );
        setBookings(response.data);
      } catch (err) {
        console.error("Error fetching booking history:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);
  if (loading)
    return <p className="text-center text-gray-600">Loading vehicles...</p>;

  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold mb-4">Your Booking History</h2>
      {bookings.length > 0 ? (
        <div className="grid gap-4">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="p-4 border rounded-lg shadow-md bg-white"
            >
              <h3 className="text-lg font-semibold">
                {booking.modelName} ({booking.vehicleType})
              </h3>
              <p>
                <strong>Car Number:</strong> {booking.vehicleNumber}
              </p>
              <p>
                <strong>Location:</strong> {booking.location}
              </p>
              <p>
                <strong>Rental Date:</strong>{" "}
                {new Date(booking.rentalDate).toLocaleDateString()}
              </p>
              <p>
                <strong>Return Date:</strong>{" "}
                {new Date(booking.returnDate).toLocaleDateString()}
              </p>
              <p>
                <strong>Total Days:</strong> {booking.totalDays}
              </p>
              <p>
                <strong>Total Price:</strong> ₹{booking.totalPrice}
              </p>
              <p>
                <strong>Payment Status:</strong>{" "}
                <span
                  className={
                    booking.paymentStatus === "Paid"
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  {booking.paymentStatus}
                </span>
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p>No bookings found.</p>
      )}
    </div>
  );
}

export default BookingHistory;
