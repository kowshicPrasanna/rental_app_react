import { Routes, Route } from "react-router";
import Login from "./Login";
import Register from "./Register";
import Customer from "./Customer";
import Owner from "./Owner";
import Booking from "./Booking";
import DashboardLayout from "./DashboardLayout";
import AddVehicle from "./AddVehicle";
import BookingConfirmation from './BookingConfirmation';
import BookingHistory from "./BookingHistory";
import Payment from './Payment';
import VehicleList from "./VehicleList";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/booking" element={<Booking />} />
      <Route path="/booking-confirmation" element={<BookingConfirmation />} />
      <Route path="/booking-history" element={<BookingHistory />} />
      <Route path="/payment" element={<Payment />} />
      <Route path="/owner/add-vehicle" element={<AddVehicle />} />
      <Route path="/owner/vehicle-list" element={<VehicleList />} />
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route path='customer' element={<Customer />} />
        <Route path='owner' element={<Owner />} />
      </Route>
    </Routes>
  );
}

export default App;
