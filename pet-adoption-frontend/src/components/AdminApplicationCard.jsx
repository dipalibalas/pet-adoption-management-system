import React, { useState } from "react";
import API from "../api/axiosConfig";

const AdminApplicationCard = ({ application, onStatusUpdate, setPopup }) => {
  const [loading, setLoading] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState(""); // "approve" or "reject"

  console.log("Application data:", application);

  const handleStatusChange = async (newStatus) => {
    setLoading(true);
    try {
      const { data } = await API.put(`/adoptions/${application._id}`, { status: newStatus });
      
      onStatusUpdate(application._id, newStatus);
      
      const message = newStatus === "approved" 
        ? "Application approved successfully!" 
        : "Application rejected successfully!";
      
      setPopup({ 
        open: true, 
        message, 
        severity: "success" 
      });
      
      setShowActionModal(false);
    } catch (err) {
      const errorMessage = err.response?.data?.msg || err.message || "Failed to update application status";
      setPopup({ open: true, message: errorMessage, severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const openActionModal = (action) => {
    setActionType(action);
    setShowActionModal(true);
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300">
        {/* Header with Status */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 sm:px-6 sm:py-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex items-center space-x-3">
              <div className={`px-2 py-1 sm:px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(application?.status || 'N/A')}`}>
                {application?.status ? application.status.charAt(0).toUpperCase() + application.status.slice(1) : 'N/A'}
              </div>
              <span className="text-xs sm:text-sm text-gray-600">
                Applied on {formatDate(application?.appliedAt)}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          {/* User Info */}
          <div className="mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Applicant Information
            </h3>
            <div className="bg-gray-50 rounded-lg p-3 sm:p-4 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <span className="text-sm font-medium text-gray-600">Name:</span>
                <span className="text-sm text-gray-900 font-semibold">{application.user?.name || 'N/A'}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <span className="text-sm font-medium text-gray-600">Email:</span>
                <span className="text-sm text-gray-900">{application.user?.email || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Pet Info */}
          <div className="mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              Pet Information
            </h3>
            <div className="bg-gray-50 rounded-lg p-3 sm:p-4 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <span className="text-sm font-medium text-gray-600">Pet Name:</span>
                <span className="text-sm text-gray-900 font-semibold">{application.pet?.name || 'N/A'}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <span className="text-sm font-medium text-gray-600">Species:</span>
                <span className="text-sm text-gray-900">{application.pet?.species || 'N/A'}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <span className="text-sm font-medium text-gray-600">Breed:</span>
                <span className="text-sm text-gray-900">{application.pet?.breed || 'N/A'}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <span className="text-sm font-medium text-gray-600">Pet Status:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(application.pet?.status || 'N/A')}`}>
                  {application.pet?.status || 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {application.status === "pending" && (
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              <button
                onClick={() => openActionModal("approve")}
                disabled={loading}
                className="flex-1 bg-green-600 text-white px-3 py-2 sm:px-4 py-2 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 font-medium flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Approve
              </button>
              
              <button
                onClick={() => openActionModal("reject")}
                disabled={loading}
                className="flex-1 bg-red-600 text-white px-3 py-2 sm:px-4 py-2 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 font-medium flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Reject
              </button>
            </div>
          )}

          {application.status !== "pending" && (
            <div className="text-center py-2">
              <span className="text-sm text-gray-500 italic">
                This application has been {application.status}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Action Confirmation Modal */}
      {showActionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md mx-4 shadow-2xl">
            <div className="text-center">
              <div className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full mb-4 ${
                actionType === "approve" ? "bg-green-100" : "bg-red-100"
              }`}>
                {actionType === "approve" ? (
                  <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>
              
              <h3 className={`text-lg font-semibold mb-2 ${
                actionType === "approve" ? "text-green-900" : "text-red-900"
              }`}>
                {actionType === "approve" ? "Approve Application" : "Reject Application"}
              </h3>
              
              <p className="text-sm text-gray-600 mb-6">
                {actionType === "approve" 
                  ? `Are you sure you want to approve ${application.user.name}'s application for ${application.pet.name}? This will mark the pet as adopted.`
                  : `Are you sure you want to reject ${application.user.name}'s application for ${application.pet.name}? The pet will become available again.`
                }
              </p>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowActionModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleStatusChange(actionType === "approve" ? "approved" : "rejected")}
                  disabled={loading}
                  className={`flex-1 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ${
                    actionType === "approve"
                      ? "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500"
                      : "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    actionType === "approve" ? "Approve" : "Reject"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminApplicationCard;
