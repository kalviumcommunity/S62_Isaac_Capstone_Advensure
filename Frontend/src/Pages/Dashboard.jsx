import { useState } from "react";
import { Pencil, PlusCircle } from "lucide-react";

export default function Dashboard() {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState({ name: "John Doe", email: "john@example.com" });
  const [savedTrips, setSavedTrips] = useState([
    { id: 1, name: "Paris Getaway", date: "2025-06-12" },
    { id: 2, name: "Tokyo Adventure", date: "2025-09-20" },
  ]);

  const handleEdit = () => setIsEditing(!isEditing);
  const handleChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* User Profile */}
      <div className="mb-6 p-4 shadow-lg">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">User Profile</h2>
          <button /*variant="ghost"*/ onClick={handleEdit}>
            <Pencil className="w-5 h-5 mr-2" /> {isEditing ? "Save" : "Edit"}
          </button>
        </div>
        <div>
          <div className="grid gap-4 mt-4">
            <input
              name="name"
              value={user.name}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="Name"
            />
            <input
              name="email"
              value={user.email}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="Email"
            />
          </div>
        </div>
      </div>

      {/* Saved Trips */}
      <div className="mb-6 p-4 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Saved Trips</h2>
        <div>
          {savedTrips.length > 0 ? (
            <ul className="space-y-3">
              {savedTrips.map((trip) => (
                <li key={trip.id} className="p-3 bg-gray-100 rounded-lg flex justify-between">
                  <span>{trip.name} - {trip.date}</span>
                  <button size="sm" variant="outline">View</button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No trips saved yet.</p>
          )}
        </div>
      </div>

      {/* New Trip Button */}
      <button className="w-full flex items-center justify-center gap-2 text-lg">
        <PlusCircle className="w-5 h-5" /> New Trip
      </button>
    </div>
  );
}
