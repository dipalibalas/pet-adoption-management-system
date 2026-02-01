import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axiosConfig";
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
console.log("roel ",isAuthenticated,role)
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
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
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
          {/* Hero Image */}
          <div className="relative">
            <img
              src={pet?.photo ? `http://localhost:5000${pet.photo}` : pet?.image ? `http://localhost:5000${pet.image}` : ""}
              alt={pet.name}
              className="w-full h-64 sm:h-80 md:h-96 lg:h-[500px] object-cover hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>

          {/* Content */}
          <div className="p-8 lg:p-12">
            <div className="flex flex-col lg:flex-row gap-8 lg:items-start">
              {/* Pet Info */}
              <div className="lg:w-2/3">
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                  {pet.name}
                </h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="space-y-4">
                    <div>
                      <span className="block text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Species</span>
                      <span className="text-2xl font-semibold text-gray-900">{pet.species}</span>
                    </div>
                    <div>
                      <span className="block text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Breed</span>
                      <span className="text-xl font-medium text-gray-900">{pet.breed}</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <span className="block text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Age</span>
                      <span className="text-2xl font-semibold text-gray-900">{pet.age}</span>
                    </div>
                    <div>
                      <span className="block text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Status</span>
                      <span className={`inline-flex px-4 py-2 rounded-full text-sm font-semibold ${
                        pet.status === 'available' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {pet.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="lg:w-1/3 flex flex-col items-center lg:items-end">
                {pet.status === "available" && isAuthenticated && role === "user" && (
                  <button
                    onClick={handleAdoption}
                    className="w-full max-w-md lg:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold text-lg rounded-xl shadow-2xl hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-3xl"
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
                {/* {pet.status === "available" && (!isAuthenticated || role !== "user") && (
                  <div className="w-full max-w-md lg:w-auto px-8 py-4 bg-gray-100 text-gray-500 font-semibold text-lg rounded-xl text-center">
                    Login as user to apply
                  </div>
                )} */}
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
