// components/ConfirmDialog.jsx
import React from "react";

const ConfirmDialog = ({ isOpen, onConfirm, onCancel, petName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl animate-in zoom-in-95 fade-in duration-200">
        {/* Message */}
        <h3 className="text-2xl font-bold text-gray-900 text-center mb-4">
          Confirm Adoption
        </h3>
        <p className="text-gray-600 text-center text-lg mb-8 leading-relaxed">
          Are you sure you want to apply for adoption of <br />
          <span className="font-semibold text-blue-600">"{petName}"</span>?
        </p>

        {/* Buttons */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={onCancel}
            className="px-8 py-3 flex-1 max-w-[140px] bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-gray-500/50 shadow-lg"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-8 py-3 flex-1 max-w-[140px] bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-4 focus:ring-green-500/50 shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            Yes, Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
