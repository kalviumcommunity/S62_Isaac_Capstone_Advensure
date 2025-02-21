/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import React from "react";
import { ArrowRight } from "lucide-react";
import FeatureComponent from "../Components/FeatureComponent";

function LandingPage() {
  return (
    <div className="w-full">
      {/*Hero Section*/}
      <div
        className="relative h-[550px] flex items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.apollo247.in/pd-cms/cms/2023-12/mountaineers-5649828_1920.jpg?tr=q-80,f-webp,w-450,dpr-3,c-at_max%201350w')",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10 text-center text-white flex flex-col items-center gap-6">
          <h1 className="text-6xl font-italiana font-bold drop-shadow-lg">
            AdvenSure:
            <span className="font-inspiration italic">
              {" "}
              The Travel planner of the future
            </span>
          </h1>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 text-lg rounded-xl flex items-center gap-2 group">
            Start Planning
            <ArrowRight className="transition-transform group-hover:translate-x-1" size={20} />
          </button>
        </div>
      </div>

      {/*Features Section*/}
      <div className="relative z-10 text-center text-black flex flex-col items-center gap-6 ">
        <h1 className="text-5xl font-bold drop-shadow-lg">Core Features</h1>
      </div>
        <div className="flex justify-between w-full px-10">
          <FeatureComponent feature={"Trip Budgeting"} description={"Keep track of expenses and plan within your budget."} image={"https://static.vecteezy.com/system/resources/previews/013/434/552/non_2x/hand-holding-dollar-sign-money-business-financial-line-style-icon-free-vector.jpg"} />
          <FeatureComponent feature={"Itinerary Creation"} description={"Easily plan your daily activities and schedule."} image={"https://cdn-icons-png.flaticon.com/512/7057/7057824.png"} />
          <FeatureComponent feature={"Personalized Recommendations"} description={"Get tailored suggestions for your trips."} image={"https://abmatic.ai/hubfs/Imported_Blog_Media/a%20content%20recommendation%20in%20flat%20illustration%20style%20with%20gradients%20and%20white%20background_compressed%2085e87bd3-77a5-48de-b6cd-c9d4b30c1019.jpg"} />
        </div>
      {/*testemonial Section */}
      <section className="py-16 bg-gray-100 text-center">
        <h2 className="text-3xl font-bold mb-8">What Our Users Say</h2>
        <div className="max-w-3xl mx-auto">
          {/*Dummy Data*/}
          <div className="p-6 shadow-md bg-white">
            <p className="text-gray-700 italic">"AdvenSure made planning our trip so easy! Highly recommend!"</p>
            <span className="block text-sm font-semibold mt-4">- John Doe</span>
          </div>
        </div>
      </section>
      <footer className="py-6 bg-gray-900 text-white text-center">
        <div className="flex justify-center space-x-6">
          <a href="#" className="hover:underline">About Us</a>
          <a href="#" className="hover:underline">Contact</a>
          <a href="#" className="hover:underline">Privacy Policy</a>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
