import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Registeration";
import PetDetails from "../pages/PetDetails";
import UserDashboard from "../pages/UserDashboard";
import PetManagement from "../pages/PetManagement";
import AdoptionApplications from "../pages/AdoptionApplications";
import AddPet from "../pages/AddPet";
import EditPet from "../pages/EditPet";
import ProtectedRoute from "../components/ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/pet/:id" element={<PetDetails />} />

      <Route element={<ProtectedRoute role="user" />}>
        <Route path="/my-applications" element={<UserDashboard />} />
      </Route>

      <Route element={<ProtectedRoute role="admin" />}>
        <Route path="/pet-management" element={<PetManagement />} />
        <Route path="/adoption-applications" element={<AdoptionApplications />} />
        <Route path="/add-pet" element={<AddPet />} />
        <Route path="/edit-pet/:id" element={<EditPet />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
