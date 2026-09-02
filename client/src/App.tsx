import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";

import DashboardLayout from "./components/layout/DashboardLayout";
import MechanicDetails from "./pages/MechanicDetails";
import Dashboard from "./pages/Dashboard";
import Bookings from "./pages/Bookings";
import BookingDetails from "./pages/BookingDetails";
import Mechanics from "./pages/Mechanics";
import Customers from "./pages/Customers";
import CustomerDetails from "./pages/CustomerDetails";
import NotFound from "./pages/NotFound";
import Settings from "./pages/Settings";
import Analytics from "./pages/Analytics";
function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Dashboard Layout */}
        <Route element={<DashboardLayout />}>
        {/*customers*/}
        <Route
  path="/customers"
  element={<Customers />}
/>

          {/* Dashboard */}
          <Route
            path="/"
            element={<Dashboard />}
          />

          {/* Bookings */}
          <Route
            path="/bookings"
            element={<Bookings />}
          />

          {/* Booking Details */}
          <Route
            path="/bookings/:id"
            element={<BookingDetails />}
          />

          {/* Mechanics */}
          <Route
            path="/mechanics"
            element={<Mechanics />}
          />
          {/* Mechanics details*/}
          <Route
       path="/mechanics/:id"
        element={<MechanicDetails />}
/>
        <Route
  path="/customers/:id"
  element={<CustomerDetails />}
/>
<Route
  path="*"
  element={<NotFound />}
/>
<Route
  path="/settings"
  element={<Settings />}
/>
          <Route
  path="/analytics"
  element={<Analytics />}
/>

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;