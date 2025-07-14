import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { Search } from 'lucide-react';
import HotelCardComponents from '../Components/HotelCardComponents';

const HotelsPage = () => {
  const location = useLocation();
  const [searchFilters, setSearchFilters] = useState({
    destination: location.state?.destination || '',
    checkIn: location.state?.startDate || '',
    checkOut: location.state?.endDate || '',
    guests: location.state?.travelers || 1,
  });

  const [showFilters, setShowFilters] = useState(false);
  const [favoriteHotels, setFavoriteHotels] = useState(new Set());
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const toggleFavorite = (hotelId) => {
    setFavoriteHotels((prev) => {
      const copy = new Set(prev);
      copy.has(hotelId) ? copy.delete(hotelId) : copy.add(hotelId);
      return copy;
    });
  };

  const handleBookNow = (hotel) => {
    console.log("Booking hotel:", hotel.name);
    // Navigate or open booking modal, etc.
  };

  const fetchHotels = async () => {
    setLoading(true);
    setError(null);
    try {
      const { destination, checkIn, checkOut, guests } = searchFilters;
      const response = await axios.get('http://localhost:8080/user/search', {
        params: {
          name: destination,
          pagination: 1,
          cur: 'INR',
          rooms: 1,
          adults: guests,
          children: 0,
          checkin: checkIn,
          checkout: checkOut,
        },
      });

      const rawData = response.data;
      const parsedHotels = Array.isArray(rawData)
        ? rawData.filter((hotel) => hotel?.hotelId && hotel?.name)
        : [];

      setHotels(parsedHotels);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch hotels. Try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchFilters.destination && searchFilters.checkIn && searchFilters.checkOut) {
      fetchHotels();
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="bg-white shadow-lg -mt-12 relative z-10 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <button onClick={() => setShowFilters((prev) => !prev)}>
            Filters
          </button>
          <button onClick={fetchHotels} className="bg-blue-600 text-white px-6 py-2 rounded-lg">
            <Search className="w-5 h-5 mr-2" />
            Search Hotels
          </button>
        </div>
      </div>

      {/* Hotel Cards */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8 text-gray-900">Available Hotels</h2>

        {loading && <p>Loading hotels...</p>}
        {error && <p className="text-red-600">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {hotels.map((hotel) => (
            <HotelCardComponents
              key={hotel.hotelId}
              hotel={{
                id: hotel.hotelId,
                name: hotel.name,
                image: '/hotel-default.jpg', // Placeholder image
                rating: hotel.reviews?.rating,
                price: hotel.price1 ? parseInt(hotel.price1.replace(/[^\d]/g, '')) : null,
                location: `${hotel.geocode?.latitude}, ${hotel.geocode?.longitude}`,
                description: `Call: ${hotel.telephone}`,
                amenities: ['wifi', 'parking', 'restaurant', 'gym'], // Dummy amenities
              }}
              isFavorite={favoriteHotels.has(hotel.hotelId)}
              onToggleFavorite={toggleFavorite}
              onBookNow={handleBookNow}
            />
          ))}
        </div>

        {!loading && hotels.length > 0 && (
          <div className="text-center mt-12">
            <button className="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-300">
              Load More Hotels
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HotelsPage;
