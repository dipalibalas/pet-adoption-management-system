import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axiosConfig";
import { BASE_URL } from "../api/axiosConfig";
import PopupMessage from "../components/PopupMessage";
import ConfirmDialog from "../components/ConfirmationDialog";
import { useAuth } from "../context/useAuth";

const PetDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, role } = useAuth();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [popup, setPopup] = useState({ open: false, message: "", severity: "info" });
  const [showConfirm, setShowConfirm] = useState(false);

const handleAdoption = async () => {
 if (!isAuthenticated || role !== "user") {
      setPopup({ open: true, message: "Only logged-in users can apply for adoption", severity: "warning" });
      return setTimeout(() => navigate("/login"), 2000);
    }
  // Show confirmation popup
  setShowConfirm(true);
};
console.log("role ",isAuthenticated,role)
  const fetchPet = async () => {
    try {
      const res = await API.get(`/pets/${id}`);
      setPet(res.data.data);
    } catch (err) {
      const errorMessage = err.response?.data?.msg || err.message || "Failed to load pet details";
      setPopup({ open: true, message: errorMessage, severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPet();
  }, [id]);

  const handleConfirmAdoption = async () => {
    try {
      await API.post(`/adoptions/${pet._id}`);
      setShowConfirm(false);
      setPopup({ open: true, message: "Adoption application submitted successfully!", severity: "success" });
      setTimeout(() => navigate("/my-applications"), 2000)
    } catch (error) {
      const errorMessage = error.response?.data?.msg || error.message || "Failed to submit adoption application";
      setPopup({ open: true, message: errorMessage, severity: "error" });
    }
  };

  const cancelAdoption = () => {
  setShowConfirm(false);
};

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Pet not found</h2>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center px-4 py-2 mb-8 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Pets
        </button>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Left Side - Image */}
            <div className="lg:w-1/2 bg-gradient-to-br from-gray-100 to-gray-200">
              <div className="relative h-64 lg:h-full min-h-[400px]">
                <img
                  src={pet?.photo ? `${BASE_URL}${pet.photo}` : pet?.image ? `${BASE_URL}${pet.image}` : ""}
                  alt={pet.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                
                {/* Pet Name Overlay on Image */}
                <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-6">
                  <h1 className="text-2xl lg:text-3xl font-bold text-white drop-shadow-lg mb-2">
                    {pet.name}
                  </h1>
                  <div className="flex flex-wrap gap-2">
                    <span className={`px-3 py-1 backdrop-blur-sm rounded-full text-sm font-medium ${
                      pet.status === 'available' 
                        ? 'bg-green-500/90 text-white' 
                        : pet.status === 'adopted'
                        ? 'bg-red-500/90 text-white'
                        : 'bg-gray-500/90 text-white'
                    }`}>
                      {pet.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Details */}
            <div className="lg:w-1/2 p-6 lg:p-8">
              {/* Pet Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div>
                  <span className="block text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Species</span>
                  <span className="text-xl font-semibold text-gray-900">{pet.species}</span>
                </div>
                <div>
                  <span className="block text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Breed</span>
                  <span className="text-xl font-medium text-gray-900">{pet.breed}</span>
                </div>
                <div>
                  <span className="block text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Age</span>
                  <span className="text-xl font-semibold text-gray-900">{pet.age}</span>
                </div>
                <div>
                  <span className="block text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Color</span>
                  <span className="text-xl font-medium text-gray-900">{pet.color || 'N/A'}</span>
                </div>
              </div>
              
              {/* Description */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">About {pet.name}</h2>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 leading-relaxed">
                    {pet.description || 'No description available for this pet.'}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-auto">
                {pet.status === "available" && isAuthenticated && role === "user" && (
                  <button
                    onClick={handleAdoption}
                    className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold text-base rounded-xl shadow-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 transform hover:-translate-y-1"
                  >
                    Apply for Adoption
                  </button>
                )}
                
                {/* Confirmation Dialog */}
                <ConfirmDialog
                  isOpen={showConfirm}
                  onConfirm={handleConfirmAdoption}
                  onCancel={cancelAdoption}
                  petName={pet.name}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <PopupMessage
        open={popup.open}
        message={popup.message}
        severity={popup.severity}
        handleClose={() => setPopup({ ...popup, open: false })}
      />
    </div>
  );
};

export default PetDetails;
