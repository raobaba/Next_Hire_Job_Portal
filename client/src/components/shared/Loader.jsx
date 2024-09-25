// Loader.js
import React from "react";
import LoaderLogo from "@/assets/NexthireLogo.png";

const Loader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-70 z-50">
      <div className="relative w-24 h-24 border-4 border-gray-300 border-t-4 border-t-blue-500 rounded-full animate-spin flex items-center justify-center">
        <img
          src={LoaderLogo}
          alt="Loader"
          className="absolute w-12 h-12 object-cover rounded-full"
        />
      </div>
    </div>
  );
};

export default Loader;
