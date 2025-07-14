import React, { useState } from "react";
import { Routes,Route } from "react-router-dom";
import axios from "axios";
import { MapContainer, TileLayer, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Link, useNavigate } from "react-router-dom";

function PlanTrip() {
  const [formData, setFormData] = useState({
    startingPoint: "",
    destination: "",
    startDate: "",
    endDate: "",
    travelers: 1,
    budget: "",
    vehicleType: "",
    mileage: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [route, setRoute] = useState(null);
  const [distance, setDistance] = useState(null);
  const [fuelCost, setFuelCost] = useState(null);
  const [center, setCenter] = useState([12.9716, 77.5946]); // Default to Bangalore
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [itinerary, setItinerary] = useState(null);
  const [isGeneratingItinerary, setIsGeneratingItinerary] = useState(false);

  const apiKey = "5b3ce3597851110001cf62487a8b320c9b214dd1a48cad95a52d92f2";
  const GEMINI_API_KEY = "AIzaSyB4YxdJ37wEdFcv7D3o4-1cESLlZZIUVU0"; // Replace with your actual Gemini API key

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Function to open Google Maps with route
  const openInGoogleMaps = () => {
    const googleMapsUrl = `https://www.google.com/maps/dir/${encodeURIComponent(formData.startingPoint)}/${encodeURIComponent(formData.destination)}`;
    window.open(googleMapsUrl, '_blank');
  };

  const generateItinerary = async (tripData) => {
    setIsGeneratingItinerary(true);
    try {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      const duration = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

      const prompt = `Create a detailed ${duration}-day itinerary for a trip from ${formData.startingPoint} to ${formData.destination}. 

Trip Details:
- Duration: ${duration} days (${formData.startDate} to ${formData.endDate})
- Number of travelers: ${formData.travelers}
- Budget: ₹${formData.budget}
- Vehicle: ${formData.vehicleType}
- Distance: ${tripData.distance} km
${tripData.fuelCost ? `- Estimated fuel cost: ₹${tripData.fuelCost}` : ''}

Please provide:
1. Day-wise detailed itinerary
2. Recommended places to visit
3. Accommodation suggestions with budget breakdown
4. Food recommendations and costs
5. Activities and attractions
6. Transportation tips
7. Budget breakdown by category
8. Best time to visit specific attractions
9. Local tips and recommendations

Format the response in a clear, organized manner with headings and bullet points.`;

      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        },
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      const generatedItinerary = response.data.candidates[0].content.parts[0].text;
      setItinerary(generatedItinerary);
    } catch (err) {
      console.error("Error generating itinerary:", err);
      setError("Failed to generate itinerary. Please check your Gemini API key and try again.");
    } finally {
      setIsGeneratingItinerary(false);
    }
  };

  const Navigate=useNavigate()
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    setIsLoading(true);
    setError(null);
    setItinerary(null);

    try {
      const getCoordinates = async (place) => {
        const res = await axios.get("https://api.openrouteservice.org/geocode/search", {
          params: {
            api_key: apiKey,
            text: place,
          },
        });

        if (!res.data.features.length) {
          throw new Error(`No location found for "${place}"`);
        }

        return res.data.features[0].geometry.coordinates;
      };

      const [startCoord, endCoord] = await Promise.all([
        getCoordinates(formData.startingPoint),
        getCoordinates(formData.destination),
      ]);
      
      setCenter([startCoord[1], startCoord[0]]);

      // Get directions
      const res = await axios.get(
        "https://api.openrouteservice.org/v2/directions/driving-car",
        {
          params: {
            api_key: apiKey,
            start: `${startCoord[0]},${startCoord[1]}`,
            end: `${endCoord[0]},${endCoord[1]}`,
            radiuses: '1000|1000'   
          },
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const geometry = res.data.features[0].geometry.coordinates;
      const distKm = res.data.features[0].properties.summary.distance / 1000;
      setDistance(distKm.toFixed(2));

      const path = geometry.map(([lon, lat]) => [lat, lon]);
      setRoute(path);

      let calculatedFuelCost = null;
      // Calculate fuel cost if personal vehicle
      if (formData.vehicleType === "personal" && formData.mileage) {
        const mileage = parseFloat(formData.mileage);
        const fuelPrice = 100; // ₹100 per litre
        const cost = (distKm / mileage) * fuelPrice;
        calculatedFuelCost = cost.toFixed(0);
        setFuelCost(calculatedFuelCost);
      } else {
        setFuelCost(null);
      }

      // Generate itinerary after route calculation
      await generateItinerary({
        distance: distKm.toFixed(2),
        fuelCost: calculatedFuelCost
      });

    } catch (err) {
      console.error("Error fetching route:", err);
      setError(err.response?.data?.message || err.message || "Failed to fetch route data");
    } finally {
      setIsLoading(false);
    }
  };

  const formatItinerary = (text) => {
    if (!text) return null;
    
    return text.split('\n').map((line, index) => {
      if (line.startsWith('##')) {
        return <h3 key={index} className="text-xl font-bold mt-4 mb-2 text-blue-600">{line.replace('##', '').trim()}</h3>;
      } else if (line.startsWith('#')) {
        return <h2 key={index} className="text-2xl font-bold mt-6 mb-3 text-gray-800">{line.replace('#', '').trim()}</h2>;
      } else if (line.startsWith('*') || line.startsWith('-')) {
        return <li key={index} className="ml-4 mb-1">{line.replace(/^[*-]\s*/, '')}</li>;
      } else if (line.trim() === '') {
        return <br key={index} />;
      } else {
        return <p key={index} className="mb-2 text-gray-700">{line}</p>;
      }
    });
  };

  return (
    <div className="pt-20"> {/* Added top padding to prevent navbar overlap */}
      {/* Hero Section */}
      <section className="relative h-96 bg-cover bg-center bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl text-white font-bold">Plan Your Perfect Trip</h1>
        </div>
      </section>

      {/* Form Section */}
      <section className="container mx-auto px-6 py-12 max-w-3xl">
        <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-8 space-y-6">
          <h2 className="text-2xl font-bold mb-4">Trip Details</h2>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label className="block font-semibold">Starting Point</label>
            <input
              type="text"
              name="startingPoint"
              value={formData.startingPoint}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded mt-1"
              placeholder="e.g., Bangalore"
              required
            />
          </div>

          <div>
            <label className="block font-semibold">Destination</label>
            <input
              type="text"
              name="destination"
              value={formData.destination}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded mt-1"
              placeholder="e.g., Coorg"
              required
            />
          </div>

          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block font-semibold">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded mt-1"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block font-semibold">End Date</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded mt-1"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold">Number of Travelers</label>
            <input
              type="number"
              name="travelers"
              min="1"
              value={formData.travelers}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded mt-1"
              required
            />
          </div>

          <div>
            <label className="block font-semibold">Total Budget (INR)</label>
            <input
              type="number"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded mt-1"
              placeholder="e.g., 25000"
              required
            />
          </div>

          <div>
            <label className="block font-semibold">Vehicle Type</label>
            <select
              name="vehicleType"
              value={formData.vehicleType}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded mt-1"
              required
            >
              <option value="">Select vehicle type</option>
              <option value="personal">Personal Vehicle</option>
              <option value="rental">Rental Vehicle</option>
              <option value="public">Public Transport</option>
            </select>
          </div>

          {formData.vehicleType === "personal" && (
            <div>
              <label className="block font-semibold">Mileage (km/l)</label>
              <input
                type="number"
                name="mileage"
                value={formData.mileage}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded mt-1"
                placeholder="e.g., 18"
                required
              />
            </div>
          )}

          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition disabled:bg-blue-300"
            disabled={isLoading}
          >
            {isLoading ? "Generating..." : "Generate Trip Plan & Itinerary"}
          </button>
        </form>
      </section>

      {/* Results Section */}
      {submitted && (
        <section className="container mx-auto px-6 pb-12 max-w-4xl">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4">Calculating your route and generating itinerary...</p>
            </div>
          ) : route ? (
            <div className="space-y-6">
              {/* Route Overview */}
              <div className="bg-white shadow-md rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold">Route Overview</h3>
                  <button
                    onClick={openInGoogleMaps}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Navigate with Google Maps
                  </button>
                </div>
                
                <p className="mb-2">Distance: {distance} km</p>
                {fuelCost && <p className="mb-4">Estimated Fuel Cost: ₹{fuelCost}</p>}

                <div className="h-96 w-full relative z-0"> {/* Added z-0 to ensure map stays below navbar */}
                  <MapContainer
                    center={center}
                    zoom={7}
                    style={{ height: "100%", width: "100%" }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <Polyline positions={route} color="blue" />
                  </MapContainer>

                </div>
              </div>

              {/* Itinerary Section */}
              <div className="bg-white shadow-md rounded-lg p-6">
                <h3 className="text-2xl font-bold mb-4 text-center">Your Personalized Itinerary</h3>
                
                {isGeneratingItinerary ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
                    <p className="mt-4">AI is crafting your perfect itinerary...</p>
                  </div>
                ) : itinerary ? (
                  <div className="prose max-w-none">
                    <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg">
                      {formatItinerary(itinerary)}
                    </div>
                    <button onClick={
                      () => {
                        // Navigate to budget planning page
                        Navigate("/hotels",{ state: { budget:formData.budget,fuelCost:fuelCost, destination:formData.destination,startDate:formData.startDate,endDate:formData.endDate,guest:formData.travelers} });
                      }
                    } className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition disabled:bg-blue-300"
                     >Select Your Desired Hotel</button>
                  </div>
                ) : (
                  <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
                    Itinerary generation failed. Please check your API configuration.
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
              No route data available. Please check your inputs and try again.
            </div>
          )}
        </section>
      )}
    </div>
  );
}

export default PlanTrip;