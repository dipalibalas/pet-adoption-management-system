import MainLayout from "./layouts/MainLayout";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext.jsx";


function App() {
   return (
   <AuthProvider>
   <MainLayout>
      <AppRoutes />
    </MainLayout>
    </AuthProvider>
  );
}

export default App
