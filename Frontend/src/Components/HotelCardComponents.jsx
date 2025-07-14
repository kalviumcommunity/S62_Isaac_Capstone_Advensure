import React from 'react';
import { MapPin, Star, Heart, Wifi, Car, Coffee, Users } from 'lucide-react';

const HotelCardComponents = ({ 
  hotel, 
  isFavorite = false, 
  onToggleFavorite, 
  onBookNow 
}) => {
  const amenityIcons = {
    wifi: <Wifi className="w-4 h-4" />,
    parking: <Car className="w-4 h-4" />,
    restaurant: <Coffee className="w-4 h-4" />,
    pool: <Users className="w-4 h-4" />,
    spa: <Heart className="w-4 h-4" />,
    gym: <Users className="w-4 h-4" />,
    business: <Users className="w-4 h-4" />,
    beach: <MapPin className="w-4 h-4" />,
    heritage: <Star className="w-4 h-4" />,
    eco: <MapPin className="w-4 h-4" />,
    nature: <MapPin className="w-4 h-4" />,
    adventure: <Users className="w-4 h-4" />,
    yoga: <Users className="w-4 h-4" />
  };

  const handleFavoriteClick = () => {
    if (onToggleFavorite) {
      onToggleFavorite(hotel.id);
    }
  };

  const handleBookClick = () => {
    if (onBookNow) {
      onBookNow(hotel);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative">
        <img 
          src={hotel.image || hotel.photoUrl || '/api/placeholder/400/300'} 
          alt={hotel.name}
          className="w-full h-48 object-cover"
        />
        
        {/* Favorite Button */}
        <button 
          onClick={handleFavoriteClick}
          className={`absolute top-4 right-4 p-2 rounded-full transition-all duration-200 ${
            isFavorite 
              ? 'bg-red-500 text-white' 
              : 'bg-white text-gray-600 hover:bg-gray-50'
          } hover:scale-110 shadow-md`}
        >
          <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
        </button>

        {/* Rating Badge */}
        {hotel.rating && (
          <div className="absolute bottom-4 left-4 bg-white px-3 py-1 rounded-full shadow-md">
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="ml-1 text-sm font-medium">{hotel.rating}</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-6">
        {/* Hotel Name and Price */}
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-gray-900 line-clamp-2">{hotel.name}</h3>
          <div className="text-right ml-4">
            <div className="text-2xl font-bold text-blue-600">
              ₹{hotel.price?.toLocaleString() || 'N/A'}
            </div>
            <div className="text-sm text-gray-500">per night</div>
          </div>
        </div>

        {/* Location */}
        {hotel.location && (
          <div className="flex items-center text-gray-600 mb-3">
            <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
            <span className="text-sm truncate">{hotel.location}</span>
          </div>
        )}

        {/* Description */}
        {hotel.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">{hotel.description}</p>
        )}

        {/* Amenities and Book Button */}
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            {hotel.amenities?.slice(0, 4).map((amenity, index) => (
              <div 
                key={index} 
                className="p-2 bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200 transition-colors"
                title={amenity}
              >
                {amenityIcons[amenity] || <Users className="w-4 h-4" />}
              </div>
            ))}
            {hotel.amenities?.length > 4 && (
              <div className="p-2 bg-gray-100 rounded-lg text-gray-600 text-xs font-medium">
                +{hotel.amenities.length - 4}
              </div>
            )}
          </div>
          
          <button 
            onClick={handleBookClick}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default HotelCardComponents;