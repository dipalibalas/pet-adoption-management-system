import React from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../api/axiosConfig";

const UserPetCard = ({ pet }) => {
  const navigate = useNavigate();
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 group">
      {/* Fixed Responsive Image Container */}
      <div className="w-full h-40 sm:h-48 md:h-56 lg:h-64 overflow-hidden bg-gray-200 relative">
        <img
          src={pet?.photo ? `${BASE_URL}${pet.photo}` : pet?.image ? `${BASE_URL}${pet.image}` : 'https://via.placeholder.com/400x300?text=No+Image'}
          alt={pet?.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 hover:brightness-105"
          loading="lazy"
          onError={(e) => {
            console.log("Image failed to load:", e.target.src);
            e.target.src = 'https://via.placeholder.com/400x300?text=Image+Error';
          }}
        />
        {/* Status Badge */}
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
          <span className={`px-2 py-1 sm:px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(pet?.status)}`}>
            {pet?.status}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-3 sm:p-4 lg:p-6">
        <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-2 truncate">{pet?.name}</h3>
        <div className="space-y-1 text-sm text-gray-600 mb-3 sm:mb-4">
          <p className="truncate"><span className="font-medium">Breed:</span> {pet?.breed || 'N/A'}</p>
          <p><span className="font-medium">Age:</span> {pet?.age ? `${pet.age} years` : 'N/A'}</p>
          <p className="truncate"><span className="font-medium">Species:</span> {pet?.species}</p>
        </div>
        <button
          onClick={() => navigate(`/pet/${pet._id}`)}
          className="w-full bg-blue-600 text-white py-2 px-3 sm:px-4 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 text-sm"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default UserPetCard;
