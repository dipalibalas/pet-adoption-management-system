// components/Pagination.jsx
import React from "react";

const Pagination = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center mt-12">
      <div className="flex items-center bg-white p-4 rounded-xl shadow-lg border border-gray-200 min-w-[300px] justify-center">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
          className="px-3 py-2 text-sm font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-50 hover:text-blue-600 disabled:hover:bg-transparent disabled:text-gray-400 flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Prev
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1 mx-4 flex-1 min-w-0">
          {[...Array(Math.min(5, totalPages))].map((_, i) => {
            const pageNum = i + 1;
            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 min-w-[44px] flex-1 ${
                  page === pageNum
                    ? 'bg-blue-600 text-white shadow-md scale-105'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200'
                }`}
              >
                {pageNum}
              </button>
            );
          })}
          
          {totalPages > 5 && (
            <>
              <span className="px-2 text-sm text-gray-400">...</span>
              <button
                onClick={() => onPageChange(totalPages)}
                className="px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-lg hover:text-blue-600 transition-colors"
              >
                {totalPages}
              </button>
            </>
          )}
        </div>

        {/* Next Button */}
        <button
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className="px-3 py-2 text-sm font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-50 hover:text-blue-600 disabled:hover:bg-transparent disabled:text-gray-400 flex items-center gap-1"
        >
          Next
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Pagination;
