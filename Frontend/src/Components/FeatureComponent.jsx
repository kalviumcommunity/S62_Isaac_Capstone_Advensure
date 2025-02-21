/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";

function FeatureComponent({ feature, image, description }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-5 max-w-sm mx-auto hover:scale-105 transition-transform">
      <img src={image} alt={feature} className="w-full h-40 object-cover rounded-xl" />
      <h1 className="text-xl font-semibold text-gray-800 mt-3">{feature}</h1>
      <p className="text-gray-600 mt-2">{description}</p>
    </div>
  );
}

export default FeatureComponent;
