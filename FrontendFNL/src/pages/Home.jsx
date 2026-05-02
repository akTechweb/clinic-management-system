import Navbar from "../components/layout/Navbar";
import heroImg from "../assets/hospital1.jpg";
import aboutImg from "../assets/aboutImage.jpeg"

import {
  FaAmbulance,
  FaHeartbeat,
  FaChild,
  FaMicroscope,
  FaUserMd,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

export default function Home() {
  const services = [
    { name: "Emergency Care", icon: <FaAmbulance /> },
    { name: "Cardiology", icon: <FaHeartbeat /> },
    { name: "Pediatrics", icon: <FaChild /> },
    { name: "Diagnostics", icon: <FaMicroscope /> },
    { name: "Surgery", icon: <FaUserMd /> },
  ];

  return (
    <>
      <Navbar />

      {/* HERO */}
      <div className="relative">
        <img
          src={heroImg}
          alt="hospital"
          className="w-full h-[500px] object-cover"
        />

        <div className="absolute inset-0 bg-blue-900/70 flex items-center">
          <div className="px-10 text-white w-1/2">
            <h1 className="text-4xl font-bold mb-4">
              Compassionate Care. <br /> Advanced Medicine.
            </h1>

            <p className="mb-6">
              Your health is our priority. Access world-class medical services.
            </p>
            <div className="flex items-center gap-4 mt-4">
            <button className="bg-blue-700 px-5 py-2 rounded mr-4 hover:bg-blue-800">
              Book Appointment
            </button>

            <button className="bg-green-500 px-5 py-2 rounded hover:bg-green-600">
              Learn More
            </button>
            </div>
          </div>
        </div>
      </div> {/* ✅ FIX: closed HERO div */}

      {/* SERVICES */}
      <div className="px-10 mt-10">
        <h2 className="text-2xl font-bold mb-6">Our Key Services</h2>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white p-5 rounded-xl shadow hover:shadow-lg text-center"
            >
              <div className="text-3xl text-blue-800 mb-3 flex justify-center">
                {service.icon}
              </div>

              <h4 className="font-semibold">{service.name}</h4>

              <p className="text-sm text-gray-500">
                Access world-class medical services.
              </p>
            </div>
          ))}
        </div>
      </div>
      {/* ABOUT */}
      <div className="px-10 py-16 bg-gray-50 mt-10">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <img
              src={aboutImg}
              alt="about hospital"
              className="rounded-xl shadow-lg"
            />
          </div>

          <div>
            <h2 className="text-3xl font-bold mb-4">
              About Our Hospital
            </h2>

            <p className="text-gray-600 mb-4">
              We provide world-class healthcare services with highly qualified
              doctors and modern medical technology.
            </p>

            <ul className="text-gray-600 space-y-2 mb-6">
              <li>✔ 24/7 Emergency Services</li>
              <li>✔ Expert Doctors</li>
              <li>✔ Advanced Equipment</li>
              <li>✔ Patient Care</li>
            </ul>

            <button className="bg-blue-700 text-white px-6 py-2 rounded hover:bg-blue-800">
              Read More
            </button>
          </div>
        </div>
      </div>

      {/* ✅ DOCTORS SECTION
      <div className="px-10 py-16">
        <h2 className="text-3xl font-bold text-center mb-10">
          Our Doctors
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {doctors.map((doc, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow hover:shadow-lg text-center"
            >
              <div className="flex justify-center mb-4 text-blue-700 text-4xl">
                <FaUserMd />
              </div>

              <h4 className="font-semibold text-lg">{doc.name}</h4>
              <p className="text-gray-500">{doc.dept}</p>
            </div>
          ))}
        </div>
      </div> */}

      {/* FOOTER */}
      <footer className="bg-blue-900 text-white px-10 py-10">
        <div className="grid md:grid-cols-3 gap-8">

          {/* Logo / About */}
          <div>
            <h3 className="text-xl font-bold mb-3">City Medical Center</h3>
            <p className="text-sm text-gray-300">
              Providing world-class healthcare services with compassion and care.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-3">Contact Us</h4>
            <p className="flex items-center gap-2 mb-2">
              <FaPhone /> +91 9876543210
            </p>
            <p className="flex items-center gap-2 mb-2">
              <FaEnvelope /> citymedicalcare@gmail.com
            </p>
            <p className="flex items-center gap-2">
              <FaMapMarkerAlt /> Kerala, India
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-gray-300">
              <li className="hover:text-white cursor-pointer">Home</li>
              <li className="hover:text-white cursor-pointer">Services</li>
              <li className="hover:text-white cursor-pointer">Doctors</li>
              <li className="hover:text-white cursor-pointer">Contact</li>
            </ul>
          </div>

        </div>

        <div className="text-center mt-8 border-t border-gray-500 pt-4 text-sm">
          © 2026 CMC. All rights reserved.
        </div>
      </footer>
    </>
  );
}