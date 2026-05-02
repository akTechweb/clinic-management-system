
import { FaHospitalAlt } from "react-icons/fa";
import { CiLogin } from "react-icons/ci";
import { Link,useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  
  //Check if admin page
  const isAdminPage = location.pathname.startsWith("/admin");
  return (
    <nav className="bg-gradient-to-br from-blue-800 to-green-500 text-white px-6 py-3 flex items-center justify-between shadow-md">
      
       {/* Logo Section */}
      <div className="flex items-center gap-3">
        <div className="bg-white p-2 rounded-lg shadow">
          <FaHospitalAlt className="text-green-600 text-xl" />
        </div>
        <h2 className="font-bold text-lg tracking-wide">
          CITY MEDICAL CENTER
        </h2>
      </div>
      {/* Menu */}
      {!isAdminPage &&(
      <div className="hidden md:flex gap-6 items-center">
        <Link to="/" className="text-white hover:text-blue/80">Home</Link>
        <Link to="/about" className="text-white hover:text-blue/80">About</Link>
        <Link to="/services" className="text-white hover:text-blue/80">Services</Link>
        <Link to="/doctors" className="text-white hover:text-blue/80">Doctors</Link>
        <Link to="/contact" className="text-white hover:text-blue/80">Contact</Link>

        {/* Button */}
        <Link
        to="/login"
        className="bg-green-600 text-white px-5 py-1 rounded-md font-semibold shadow flex items-center gap-2 hover:bg-green-700 transition"
        >
        <CiLogin />
          LOGIN
        </Link>
        {/* <Link
          to="/login"
          className="bg-green-600 text-white px-5 py-1 rounded-md hover:bg-green-700 font-semibold shadow"
        >
          PORTAL LOGIN */}
      </div>
      )}
    </nav>
  );
}