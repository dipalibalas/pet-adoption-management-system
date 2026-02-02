import React, { useState } from "react";
import API from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";
import PopupMessage from "../components/PopupMessage";
import { useAuth } from "../context/useAuth";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [popup, setPopup] = useState({ open: false, message: "", severity: "info" });

  const validateField = (name) => {
    const tempErrors = {};
    
    if (name === "email" || !errors.password) {
      if (!formData.email) tempErrors.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(formData.email))
        tempErrors.email = "Enter a valid email";
    }
    
    if (name === "password" || !errors.email) {
      if (!formData.password) tempErrors.password = "Password is required";
      else if (formData.password.length < 6)
        tempErrors.password = "Password must be at least 6 characters";
    }
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const validate = () => {
    const tempErrors = {};
  
    if (!formData.email) tempErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      tempErrors.email = "Enter a valid email";
    
    if (!formData.password) tempErrors.password = "Password is required";
    else if (formData.password.length < 6)
      tempErrors.password = "Password must be at least 6 characters";
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // ✅ FIXED: Only update form data, don't clear errors here
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear server error only
    if (serverError) setServerError("");
    
    // Validate field in real-time (errors will show immediately)
    validateField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // ✅ Validate entire form
    if (!validate()) return;
    
    setServerError("");
    
    try {
      const res = await API.post("/auth/login", formData);
      
      if (res && res.data) {
        const { data } = res.data;
        login(data?.token, data?.user);
        setPopup({ open: true, message: "Login successful!", severity: "success" });
        
        setTimeout(() => {
          if (data?.user?.role === "admin") navigate("/adoption-applications");
          else navigate("/my-applications");
        }, 1000);
      }
    } catch (error) {
      setServerError(error?.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-4">
        {/* Form */}
        <form className="mt-8 space-y-6 bg-white p-8 rounded-2xl shadow-xl ring-1 ring-gray-200" onSubmit={handleSubmit}>
          {/* Header */}
        <div>
                <h2 className="mt-2 text-center text-3xl font-bold text-gray-900">
                    Welcome Back
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                     Sign in to your account to continue
                </p>
              </div>

              {/* Server Error Display */}
              {serverError && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm text-red-800 font-medium">{serverError}</p>
                  </div>
                </div>
              )}
          {/* Email Field */}
          <div className="space-y-1">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-4 border rounded-xl text-base focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 ${
                errors.email
                  ? 'border-red-300 bg-red-50 focus:ring-red-500/20 focus:border-red-500'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.email}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-1">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-4 border rounded-xl text-base focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 ${
                errors.password
                  ? 'border-red-300 bg-red-50 focus:ring-red-500/20 focus:border-red-500'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                {errors.password}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            // disabled={!formData.email || !formData.password || formData.password.length < 6}
            className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-500/50 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-500 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            
            Sign In
          </button>
        </form>

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

export default Login;
