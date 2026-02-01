import React, { useState, useEffect } from "react";
import API from "../api/axiosConfig";
import AdminApplicationCard from "../components/AdminApplicationCard";
import PopupMessage from "../components/PopupMessage";
import Pagination from "../components/Pagination";

const AdoptionApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [popup, setPopup] = useState({ open: false, message: "", severity: "info" });
  const limit = 8;

  const fetchApplications = async (signal) => {
    try {
      console.log("Fetching adoption applications...");
      const { data } = await API.get("/adoptions/", {
        signal,
        params: { search, status: filterStatus, page, limit },
      });
      console.log("API Response:", data);
      setApplications(data.data || []);
      setTotalPages(data.pages || Math.ceil((data.total || 0) / limit));
    } catch (err) {
      console.error("Error fetching applications:", err);
      if (err.name !== "CanceledError") {
        const errorMessage = err.response?.data?.msg || err.message || "Failed to fetch applications";
        setPopup({ open: true, message: errorMessage, severity: "error" });
        setApplications([]);
        setTotalPages(0);
      }
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    fetchApplications(controller.signal);
    setLoading(false);
    return () => controller.abort();
  }, [search, filterStatus, page]);

  const handleStatusUpdate = (applicationId, newStatus) => {
    setApplications(applications.map(app => 
      app._id === applicationId ? { ...app, status: newStatus } : app
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 lg:py-8 px-3 sm:px-4 lg:px-8 overflow-x-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Adoption Applications</h1>
          <p className="text-gray-600 text-sm sm:text-base">Review and manage pet adoption applications</p>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col lg:flex-row gap-3 sm:gap-4">
            <input
              type="text"
              placeholder="Search by pet name or user email"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="flex-1 px-3 py-2 sm:px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base min-w-0"
            />
            
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 sm:px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base bg-white min-w-0 flex-shrink-0"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {/* Applications Grid */}
            {applications.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                {applications?.map((application) => (
                  <AdminApplicationCard 
                    key={application._id} 
                    application={application} 
                    onStatusUpdate={handleStatusUpdate}
                    setPopup={setPopup}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 sm:py-12">
                <div className="text-gray-500 text-base sm:text-lg mb-4">
                  {filterStatus || search 
                    ? "No applications found matching your criteria" 
                    : "No adoption applications yet"}
                </div>
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

export default AdoptionApplications;
