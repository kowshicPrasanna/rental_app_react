import { useState, useEffect } from "react";
import axios from "axios";

const VehicleList = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [updatedData, setUpdatedData] = useState({
    modelName: "",
    modelYear: "",
    vehicleType: "",
    vehicleLocation:"",
    location: "",
    price: "",
  });

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const email = localStorage.getItem("user_email");
        if (!email) {
          throw new Error("No vehicle parameter found in localStorage");
        }
        const response = await axios.get(`https://rental-app-node.onrender.com/vehicle/list`, {
          params: { email: email },
        });
        setVehicles(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  const handleDelete = async (vehicleId) => {
    if (!vehicleId) {
      console.error("Vehicle ID is missing!");
      return;
    }
    try {
      const response = await axios.delete(`https://rental-app-node.onrender.com/vehicle/delete`, {
        params: { vehicleId },
      });
      if (response.status === 200) {
        alert("Vehicle deleted successfully!");
        setVehicles((prevVehicles) =>
          prevVehicles.filter((vehicle) => vehicle.vehicleId !== vehicleId)
        );
      }
    } catch (err) {
      console.error("Error deleting vehicle:", err);
    }
  };

  const handleUpdateClick = (vehicle) => {
    setSelectedVehicle(vehicle);
    setUpdatedData({
      modelName: vehicle.modelName,
      modelYear: vehicle.modelYear,
      vehicleType: vehicle.vehicleType,
      vehicleNumber: vehicle.vehicleNumber,
      location: vehicle.location,
      price: vehicle.price,
    });
    setShowUpdateForm(true);
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData((prev) => ({ ...prev, [name]: value }));
  };
  const handleUpdateSubmit = async () => {
    try {
      const response = await axios.put(`https://rental-app-node.onrender.com/vehicle/update-vehicle`, {
        vehicleId: selectedVehicle.vehicleId,
        ...updatedData,
      });

      if (response.status === 200) {
        alert("Vehicle updated successfully!");
        setVehicles((prevVehicles) =>
          prevVehicles.map((vehicle) =>
            vehicle.vehicleId === selectedVehicle.vehicleId
              ? { ...vehicle, ...updatedData }
              : vehicle
          )
        );
        setShowUpdateForm(false);
      }
    } catch (err) {
      console.error("Error updating vehicle:", err);
    }
  };

  if (loading)
    return <p className="text-center text-gray-600">Loading vehicles...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center text-black font-serif">
        Your Vehicles
      </h2>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map((vehicle) => (
          <li
            key={vehicle.vehicleId}
            className="p-4 bg-white rounded-lg shadow-lg border border-gray-200"
          >
            <img
              src={vehicle.vehicleImage}
              alt={vehicle.vehicleId}
              className="w-full h-40 object-cover rounded-md mb-4"
            />
            <h3 className="text-xl font-semibold text-gray-800">
              {vehicle.modelName}
            </h3>
            <p className="text-gray-600">Year: {vehicle.modelYear}</p>
            <p className="text-gray-600">Type: {vehicle.vehicleType}</p>
            <p className="text-gray-600">Car Number: {vehicle.vehicleNumber}</p>
            <p className="text-gray-600">Location: {vehicle.location}</p>
            <p className="text-gray-600 font-bold">Price: ₹{vehicle.price}</p>
            <div className="flex justify-between pt-4">
              <button onClick={() => handleUpdateClick(vehicle)} className="px-4 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-800 cursor-pointer">
                Update
              </button>
              <button
                onClick={() => handleDelete(vehicle.vehicleId)}
                className="px-4 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 cursor-pointer"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
      {/* Update Form Modal */}
      {showUpdateForm && (
        <div className="fixed inset-0 flex items-center justify-center  bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Update Vehicle</h2>
            <input
              type="text"
              name="modelName"
              value={updatedData.modelName}
              onChange={handleInputChange}
              placeholder="Model Name"
              className="w-full mb-2 p-2 border rounded"
            />
            <input
              type="text"
              name="modelYear"
              value={updatedData.modelYear}
              onChange={handleInputChange}
              placeholder="Model Year"
              className="w-full mb-2 p-2 border rounded"
            />
            <input
              type="text"
              name="vehicleType"
              value={updatedData.vehicleType}
              onChange={handleInputChange}
              placeholder="Vehicle Type"
              className="w-full mb-2 p-2 border rounded"
            />
            <input
              type="text"
              name="vehicleNumber"
              value={updatedData.vehicleNumber}
              onChange={handleInputChange}
              placeholder="Vehicle Number"
              className="w-full mb-2 p-2 border rounded"
            />
            <input
              type="text"
              name="location"
              value={updatedData.location}
              onChange={handleInputChange}
              placeholder="Location"
              className="w-full mb-2 p-2 border rounded"
            />
            <input
              type="text"
              name="price"
              value={updatedData.price}
              onChange={handleInputChange}
              placeholder="Price"
              className="w-full mb-2 p-2 border rounded"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowUpdateForm(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateSubmit}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleList;
