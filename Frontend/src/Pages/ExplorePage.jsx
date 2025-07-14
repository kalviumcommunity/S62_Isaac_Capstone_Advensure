import React, { useState } from "react";
import { Search } from "lucide-react";

function Explore() {
  const [search, setSearch] = useState("");

  const destinations = [
    {
      name: "Tropical Beaches",
      image: "https://plus.unsplash.com/premium_photo-1723867356920-8e05009f3499?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dHJvcGljYWwlMjBiZWFjaHxlbnwwfHwwfHx8MA%3D%3D",
      description: "Soak in the sun at the most serene beach destinations worldwide."
    },
    {
      name: "Mountain Retreats",
      image: "https://www.wildnatureimages.com/images/xl/070620-014-The-Tetons.jpg",
      description: "Find peace and adventure in the heart of mountain ranges."
    },
    {
      name: "City Getaways",
      image: "https://media.istockphoto.com/id/484915982/photo/akihabara-tokyo.jpg?s=612x612&w=0&k=20&c=kbCRYJS5vZuF4jLB3y4-apNebcCEkWnDbKPpxXdf9Cg=",
      description: "Explore vibrant cities full of culture, food, and energy."
    },
    {
      name: "Cultural Escapes",
      image: "https://media.licdn.com/dms/image/v2/D4D12AQHCowNfbGXTsg/article-cover_image-shrink_600_2000/article-cover_image-shrink_600_2000/0/1681811705644?e=2147483647&v=beta&t=PcXBlhC0UoNZLsw-LmO872jmjRCFCbm-0AlvnO3sr3k",
      description: "Dive into rich cultural traditions and local experiences."
    },
    {
      name: "Adventure Spots",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjau0iPF7SjSmpGeCTjOb4NRIZTRATJaE5JA&s",
      description: "Thrilling destinations for the adrenaline junkie."
    },
    {
      name: "Historical Wonders",
      image: "https://www.new7wonders.com/app/uploads/sites/3/2016/11/egypt-1179193.jpg",
      description: "Step back in time at the world’s most iconic landmarks."
    }
  ];

  const filteredDestinations = destinations.filter(dest =>
    dest.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="pt-20 bg-white text-black">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center bg-gradient-to-r from-blue-600 to-purple-700 text-white justify-center bg-cover bg-center" >
        <div className="bg-black bg-opacity-20 absolute inset-0"></div>
        <div className="relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Explore Destinations</h1>
          <p className="text-white text-lg md:text-xl">Discover breathtaking places around the world.</p>
        </div>
      </section>

      {/* Search Section */}
      <section className="bg-white px-6 md:px-20 py-10 flex justify-center">
        <div className="relative w-full max-w-2xl">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search destinations..."
            className="w-full border border-gray-300 rounded-full py-3 px-6 pr-12 text-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </section>

      {/* Core Explore Features */}
      <section className="py-12 px-6 md:px-20 bg-gray-100">
        <h2 className="text-3xl font-bold text-center mb-10">Top Picks for You</h2>
        {filteredDestinations.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredDestinations.map((dest, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 text-center">
                <img src={dest.image} alt={dest.name} className="w-full h-48 object-cover rounded-md mb-4" />
                <h3 className="text-xl font-semibold mb-2">{dest.name}</h3>
                <p>{dest.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No destinations match your search.</p>
        )}
      </section>
    </div>
  );
}

export default Explore;
