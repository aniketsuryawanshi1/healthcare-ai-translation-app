import {  Routes, Route } from "react-router-dom";
import { Layout } from "antd";
import {
  Register,
  Login,
  HealthcareDashboard,
 PatientDashboard ,
  LandingPage,
  PatientChat,
  AddProfileForm,
  DoctorChat,
  TestOnePAge
} from "../pages/index";


import PrivateRoute from "./ProtectedRoute";
import PublicRoutes from "./PublicRoutes";
const { Content } = Layout;

const MainRoutes = () => {


  return (
   <Layout style={{ minHeight: "100vh", width: "100vw" }}>
      
      <Layout>

        <Layout>
          <Content
    style={{
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "100vh",
  width: "100%",     
  overflowX: "hidden"  
}}>
    
            <Routes>
              <Route
                path="/"
                element={
                  <PublicRoutes>
                    <LandingPage />
                  </PublicRoutes>
                }
              />
              <Route
                path="/patient"
                element={
                  <PublicRoutes>
                    <PatientDashboard />
                  </PublicRoutes>
                }
              />
              <Route
              path="/test"
              element={
                <PublicRoutes>
                  <HealthcareDashboard />
                  </PublicRoutes>
              }
              />

              {/* <Route
                path="/profile"
                element={
                  <PublicRoutes>
                    <ProfileForm />
                  </PublicRoutes>
                }
              /> */}
              <Route
                path="/register"
                element={
                  <PublicRoutes>
                    <Register />
                  </PublicRoutes>
                }
              />
              <Route
                path="/login"
                element={
                  <PublicRoutes>
                    <Login />
                  </PublicRoutes>
                }
              />
              

              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <TestOnePAge />
                  </PrivateRoute>
                }
              />
</Routes> 
            
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default MainRoutes;
