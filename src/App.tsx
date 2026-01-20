import { Route, Routes, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";

// ==============================
//  AUTH PAGES (LAZY LOADED)
// ==============================
const Login = lazy(() =>
  import("./Ui/Pages/Auth/Login/Login").then((m) => ({ default: m.Login })),
);

const Register = lazy(() =>
  import("./Ui/Pages/Auth/Register/Register").then((m) => ({
    default: m.Register,
  })),
);

const ForgetPasswordModal = lazy(() =>
  import("./Ui/Pages/Auth/ForgetPasswordModal/ForgetPasswordModal").then(
    (m) => ({ default: m.ForgetPasswordModal }),
  ),
);

const ResetPassword = lazy(() =>
  import("./Ui/Pages/Auth/ResetPassword/ResetPassword").then((m) => ({
    default: m.ResetPassword,
  })),
);

// ==============================
//  DASHBOARDS (LAZY LOADED)
// ==============================
const Analyst = lazy(() =>
  import("./Dashboards/User/User").then((m) => ({
    default: m.Analyst,
  })),
);

const AdminDashboard = lazy(() =>
  import("./Dashboards/Admin/AdminDashboard").then((m) => ({
    default: m.AdminDashboard,
  })),
);

// ==============================
//  CTF PAGES (LAZY LOADED)
// ==============================
import { CTF } from "./Ui/Pages/CTF/CTF";
const TeamsPanel = lazy(() =>
  import("./Ui/Pages/Teams/Teams").then((m) => ({
    default: m.Teams,
  })),
);

const CTFTeams = lazy(() =>
  import("./Ui/Pages/CTF/Teams/Teams").then((m) => ({
    default: m.Teams,
  })),
);

// const FilteringRound = lazy(() =>
//   import("./Ui/Pages/FilteringRound/FilteringRound").then((m) => ({
//     default: m.default,
//   })),
// );

const Challenge = lazy(() =>
  import("./Ui/Pages/Challenge/Challenge").then((m) => ({
    default: m.Challenge,
  })),
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
              {/* ==============================
              FILTERING ROUND
             ============================== */}
              {/* <Route index element={<FilteringRound />} /> */}
              {/* Ctf Page */}
              <Route path="ctf" element={<CTF />} />
              {/* Teams Route */}
              <Route path="teams" element={<TeamsPanel />} />
              {/* Challenge Route */}
              <Route path="challenge" element={<Challenge />} />
            </Route>
          </Route>

          {/* ==============================
              TOP-LEVEL CTF ROUTES (PROTECTED)
              Matches /ctf and /ctf/teams
             ============================== */}
          <Route element={<ProtectedRoute role="user" />}>
            <Route path="/ctf" element={<CTF />} />
            <Route path="/ctf/teams" element={<CTFTeams />} />
          </Route>

          {/* ==============================
              ADMIN DASHBOARD (PROTECTED)
             ============================== */}
          <Route element={<ProtectedRoute role="admin" />}>
            <Route path="/dashboard/auth/admin" element={<AdminDashboard />} />
          </Route>

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
