import React from "react";
import logo from "../../src/levitation-Infotech.png";

import { useUserContext } from "../Context/UserContext";

const Navbar = () => {
  const { isLoggedIn, setIsLoggedIn } = useUserContext();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    setIsLoggedIn(false);
    window.location.href = "/login";
  };

  return (
    <nav className="bg-white p-4 flex justify-between items-center text-gray-900">
      <div className="flex items-center">
        <p className="font-bold lg:text-2xl md:text-2x sm:text-xl">
          INVOICE GENERATOR
        </p>
      </div>
      <div className="flex items-center">
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="mr-4 px-3 py-1 bg-yellow-500 text-white font-semibold rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-600"
          >
            Logout
          </button>
        ) : null}
        <img className="w-42 h-12" src={logo} alt="Logo" />
      </div>
    </nav>
  );
};

export default Navbar;
