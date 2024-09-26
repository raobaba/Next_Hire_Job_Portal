import React from "react";
import LoaderLogo from "@/assets/NexthireLogo.png"; // Ensure the image path is correct

const Loader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-70 z-50">
      <div className="relative flex items-center justify-center">
        <img
          src={LoaderLogo}
          alt="Loader"
          className="w-20 h-20 object-cover rounded-full z-10"
        />
        <div className="absolute w-24 h-24 border-2 border-gray-300 border-t-2 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    </div>
  );
};

export default Loader;
