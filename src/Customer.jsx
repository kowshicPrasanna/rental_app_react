import { useNavigate } from "react-router-dom";

function Customer() {
  const navigate = useNavigate();

  return (
    <div className="font-serif">
      <div className="mt-20 mb-10">
        <h1 className="flex flex-col items-center justify-center text-6xl font-bold">
          services
        </h1>
      </div>
      <div className="flex items-center justify-center gap-8 p-8 flex-wrap">
        {/* Container 1 - Bookings */}
        <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg w-60">
          <img src="/history.svg" alt="Add Icon" className="w-10 h-10" />
          <h3 className="text-xl font-semibold mt-4">Bookings</h3>
          <button
            onClick={() => navigate("/booking-history")}
            className="mt-4 py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            View Bookings
          </button>
        </div>
      </div>
    </div>
  );
}

export default Customer;
