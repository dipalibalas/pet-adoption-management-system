import React, { useState, useEffect } from "react";
import API from "../api/axiosConfig";
import AdminPetCard from "../components/AdminPetCard";
import PopupMessage from "../components/PopupMessage";
import Pagination from "../components/Pagination";

const PetManagement = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [popup, setPopup] = useState({ open: false, message: "", severity: "info" });
  const limit = 8;

  const fetchPets = async (signal) => {
    try {
      const { data } = await API.get("/pets", {
        signal,
        params: { search, page, limit, status: "" }, // Get all pets for admin
      });
      setPets(data.data || []);
      setTotalPages(data.pages || Math.ceil((data.total || 0) / limit));
    } catch (err) {
      if (err.name !== "CanceledError") {
        const errorMessage = err.response?.data?.msg || err.message || "Failed to fetch pets";
        setPopup({ open: true, message: errorMessage, severity: "error" });
        setPets([]);
        setTotalPages(0);
      }
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    fetchPets(controller.signal);
    setLoading(false);
    return () => controller.abort();
  }, [search, page]);

  const handlePetDelete = (petId) => {
    setPets(pets.filter(pet => pet._id !== petId));
  };

  const handlePetUpdate = (updatedPet) => {
    setPets(pets.map(pet => pet._id === updatedPet._id ? updatedPet : pet));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 lg:py-8 px-3 sm:px-4 lg:px-8 overflow-x-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Pet Management</h1>
          <p className="text-gray-600 text-sm sm:text-base">Manage all pets in the adoption system</p>
        </div>

        {/* Search and Add Pet */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col lg:flex-row gap-3 sm:gap-4">
            <input
              type="text"
              placeholder="Search by pet name or breed"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="flex-1 px-3 py-2 sm:px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base min-w-0"
            />

            <button
              onClick={() => window.location.href = '/add-pet'}
              className="px-4 py-2 sm:px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-lg hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-4 focus:ring-green-500/50 shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2 text-sm sm:text-base flex-shrink-0"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Add Pet</span>
            </button>
          </div>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {/* Pet Grid */}
            {pets.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
                {pets?.map((pet) => (
                  <AdminPetCard 
                    key={pet._id} 
                    pet={pet} 
                    onDelete={handlePetDelete}
                    onUpdate={handlePetUpdate}
                    setPopup={setPopup}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 sm:py-12">
                <div className="text-gray-500 text-base sm:text-lg mb-4">
                  {search 
                    ? "No pets found matching your criteria" 
                    : "No pets added yet"}
                </div>
                <button
                  onClick={() => window.location.href = '/add-pet'}
                  className="bg-blue-600 text-white px-4 py-2 sm:px-6 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors duration-200 text-sm sm:text-base"
                >
                  Add Your First Pet
                </button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination 
                page={page} 
                totalPages={totalPages} 
                onPageChange={setPage} 
              />
            )}
          </>
        )}

        <PopupMessage
          open={popup.open}
          message={popup.message}
          severity={popup.severity}
          handleClose={() => setPopup({ ...popup, open: false })}
        />
      </div>
    </div>
  );
};

export default PetManagement;
