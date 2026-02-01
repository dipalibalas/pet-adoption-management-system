import React, { useState, useEffect, useContext } from "react";
import API from "../api/axiosConfig";
import UserPetCard from "../components/UserPetCard";
import PopupMessage from "../components/PopupMessage";
import Pagination from "../components/Pagination";
import { AuthContext } from "../context/AuthContext.jsx";

const UserDashboard = () => {
  const { user } = useContext(AuthContext);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [popup, setPopup] = useState({ open: false, message: "", severity: "info" });
  const limit = 8;

  const fetchUserPets = async (signal) => {
    if (!user?._id) return;
    
    setLoading(true);
    try {
      const { data } = await API.get("/adoptions/my", {
        signal,
        params: { search, status: filterStatus, page, limit },
      });
      
      setPets(data.data || []);
      setTotalPages(data.pages || Math.ceil((data.total || 0) / limit));
    } catch (err) {
      if (err.name !== "CanceledError") {
        const errorMessage = err.response?.data?.msg || err.message || "Failed to fetch your pets";
        setPopup({ open: true, message: errorMessage, severity: "error" });
        setPets([]);
        setTotalPages(0);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchUserPets(controller.signal);
    return () => controller.abort();
  }, [search, filterStatus, page, user?._id]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Adoption Requests</h1>
          <p className="text-gray-600">Track the status of your pet adoption requests</p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 max-w-2xl mx-auto">
          <input
            type="text"
            placeholder="Search by name or breed"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-5 py-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-5 py-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base bg-white w-48 sm:w-52"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {pets?.map((pet) => (
                  <UserPetCard key={pet._id} pet={pet} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-500 text-lg mb-4">
                  {filterStatus || search 
                    ? "No pets found matching your criteria" 
                    : "You haven't made any adoption requests yet"}
                </div>
                {!filterStatus && !search && (
                  <button
                    onClick={() => window.location.href = '/'}
                    className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors duration-200"
                  >
                    Browse Available Pets
                  </button>
                )}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <Pagination 
                  page={page} 
                  totalPages={totalPages} 
                  onPageChange={setPage} 
                />)}
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

export default UserDashboard;
