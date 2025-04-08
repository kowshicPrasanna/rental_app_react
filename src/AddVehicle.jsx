import { useNavigate } from "react-router-dom";

import { useFormik } from "formik";
import axios from "axios";
import { useState } from "react";

function AddVehicle() {
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      modelName: "",
      modelYear: "",
      vehicleType: "",
      vehicleNumber: "",
      location: "",
      email: localStorage.getItem("user_email") || "",
      price: "",
    },
    validate: (values) => {
      const errors = {};
      if (!values.email) {
        errors.email = "Required";
      } else if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
      ) {
        errors.email = "Invalid email address";
      }
      return errors;
    },

    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        formData.append("modelName", values.modelName);
        formData.append("modelYear", values.modelYear);
        formData.append("vehicleType", values.vehicleType);
        formData.append("vehicleNumber", values.vehicleNumber);
        formData.append("location", values.location);
        formData.append("email", values.email);
        formData.append("price", values.price);
        if (file) {
          formData.append("vehicleImage", file);
        }
        const token = localStorage.getItem("carrental_app_token");
        const addVehicleRep = await axios.post(
          "https://rental-app-node.onrender.com/vehicle/add",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (addVehicleRep.status === 200) {
          alert("Vehicle added successfully!");
          const storedRole = localStorage.getItem("user_role");

          if (storedRole === "customer") {
            navigate("/dashboard/customer", { replace: true });
          } else if (storedRole === "owner") {
            navigate("/dashboard/owner", { replace: true });
          }
        }
      } catch (error) {
        console.log(error);
      }
    },
  });
  return (
    <div
      className="h-screen w-full bg-cover bg-center flex items-center"
      style={{ backgroundImage: "url('/car_bg.jpg')" }}
    >
      {/* Login Form Container */}
      <div className="bg-cyan-50 bg-opacity-80 p-10 rounded-lg shadow-lg w-full max-w-4xl ml-24 mr-auto">
        <h2 className="text-3xl font-semibold text-black text-center mb-6">
          Zulu Cars
        </h2>
        <form onSubmit={formik.handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="mb-4">
              <label className="block text-black">ModelName</label>
              <input
                type="text"
                name="modelName"
                id="modelName"
                className="w-full p-3 rounded-lg bg-gray-300 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-950"
                placeholder="Enter your vehicel model"
                value={formik.values.modelName}
                onChange={formik.handleChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-black">ModelYear</label>
              <input
                type="text"
                name="modelYear"
                id="modelYear"
                className="w-full p-3 rounded-lg bg-gray-300 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-950"
                placeholder="Enter vehicle model year"
                value={formik.values.modelYear}
                onChange={formik.handleChange}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="mb-4">
              <label className="block text-black">VehicleType</label>
              <input
                type="text"
                name="vehicleType"
                id="vehicleType"
                className="w-full p-3 rounded-lg bg-gray-300 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-950"
                placeholder="Enter type of the vehicle"
                value={formik.values.vehicleType}
                onChange={formik.handleChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-black">VehicleNumber</label>
              <input
                type="text"
                name="vehicleNumber"
                id="vehicleNumber"
                className="w-full p-3 rounded-lg bg-gray-300 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-950"
                placeholder="Enter your vehicle number"
                value={formik.values.vehicleNumber}
                onChange={formik.handleChange}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="mb-4">
              <label className="block text-black">Location</label>
              <select
                name="location"
                id="location"
                className="w-full p-3 rounded-lg bg-gray-300 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-950"
                value={formik.values.location}
                onChange={formik.handleChange}
              >
                <option value="">Select a location</option>
                <option value="Ariyalur">Ariyalur</option>
                <option value="Chengalpattu">Chengalpattu</option>
                <option value="Chennai">Chennai</option>
                <option value="Coimbatore">Coimbatore</option>
                <option value="Cuddalore">Cuddalore</option>
                <option value="Dharmapuri">Dharmapuri</option>
                <option value="Dindigul">Dindigul</option>
                <option value="Erode">Erode</option>
                <option value="Kallakurichi">Kallakurichi</option>
                <option value="Kanchipuram">Kanchipuram</option>
                <option value="Kanyakumari">Kanyakumari</option>
                <option value="Karur">Karur</option>
                <option value="Krishnagiri">Krishnagiri</option>
                <option value="Madurai">Madurai</option>
                <option value="Nagapattinam">Nagapattinam</option>
                <option value="Namakkal">Namakkal</option>
                <option value="Nilgiris">Nilgiris</option>
                <option value="Perambalur">Perambalur</option>
                <option value="Pudukkottai">Pudukkottai</option>
                <option value="Ramanathapuram">Ramanathapuram</option>
                <option value="Ranipet">Ranipet</option>
                <option value="Salem">Salem</option>
                <option value="Sivaganga">Sivaganga</option>
                <option value="Tenkasi">Tenkasi</option>
                <option value="Thanjavur">Thanjavur</option>
                <option value="Theni">Theni</option>
                <option value="Thoothukudi">Thoothukudi</option>
                <option value="Trichy">Trichy</option>
                <option value="Tirunelveli">Tirunelveli</option>
                <option value="Tirupathur">Tirupathur</option>
                <option value="Tiruppur">Tiruppur</option>
                <option value="Tiruvallur">Tiruvallur</option>
                <option value="Tiruvannamalai">Tiruvannamalai</option>
                <option value="Tiruvarur">Tiruvarur</option>
                <option value="Vellore">Vellore</option>
                <option value="Viluppuram">Viluppuram</option>
                <option value="Virudhunagar">Virudhunagar</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-black">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                className="w-full p-3 rounded-lg bg-gray-300 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-950"
                placeholder="Enter your email"
                value={formik.values.email}
                onChange={formik.handleChange}
              />
              <span className="text-sm text-red-500">
                {formik.errors.email}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="mb-4">
              <label className="block text-black">Price</label>
              <input
                type="text"
                name="price"
                id="price"
                className="w-full p-3 rounded-lg bg-gray-300 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-950"
                placeholder="Enter price per day"
                value={formik.values.price}
                onChange={formik.handleChange}
              />
            </div>
            {/* added for image upload */}
            <div className="mb-4">
              <label className="block text-black">Upload Vehicle Image</label>
              <input
                type="file"
                name="vehicleImage"
                className="w-full p-3 bg-gray-300 border border-gray-600 rounded-lg"
                accept="image/*"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-black hover:bg-gray-500 text-white font-semibold py-3 rounded-lg transition duration-300 cursor-pointer"
          >
            Add
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddVehicle;
