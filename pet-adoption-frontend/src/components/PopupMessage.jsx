import React from "react";

const PopupMessage = ({ open, message, severity = "info", handleClose }) => {
  const getSeverityStyles = (severity) => {
    const styles = {
      success: "bg-green-100 border-green-300 text-green-800 shadow-green-200 ring-green-500/20",
      error: "bg-red-100 border-red-300 text-red-800 shadow-red-200 ring-red-500/20",
      warning: "bg-yellow-100 border-yellow-300 text-yellow-800 shadow-yellow-200 ring-yellow-500/20",
      info: "bg-blue-100 border-blue-300 text-blue-800 shadow-blue-200 ring-blue-500/20",
    };
    return styles[severity] || styles.info;
  };

  return (
    <>
      {open && (
        <div className="fixed top-4 right-4 z-[9999] max-w-sm w-full">
          <div className={`animate-in slide-in-from-top-2 fade-in duration-300 rounded-2xl p-4 border shadow-xl backdrop-blur-sm ${getSeverityStyles(severity)} border-l-4`}>
            <div className="flex items-start space-x-3">
              {/* Icon */}
              <div className="flex-shrink-0 pt-0.5">
                {severity === "success" && (
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {severity === "error" && (
                  <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                )}
                {severity === "warning" && (
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                )}
                {severity === "info" && (
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </div>
              
              {/* Message */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium leading-5">{message}</p>
              </div>
              
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="ml-2 flex-shrink-0 p-1 rounded-full hover:bg-opacity-20 hover:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
              >
                <svg className="w-4 h-4 text-current" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PopupMessage;
