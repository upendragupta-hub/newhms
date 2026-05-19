import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import FacilityDetails from './pages/FacilityDetails';

import AdminLogin from './pages/AdminLogin';
import AdminSignup from './pages/AdminSignup';
import AdminDoctors from './pages/AdminDoctors';
import Admin from './pages/AdminDashboard';

import MyAccount from './pages/MyAccount';
import Login from './pages/Login';

import ProductDetails from './pages/ProductDetails';

import Doctors from './pages/Doctors';
import DoctorRegister from './pages/DoctorRegister';
import DoctorDashboard from './pages/DoctorDashboard';

import BookAppointment from './pages/BookAppointment';

import MyAppointments from './pages/MyAppointments';

import PatientSignup from "./pages/PatientSignup";

import PatientLogin from "./pages/PatientLogin";
import BookDemo from './pages/BookDemo';

function App() {

  return (

    <BrowserRouter>
      <div className="flex min-h-screen flex-col overflow-x-hidden bg-[var(--color-bg)] text-[var(--color-text)] transition-colors duration-300">

        <Navbar />

        <main className="flex-1">
          <Routes>

        {/* Home */}
        <Route path="/" element={<Home />} />

        {/* Other Pages */}
        <Route path="/about" element={<About />} />

        <Route path="/contact" element={<Contact />} />


        {/* Product Details */}
        <Route
          path="/product/:id"
          element={<ProductDetails />}
        />

        {/* Admin */}
        <Route
          path="/admin-signup"
          element={<AdminSignup />}
        />

        <Route
          path="/admin-dashboard"
          element={<Admin />}
        />

        <Route
          path="/admin"
          element={<AdminLogin />}
        />

        <Route
          path="/admin-doctors"
          element={<AdminDoctors />}
        />

        {/* User */}
        <Route
          path="/my-account"
          element={<MyAccount />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        {/* Doctors */}
        <Route
          path="/doctors"
          element={<Doctors />}
        />

        <Route
          path="/doctor-login"
          element={<DoctorRegister />}
        />

        <Route
          path="/doctor-dashboard"
          element={<DoctorDashboard />}
        />

        {/* Patient Signup */}
        <Route
          path="/patient-signup"
          element={<PatientSignup />}
        />

        {/* Patient Login */}
        <Route
          path="/patient-login"
          element={<PatientLogin />}
        />

        {/* Book Appointment */}
        <Route
          path="/book-appointment"
          element={<BookAppointment />}
        />

        <Route
          path="/bookdemo"
          element={<BookDemo />}
        />

        {/* My Appointments */}
        <Route
          path="/my-appointments"
          element={<MyAppointments />}
        />

        <Route
          path="/facility/:id"
          element={<FacilityDetails />}
        />

          </Routes>
        </main>

        <Footer />

      </div>
    </BrowserRouter>
  );
}

export default App;
