import React, { useState } from "react";
import API from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";
import PopupMessage from "../components/PopupMessage";
import { useAuth } from "../context/useAuth";

const Registeration = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [popup, setPopup] = useState({ open: false, message: "", severity: "info" });

  // Field-level real-time validation
const validateField = (name, value) => {
  // Create updated formData with new value FIRST
  const updatedFormData = { ...formData, [name]: value };
  const tempErrors = { ...errors };
  
  switch (name) {
    case "name":
      if (!value.trim()) tempErrors.name = "Name is required";
      else delete tempErrors.name;
      break;
      
    case "email":
      if (!updatedFormData.email) tempErrors.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(updatedFormData.email))
        tempErrors.email = "Email is invalid";
      else delete tempErrors.email;
      break;
      
    case "password":
      if (!updatedFormData.password) tempErrors.password = "Password is required";
      else if (updatedFormData.password.length < 6)
        tempErrors.password = "Password must be at least 6 characters";
      else delete tempErrors.password;
      break;
      
    case "confirmPassword":
      if (updatedFormData.password !== value)
        tempErrors.confirmPassword = "Passwords do not match";
      else delete tempErrors.confirmPassword;
      break;
      
    case "role":
      if (!value) tempErrors.role = "Role is required";
      else delete tempErrors.role;
      break;
  }
  
  setErrors(tempErrors);
};


  // const validate = () => {
  //   const tempErrors = {};
  
  //   if (!formData.name?.trim()) tempErrors.name = "Name is required";
  //   if (!formData.email) tempErrors.email = "Email is required";
  //   else if (!/\S+@\S+\.\S+/.test(formData.email)) tempErrors.email = "Email is invalid";
  //   if (!formData.password) tempErrors.password = "Password is required";
  //   else if (formData.password.length < 6)
  //     tempErrors.password = "Password must be at least 6 characters";
  //   if (formData.password !== formData.confirmPassword)
  //     tempErrors.confirmPassword = "Passwords do not match";
  //   if (!formData.role) tempErrors.role = "Role is required";

  //   setErrors(tempErrors);
  //   return Object.keys(tempErrors).length === 0;
  // };

  //  FIXED: Only update data + validate, don't clear errors
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if (serverError) setServerError("");
    validateField(name, value); //  Passes fresh value
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // if (!validate()) return;
    setServerError("");

    try {
      const res = await API.post("/auth/register", formData);
      
      if (res.data && res.data.success) {
        setPopup({ open: true, message: res.data.message || "Registration successful!", severity: "success" });
        logout();
        setTimeout(() => navigate("/login"), 1500);
      }
    } catch (error) {
      setServerError(error?.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Form - Fixed responsive container */}
        <div className="w-full max-w-md mx-auto">
          <form className="space-y-6 bg-white p-6 sm:p-8 rounded-2xl shadow-xl ring-1 ring-gray-200" onSubmit={handleSubmit}>
                  {/* Header */}
              <div>
                <h2 className="mt-2 text-center text-3xl font-bold text-gray-900">
                  Create Account
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                  Join our pet loving community
                </p>
              </div>

            {/* Name Field */}
            <div className="space-y-1">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-3 sm:py-4 border rounded-xl text-base focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 ${
                  errors.name
                    ? 'border-red-300 bg-red-50 focus:ring-red-500/20 focus:border-red-500'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                placeholder="Enter your full name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.name}
                </p>
              )}
            </div>

            {/* Role Field */}
            <div className="space-y-1">
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                Role
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className={`w-full px-4 py-3 sm:py-4 border rounded-xl text-base focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 ${
                  errors.role
                    ? 'border-red-300 bg-red-50 focus:ring-red-500/20 focus:border-red-500'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              {errors.role && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.role}
                </p>
              )}
            </div>

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
                className={`w-full px-4 py-3 sm:py-4 border rounded-xl text-base focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 ${
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
                className={`w-full px-4 py-3 sm:py-4 border rounded-xl text-base focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 ${
                  errors.password
                    ? 'border-red-300 bg-red-50 focus:ring-red-500/20 focus:border-red-500'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                placeholder="At least 6 characters"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-1">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-4 py-3 sm:py-4 border rounded-xl text-base focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 ${
                  errors.confirmPassword
                    ? 'border-red-300 bg-red-50 focus:ring-red-500/20 focus:border-red-500'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              // disabled={!formData.name || !formData.email || !formData.password || !formData.confirmPassword || !formData.role || formData.password.length < 6 || formData.password !== formData.confirmPassword}
              className="group relative w-full flex justify-center py-3 sm:py-4 px-4 border border-transparent text-sm font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-500/50 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-500 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Create Account
            </button>
                {/* Login Link */}
        <div className="text-center">
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            Already have an account? Sign in
          </button>
        </div>
          </form>
         
        </div>

     

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

export default Registeration;