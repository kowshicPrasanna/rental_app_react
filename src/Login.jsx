import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import axios from "axios";

function Login() {
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
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
      if (!values.password) {
        errors.password = "Required";
      } else if (values.password.length < 4) {
        errors.password = "Password must be at least 4 characters long";
      }
      return errors;
    },
    onSubmit: async (values) => {
      try {
        const loginRep = await axios.post(
          "https://rental-app-node.onrender.com/users/login",
          values
        );
        if (loginRep.status === 200) {
          console.log("Login Success");
          const token = loginRep.data.token;
          const role = loginRep.data.role;
          const email = loginRep.data.email;
          window.localStorage.setItem("carrental_app_token", token);
          window.localStorage.setItem("user_role", role);
          window.localStorage.setItem("user_email", email);
          console.log(window.Razorpay); 
          navigate("/dashboard");
          if (role === "customer") {
            navigate("/dashboard/customer", { replace: true }); 
          } else if (role === "owner") {
            navigate("/dashboard/owner", { replace: true }); 
          } else {
            navigate("/dashboard", { replace: true }); 
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
      <div className="bg-cyan-50 bg-opacity-80 p-10 rounded-lg shadow-lg w-96 ml-24 mr-auto">
        <h2 className="text-3xl font-semibold text-black text-center mb-6">
          Zulu Cars
        </h2>
        <form onSubmit={formik.handleSubmit}>
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
            <span className="text-sm text-red-500">{formik.errors.email}</span>
          </div>

          <div className="mb-4">
            <label className="block text-black">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              className="w-full p-3 rounded-lg bg-gray-300 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-950"
              placeholder="Enter your password"
              value={formik.values.password}
              onChange={formik.handleChange}
            />
            <span className="text-sm text-red-500">
              {formik.errors.password}
            </span>
          </div>

          <button
            type="submit"
            className="w-full bg-black hover:bg-gray-500 text-white font-semibold py-3 rounded-lg transition duration-300 cursor-pointer"
          >
            Login
          </button>
        </form>
        <div className="flex items-center justify-center pt-[1rem]">
          <p className="font-semibold pr-[0.5rem]">New User ? </p>{" "}
          <button
            onClick={() => navigate("/register")}
            className="cursor-pointer font-bold text-red-800"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
