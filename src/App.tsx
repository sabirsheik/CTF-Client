import { Route, Routes, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";

// ==============================
//  AUTH PAGES (LAZY LOADED)
// ==============================
const Login = lazy(() =>
  import("./Ui/Pages/Auth/Login/Login").then((m) => ({ default: m.Login }))
);

const Register = lazy(() =>
  import("./Ui/Pages/Auth/Register/Register").then((m) => ({
    default: m.Register,
  }))
);

const ForgetPasswordModal = lazy(() =>
  import(
    "./Ui/Pages/Auth/ForgetPasswordModal/ForgetPasswordModal"
  ).then((m) => ({ default: m.ForgetPasswordModal }))
);

const ResetPassword = lazy(() =>
  import("./Ui/Pages/Auth/ResetPassword/ResetPassword").then((m) => ({
    default: m.ResetPassword,
  }))
);

// ==============================
//  DASHBOARDS (LAZY LOADED)
// ==============================
const Analyst = lazy(() =>
  import("./Dashboards/Analyst/Analyst").then((m) => ({
    default: m.Analyst,
  }))
);

const AdminDashboard = lazy(() =>
  import("./Dashboards/Admin/AdminDashboard").then((m) => ({
    default: m.AdminDashboard,
  }))
);

// ==============================
//  COMPONENTS & CONTEXT
// ==============================
import { Header } from "./Ui/Components/Header/header";
import { useUser } from "./Hook/Auth/useAuth";
import ProtectedRoute from "./context/Secure/ProctectedRoute";
import DashboardRedirect from "./context/Secure/DashboradRedirect";

export const App = () => {
  // ==============================
  //  USER AUTH STATE
  // ==============================
  const { data: user } = useUser();
  const isLoggedIn = !!user;

  return (
    <>
      {/* ==============================
           HEADER (ONLY WHEN LOGGED IN)
         ============================== */}
      {isLoggedIn && <Header />}

      {/* ==============================
          SUSPENSE WRAPPER
          Fallback shown while loading chunks
         ============================== */}
      <Suspense fallback={<div className="p-4">Loading...</div>}>
        <Routes>
          {/* ==============================
              PUBLIC ROUTES
             ============================== */}
          <Route
            path="/"
            element={!isLoggedIn ? <Login /> : <Navigate to="/dashboard" />}
          />

          <Route path="/register" element={<Register />} />
          <Route path="/forget-password" element={<ForgetPasswordModal />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* ==============================
              DASHBOARD REDIRECT
              ROLE BASED REDIRECTION
             ============================== */}
          <Route path="/dashboard" element={<DashboardRedirect />} />

          {/* ==============================
              USER DASHBOARD (PROTECTED)
             ============================== */}
          <Route element={<ProtectedRoute role="user" />}>
            <Route path="/dashboard/auth/user" element={<Analyst />}>
             
            </Route>
          </Route>

          {/* ==============================
              ADMIN DASHBOARD (PROTECTED)
             ============================== */}
          <Route element={<ProtectedRoute role="admin" />}>
            <Route
              path="/dashboard/auth/admin"
              element={<AdminDashboard />}
            />
          </Route>

          {/* ==============================
              FALLBACK ROUTE
             ============================== */}
          <Route
            path="*"
            element={
              isLoggedIn ? (
                <Navigate to="/dashboard/auth/user" />
              ) : (
                <Navigate to="/" />
              )
            }
          />
        </Routes>
      </Suspense>
    </>
  );
};